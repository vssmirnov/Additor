import StereoPannerShim from './StereoPannerShim';

'use strict';

class ChannelStrip {
  constructor (o) {
    o = o || {};

    this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

    // shim StereoPanner if it's not implemented
    if (typeof this._audioCtx.createStereoPanner === 'undefined') {
      this._audioCtx.createStereoPanner = function () { return new StereoPannerShim(this)};
    }

    this._inputGainNode = this._audioCtx.createGain();
    this._panner = this._audioCtx.createStereoPanner();
    this._outputGainNode = this._audioCtx.createGain();

    // shim the SterePanner connection
    let pannerConnectionShim = {};
    if (this._panner.constructor.name === "StereoPannerNode") {
      pannerConnectionShim = this._panner;
    }
    else if (this._panner.constructor.name === "StereoPannerShim") {
      pannerConnectionShim = this._panner._input;
    }

    this._inputGainNode.connect(pannerConnectionShim);
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
    return this._inputGainNode.gain.value;
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
    return this._outputGainNode.gain.value;
  }
  set outputGain (newGain) {
    this._outputGainNode.gain.value = newGain;
    return this;
  }
}

export default ChannelStrip
