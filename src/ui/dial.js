'use strict';

import Widget from "ui/widget";
import Constraint from "util/constraint";
import ConstraintSpec from "util/constraint-def";

/**
 * Class representing an SVG Dial widget.
 * @class
 * @implements {Widget}
 */
class Dial extends Widget {

  /**
   * @constructor
   * @param {object} container - DOM container for the widget.
   * @param {object=} o - options.
   * @param {number=0} o.minVal - Minimum value constraint.
   * @param {number=127} o.maxVal - Maximum value constraint.
   * @param {string="#000"} o.needleColor - Dial needle color.
   * @param {string="#f40"} o.activeColor - Dial active color.
   */
  constructor(container, o) {
    super(container, o);
  }

  /* ===========================================================================
  *  PUBLIC API
  */

  /**
   * Returns the dial value.
   * @public @override
   * @returns {number} - Value of the dial.
   */
  getVal() {
    return this.state.val;
  }

  /**
   * Sets the dial value.
   * Same as setVal(), but will not trigger observer callbacks.
   * @public @override
   * @param {number} newVal - The new value.
   */
  setInternalVal(newVal) {
    this.setInternalState({ val: newVal });
  }

  /**
   * Sets the dial value.
   * Same as setInternalVal(), but will trigger observer callbacks.
   * @public @override
   * @param {number} newVal - The new value.
   */
  setVal(newVal) {
    this.setState({val: newVal });
  }

  /* ==============================================================================================
  *  INITIALIZATION METHODS
  */

  /**
   * Initializes the options.
   * @override
   * @private
   */
  _initOptions(o) {
    // set the defaults
    this.o = {
      minVal: 0,
      maxVal: 127,
      needleColor: "#414141",
      activeColor: "#f40",
      mouseSensitivity: 1.2
    };

    // override defaults with provided options
    this.setOptions(o);
  }

  /**
   * Initializes state constraints.
   * @override
   * @private
   */
  _initStateConstraints() {
    const _this = this;

    this.stateConstraints = new ConstraintSpec({
      val: new Constraint({
        min: _this.o.minVal,
        max: _this.o.maxVal,
        transform: num => ~~num
      })
    });
  }

  /**
   * Initializes state.
   * @override
   * @private
   */
  _initState() {
    this.state = {
      val: 0
    };
  }

  /**
   * Initializes the svg elements.
   * @override
   * @private
   */
  _initSvgEls() {
    const _this = this;

    this.svgEls = {
      bgArc: document.createElementNS(this.SVG_NS, "path"),
      activeArc: document.createElementNS(this.SVG_NS, "path"),
      needle: document.createElementNS(this.SVG_NS, "line")
    };

    // draw the background arc
    this.svgEls.bgArc.setAttribute("d",
      _this._calcSvgArcPath(
        _this._calcNeedleCenter().x,
        _this._calcNeedleCenter().y,
        _this._calcDialRadius(),
        0.67 * Math.PI,
        2.35 * Math.PI
    ));
    this.svgEls.bgArc.setAttribute("stroke-width", _this._calcArcStrokeWidth());
    this.svgEls.bgArc.setAttribute("stroke", _this.o.needleColor);
    this.svgEls.bgArc.setAttribute("fill", "transparent");
    this.svgEls.bgArc.setAttribute("stroke-linecap", "round");

    // draw the active arc
    this.svgEls.activeArc.setAttribute("stroke-width", _this._calcArcStrokeWidth());
    this.svgEls.activeArc.setAttribute("stroke", _this.o.activeColor);
    this.svgEls.activeArc.setAttribute("fill", "transparent");
    this.svgEls.activeArc.setAttribute("stroke-linecap", "round");

    // draw the needle
    this.svgEls.needle.setAttribute("x1", _this._calcNeedleCenter().x);
    this.svgEls.needle.setAttribute("y1", _this._calcNeedleCenter().y);
    this.svgEls.needle.setAttribute("x2", _this._calcNeedleEnd().x);
    this.svgEls.needle.setAttribute("y2", _this._calcNeedleEnd().y);
    this.svgEls.needle.setAttribute("stroke-width", _this._calcNeedleWidth());
    this.svgEls.needle.setAttribute("stroke", _this.o.needleColor);
    this.svgEls.needle.setAttribute("z-index", "1000");
    this.svgEls.needle.setAttribute("stroke-linecap", "round");

    this._appendSvgEls();
    this._update();
  }

  /**
   * Initializes mouse and touch event handlers.
   * @override
   * @private
   */
   _initHandlers() {
      const _this = this;

      let y0 = 0;
      let yD = 0;
      let newVal = _this.getState().val;

      this.handlers = {
       touch: function(ev) {
         y0 = ev.clientY;

         document.addEventListener("mousemove", _this.handlers.move);
         document.addEventListener("touchmove", _this.handlers.move);
         document.addEventListener("mouseup", _this.handlers.release);
         document.addEventListener("touchend", _this.handlers.release);
       },
       move: function(ev) {
         ev.preventDefault();

         yD = y0 - ev.clientY;
         y0 = ev.clientY;

         newVal = _this.state.val + (yD * _this.o.mouseSensitivity);
         newVal = Math.max(newVal, _this.o.minVal);
         newVal = Math.min(newVal, _this.o.maxVal);

         _this.setState({
           val: newVal
         });
       },
       release: function() {
         document.removeEventListener("mousemove", _this.handlers.move);
         document.removeEventListener("touchmove", _this.handlers.move);
       }
      };

      this.svg.addEventListener("mousedown", _this.handlers.touch);
      this.svg.addEventListener("touchstart", _this.handlers.touch);
   }

  /**
   * Updates (redraws) components based on state.
   * @override
   * @private
   */
   _update() {
     // change the needle angle
     this.svgEls.needle.setAttribute("x1", this._calcNeedleCenter().x);
     this.svgEls.needle.setAttribute("y1", this._calcNeedleCenter().y);
     this.svgEls.needle.setAttribute("x2", this._calcNeedleEnd().x);
     this.svgEls.needle.setAttribute("y2", this._calcNeedleEnd().y);

     // change the active arc length
     this.svgEls.activeArc.setAttribute("d",
       this._calcSvgArcPath(
         this._calcNeedleCenter().x,
         this._calcNeedleCenter().y,
         this._calcDialRadius(),
         0.65 * Math.PI,
         this._calcNeedleAngle() - 0.5 * Math.PI
     ));

     // if the value is at min, change the color to match needle color
     // - otherwise the active part will be visible beneath the needle
     if (this.state.val === this.o.minVal) {
       this.svgEls.activeArc.setAttribute("stroke", this.o.needleColor);
     } else {
       this.svgEls.activeArc.setAttribute("stroke", this.o.activeColor);
     }
   }

  /* ==============================================================================================
  *  INTERNAL FUNCTIONALITY METHODS
  */

   /** 
    * Calcultes the stroke width for the background and active arcs.
    * @private
    * @returns {number} - Arc stroke width;
    */
   _calcArcStrokeWidth() {
     return this._calcDialRadius() / 5;
   }

   /** 
    * Calculates the dial radius.
    * @private
    * @returns {number} - Radius of the dial.
    */
   _calcDialRadius() {
     let radius = (Math.min(this._getWidth(), this._getHeight()) / 2) * 0.89;
     radius = Math.trunc(radius);
     return radius;
   }

   /** 
    * Calculates the needle angle for a given state val.
    * @private
    * @returns {number} - Angle of the needle.
    */
   _calcNeedleAngle() {
     const _this = this;

     return (
              // protect against divide by 0:
              ((this.o.maxVal - _this.o.minVal) !== 0) ?
                  (  
                    (_this.state.val - _this.o.minVal) / (_this.o.maxVal - _this.o.minVal) * (1.7 * Math.PI) + 
                    (1.15 * Math.PI)
                  )  
                : ( 0.5 * (1.7 * Math.PI) + (1.15 * Math.PI) )
            );
   }

   /** 
    * Calculates the center of the needle.
    * @private
    * @returns {object} - {x, y} object representing the needle center coordinates.
    */
   _calcNeedleCenter() {
     const _this = this;
     return {
       x: Math.trunc(_this._getWidth() / 2),
       y: Math.trunc(_this._getHeight() / 2)
     };
   }

   /** 
    * Calculates the position of end of the needle
    * @private
    * @returns {object} - {x, y} object representing the end of the needle. 
    */
   _calcNeedleEnd() {
     const _this = this;
     return {
       x: _this._calcNeedleCenter().x + (Math.sin(_this._calcNeedleAngle()) * _this._calcDialRadius()),
       y: _this._calcNeedleCenter().y - (Math.cos(_this._calcNeedleAngle()) * _this._calcDialRadius())
     };
   }

   /** 
    * Calculates the needle width.
    * @private
    * @returns {number} - The width of the needle in px.
    */
   _calcNeedleWidth() {
     return this._calcDialRadius() / 5;
   }

   /** 
    * Calculates the path for an svg arc based on cx, cy, r, startAngle, endAngle.
    * The input parameters are the way arcs are represented in HTML canvas.
    * @private
    * @param {number} cx - Center X.
    * @param {number} cy - Center Y.
    * @param {number} r - Radius.
    * @param {number} startAngle - Start angle in radians.
    * @param {number} endAngle - End angle in radians.
    * @returns {string} - A string to be used for the arc path by an SVG arc object.
    */
   _calcSvgArcPath(cx, cy, r, startAngle, endAngle) {
     let x1 = cx + (r * Math.cos(startAngle));
     let y1 = cy + (r * Math.sin(startAngle));
     let x2 = cx + (r * Math.cos(endAngle));
     let y2 = cy + (r * Math.sin(endAngle));
     let largeArc = (endAngle - startAngle) < Math.PI ? 0 : 1;
     let sweep = (endAngle - startAngle) < Math.PI ? 1 : 1;

     return ["M", x1, y1, "A", r, r, 0, largeArc, sweep, x2, y2].join(" ");
   }
}

export default Dial;