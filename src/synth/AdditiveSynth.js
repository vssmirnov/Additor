define(['require', 'AdditiveSynthVoice', 'ChannelStrip', 'util'], function(require, AdditiveSynthVoice, ChannelStrip, util) {
  'use strict';

  class AdditiveSynth {
    constructor (o) {
        o = o || {};

        this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

        var numVoices = o.numVoices || 16;
        this._numOvertones = o.numOvertones || 20;

        this._voices = [];
        this._availableVoices = [];
        this._busyVoices = []; // { voiceNum: {number}, pitch: {number} }
        this._channelStrip = new ChannelStrip({ audioCtx: this._audioCtx });

        for (var i = 0; i < numVoices; i++) {
          this._voices.push(new AdditiveSynthVoice({ audioCtx: this._audioCtx,
                                                     numOvertones: this._numOvertones}));
          this._voices[i].connect(this._channelStrip.input);
          this._availableVoices.push(i);
        }

        this.output = this._channelStrip.output;
    }

    /* =================== */
    /* --- Audio setup --- */
    /* =================== */

    /**
     * Connect this node to a destination
     * @param {AudioNode} destination - The destination to connect to
     */
    connect (destination) {
      this.output.connect(destination);
      return this;
    }

    /* =========================== */
    /* --- Getters and setters --- */
    /* =========================== */

    /** Number of voices */
    get numVoices () {
      return this._voices.length;
    }
    set numVoices (newNumVoices) {
      const _this = this;

      // if the new number of voices is more than previous number, we add voices
      if (newNumVoices > this.numVoices) {
        for (var i = this.numVoices; i < newNumVoices; i++) {
          this._voices.push(new AdditiveSynthVoice({
            audioCtx: this._audioCtx,
            numOvertones: this._numOvertones
          }));
          this._voices[i].connect(this._channelStrip.input);
          this._availableVoices.push(i);
        }

      // if the new number is less than previous, remove voices
      } else if (newNumVoices < this.numVoices) {
        let numVoicesToDelete = this.numVoices - newNumVoices;
        let numAvailableVoices = this._availableVoices.length;


        // if the number of voices to delete is less then or equal to the number of available (inactive) voices, delete these voices
        if (numVoicesToDelete <= numAvailableVoices) {
          deleteAvailableVoices(numVoicesToDelete);
        }

        // else delete all available (inactive) voices and also required number of busy voices
        else {
          let numBusyVoicesToDelete = numVoicesToDelete - numAvailableVoices;

          deleteAvailableVoices(numAvailableVoices);
          deleteBusyVoices(numBusyVoicesToDelete);
        }

        function deleteAvailableVoices (numVoicesToDelete) {
          for(let i = 0; i < numVoicesToDelete; i++) {
            let voiceToDelete = _this._availableVoices[i];

            _this._voices.splice(voiceToDelete, 1);
            _this._availableVoices.splice(i, 1);

            // remap the available and busy voices because we modified the voices stack
            _this._availableVoices = _this._availableVoices.map(voice => {
              return (voice > voiceToDelete) ? voice - 1 : voice;
            });
            _this._busyVoices = _this._busyVoices.map(voice => {
              return {
                voiceNum: (voice.voiceNum > voiceToDelete) ? voice.voiceNum - 1 : voice.voiceNum,
                pitch: voice.pitch
              };
            });
          }
        }

        function deleteBusyVoices (numBusyVoicesToDelete) {
          // delete the required number of busy voices
          for (let i = 0; i < numBusyVoicesToDelete; i++) {
            let voiceToDelete = _this._busyVoices[i].voiceNum;

            _this.releaseVoice(voiceToDelete);
            _this._voices.splice(voiceToDelete, 1);
            _this._busyVoices.splice(i, 1);

            // remap the busy voices pointer stack because we modified the voices stack
            _this._busyVoices = _this._busyVoices.map(voice => {
              return {
                voiceNum: (voice.voiceNum > voiceToDelete) ? voice.voiceNum - 1 : voice.voiceNum,
                pitch: voice.pitch
              };
            });
          }
        }
      }
      console.log('newNumVoices: ' + this.numVoices);
      return this;
    }
    setNumVoices (newNumVoices) {
      this.numVoices = newNumVoices;
    }

    /** Number of overtones */
    get numOvertones () {
      return this._numOvertones;
    }
    set numOvertones (newNumOvertones) {
      this._voices.forEach(voice => {
        voice.numOvertones = newNumOvertones;
      });
      this._numOvertones = newNumOvertones;
      return this;
    }
    setNumOvertones (newNumOvertones) {
      this.numOvertones = newNumOvertones;
    }

    /** Gain */
    get gain () {
      return this._channelStrip.outputGain;
    }
    set gain (newGain) {
      this._channelStrip.outputGain = newGain;
      return this;
    }
    setGain (newGain) {
      this.gain = newGain;
    }

    /** Pan */
    get pan () {
      return this._channelStrip.pan;
    }
    set pan (newPan) {
      this._channelStrip.pan = newPan;
      return this;
    }
    setPan (newPan) {
      this.pan = newPan;
    }

    /** Overtone amplitude */
    setOvertoneAmplitude (voiceNum, otNum, newAmp) {
      this._voices[voiceNum].setOvertoneAmplitude(otNum, newAmp);
      return this;
    }

    /* ========================= */
    /* --- Envelope controls --- */
    /* ========================= */

    /** Attack envelope */
    set attackEnvelope (newEnv) {
      this._voices.forEach(voice => {
        voice.attackEnvelope = newEnv;
      });
    }

    /** Release envelope */
    set releaseEnvelope (newEnv) {
      this._voices.forEach(voice => {
        voice.releaseEnvelope = newEnv;
      });
    }

    /** Set the attack envelope for an overtone
     *  @param {number} otNum - Number of overtone for which to set envelope
     *  @param {array} newEnv - 2D array representing the new envelope
     */
    setOvertoneAttackEnvelope (otNum, newEnv) {
      this._voices.forEach(voice => {
        voice.setOvertoneAttackEnvelope(otNum, newEnv);
      });
      return this;
    }

    /** Set the release envelope for an overtone
     *  @param {number} otNum - Number of overtone for which to set envelope
     *  @param {array} newEnv - 2D array representing the new envelope
     */
    setOvertoneReleaseEnvelope (otNum, newEnv) {
      this._voices.forEach(voice => {
        voice.setOvertoneReleaseEnvelope(otNum, newEnv);
      });
      return this;
    }

    /**
     * Play a note using the current attack envelope
     * @param {(number|string)} note - MIDI pitch value or note name (i.e. A0 or F#8)
     */
    playNote (note) {
      var noteNameFormat = /^([a-g]|[A-G])(#|b)?([0-9]|10)$/;
      var selectedVoice = -1;
      var freq = -1;

      // check for correct note format and convert to freq
      if (typeof note === 'number'
          && note >= 0 && note <= 127) {
        freq = util.midiToFreq(note);
      } else if (typeof note === 'string'
                 && noteNameFormat.test(note) === true) {
        note = util.noteNameToMidi(note); // convert to MIDI so we can keep track of active note in _busyVoices
        freq = util.midiToFreq(note);
      }

      // if the correct format for note was received
      if (freq !== -1) {
        //pick a voice
        if (this._availableVoices.length > 0) {
          selectedVoice = this._availableVoices.shift();
        } else {
          selectedVoice = this._busyVoices.shift().voiceNum;
          this.releaseVoice(selectedVoice);
        }
        this._busyVoices.push({ voiceNum: selectedVoice, note: note });

        this.attackVoice(selectedVoice, freq);
      }
    }

    /**
     * Release a currently playing note
     * @param {(number|string)} note - MIDI pitch value or note name (i.e. A0 or F#8)
     */
    releaseNote (note) {
      var noteNameFormat = /^([a-g]|[A-G])(#|b)?([0-9]|10)$/;
      var selectedVoice = -1;

      // check for correct note format and convert to freq
      if (typeof note === 'number'
          && note >= 0 && note <= 127) {
      } else if (typeof note === 'string'
                 && noteNameFormat.test(note) === true) {
        note = util.noteNameToMidi(note);
      } else {
        note = -1;
      }

      if (note != -1) {
        var selectedBusyNodeIndex = this._busyVoices.findIndex((busyVoice) => {
          return busyVoice.note === note;
        });

        if (selectedBusyNodeIndex !== -1) {
          selectedVoice = this._busyVoices[selectedBusyNodeIndex].voiceNum;
          this._availableVoices.push(selectedVoice);
          this._busyVoices.splice(selectedBusyNodeIndex, 1);
        }
      }

      if (selectedVoice !== -1) {
        this.releaseVoice(selectedVoice);
      } else return this;
    }

    /**
     * Execute the attack for a given voice with a given frequency
     **/
    attackVoice (voiceNum, freq) {
      this._voices[voiceNum].setFrequency(freq);
      this._voices[voiceNum].attack();
    }

    /**
     * Execute the release for a given voice
     **/
    releaseVoice (voiceNum) {
      this._voices[voiceNum].release();
    }
  }

  return AdditiveSynth;
});
