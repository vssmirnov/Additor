'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['require', 'ChannelStrip', 'Envelope', 'Overtone'], function (require, ChannelStrip, Envelope, Overtone) {
  'use strict';

  var AdditiveSynthVoice = function () {
    function AdditiveSynthVoice(o) {
      _classCallCheck(this, AdditiveSynthVoice);

      o = o || {};

      this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

      this._channelStrip = new ChannelStrip({ audioCtx: this._audioCtx });
      this._envelope = new Envelope({ audioCtx: this._audioCtx });

      var numOvertones = o.numOvertones || o.numberOfOvertones || 20;
      this._overtones = [];
      for (var i = 0; i < numOvertones; i++) {
        this._overtones.push(new Overtone({ audioCtx: this._audioCtx }));
        this._overtones[i].connect(this._envelope.input);
        this._envelope.connect(this._channelStrip.input);
        this._overtones[i].gain = 1 / numOvertones;
      }

      this.output = this._channelStrip.output;

      this.frequency = o.frequency || o.freq || 440;
      this.pan = o.pan || 0; // -1: hard left, 1: hard right
      this.gain = o.gain || 1;
    }

    /* =================== */
    /* --- Audio setup --- */
    /* =================== */

    /**
     * Connect this node to a destination
     * @param {AudioNode} destination - The destination to connect to
     */


    _createClass(AdditiveSynthVoice, [{
      key: 'connect',
      value: function connect(destination) {
        this.output.connect(destination);
        return this;
      }

      /* =========================== */
      /* --- Getters and setters --- */
      /* =========================== */

      /** Options */

    }, {
      key: 'setOptions',
      value: function setOptions(o) {
        o = o || {};
        this.options = o;
      }

      /** Number of overtones (including the fundamental) */

    }, {
      key: 'setNumOvertones',
      value: function setNumOvertones(newNumOvertones) {
        this.numOvertones = newNumOvertones;
      }

      /** Fundamental frequency */

    }, {
      key: 'setFrequency',
      value: function setFrequency(newFreq) {
        this.frequency = newFreq;
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

      /** Get overtone amplitude
       * @param {number} otNum - Overtone number (0 for the fundamental).
       */

    }, {
      key: 'getOvertoneAmplitude',
      value: function getOvertoneAmplitude(otNum) {
        return this._overtones[otNum].amplitude;
      }
      /** Set overtone amplitude
       * @param {number} otNum - Overtone number (0 for the fundamental).
       * @param {number} newAmp - New amplitude (useful range: 0.0 - 1.0).
       */

    }, {
      key: 'setOvertoneAmplitude',
      value: function setOvertoneAmplitude(otNum, newAmp) {
        this._overtones[otNum].amplitude = newAmp;
        return this;
      }

      /** Set overtone amplitudes by a formula function
       * @param {function} func - The function specifying the amplitude of each overtone number n.
       */

    }, {
      key: 'setOvertoneAmplitudesByFormula',
      value: function setOvertoneAmplitudesByFormula(func) {
        for (var n = this.numOvertones - 1; n >= 0; n--) {
          this.setOvertoneAmplitude(n, func(n + 1));
        }
        return this;
      }

      /** Attack envelope */

    }, {
      key: 'setAttackEnvelope',
      value: function setAttackEnvelope(newEnv) {
        this.attackEnvelope = newEnv;
      }

      /** Release envelope */

    }, {
      key: 'setReleaseEnvelope',
      value: function setReleaseEnvelope(newEnv) {
        this.releaseEnvelope = newEnv;
      }

      /** Set the attack envelope for an overtone
       *  @param {number} otNum - Number of overtone for which to set envelope
       *  @param {array} newEnv - 2D array representing the new envelope
       */

    }, {
      key: 'setOvertoneAttackEnvelope',
      value: function setOvertoneAttackEnvelope(otNum, newEnv) {
        this._overtones[otNum].attackEnvelope = newEnv;
        return this;
      }

      /** Set the release envelope for an overtone
       *  @param {number} otNum - Number of overtone for which to set envelope
       *  @param {array} newEnv - 2D array representing the new envelope
       */

    }, {
      key: 'setOvertoneReleaseEnvelope',
      value: function setOvertoneReleaseEnvelope(otNum, newEnv) {
        this._overtones[otNum].releaseEnvelope = newEnv;
        return this;
      }

      /* ========================= */
      /* --- Envelope controls --- */
      /* ========================= */

      /**
       * Execute the attack envelope.
       * Individual envelopes are executed for each overtone, and the envelope for this voice is executed.
       */

    }, {
      key: 'attack',
      value: function attack(o) {
        if (o) this.options = o;

        for (var i = this.numOvertones - 1; i >= 0; i--) {
          this._overtones[i].attack();
        }
        this._envelope.attack();
      }

      /**
       * Execute the release envelope
       * Individual envelopes are executed for each overtone, and the envelope for this voice is executed.
       */

    }, {
      key: 'release',
      value: function release() {
        for (var i = this.numOvertones - 1; i >= 0; i--) {
          this._overtones[i].release();
        }
        this._envelope.release();
      }
    }, {
      key: 'options',
      get: function get() {
        return {
          numOvertones: this.numOvertones,
          frequency: this.frequency,
          gain: this.gain,
          pan: this.pan
        };
      },
      set: function set(o) {
        o = o || {};

        if (o.numOvertones) this.numOvertones = o.numOvertones;
        if (o.frequency) this.frequency = o.frequency;
        if (o.gain) this.gain = o.gain;
        if (o.pan) this.pan = o.pan;

        return this;
      }
    }, {
      key: 'numOvertones',
      get: function get() {
        return this._overtones.length;
      },
      set: function set(newNumOvertones) {
        if (newNumOvertones > this.numOvertones) {
          var fundFreq = this.frequency;
          for (var i = this.numOvertones; i < newNumOvertones && (i + 1) * fundFreq < this._audioCtx.sampleRate / 2; i++) {
            this._overtones.push(new Overtone({ audioCtx: this._audioCtx }));
            this._overtones[i].frequency = (i + 1) * fundFreq;
            this._overtones[i].gain = 1 / newNumOvertones;
          }
        } else if (newNumOvertones < this.numOvertones) {
          for (var i = this.numOvertones; i > this.newNumOvertones; i--) {
            this._overtones.pop();
            this._overtones[i].gain = 1 / newNumOvertones;
          }
        }
        return this;
      }
    }, {
      key: 'frequency',
      get: function get() {
        return this._overtones[0].frequency;
      },
      set: function set(newFreq) {
        var freqCeil = this._audioCtx.sampleRate / 2;
        var numOvertones = this.numOvertones;

        for (var i = this.numOvertones - 1; i >= 0; i--) {
          if ((i + 1) * newFreq < freqCeil) {
            this._overtones[i].frequency = (i + 1) * newFreq;
            this._overtones[i].gain = 1 / numOvertones;
          } else {
            this._overtones[i].gain = 0;
          }
        }
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
      get: function get() {
        return this._envelope.attackEnvelope;
      },
      set: function set(newEnv) {
        this._envelope.attackEnvelope = newEnv;
        return this;
      }
    }, {
      key: 'releaseEnvelope',
      get: function get() {
        return this._envelope.releaseEnvelope;
      },
      set: function set(newEnv) {
        this._envelope.releaseEnvelope = newEnv;
        return this;
      }
    }]);

    return AdditiveSynthVoice;
  }();

  return AdditiveSynthVoice;
});