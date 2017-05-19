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

  connect(audioNode) {
    this._output.connect(audioNode);
  }
}

export default StereoPannerShim
