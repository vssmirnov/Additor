import WidgetSvgNsMixin from "./widget-mixin-svgns";
import WidgetStateMixin from "./widget-mixin-state";
import WidgetOptionsMixin from "./widget-mixin-options";
import WidgetObserverMixin from "./widget-mixin-observer";

'use strict';

/**
 * Abstract base class representing an SVG widget that can be placed inside a DOM container.
 * @class
 * @abstract
 */
class Widget {

  /**
   * @constructor
   * @mixes WidgetSvgNsMixin
   * @mixes WidgetStateMixin
   * @mixes WidgetOptionsMixin
   * @mixes WidgetObserverMixin
   * @param {DOM element | string} container - DOM element that will contain the widget,
   *                                           or string passed to querySelector to find
   *                                           said DOM element.
   * @param {object=} o - Options.
   */
  constructor(container, o) {
    if (typeof container === "string") {
      container = document.querySelector(container);
    }

    if (container === undefined || !(container instanceof Element)) {
      throw new Error("widget requires a DOM element specifying its container as the first argument");
    }

    this.container = container;

    o = o || {};

    this.svg = document.createElementNS(this.SVG_NS, "svg");
    this.container.appendChild(this.svg);
    this.svg.setAttribute("width", this.container.getBoundingClientRect().width);
    this.svg.setAttribute("height", this.container.getBoundingClientRect().height);

    /* Manifest of containers and namespaces */
    this.o = {};                 // options namespace
    this.svgEls = {};            // svg element namespace
    this.handlers = {};          // mouse and touch event handler namespace
    this.state = {};             // state namespace
    this.stateConstraints = {};  // state constraints namespace
    this.observers = [];         // observer callback container

    this._initOptions(o);
    this._initStateConstraints();
    this._initState();
    this._initSvgEls();
    this._initHandlers();
  }

  /**
   * Initialize the options
   * @abstract
   * @protected
   */
  _initOptions(o) {}

  /**
   * Initialize state constraints
   * @abstract
   * @protected
   */
  _initStateConstraints() {}

  /**
   * Initialize state
   * @abstract
   * @protected
   */
  _initState() {}

  /**
   * Initialize the svg elements.
   * Each implementation of this method must end with calls to _appendSvgEls() and _update(),
   * in that order, as shown in this template
   * @abstract
   * @protected
   */
  _initSvgEls() {}

  /**
   * Append the newly created svg elements to the svg container.
   * This method should be called exctly once by each implementation of the _initSvgEls() method.
   * @protected
   */
  _appendSvgEls() {
    const _this = this;

    Object.values(_this.svgEls).forEach(svgEl => {
      appendSvgEls(svgEl);
    });

    function appendSvgEls(child) {
      if (child instanceof Array) {
        child.forEach(arrEl => appendSvgEls(arrEl));
      } else {
        _this.svg.appendChild(child);
        child.setAttribute("shape-rendering", "geometricPrecision");
      }
    }
  }

  /**
   * Initialize mouse and touch event handlers
   * @abstract
   * @protected
   */
  _initHandlers() {}

  /**
   * Update (redraw) component based on state
   * @abstract
   * @protected
   */
  _update() {}

  /* ===========================================================================
  *  PUBLIC API
  */

  /**
   * Get public representation of the state.
   * @abstract
   * @public
   */
  getVal() {}

  /**
   * Set the current state in a format specific to each widget.
   * Same as setVal(), but will not cause an observer callback trigger.
   * @abstract 
   * @public
   */
  setInternalVal(newVal) {}

  /**
   * Set the current state in a format specific to each widget.
   * Same as setInternalVal(), but will cause an observer callback trigger.
   * @abstract @public
   */
  setVal(newVal) {}

  /**
   * Get the current state.
   * @abstract
   * @public
   * @returns {object} - Copy of this.state
   */
  getState() {}

  /**
   * Set the current state and redraw.
   * @description If no new state argument is provided, will reassign old state, taking into account the stateConstraints.
   * As opposed to setState(), setInternalState() does not trigger observer notification.
   * Will use Widget.stateConstraints to constrain each state value to each constraints min, max, or enum
   * @abstract
   * @public
   * @param {object} [newState] - The new state.
   * @returns {boolean} A flag indicating whether the state has been changed.
   */
  setInternalState(newState) {}

  /**
   * Sets the current state and redraws.
   * @description As opposed to setInternalState(), setState() will call the observer callback functions,
   * so may lead to an infinate loop if an observer calls this method.
   * @abstract
   * @public
   * @param {object} [newState] - The new state.
   * @returns {boolean} A flag indicating whether the state has been changed.
   */
  setState(newState) {}
  
  /* ===========================================================================
  *  HELPER METHODS
  */

  /** Helper method: get x relative to the container */
  _getRelativeX(x) {
    return x - this._getLeft();
  }

  /** Helper method: get y relative to the container */
  _getRelativeY(y) {
    return y - this._getTop();
  }

   /** Helper method: get the width of the svg container */
   _getWidth() {
     return this.svg.getBoundingClientRect().width;
   }

   /** Helper method: get the height of the svg container */
   _getHeight() {
     return this.svg.getBoundingClientRect().height;
   }

   /** Helper method: get the top edge position of the svg container */
   _getTop() {
     return this.svg.getBoundingClientRect().top;
   }

   /** Helper method: get the left edge position of the svg container */
   _getLeft() {
     return this.svg.getBoundingClientRect().left;
   }
}

Object.assign(Widget.prototype, WidgetSvgNsMixin);
Object.assign(Widget.prototype, WidgetStateMixin);
Object.assign(Widget.prototype, WidgetOptionsMixin);
Object.assign(Widget.prototype, WidgetObserverMixin);

export default Widget;