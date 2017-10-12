import WidgetSvgNsMixin from "./widget-svgns-mixin";
import WidgetStateMixin from "./widget-state-mixin";
import WidgetOptionsMixin from "./widget-options-mixin";
import WidgetObserverMixin from "./widget-observer-mixin";

/**
 * Abstract base class that represents an svg widget that can be placed inside a DOM container.
 * @class
 */
class Widget {

  /**
   * @constructor
   * @mixes WidgetSvgNsMixin
   * @mixes WidgetStateMixin
   * @mixes WidgetOptionsMixin
   * @mixes WidgetObserverMixin
   * @param {DOM element} container - DOM element that will contain the widget.
   * @param {object} o - Options.
   */
  constructor(container, o) {
    this.container = container;

    o = o || {};

    this.svg = document.createElementNS(this.SVG_NS, "svg");
    this.container.appendChild(this.svg);
    this.svg.setAttribute("width", this.container.getBoundingClientRect().width);
    this.svg.setAttribute("height", this.container.getBoundingClientRect().height);

    /* Manifest of containers and namespaces */
    this.o = {}                  // options namespace
    this.svgEls = {};            // svg element namespace
    this.handlers = {};          // mouse and touch event handler namespace
    this.state = {};             // state namespace
    this.stateConstraints = {};  // state constraints namespace
    this.observers = [];         // observer callback container

    this._initOptions(o);
    this._initState();
    this._initSvgEls();
    this._initHandlers();
  }

  /**
   * Initialize the options
   * @abstract
   * @protected
   */
  _initOptions(o) {
    throw new Error("Abstract method _initOptions(o) must be implemented by subclass");
  }

  /**
   * Initialize state
   * @abstract
   * @protected
   */
  _initState() {
    throw new Error("Abstract method _initState() must be implemented by subclass");
  }

  /**
   * Initialize the svg elements
   * @abstract
   * @protected
   */
  _initSvgEls() {
    throw new Error("Abstract method _initSvgEls() must be implemented by subclass");
  }

  /**
   * Initialize mouse and touch event handlers
   * @abstract
   * @protected
   */
  _initHandlers() {
    throw new Error("Abstract method _initHandlers() must be implemented by subclass");
  }

  /**
   * Update (redraw) component based on state
   * @abstract
   * @protected
   */
  _update() {
    throw new Error("Abstract method _update() must be implemented by subclass");
  }

   /** Helper method: get the width of the svg container */
   _getWidth() {
     return this.svg.getBoundingClientRect().width;
   }

   /** Helper method: get the height of the svg container */
   _getHeight() {
     return this.svg.getBoundingClientRect().height;
   }
}

Object.assign(Widget.prototype, WidgetSvgNsMixin);
Object.assign(Widget.prototype, WidgetStateMixin);
Object.assign(Widget.prototype, WidgetOptionsMixin);
Object.assign(Widget.prototype, WidgetObserverMixin);

export default Widget
