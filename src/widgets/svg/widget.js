/**
 * Abstract base class that represents an svg widget that can be placed inside a DOM container.
 * @param {DOM element} container - DOM element that will contain the widget.
 * @param {object} o - Options.
 */
class Widget {

  constructor(container, o) {
    this.SVG_NS = "http://www.w3.org/2000/svg";

    o = o || {};

    this.svg = document.createElementNS(this.SVG_NS, "svg");
    this.container.appendChild(this.svg);
    this.svg.setAttribute("width", container.getBoundingClientRect().width);
    this.svg.setAttribute("height", container.getBoundingClientRect().height);
    this.svg.setAttribute("borderWidth", 0);

    /* Manifest of containers and namespaces */
    this.o = {}           // options namespace
    this.svgEls = {};     // svg element namespace
    this.handlers = {};   // mouse and touch event handler namespace
    this.state = {};      // state namespace
    this.observers = [];  // observer callback container

    this._initOptions(o);
    this._initSvgEls();
    this._initHandlers();
    this._initState();
  }

  /*========================
   * Init and Update Methods
   *========================*/

  /**
   * Initialize the options
   */
  _initOptions(o) {}

  /**
   * Initialize the svg elements
   */
  _initSvgEls() {}

  /**
   * Initialize mouse and touch event handlers
   */
   _initHandlers() {}

  /**
   * Update (redraw) component based on state
   */
   _update() {}

  /*====================
   * Getters and Setters
   *====================*/

  /**
   * Get the options object
   * @return {object} this.o - Options
   */
  getOptions() {
    return this.o
  }

  /**
   * Set the options
   * Uses a diffing function, so only specified keys that have new values will be changed
   * @param {object} o - options
   * @return {boolean} isChanged - Returns a boolean indicating whether any option has been changed
   */
  setOptions(o) {
    const _this = this;
    o = o || {};
    let isChanged = false;

    Object.keys(o).forEach(key => {
      if (_this.o.hasOwnProperty[key] && _this.o[key] !== o[key]) {
        _this.o[key] = o[key];
        isChanged = true;
      }
    });

    if (isChanged) {
      this._update();
    }

    return isChanged;
  }

  /**
   * Get the current state
   * @return {object} this.state
   */
  getState() {
    return this.state;
  }

  /**
   * Set the current state and redraw. As opposed to _setState(), does not trigger observer notification.
   * Uses a diffing function, so only state that is different will lead to an update.
   * @param {object} newState - The new state.
   * @return {boolean} isChanged - Returns a boolean indicating whether the state has been changed
   */
  setState(newState) {
    const _this = this;
    newState = newState || {};
    let isChanged = false;

    Object.keys(newState).forEach(key => {
      if (_this.state.hasOwnProperty(key) && _this.state[key] !== newState[key]) {
        _this.state[key] = newState[key];
        isChanged = true;
      }
    });

    if (isChanged === true) {
      this._update();
    }

    return isChanged;
  }

  /**
   * Set the current state redraw (private method).
   * As opposed to the public version (setState()), _setState() will call the observer callback functions,
   * so may lead to an infinate loop if an observer calls this method.
   * Uses a diffing function, so only state that is different will lead to an update.
   * @param {object} newState - The new state.
   * @return {boolean} isChanged - Returns a boolean indicating whether the state has been changed
   */
  _setState(newState) {
    const _this = this;
    newState = newState || {};

    if (this.setState(newState)) {
      this._notifyObservers();
      return true;
    }

    return false;
  }

  /* ================
   * Observer methods
   * ================*/

  /**
   * Register a new observer function that will recieve the state value every time the state is updated.
   * @param {function} newObserver - The new observer function to be notified every time the state changes.
   * @return {boolean} isChanged - Indicates whether an observer was added.
   */
  addObserver(newObserver) {
    let isChanged = false;

    if (!(this.observers.find(observer => observer === newObserver)) {
      this.observers.push(newObserver);
      isChanged = true;
    }

    return isChanged;
  }

  /**
   * Remove an observer function from being notified when the state changes.
   * @param {function} targetObserver - The observer function to be removed.
   * @return {boolean} isChanged - Indicates whether an observer has been removed
   */
  removeObserver(targetObserver) {
    const _this = this;
    let isChanged = false;

    this.observers.forEach((observer, idx) => {
      if (observer === targetObserver) {
        _this.observers.splice(idx, 1);
        isChanged = true;
      }
    });

    return isChanged;
  }

  /**
   * Notify all observers of new state (private method)
   */
  _notifyObservers() {
    const _this = this;
    this.observers.forEach(observer => observer(_this.state));
  }

  /* ==============
   * Helper Methods
   * ==============*/

   /** Get the width of the svg container */
   _getWidth() {
     return this.svg.getBoundingClientRect().width;
   }

   /** Get the height of the svg container */
   _getHeight() {
     return this.svg.getBoundingClientRect().height;
   }
}

export default Widget;
