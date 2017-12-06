import Widget from "ui/widget";
import Constraint from "util/constraint";
import ConstraintSpec from "util/constraint-def";

/**
 * Class representing a Volume Meter widget.
 * @class
 * @implements {Widget}
 */
class Meter extends Widget {

  /**
   * @constructor
   * @param {object} container - DOM container for the widget.
   * @param {AudioContext} audioContext - The audio context to be used.
   * @param {object} [o] - Options object.
   * @param {string} [o.backgroundColor="#282828"] - The background color. 
   * @param {number} [o.initAmplitude=0] - The initial amplitude to be displayed (range of 0. - 1.)
   */
  constructor(container, audioContext, o) {
    o.audioContext = audioContext;

    super(container, o); 
  }

  /* ===========================================================================
  *  INITIALIZATION METHODS
  */

  /**
   * Initialize the options
   * @override
   * @protected
   */
  _initOptions(o) {
    this.audioCtx = o.audioContext;
    this.analyser = this.audioCtx.createAnalyser();
    this.dataArray = new Float32Array(this.analyser.frequencyBinCount);
    this.prevAmplitude = 0;
    this.amplitude = 0;
    this.peak = 0;
    this.peakSetTime = this.audioCtx.currentTime;

    // set the defaults
    this.o = {
      backgroundColor: "#282828",
      initAmplitude: 0
    };

    // override defaults with provided options
    super._initOptions(o);
  }

  /**
   * Initialize state constraints.
   * @override
   * @protected
   */
  _initStateConstraints() {}

  /**
   * Initialize state.
   * @override
   * @protected
   */
  _initState() {}

  /**
   * Initialize the svg elements
   * @override
   * @protected
   */
  _initSvgEls() {
    const _this = this;

    this.svgEls = {
      led: document.createElementNS(_this.SVG_NS, "rect"),
      gap: document.createElementNS(_this.SVG_NS, "rect"),
      peak: document.createElementNS(_this.SVG_NS, "rect")
    };
  
    this.svgEls.led.setAttribute("x", 0);
    this.svgEls.led.setAttribute("fill", "url(#meter-linear-gradient)");

    this.svgEls.gap.setAttribute("x", 0);
    this.svgEls.gap.setAttribute("y", 0);
    this.svgEls.gap.setAttribute("fill", this.o.backgroundColor);

    this.svgEls.peak.setAttribute("x", 0);
    this.svgEls.peak.setAttribute("height", 1);
    this.svgEls.peak.setAttribute("fill", "#f00");

    // Create the linear gradient for the led portion
    let linearGradient = document.createElementNS(Meter.prototype.SVG_NS, "linearGradient");

    linearGradient.setAttribute("id", "meter-linear-gradient");
    linearGradient.setAttribute("x1", 0);
    linearGradient.setAttribute("x2", 0);
    linearGradient.setAttribute("y1", 1);
    linearGradient.setAttribute("y2", 0);
    this.svg.appendChild(linearGradient);

    let stop1 = document.createElementNS(Meter.prototype.SVG_NS, "stop");
    let stop2 = document.createElementNS(Meter.prototype.SVG_NS, "stop");
    let stop3 = document.createElementNS(Meter.prototype.SVG_NS, "stop");
    let stop4 = document.createElementNS(Meter.prototype.SVG_NS, "stop");
  
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "green");
    stop2.setAttribute("offset", "40%");
    stop2.setAttribute("stop-color", "green");
    stop3.setAttribute("offset", "80%");
    stop3.setAttribute("stop-color", "yellow");
    stop4.setAttribute("offset", "95%");
    stop4.setAttribute("stop-color", "red");
  
    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop2);
    linearGradient.appendChild(stop3);
    linearGradient.appendChild(stop4);
    
    this._appendSvgEls();
    this._update();
  }

  /**
   * Initialize mouse and touch event handlers
   * @override
   * @protected
   */
  _initHandlers() {}

  /**
   * Update (redraw) component based on state
   * @override
   * @protected
   */
  _update() {
    const _this = this;

    redraw();

    function redraw() {
      _this.analyser.getFloatTimeDomainData(_this.dataArray);
      
      // calculate the rms
      _this.amplitude = Math.sqrt(_this.dataArray.reduce((prev, cur) => {
        return prev + (cur * cur);
      }, 0)/ _this.dataArray.length);
  
      // calculate the peak position
      // special cases - peak = -1 means peak expired and waiting for amplitude to rise
      // peak = 0 means amplitude is rising, waiting for peak
      if (_this.amplitude < _this.prevAmplitude && _this.peak < _this.prevAmplitude && _this.peak !== -1) {
        _this.peak = _this.prevAmplitude;
        _this.peakSetTime = _this.audioCtx.currentTime;
      } else if (_this.amplitude > _this.prevAmplitude) {
        _this.peak = 0;
      }
  
      // draw the peak for 2 seconds, then remove it
      if (_this.audioCtx.currentTime - _this.peakSetTime > 2 && _this.peak !== 0) {
        _this.peak = -1;
      }
  
      _this.prevAmplitude = _this.amplitude;
  

      let containerHeight = _this._getHeight();
      let containerWidth = _this._getWidth();
      let ledHeight = containerHeight * _this.amplitude;
      let gapHeight = Math.max(0, containerHeight - ledHeight);
      let peakY = _this.peak * containerHeight;
  
      _this.svgEls.led.setAttribute("height", containerHeight);
      _this.svgEls.led.setAttribute("width", containerWidth);

      _this.svgEls.gap.setAttribute("height", gapHeight);
      _this.svgEls.gap.setAttribute("width", containerWidth);

      _this.svgEls.peak.setAttribute("y", peakY);
      _this.svgEls.peak.setAttribute("width", containerWidth);

      requestAnimationFrame(redraw);
    }
  }

  /* ===========================================================================
  *  PUBLIC API
  */

  /**
   * Recieve audio from a source.
   * @param {AudioNode} audioSource - The audio source to connect.
   */
  receiveAudioFrom(audioSource) {
    audioSource.connect(this.analyser);
  }

  /**
   * Recieve audio from a source. Alias for 
   * @param {AudioNode} audioSource - The audio source to connect.
   */
  connectTo(audioSource) {
    audioSource.connect(this.analyser);
  }

  /**
   * Get public representation of the state.
   * @abstract
   * @public
   * TODO: IMPLEMENT getVal()
   */
  getVal() {
    throw new Error("Abstract method getPublicState() must be implemented by subclass");
  }

  /**
   * Set the current state in a format specific to each widget.
   * Same as setVal(), but will not cause an observer callback trigger.
   * @abstract @public
   * TODO: IMPLEMENT setInternalVal()
   */
  setInternalVal(newVal) {
    throw new Error("Abstract method setInternalVal() must be implemented by subclass");
  }

  /**
   * Set the current state in a format specific to each widget.
   * Same as setInternalVal(), but will cause an observer callback trigger.
   * @abstract @public
   * TODO: IMPLEMENT setVal()
   */
  setVal(newVal) {
    throw new Error("Abstract method setVal() must be implemented by subclass");
  }

  /* ===========================================================================
  *  HELPER METHODS
  */

  //TODO: IMPLEMENT HELPER METHODS
}

export default Meter;
