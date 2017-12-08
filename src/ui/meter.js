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
  constructor(container, audioCtx, o) {
    super(container, o);

    // remove the svg since we are using canvas here
    this.container.removeChild(this.svg);
    this.svg = null;

    this._initCanvasElements();
    this._initAudioModules(audioCtx);
    this._initOptions(o);
  }

  /* ===========================================================================
  *  INITIALIZATION METHODS
  */

  /**
   * Initialize the options.
   * @override
   * @private
   */
  _initOptions(o) {
    // set the defaults
    this.o = {
      backgroundColor: "#282828",
      initAmplitude: 0
    };

    // override defaults with provided options
    super._initOptions(o);
  }

  /**
   * Initialize the audio modules necessary to analyse the volume.
   * @param {AudioContext} audioCtx - The audio context to use.
   */
  _initAudioModules(audioCtx) {
    const _this = this;

    this.audioCtx = audioCtx;
    
    // keep track of audio values
    this.amplitude = 0;
    this.prevAmplitude = 0;
    this.peak = 0;
    this.peakSetTime = audioCtx.currentTime;
    
    // create the script processor
    // TODO: ScriptProcessorNode is soon to be derpecated and replaced by AudioWorker
    this.scriptProcessor = this.audioCtx.createScriptProcessor(512, 1, 1);
    this.scriptProcessor.connect(this.audioCtx.destination);
    this.scriptProcessor.onaudioprocess = function(e) {
      _this.amplitude = _this._calcAmplitude(e.inputBuffer.getChannelData(0));
      _this.peak = _this._calcPeak();
    };
  }

  /**
   * Initialize the canvas elements.
   * @private
   */
  _initCanvasElements() {
    if (this.canvas === undefined) {
      this.canvas = document.createElement("canvas");
      this.container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext("2d");
    }
  
    let containerDims = this.container.getBoundingClientRect();
    
    this.canvas.setAttribute("width", containerDims.width);
    this.canvas.setAttribute("height", containerDims.height);

    this.ledGradient = this.ctx.createLinearGradient(0, this.canvas.height, 0, 0);
    this.ledGradient.addColorStop(0, 'green');
    this.ledGradient.addColorStop(0.6, 'lightgreen');
    this.ledGradient.addColorStop(0.8, 'yellow');
    this.ledGradient.addColorStop(1, 'red');

    this._update();
  }

  /**
   * Update (redraw) component based on state.
   * @override
   * @private
   */
  _update() {
    const _this = this;

    let containerDims = this.container.getBoundingClientRect();
    let width = containerDims.width;
    let height = containerDims.height;

    redraw();

    function redraw() {
      _this.peak = _this._calcPeak();

      let ledHeight = height * _this.amplitude;   
      let peakYPos = height * _this.peak;

      console.log("peakkk: ", _this.peak);

      _this.ctx.clearRect(0, 0, width, height);
      
      // draw the background
      _this.ctx.fillStyle = _this.o.backgroundColor;
      _this.ctx.fillRect(0, 0, width, height);

      // draw the led
      _this.ctx.fillStyle = _this.ledGradient;
      _this.ctx.fillRect(0, height - ledHeight, width, ledHeight);

      // draw the peak
      _this.ctx.fillStyle = _this.ledGradient;
      _this.ctx.fillRect(0, peakYPos, width, 10);
      
      window.requestAnimationFrame(redraw);
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
    audioSource.connect(this.scriptProcessor);
  }

  /* ===========================================================================
  *  HELPER METHODS
  */

  /**
   * Calculate the amplitude for a given audio buffer
   * @param {Float32Array} buffer
   */
  _calcAmplitude(buffer) {
    let sum = 0;
    
    for (let i = 0; i < buffer.length; ++i) {
      sum += buffer[i] * buffer[i];
    }

    return Math.sqrt(sum / buffer.length); 
  }

  /**
   * Calculate the current peak
   */
  _calcPeak() {

    // calculate the peak position
    // special cases - peak = -1 means peak expired and waiting for amplitude to rise
    // peak = 0 means amplitude is rising, waiting for peak
    if (this.amplitude < this.prevAmplitude) {
      this.peak = this.prevAmplitude;
      this.peakSetTime = this.audioCtx.currentTime;
    } else if (this.amplitude > this.prevAmplitude) {
      this.peak = 0;
    }

    // draw the peak for 2 seconds, then remove it
    if (this.audioCtx.currentTime - this.peakSetTime > 2 && this.peak !== 0) {
      this.peak = -1;
    }

    this.prevAmplitude = this.amplitude;
  }
}

export default Meter;