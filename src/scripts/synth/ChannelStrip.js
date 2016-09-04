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

      this._inputGainNode.gain.value = o.inputGain || 1;
      this._outputGainNode.gain.value = o.outputGain || 1;

      this.input = this._inputGainNode;
      this.output = this._outputGainNode;
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

    /** Options */
    get options () {
      return {
        inputGain: this.inputGain,
        outputGain: this.outputGain,
        pan: this.pan
      }
    }
    set options (o) {
      o = o || {};

      if (o.inputGain) this.inputGain = o.inputGain;
      if (o.outputGain) this.outputGain = o.outputGain;
      if (o.pan) this.pan = o.pan;

      return this;
    }
    setOptions (o) {
      o = o || {};
      this.options = o;
    }

    /** Input gain */
    get inputGain () {
      return this._inputGainNode.gain;
    }
    set inputGain (newGain) {
      this._inputGainNode.gain.value = newGain;
      return this;
    }

    /** Pan */
    get pan () {
      return this._panner.pan;
    }
    set pan (newPan) {
      this._panner.pan.value = newPan;
      return this;
    }

    /** Output gain */
    get outputGain () {
      return this._outputGainNode.gain;
    }
    set outputGain (newGain) {
      this._outputGainNode.gain.value = newGain;
      return this;
    }
  }

  /* ======================================== */
  /* --- Module loader and global support --- */
  /* ======================================== */

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
