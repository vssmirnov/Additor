'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['require'], function (require) {
  'use strict';

  var Envelope = function () {

    /**
     * Envelope
     * <p>
     * Envelope values are specified as 2D arrays in the form
     * <b>[ [t(0), a(0)], [t(1), a(1)], ... [t(i), a(i)] ]</b>,
     * where <b>t(i)</b> specifies the time, in seconds,
     * and <b>a(i)</b> specifies the amplitude of the envelope at the vertex <b>i</b>.
     * </p>
     * @param {object} o - Options
     * @param {AudioContext} o.audioCtx - The audio context to be used.
     * @param {array} o.attackEnvelope - 2D array specifying the attack envelope
     * @param {array} o.releaseEnvelope - 2D array specifying the release envelope
     */
    function Envelope(o) {
      _classCallCheck(this, Envelope);

      o = o || {};

      this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

      this._envGain = this._audioCtx.createGain();
      this._envGain.gain.value = 0;

      this.input = this._envGain;
      this.output = this._envGain;

      this._aEnv = o.aEnv || o.attackEnv || o.attackEnvelope || o.aEnvelope || [[0, 0], [0.05, 1], [1, 1]];
      this._rEnv = o.rEnv || o.releaseEnv || o.releaseEnvelope || o.rEnvelope || [[0, 1], [0.5, 1], [1, 0]];
    }

    /* =================== */
    /* --- Audio setup --- */
    /* =================== */

    /**
     * Connect this node to a destination
     * @param {AudioNode} destination - The destination to connect to
     */


    _createClass(Envelope, [{
      key: 'connect',
      value: function connect(destination) {
        this.output.connect(destination);
        return this;
      }

      /* ============================= */
      /* --- Get/set the envelopes --- */
      /* ============================= */

      /** The attack envelope */

    }, {
      key: 'attack',


      /* ========================== */
      /* --- Envelope execution --- */
      /* ========================== */

      /** Execute the attack envelope */
      value: function attack() {
        var startTime = this._audioCtx.currentTime;
        var env = this._aEnv;
        var envLength = env.length;

        // ramp from 0 to the first value in the envelope
        this._envGain.gain.setValueAtTime(0, startTime);
        this._envGain.gain.linearRampToValueAtTime(env[0][1], startTime + env[0][0]);

        // ramp to each subsequent value
        for (var i = 0; i < envLength - 1; i++) {
          this._envGain.gain.setValueAtTime(env[i][1], startTime + env[i][0]);
          this._envGain.gain.linearRampToValueAtTime(env[i + 1][1], startTime + env[i + 1][0]);
        }

        // set the final value
        this._envGain.gain.setValueAtTime(env[envLength - 1][1], startTime + env[envLength - 1][0]);
      }

      /** Execute the release envelope */

    }, {
      key: 'release',
      value: function release() {
        var startTime = this._audioCtx.currentTime;
        var env = this._rEnv;
        var envLength = env.length;

        // cancel scheduled values in case attack is still happening
        this._envGain.gain.cancelScheduledValues(startTime);

        // ramp to each subsequent value
        for (var i = 0; i < envLength - 1; i++) {
          this._envGain.gain.setValueAtTime(env[i][1], startTime + env[i][0]);
          this._envGain.gain.linearRampToValueAtTime(env[i + 1][1], startTime + env[i + 1][0]);
        }

        // if the gain value at the end is not 0, ramp it down to 0 in 1ms
        if (env[envLength - 1][1] !== 0) {
          this._envGain.gain.linearRampToValueAtTime(0, startTime + env[envLength - 1][0] + 0.001);
        }
      }
    }, {
      key: 'attackEnvelope',
      get: function get() {
        return this._aEnv;
      },
      set: function set(newEnv) {
        this._aEnv = newEnv;
        return this;
      }

      /** The release envelope */

    }, {
      key: 'releaseEnvelope',
      get: function get() {
        return this._rEnv;
      },
      set: function set(newEnv) {
        this._rEnv = newEnv;
        return this;
      }
    }]);

    return Envelope;
  }();

  return Envelope;
});