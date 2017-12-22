import AudioModule from "audio_modules/core/audio-module";

/** Stereo panner shim */
class StereoPannerShim {
  constructor (ac) {
    let _this = this;

    _this._input = ac.createGain();
    _this._gainL = ac.createGain();
    _this._gainR = ac.createGain();
    _this._input.connect(this._gainL);
    _this._input.connect(this._gainR);
    _this._output = ac.createChannelMerger(2);
    _this._gainL.connect(this._output, 0, 0);
    _this._gainR.connect(this._output, 0, 1);

    _this._pan = 0;

    (function generatePanSetter (val) {
      _this.pan = new Number(val);

      Object.defineProperty(_this.pan, "value", {
        set: function (newVal) {
          newVal = (newVal > 1) ? 1 : newVal;
          newVal = (newVal < -1) ? -1 : newVal;

          _this._pan = newVal;

          _this._gainL.gain.value = -(newVal / 2) + 0.5;
          _this._gainR.gain.value = (newVal / 2) + 0.5;

          generatePanSetter(newVal);
        }
      });
    }());

    return this;
  }

  /**
   * Connect to another AudioNode or AudioModule
   */
  connect (destination) {
    // if destination has an input property, connect to it (destination is an AudioModule)
    if (typeof destination.input === "object") {
      this.output.connect(destination.input);
    }
    // else destination is an AudioNode and can be connected to directly
    else {
      this.output.connect(destination);
    }
  }

  /**
   * Disconnect from an AudioNode or AudioModule
   */
  disconnect (destination) {
    // if destination has an input property, disconnect from it (destination is an AudioModule)
    if (typeof destination.input === "object") {
      this.output.disconnect(destination.input);
    // else destination is an AudioNode and can be disconnected from directly
    } else {
      this.output.disconnect(destination);
    }
  }
}

export default StereoPannerShim;