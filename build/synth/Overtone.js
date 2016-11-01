'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['require', 'ChannelStrip', 'Envelope'], function (require, ChannelStrip, Envelope) {
  'use strict';

  var Overtone = function () {
    function Overtone(o) {
      _classCallCheck(this, Overtone);

      o = o || {};

      this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

      this._oscillator = this._audioCtx.createOscillator();
      this._envelope = new Envelope({ audioCtx: this._audioCtx });
      this._channelStrip = new ChannelStrip({ audioCtx: this._audioCtx });

      this._oscillator.connect(this._envelope.input);
      this._envelope.connect(this._channelStrip.input);

      this._oscillator.start();

      this.output = this._channelStrip.output;

      this.frequency = o.frequency || 440;
      this.pan = o.pan || 0;
      this.amplitude = o.amplitude || 1;
    }

    /* =========================== */
    /* --- Getters and setters --- */
    /* =========================== */

    _createClass(Overtone, [{
      key: 'setOptions',
      value: function setOptions(o) {
        o = o || {};
        this.options = o;
      }
    }, {
      key: 'connect',


      /* =================== */
      /* --- Audio setup --- */
      /* =================== */

      /**
       * Connect this node to a destination
       * @param {AudioNode} destination - The destination to connect to
       */
      value: function connect(destination) {
        this.output.connect(destination);
        return this;
      }

      /* ========================= */
      /* --- Envelope controls --- */
      /* ========================= */

      /** Execute the attack envelope */

    }, {
      key: 'attack',
      value: function attack() {
        this._envelope.attack();
      }

      /** Execute the release envelope */

    }, {
      key: 'release',
      value: function release() {
        this._envelope.release();
      }
    }, {
      key: 'options',
      get: function get() {
        return {
          audioCtx: audioCtx,
          frequency: this.frequency,
          pan: this.pan,
          amplitude: this.amplitude,
          attackEnvelope: this.attackEnvelope,
          releaseEnvelope: this.releaseEnvelope
        };
      },
      set: function set(o) {
        o = o || {};

        if (o.frequency) this.frequency = o.frequency;
        if (o.pan) this.pan = o.pan;
        if (o.amplitude) this.amplitude = o.amplitude;
        if (o.attackEnvelope) this.attackEnvelope = o.attackEnvelope;
        if (o.releaseEnvelope) this.releaseEnvelope = o.releaseEnvelope;

        return this;
      }
    }, {
      key: 'audioCtx',
      get: function get() {
        return this._audioCtx;
      }

      /** Oscillator frequency */

    }, {
      key: 'frequency',
      get: function get() {
        return this._oscillator.frequency;
      },
      set: function set(newFreq) {
        var curTime = this._audioCtx.currentTime;
        this._oscillator.frequency.value = newFreq;
        return this;
      }

      /** Pan */

    }, {
      key: 'pan',
      get: function get() {
        return this._channelStrip.pan;
      },
      set: function set(newPan) {
        this._channelStrip.pan = newPan;
        return this;
      }

      /** Overtone amplitude */

    }, {
      key: 'amplitude',
      get: function get() {
        return this._channelStrip.inputGain;
      },
      set: function set(newAmp) {
        this._channelStrip.inputGain = newAmp;
        return this;
      }

      /** Overtone output gain (used for balancing volume when several overtones are used in a voice) */

    }, {
      key: 'gain',
      get: function get() {
        return this._channelStrip.outputGain;
      },
      set: function set(newGain) {
        this._channelStrip.outputGain = newGain;
        return this;
      }

      /** Attack envelope */

    }, {
      key: 'attackEnvelope',
      get: function get() {
        return this._envelope.attackEnvelope;
      },
      set: function set(newEnv) {
        this._envelope.attackEnvelope = newEnv;
        return this;
      }

      /** Release envelope */

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

    return Overtone;
  }();

  return Overtone;
});