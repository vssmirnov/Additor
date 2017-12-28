import AudioModule from "audio_modules/core/audio-module";

'use strict';

/** 
 * Class representing a Stereo Panner Shim.
 * This shim provides an implementation of StereoPannerNode for WebAudio implementations that
 * do not provide it.
 * @class
 */
class StereoPannerShim extends AudioModule {

  /**
   * @constructor
   * @param {AudioContext} audioCtx - Audio Context in which this module participates. 
   */
  constructor(audioCtx) {
    super(audioCtx);

    const _this = this;

    // generate a setter for the pan value
    (function generatePanSetter (val) {
      _this.pan = new Number(val);

      Object.defineProperty(_this.pan, "value", {
        set: function (newVal) {
          newVal = (newVal > 1) ? 1 : newVal;
          newVal = (newVal < -1) ? -1 : newVal;

          _this.audioComponents.gainL.gain.value = -(newVal / 2) + 0.5;
          _this.audioComponents.gainR.gain.value = (newVal / 2) + 0.5;

          generatePanSetter(newVal);
        }
      });
    }());
  }

  /* ============================================================================================= */
  /*  INITIALIZATION METHODS
  /* ============================================================================================= */
  
  /**
   * Initialize audio components and their connections.
   * @private @override
   */
  _initAudioComponents() {
    const _this = this;

    this.audioComponents = {
      gainL: _this.audioCtx.createGain(),  
      gainR: _this.audioCtx.createGain(),
      merger: _this.audioCtx.createChannelMerger(2)
    };

    this.input.connect(this.audioComponents.gainL);
    this.input.connect(this.audioComponents.gainR);
    this.audioComponents.gainL.connect(this.audioComponents.merger, 0, 0);
    this.audioComponents.gainR.connect(this.audioComponents.merger, 0, 1);
    this.audioComponents.merger.connect(this.output);
  }
}

export default StereoPannerShim;