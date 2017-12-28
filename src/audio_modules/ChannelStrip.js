import StereoPannerShim from './shim/StereoPannerShim';
import AudioModule from "./core/audio-module";
import AudioModuleUtil from "./core/util";

'use strict';

/**
 * Class representing a Channel Strip Audio Module.
 * A Channel Strip is a processing component similar to a channel strip found on a mixing board.
 * It facilitates control over input gain, output gain, and pan of a signal.
 * @class
 */
class ChannelStrip extends AudioModule {
  
  /**
   * @constructor
   * @param {AudioContext} audioCtx 
   * @param {object} o 
   */
  constructor(audioCtx, o) {
    super(audioCtx);

    o = o || {};

    // shim StereoPanner if it's not implemented
    if (typeof this._audioCtx.createStereoPanner === 'undefined') {
      this._audioCtx.createStereoPanner = function () { return new StereoPannerShim(this) };
    }

    // shim the SterePanner connection
    let pannerConnectionShim = {};
    if (this._panner.constructor.name === "StereoPannerNode") {
      pannerConnectionShim = this._panner;
    }
    else if (this._panner.constructor.name === "StereoPannerShim") {
      pannerConnectionShim = this._panner._input;
    }
  }

  /**
   * Initializes the audio patch.
   * @private @override
   */
  _initAudioPatch() {
    const _this = this;

    this.audioEls = {
      inputGainNode: _this.audioCtx.createGain(),
      panner: _this.audioCtx.createStereoPanner(),
      outputGainNode: _this.audioCtx.createGain()
    }

    this.input.connect(this.audioEls.inputGainNode);
    this.audioEls.inputGainNode.connect(this.audioEls.panner);
    this.audioEls.panner.connect(this.audioEls.outputGainNode);
    this.audioEls.outputGainNode.connect(this.output);
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

export default ChannelStrip;
