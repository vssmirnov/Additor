import Widget from "ui/widget";
import Constraint from "util/constraint";
import ConstraintSpec from "util/constraint-def";

/**
 * Class representing a Multislider widget.
 * @class
 * @implements {Widget}
 */
class Multislider extends Widget {

  /**
   * @constructor
   * @param {object} container - DOM container for the widget.
   * @param {object} [o] - Options.
   * @param {number} [o.numSliders=10] - Number of sliders.
   * @param {number} [o.minVal=0] - Minimum slider value.
   * @param {number} [o.maxVal=127] - Maximum slider value.
   * @param {array<string>} [o.sliderColors=["#000"]] - Slider colors, specified as an array of color values.
   *                                                    e.g. to get a black-white-black-white zebra pattern, specify
   *                                                    ['black', 'white']
   * @param {string} [o.backgroundColor="#fff"] - Background color.
   */
  constructor(container, o) {
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
    // set the defaults
    this.o = {
      numSliders: 10,
      minVal: 0,
      maxVal: 127,
      sliderColors: ["#000"],
      backgroundColor: "#fff",
      mouseSensitivity: 1.2
    };

    // override defaults with provided options
    this.setOptions(o);
  }

  /**
   * Initialize state constraints
   * @override
   * @protected
   */
  _initStateConstraints() {
    const _this = this;

    this.stateConstraits = new ConstraintSpec({
      sliderVals: [new Constraint({ min: _this.o.minVal, max: _this.o.maxVal })]
    });
  }

  /**
   * Initialize state
   * @override
   * @protected
   */
  _initState() {
    this.state = {
      sliderVals: []
    };
  }

  /**
   * Initialize the svg elements
   * @override
   * @protected
   */
  _initSvgEls() {
    const _this = this;

    this.svgEls = {
      panel: document.createElementNS(this.SVG_NS, "rect"),
      sliders: []
    };

    //TODO: IMPLEMENT SVG_ELS ATTRIBUTES

    this._appendSvgEls();
    this._update();
  }

  /**
   * Initialize mouse and touch event handlers
   * @override
   * @protected
   */
  _initHandlers() {
    const _this = this;

    //TODO: IMPLEMENT HANDLER FUNCTIONS
    this.handlers = {
     touch: function(ev) {
     },
     move: function(ev) {
     },
     release: function() {
     }
    };

    //TODO: ASSIGN INIT HANDLERS
  }

  /**
   * Update (redraw) component based on state.
   * @override
   * @protected
   */
  _update() {
    const _this = this;

    _this._updateSvgEls();
  
    for (let i = 0; i < this.o.numSliders; ++i) {
      this.svgEls.sliders[i].setAttribute("x", _this._calcSliderX());
    }

    //TODO: IMPLEMENT UPDATE
    //TODO: IMPLEMENT UPDATE EDGE CASES
  }

  /**
   * Updates the SVG elements. 
   * Adds or removes a number of SVG elements to match the current number of keys.
   * @private
   */
  _updateSvgEls() {
    let numSliders = this.o.numSliders;
    
    // add SVG elements representing sliders to match current number of sliders
    for (let i = this.svgEls.sliders.length; i < numSliders; ++i) {
      this._addSvgSlider();
    }

    // remove SVG elements representing sliders to match current number of sliders
    for (let i = this.svgEls.sliders.length; i > numSliders; ++i) {
      this._removeSvgSlider();
    }
  }

  /* ===========================================================================
  *  PUBLIC API
  */

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

  /**
   * Adds an svg element representing a slider.
   * @private 
   */
  _addSvgSlider() {
    let newSlider = this.document.createElementNS(this.SVG_NS, "rect");
    this.svgEls.sliders.push(newSlider);
  }

  /**
   * Remove an SVG slider element.
   * @private 
   */
  _removeSvgSlider() {
    let targetSlider = this.svgEls.sliders.pop();
    this.svg.removeChild(targetSlider);
    targetSlider = null;
  }

  /**
   * Calculate the width of each slider.
   * Each slider's width is width of multislider / number of sliders.
   * @private
   * @returns {number} - Width of each slider in px. 
   */
  _calcSliderWidth() {
    return this.getWidth() / this.o.numSliders.
  }

  /**
   * Calculate the position for a given slider.
   * @private
   * @param {number} idx - Index of the slider (left to right).
   * @returns {object} - Object representing the {x, y} position.
   */
  _calcSliderPos(idx) {
    const _this = this;

    return {
      x: _this._calcSliderWidth() * idx, 
      y: _this._getHeight()
    }
  }
}

//TODO: CHANGE EXPORT NAME
export default Multislider
