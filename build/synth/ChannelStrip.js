'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['require'], function (require) {
  'use strict';

  var ChannelStrip = function () {
    function ChannelStrip(o) {
      _classCallCheck(this, ChannelStrip);

      o = o || {};

      this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

      this._inputGainNode = this._audioCtx.createGain();
      this._panner = this._audioCtx.createStereoPanner();
      this._outputGainNode = this._audioCtx.createGain();

      this._inputGainNode.connect(this._panner);
      this._panner.connect(this._outputGainNode);

      this._inputGainNode.gain.value = o.inputGain || 1;
      this._outputGainNode.gain.value = o.outputGain || 1;

      this.input = this._inputGainNode;
      this.output = this._outputGainNode;

      return this;
    }

    /* =================== */
    /* --- Audio setup --- */
    /* =================== */

    /**
     * Connect this node to a destination
     * @param {AudioNode} destination - The destination to connect to
     */


    _createClass(ChannelStrip, [{
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

      /** Input gain */

    }, {
      key: 'options',
      get: function get() {
        return {
          inputGain: this.inputGain,
          outputGain: this.outputGain,
          pan: this.pan
        };
      },
      set: function set(o) {
        o = o || {};

        if (o.inputGain) this.inputGain = o.inputGain;
        if (o.outputGain) this.outputGain = o.outputGain;
        if (o.pan) this.pan = o.pan;

        return this;
      }
    }, {
      key: 'inputGain',
      get: function get() {
        return this._inputGainNode.gain.value;
      },
      set: function set(newGain) {
        this._inputGainNode.gain.value = newGain;
        return this;
      }

      /** Pan */

    }, {
      key: 'pan',
      get: function get() {
        return this._panner.pan.value;
      },
      set: function set(newPan) {
        this._panner.pan.value = newPan;
        return this;
      }

      /** Output gain */

    }, {
      key: 'outputGain',
      get: function get() {
        return this._outputGainNode.gain.value;
      },
      set: function set(newGain) {
        this._outputGainNode.gain.value = newGain;
        return this;
      }
    }]);

    return ChannelStrip;
  }();

  return ChannelStrip;
});
