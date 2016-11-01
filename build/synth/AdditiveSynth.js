'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['require', 'AdditiveSynthVoice', 'ChannelStrip', 'util'], function (require, AdditiveSynthVoice, ChannelStrip, util) {
  'use strict';

  var AdditiveSynth = function () {
    function AdditiveSynth(o) {
      _classCallCheck(this, AdditiveSynth);

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
          numOvertones: this._numOvertones }));
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


    _createClass(AdditiveSynth, [{
      key: 'connect',
      value: function connect(destination) {
        this.output.connect(destination);
        return this;
      }

      /* =========================== */
      /* --- Getters and setters --- */
      /* =========================== */

      /** Number of voices */

    }, {
      key: 'setNumVoices',
      value: function setNumVoices(newNumVoices) {
        this.numVoices = newNumVoices;
      }

      /** Number of overtones */

    }, {
      key: 'setNumOvertones',
      value: function setNumOvertones(newNumOvertones) {
        this.numOvertones = newNumOvertones;
      }

      /** Gain */

    }, {
      key: 'setGain',
      value: function setGain(newGain) {
        this.gain = newGain;
      }

      /** Pan */

    }, {
      key: 'setPan',
      value: function setPan(newPan) {
        this.pan = newPan;
      }

      /** Get overtone amplitude */

    }, {
      key: 'getOvertoneAmplitude',
      value: function getOvertoneAmplitude(voiceNum, otNum) {
        this._voices[voiceNum].getOvertoneAmplitude(otNum);
        return this;
      }

      /** Overtone amplitude */

    }, {
      key: 'setOvertoneAmplitude',
      value: function setOvertoneAmplitude(voiceNum, otNum, newAmp) {
        this._voices[voiceNum].setOvertoneAmplitude(otNum, newAmp);
        return this;
      }

      /* ========================= */
      /* --- Envelope controls --- */
      /* ========================= */

      /** Attack envelope */

    }, {
      key: 'setOvertoneAttackEnvelope',


      /** Set the attack envelope for an overtone
       *  @param {number} otNum - Number of overtone for which to set envelope
       *  @param {array} newEnv - 2D array representing the new envelope
       */
      value: function setOvertoneAttackEnvelope(otNum, newEnv) {
        this._voices.forEach(function (voice) {
          voice.setOvertoneAttackEnvelope(otNum, newEnv);
        });
        return this;
      }

      /** Set the release envelope for an overtone
       *  @param {number} otNum - Number of overtone for which to set envelope
       *  @param {array} newEnv - 2D array representing the new envelope
       */

    }, {
      key: 'setOvertoneReleaseEnvelope',
      value: function setOvertoneReleaseEnvelope(otNum, newEnv) {
        this._voices.forEach(function (voice) {
          voice.setOvertoneReleaseEnvelope(otNum, newEnv);
        });
        return this;
      }

      /**
       * Play a note using the current attack envelope
       * @param {(number|string)} note - MIDI pitch value or note name (i.e. A0 or F#8)
       */

    }, {
      key: 'playNote',
      value: function playNote(note) {
        var noteNameFormat = /^([a-g]|[A-G])(#|b)?([0-9]|10)$/;
        var selectedVoice = -1;
        var freq = -1;

        // check for correct note format and convert to freq
        if (typeof note === 'number' && note >= 0 && note <= 127) {
          freq = util.midiToFreq(note);
        } else if (typeof note === 'string' && noteNameFormat.test(note) === true) {
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

    }, {
      key: 'releaseNote',
      value: function releaseNote(note) {
        var noteNameFormat = /^([a-g]|[A-G])(#|b)?([0-9]|10)$/;
        var selectedVoice = -1;

        // check for correct note format and convert to freq
        if (typeof note === 'number' && note >= 0 && note <= 127) {} else if (typeof note === 'string' && noteNameFormat.test(note) === true) {
          note = util.noteNameToMidi(note);
        } else {
          note = -1;
        }

        if (note !== -1) {
          var selectedBusyNodeIndex = this._busyVoices.findIndex(function (busyVoice) {
            return busyVoice.note === note;
          });

          if (selectedBusyNodeIndex !== -1) {
            selectedVoice = this._busyVoices[selectedBusyNodeIndex].voiceNum;

            console.log('note to be released is in voice ' + selectedVoice);

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

    }, {
      key: 'attackVoice',
      value: function attackVoice(voiceNum, freq) {
        this._voices[voiceNum].setFrequency(freq);
        this._voices[voiceNum].attack();
      }

      /**
       * Execute the release for a given voice
       **/

    }, {
      key: 'releaseVoice',
      value: function releaseVoice(voiceNum) {
        this._voices[voiceNum].release();
      }
    }, {
      key: 'numVoices',
      get: function get() {
        return this._voices.length;
      },
      set: function set(newNumVoices) {
        var _this = this;

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
          var _deleteAvailableVoices = function _deleteAvailableVoices(numVoicesToDelete) {
            var _loop = function _loop(_i) {
              var voiceToDelete = _this._availableVoices[_i];

              _this._voices.splice(voiceToDelete, 1);
              _this._availableVoices.splice(_i, 1);

              // remap the available and busy voices because we modified the voices stack
              _this._availableVoices = _this._availableVoices.map(function (voice) {
                return voice > voiceToDelete ? voice - 1 : voice;
              });
              _this._busyVoices = _this._busyVoices.map(function (voice) {
                return {
                  voiceNum: voice.voiceNum > voiceToDelete ? voice.voiceNum - 1 : voice.voiceNum,
                  pitch: voice.pitch
                };
              });
            };

            for (var _i = 0; _i < numVoicesToDelete; _i++) {
              _loop(_i);
            }
          };

          var _deleteBusyVoices = function _deleteBusyVoices(numBusyVoicesToDelete) {
            var _loop2 = function _loop2(_i2) {
              var voiceToDelete = _this._busyVoices[_i2].voiceNum;

              _this.releaseVoice(voiceToDelete);
              _this._voices.splice(voiceToDelete, 1);
              _this._busyVoices.splice(_i2, 1);

              // remap the busy voices pointer stack because we modified the voices stack
              _this._busyVoices = _this._busyVoices.map(function (voice) {
                return {
                  voiceNum: voice.voiceNum > voiceToDelete ? voice.voiceNum - 1 : voice.voiceNum,
                  pitch: voice.pitch
                };
              });
            };

            // delete the required number of busy voices
            for (var _i2 = 0; _i2 < numBusyVoicesToDelete; _i2++) {
              _loop2(_i2);
            }
          };

          var numVoicesToDelete = this.numVoices - newNumVoices;
          var numAvailableVoices = this._availableVoices.length;

          // if the number of voices to delete is less then or equal to the number of available (inactive) voices, delete these voices
          if (numVoicesToDelete <= numAvailableVoices) {
            _deleteAvailableVoices(numVoicesToDelete);
          }

          // else delete all available (inactive) voices and also required number of busy voices
          else {
              var numBusyVoicesToDelete = numVoicesToDelete - numAvailableVoices;

              _deleteAvailableVoices(numAvailableVoices);
              _deleteBusyVoices(numBusyVoicesToDelete);
            }
        }
        console.log('newNumVoices: ' + this.numVoices);
        return this;
      }
    }, {
      key: 'numOvertones',
      get: function get() {
        return this._numOvertones;
      },
      set: function set(newNumOvertones) {
        this._voices.forEach(function (voice) {
          voice.numOvertones = newNumOvertones;
        });
        this._numOvertones = newNumOvertones;
        return this;
      }
    }, {
      key: 'gain',
      get: function get() {
        return this._channelStrip.outputGain;
      },
      set: function set(newGain) {
        this._channelStrip.outputGain = newGain;
        return this;
      }
    }, {
      key: 'pan',
      get: function get() {
        return this._channelStrip.pan;
      },
      set: function set(newPan) {
        this._channelStrip.pan = newPan;
        return this;
      }
    }, {
      key: 'attackEnvelope',
      set: function set(newEnv) {
        this._voices.forEach(function (voice) {
          voice.attackEnvelope = newEnv;
        });
      }

      /** Release envelope */

    }, {
      key: 'releaseEnvelope',
      set: function set(newEnv) {
        this._voices.forEach(function (voice) {
          voice.releaseEnvelope = newEnv;
        });
      }
    }]);

    return AdditiveSynth;
  }();

  return AdditiveSynth;
});