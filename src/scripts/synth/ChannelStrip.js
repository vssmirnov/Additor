(function(){
  'use strict';

  class ChannelStrip {
    constructor (o) {
      o = o || {};

      this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

      this._inputGainNode = this._audioCtx.createGain();
      this._panner = this._audioCtx.createStereoPanner();
      this._outputGainNode = this._audioCtx.createGain();

      this._inputGainNode.connect(this._panner);
      this._panner.connect(this._outputGainNode);
    }

    /**
     * Get/set the audio context
     */
    get audioCtx () {
      return this._audioCtx;
    }
    set audioCtx (newAudioCtx) {
      var _this = this;

      try {
        if (newAudioCtx.constructor.name !== 'AudioContext') {
          throw 'Supplied argument is not an AudioContext';
        } else {
          setNewAudioContext();
        }
      }
      catch (e) {
        console.log(e);
      }

      function setNewAudioContext() {
        var newInputGainNode = newAudioCtx.createGain();
        var newPanner = newAudioCtx.createStereoPanner();
        var newOutputGainNode = newAudioCtx.createGain();

        newInputGainNode.gain.value = _this._inputGainNode.gain;
        newPanner.pan.value = _this._panner.pan;
        newOutputGainNode.gain.value = _this._outputGainNode.gain;

        this._inputGainNode.disconnect();
        this._panner.disconnect();
        this._outputGainNode.disconnect();

        this._audioCtx = newAudioCtx;
        this._inputGainNode = newInputGainNode;
        this._panner = newPanner;
        this._outputGainNode = newOutputGainNode;
      }
    }
    setAudioCtx (newAudioContext) {
      this.audioCtx = newAudioContext;
    }

    /**
     * Get/set input gain
     */
    get inputGain () {
      return this._inputGainNode.gain;
    }
    set inputGain (newGain) {
      this._inputGainNode.gain.value = newGain;
      return this;
    }

    /**
     * Get/set pan
     */
    get pan () {
      return this._panner.pan;
    }
    set pan (newPan) {
      this._panner.pan.value = newPan;
      return this;
    }

    /**
     * Get/set output gain
     */
    get outputGain () {
      return this._outputGainNode.gain;
    }
    set outputGain (newGain) {
      this._outputGainNode.gain.value = newGain;
      return this;
    }

    /**
     * Connect the output to a destination
     * @param {AudioNode} destination
     */
    connect (destination) {
      this._outputGainNode.connect(destination);
      return this;
    }
  }

  // support for AMD libraries
  if (typeof define === 'function') {
    define([], function () {
      return ChannelStrip;
    });
  }

  // support for CommonJS libraries
  else if (typeof exports !== 'undefined') {
    exports.ChannelStrip = ChannelStrip;
  }

  // support for window global
  else if (typeof window !== 'undefined') {
    window.ChannelStrip = ChannelStrip;
  }

  // support for Node.js global
  else if (typeof global !== 'undefined') {
    global.ChannelStrip = ChannelStrip;
  }
})();
