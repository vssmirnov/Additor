'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['require'], function (require) {
  'use strict';

  var StereoFeedbackDelay = function () {

    /**
     * Stereo delay with feedback
     * @param {object} [o] - Options
     * @param {number} [o.delayTimeL]
     * @param {number} [o.delayTimeR]
     * @param {number} [o.feedbackL]
     * @param {number} [o.feedbackR]
     * @param {number} [o.crossfeedL]
     * @param {number} [o.crossfeedR]
     * @param {number} [o.dryMixL]
     * @param {number} [o.dryMixR]
     * @param {number} [o.wetMixL]
     * @param {number} [o.wetMixR]
     */
    function StereoFeedbackDelay(o) {
      _classCallCheck(this, StereoFeedbackDelay);

      o = o || {};

      this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

      this._maxDelayTime = o.maxDelayTime || 10;

      this._input = this._audioCtx.createGain();
      this._channelSplitter = this._audioCtx.createChannelSplitter(2);
      this._dryMixL = this._audioCtx.createGain();
      this._dryMixR = this._audioCtx.createGain();
      this._wetMixL = this._audioCtx.createGain();
      this._wetMixR = this._audioCtx.createGain();
      this._delayL = this._audioCtx.createDelay(this._maxDelayTime);
      this._delayR = this._audioCtx.createDelay(this._maxDelayTime);
      this._feedbackL = this._audioCtx.createGain();
      this._feedbackR = this._audioCtx.createGain();
      this._crossfeedL = this._audioCtx.createGain();
      this._crossfeedR = this._audioCtx.createGain();
      this._channelMerger = this._audioCtx.createChannelMerger(2);
      this._output = this._audioCtx.createGain();

      this._connectAudioNodes();
      this._setAudioDefaults(o);

      return this;
    }

    _createClass(StereoFeedbackDelay, [{
      key: '_connectAudioNodes',
      value: function _connectAudioNodes() {
        this._input.connect(this._channelSplitter);
        this._channelSplitter.connect(this._dryMixL, 0);
        this._channelSplitter.connect(this._dryMixR, 1);
        this._channelSplitter.connect(this._delayL, 0);
        this._channelSplitter.connect(this._delayR, 1);
        this._delayL.connect(this._feedbackL);
        this._delayR.connect(this._feedbackR);
        this._feedbackL.connect(this._delayL);
        this._feedbackR.connect(this._delayR);
        this._delayL.connect(this._crossfeedR);
        this._delayR.connect(this._crossfeedL);
        this._crossfeedL.connect(this._delayL);
        this._crossfeedR.connect(this._delayR);
        this._delayL.connect(this._wetMixL);
        this._delayR.connect(this._wetMixR);
        this._dryMixL.connect(this._channelMerger, 0, 0);
        this._dryMixR.connect(this._channelMerger, 0, 1);
        this._wetMixL.connect(this._channelMerger, 0, 0);
        this._wetMixR.connect(this._channelMerger, 0, 1);
        this._channelMerger.connect(this._output);

        return this;
      }
    }, {
      key: '_setAudioDefaults',
      value: function _setAudioDefaults(o) {
        o = o || {};

        this._input.gain.value = 1;
        this._delayL.delayTime.value = o.delayTimeL || 0.5;
        this._delayR.delayTime.value = o.delayTimeR || 0.5;
        this._dryMixL.gain.value = o.dryMixL || 1;
        this._dryMixR.gain.value = o.dryMixR || 1;
        this._wetMixL.gain.value = o.wetMixL || 0.2;
        this._wetMixR.gain.value = o.wetMixR || 0.2;
        this._feedbackL.gain.value = o.feedbackL || 0.1;
        this._feedbackR.gain.value = o.feedbackR || 0.1;
        this._crossfeedL.gain.value = o.crossfeedL || 0;
        this._crossfeedR.gain.value = o.crossfeedR || 0;
        this._output.gain.value = 1;

        return this;
      }
    }, {
      key: 'connect',
      value: function connect(destination) {
        this._output.connect(destination);
        return this;
      }

      /* =========================== */
      /* --- Getters and setters --- */
      /* =========================== */

    }, {
      key: 'input',
      get: function get() {
        return this._input;
      }

      /** Delay time left */

    }, {
      key: 'delayTimeL',
      get: function get() {
        return this._delayL.delayTime;
      },
      set: function set(time) {
        this._delayL.delayTime.value = time;
        return this;
      }

      /** Delay time right */

    }, {
      key: 'delayTimeR',
      get: function get() {
        return this._delayR.delayTime;
      },
      set: function set(time) {
        this._delayR.delayTime.value = time;
        return this;
      }

      /** Feedback L */

    }, {
      key: 'feedbackL',
      get: function get() {
        return this._feedbackL.gain;
      },
      set: function set(gain) {
        this._feedbackL.gain.value = gain;
        return this;
      }

      /** Feedback R */

    }, {
      key: 'feedbackR',
      get: function get() {
        return this._feedbackR.gain;
      },
      set: function set(gain) {
        this._feedbackR.gain.value = gain;
        return this;
      }

      /** Cross-feed L */

    }, {
      key: 'crossfeedL',
      get: function get() {
        return this._crossfeedL.gain;
      },
      set: function set(gain) {
        this._crossfeedL.gain.value = gain;
        return this;
      }

      /** Cross-feed R */

    }, {
      key: 'crossfeedR',
      get: function get() {
        return this._crossfeedR.gain;
      },
      set: function set(gain) {
        this._crossfeedR.gain.value = gain;
        return this;
      }

      /** Dry mix L */

    }, {
      key: 'dryMixL',
      get: function get() {
        return this._dryMixL.gain;
      },
      set: function set(gain) {
        this._dryMixL.gain.value = gain;
        return this;
      }

      /** Dry mix R */

    }, {
      key: 'dryMixR',
      get: function get() {
        return this._dryMixR.gain;
      },
      set: function set(gain) {
        this._dryMixR.gain.value = gain;
        return this;
      }

      /** Wet mix L */

    }, {
      key: 'wetMixL',
      get: function get() {
        return this._wetMixL.gain;
      },
      set: function set(gain) {
        this._wetMixL.gain.value = gain;
        return this;
      }

      /** Wet mix R */

    }, {
      key: 'wetMixR',
      get: function get() {
        return this._wetMixR.gain;
      },
      set: function set(gain) {
        this._wetMixR.gain.value = gain;
        return this;
      }
    }]);

    return StereoFeedbackDelay;
  }();

  return StereoFeedbackDelay;
});