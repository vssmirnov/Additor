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
      if (newNumVoices > this.numVoices) {
        for (var i = this.numVoices; i < newNumVoices; i++) {
          this._voices.push(new AdditiveSynthVoice({ audioCtx: this._audioCtx}));
        }
      } else if (newNumVoices < this.numVoices) {
        for (var i = this.numVoices; i > this.newNumVoices; i--) {
          this._voices.pop();
        }
      }
      return this;
    }
    setNumVoices (newNumVoices) {
      this.numVoices = newNumVoices;
    }

    /** Number of overtones */
    get numOvertones () {
      return this._numOvertones;
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

    /**
     * Play a note
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
        if(this._availableVoices.length > 0) {
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
     * Release a note
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
