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
      sliderColors: ["#f40", "#f50"],
      backgroundColor: "#fff",
      mouseSensitivity: 1.2
    };

    // override defaults with provided options
    super._initOptions(o);
  }

  /**
   * Initialize state constraints
   * @override
   * @protected
   */
  _initStateConstraints() {
    const _this = this;

    this.stateConstraints = new ConstraintSpec({
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
      sliders: [],
      sliderPanels: []
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
      touch: function touch(ev) {
        ev.preventDefault();

        let y = _this._getHeight() - _this._getRelativeY(ev.clientY);

        _this._setSliderVal(ev.target, y);

        for (let i = 0; i < _this.svgEls.sliderPanels.length; ++i) {
          _this.svgEls.sliderPanels[i].addEventListener("mousemove", _this.handlers.move);
          _this.svgEls.sliderPanels[i].addEventListener("touchmove", _this.handlers.move);

        }
        
        document.addEventListener("mouseup", _this.handlers.release);
        document.addEventListener("touchend", _this.handlers.release);
      },

      move: function move(ev) {
        ev.preventDefault();
              
        let y = _this._getHeight() - _this._getRelativeY(ev.clientY);
        _this._setSliderVal(ev.target, y);
      },

      release: function release(ev) {
        ev.preventDefault();

        for (let i = 0; i < _this.svgEls.sliderPanels.length; ++i) {
          _this.svgEls.sliderPanels[i].removeEventListener("mousemove", _this.handlers.move);
          _this.svgEls.sliderPanels[i].removeEventListener("touchmove", _this.handlers.move);
        }
      }
    };

    for (let i = 0; i < this.svgEls.sliderPanels.length; ++i) {
      this.svgEls.sliderPanels[i].addEventListener("mousedown", this.handlers.touch);
      this.svgEls.sliderPanels[i].addEventListener("touchstart", this.handlers.touch);
    }
  }

  /**
   * Update (redraw) component based on state.
   * @override
   * @protected
   */
  _update() {
    const _this = this;

    _this._updateEls();
  
    for (let i = 0; i < this.o.numSliders; ++i) {
      let sliderPos = _this._calcSliderPos(i);

      this.svgEls.sliders[i].setAttribute("x", sliderPos.x);
      this.svgEls.sliders[i].setAttribute("y", sliderPos.y);
      this.svgEls.sliders[i].setAttribute("width", _this._calcSliderWidth());
      this.svgEls.sliders[i].setAttribute("height", _this._calcSliderHeight(i));
      this.svgEls.sliders[i].setAttribute("fill", this.o.sliderColors[i % this.o.sliderColors.length]);

      this.svgEls.sliderPanels[i].setAttribute("x", sliderPos.x);
      this.svgEls.sliderPanels[i].setAttribute("y", 0);
      this.svgEls.sliderPanels[i].setAttribute("width", _this._calcSliderWidth());
      this.svgEls.sliderPanels[i].setAttribute("height", _this._getHeight());
      this.svgEls.sliderPanels[i].setAttribute("fill", "transparent");
    }

    // set background panel color
    this.svgEls.panel.setAttribute("x", 0);
    this.svgEls.panel.setAttribute("y", 0);
    this.svgEls.panel.setAttribute("width", _this._getWidth());
    this.svgEls.panel.setAttribute("height", _this._getHeight());
    this.svgEls.panel.setAttribute("fill", this.o.backgroundColor);
  }

  /**
   * Updates the SVG elements and state containers. 
   * Adds or removes a number of SVG elements and state containers to match the current number of sliders.
   * @private
   */
  _updateEls() {
    let numSliders = this.o.numSliders;

    // add SVG elements representing sliders to match current number of sliders
    for (let i = this.state.sliderVals.length; i < numSliders; ++i) {
      this.state.sliderVals.push(this.o.minVal);
      this._addSvgSlider();
    }

    // remove SVG elements representing sliders to match current number of sliders
    for (let i = this.state.sliderVals.length; i > numSliders; --i) {
      this.state.sliderVals.pop();
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
    let _this = this;

    let newSlider = document.createElementNS(this.SVG_NS, "rect");
    let newSliderPanel = document.createElementNS(this.SVG_NS, "rect");
    this.svg.appendChild(newSlider);
    this.svg.appendChild(newSliderPanel);
    this.svgEls.sliders.push(newSlider);
    this.svgEls.sliderPanels.push(newSliderPanel);

    console.log(_this.handlers);

    newSliderPanel.addEventListener("mousedown", _this.handlers.touch);
    newSliderPanel.addEventListener("touchstart", _this.handlers.touch);
  }

  /**
   * Remove an SVG slider element.
   * @private 
   */
  _removeSvgSlider() {
    let targetSlider = this.svgEls.sliders.pop();
    let targetSliderPanel = this.svgEls.sliderPanels.pop();
    this.svg.removeChild(targetSliderPanel);
    this.svg.removeChild(targetSlider);
    targetSlider = null;
    targetSliderPanel = null;
  }

  /**
   * Calculate the width of each slider.
   * Each slider's width is width of multislider / number of sliders.
   * @private
   * @returns {number} - Width of each slider in px. 
   */
  _calcSliderWidth() {
    return this._getWidth() / this.o.numSliders;
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
      y: _this._getHeight() - _this._calcSliderHeight(idx)
    }
  }

  /**
   * Calculate the slider height.
   * @private
   * @param {number} idx - Index of the slider.
   * @returns {number} - Height of the slider in px.
   */
  _calcSliderHeight(idx) {
    return (this.state.sliderVals[idx] / (this.o.maxVal - this.o.minVal)) * this._getHeight(); 
  }

  /**
   * Set value for a slider based on y position of a click event.
   * @param {object} targetSliderPanel - The panel that registered the event. 
   * @param {number} y - Y-position of the event. 
   */
  _setSliderVal(targetSliderPanel, y) {
    const _this = this;
    
    let targetIdx = this.svgEls.sliderPanels.findIndex(sliderPanel => sliderPanel === targetSliderPanel);
    let newVal = (y / (this._getHeight())) * (this.o.maxVal - this.o.minVal) + this.o.minVal;

    let newState = {
      sliderVals: _this.state.sliderVals.map((val, idx) => {
        return (idx === targetIdx) ? newVal : val;
      })
    }

    this.setState(newState);
  }
}

//TODO: CHANGE EXPORT NAME
export default Multislider
