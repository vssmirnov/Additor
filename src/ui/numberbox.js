'use strict';

import Widget from "ui/widget";
import Constraint from "util/constraint";
import ConstraintSpec from "util/constraint-def";

/**
 * Class representing an Numberbox widget.
 * @class
 * @implements {Widget}
 */
class Numberbox extends Widget {

  /**
   * @constructor
   * @param {object} container - DOM container for the widget.
   * @param {object} [o] - Options.
   * @param {number} [o.minVal=null] - Minimum value. 
   * @param {number} [o.maxVal=null] - Maximum value.
   * @param {number} [o.precision=0] - Number of decimal places to use.
   * @param {string} [o.backgroundColor="#282828"] - The background color.
   * @param {string} [o.fontColor="#aaa"] - The font color.
   * @param {string} [o.fontSize="12px"] - The font size.
   * @param {string} [o.fontFamily="Arial"] - The font family.
   */
  constructor(container, o) {
    super(container, o);
  }

  /* ==============================================================================================
  *  PUBLIC API
  */

  /**
   * Returns the current value.
   * @public @override
   * @returns {number} - Current value.
   */
  getVal() {
    return this.state.val;
  }

  /**
   * Sets the current value.
   * Same as setVal(), but will not cause an observer callback trigger.
   * @public @override
   * @param {number} newVal - The new value.
   */
  setInternalVal(newVal) {
    this.setInternalState({ val: newVal });
  }

  /**
   * Sets the current value.
   * Same as setInternalVal(), but will cause an observer callback trigger.
   * @public @override
   * @param {number} newVal - The new value.
   */
  setVal(newVal) {
    this.setState({ val: newVal });
  }

  /* ==============================================================================================
  *  INITIALIZATION METHODS
  */

  /**
   * Initializes the options.
   * @private @override
   */
  _initOptions(o) {
    // set the defaults
    this.o = {
      minVal: 0,
      maxVal: 127,
      precision: 0,
      backgroundColor: "#282828",
      fontColor: "#ccc",
      fontSize: "12px",
      fontFamily: "Arial",
      mouseSensitivity: 1.2
    };

    // override defaults with provided options
    super._initOptions(o);
  }

  /**
   * Initializes state constraints.
   * @private @override
   */
  _initStateConstraints() {
    const _this = this;

    let valConstraintDef = {};

    if (this.o.minVal !== null) {
      valConstraintDef.minVal = this.o.minVal;
    }

    if (this.o.maxVal !== null) {
      valConstraintDef.maxVal = this.o.maxVal;
    }

    this.stateConstraints = new ConstraintSpec({
      val: new Constraint(valConstraintDef)
    });
  }

  /**
   * Initializes the state.
   * @private @override
   */
  _initState() {
    this.state = {
      val: 0
    };
  }

  /**
   * Initializes the svg elements.
   * @private @override
   */
  _initSvgEls() {
    const _this = this;

    this.svgEls = {
      panel: document.createElementNS(_this.SVG_NS, "rect"),
      text: document.createElementNS(_this.SVG_NS, "text"),
      overlay: document.createElementNS(_this.SVG_NS, "rect"),
    };

    this.svgEls.text.setAttribute("alignment-baseline", "middle");
    this.svgEls.text.setAttribute("text-anchor", "middle");

    this._appendSvgEls();
    this._update();
  }

  /**
   * Initializes mouse and touch event handlers.
   * @private @override
   */
  _initHandlers() {
    const _this = this;
    
    let y0 = 0;
    let yD = 0;
    let newVal = _this.getState().val;

    this.handlers = {

      touch: function(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        y0 = ev.clientY;

        document.addEventListener("mousemove", _this.handlers.move);
        document.addEventListener("touchmove", _this.handlers.move);
        document.addEventListener("mouseup", _this.handlers.release);
        document.addEventListener("touchend", _this.handlers.release);
      },

      move: function(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        yD = y0 - ev.clientY;

        newVal = _this.state.val + (yD * _this.o.mouseSensitivity);

        _this.setState({
          val: newVal
        });
      },

      release: function(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        document.removeEventListener("mousemove", _this.handlers.move);
        document.removeEventListener("touchmove", _this.handlers.move);
      }
    };

    this.svg.addEventListener("mousedown", _this.handlers.touch);
    this.svg.addEventListener("touchstart", _this.handlers.touch);
  }

  /**
   * Updates (redraws) components based on state.
   * @private @override
   */
  _update() {
    const _this = this;

    this.svgEls.text.textContent = this.state.val;

    let panelWidth = _this._getWidth();
    let panelHeight = _this._getHeight();
    let textWidth = this.svgEls.text.getBoundingClientRect().width;
    let textHeight = this.svgEls.text.getBoundingClientRect().height;

    this.svgEls.panel.setAttribute("fill", _this.o.backgroundColor);
    this.svgEls.panel.setAttribute("width", panelWidth);
    this.svgEls.panel.setAttribute("height", panelHeight);

    this.svgEls.text.setAttribute("x", panelWidth / 2);
    this.svgEls.text.setAttribute("y", panelHeight / 2);
    this.svgEls.text.setAttribute("fill", _this.o.fontColor);

    this.svgEls.overlay.setAttribute("fill", "transparent");
    this.svgEls.overlay.setAttribute("width", _this._getWidth());
    this.svgEls.overlay.setAttribute("height", _this._getHeight());
  }

  /* ==============================================================================================
  *  INTERNAL FUNCTIONALITY METHODS
  */
}

export default Numberbox;