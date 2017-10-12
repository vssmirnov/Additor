/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _widget = __webpack_require__(2);

var _widget2 = _interopRequireDefault(_widget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WidgetDial = function (_Widget) {
  _inherits(WidgetDial, _Widget);

  function WidgetDial(container, o) {
    _classCallCheck(this, WidgetDial);

    return _possibleConstructorReturn(this, (WidgetDial.__proto__ || Object.getPrototypeOf(WidgetDial)).call(this, container, o));
  }

  /*========================
   * Init and Update Methods
   *========================*/

  /**
   * Initialize the options
   * @override
   */


  _createClass(WidgetDial, [{
    key: "_initOptions",
    value: function _initOptions(o) {
      this.o = {
        minVal: 0,
        maxVal: 127,
        needleColor: "#000",
        activeColor: "#f40",
        mouseSensitivity: 0.45
      };

      this.setOptions(o);
    }

    /**
     * Initialize state
     * @override
     */

  }, {
    key: "_initState",
    value: function _initState() {
      this.state = {
        val: 0
      };
    }

    /**
     * Initialize the svg elements
     * @override
     */

  }, {
    key: "_initSvgEls",
    value: function _initSvgEls() {
      var _this = this;

      this.svgEls = {
        bgArc: document.createElementNS(this.SVG_NS, "path"),
        activeArc: document.createElementNS(this.SVG_NS, "path"),
        needle: document.createElementNS(this.SVG_NS, "line")
      };

      Object.keys(_this.svgEls).forEach(function (key) {
        _this.svg.appendChild(_this.svgEls[key]);
      });

      // draw the background arc
      this.svgEls.bgArc.setAttribute("d", _this._calcSvgArcPath(_this._calcNeedleCenter().x, _this._calcNeedleCenter().y, _this._calcDialRadius(), 0.67 * Math.PI, 2.35 * Math.PI));
      this.svgEls.bgArc.setAttribute("stroke-width", _this._calcArcStrokeWidth() - 0.5);
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

      this._update();
    }

    /**
     * Initialize mouse and touch event handlers
     * @override
     */

  }, {
    key: "_initHandlers",
    value: function _initHandlers() {
      var _this = this;

      var y0 = 0;
      var yD = 0;
      var newVal = _this.getState().val;

      this.handlers = {
        touch: function touch(ev) {
          y0 = ev.clientY;

          document.addEventListener("mousemove", _this.handlers.move);
          document.addEventListener("touchmove", _this.handlers.move);
          document.addEventListener("mouseup", _this.handlers.release);
          document.addEventListener("touchend", _this.handlers.release);
        },
        move: function move(ev) {
          yD = y0 - ev.clientY;
          y0 = ev.clientY;

          newVal = _this.state.val + yD * _this.o.mouseSensitivity;
          newVal = Math.max(newVal, _this.o.minVal);
          newVal = Math.min(newVal, _this.o.maxVal);

          _this._setState({
            val: newVal
          });
        },
        release: function release() {
          document.removeEventListener("mousemove", _this.handlers.move);
          document.removeEventListener("touchmove", _this.handlers.move);
        }
      };

      this.svg.addEventListener("mousedown", _this.handlers.touch);
      this.svg.addEventListener("touchstart", _this.handlers.touch);
    }

    /**
     * Update (redraw) component based on state
     * @override
     */

  }, {
    key: "_update",
    value: function _update() {
      // change the needle angle
      this.svgEls.needle.setAttribute("x1", this._calcNeedleCenter().x);
      this.svgEls.needle.setAttribute("y1", this._calcNeedleCenter().y);
      this.svgEls.needle.setAttribute("x2", this._calcNeedleEnd().x);
      this.svgEls.needle.setAttribute("y2", this._calcNeedleEnd().y);

      // change the active arc length
      this.svgEls.activeArc.setAttribute("d", this._calcSvgArcPath(this._calcNeedleCenter().x, this._calcNeedleCenter().y, this._calcDialRadius(), 0.65 * Math.PI, this._calcNeedleAngle() - 0.5 * Math.PI));

      // if the value is at min, change the color to match needle color
      // - otherwise the active part will be visible beneath the needle
      if (this.state.val === this.o.minVal) {
        this.svgEls.activeArc.setAttribute("stroke", this.o.needleColor);
      } else {
        this.svgEls.activeArc.setAttribute("stroke", this.o.activeColor);
      }
    }

    /*====================
     * Getters and Setters
     *====================*/

    /**
     * Get the options object
     * @return {object} this.o - Options
     * @override
     */

  }, {
    key: "getOptions",
    value: function getOptions() {
      return this.o;
    }

    /**
     * Set the options
     * Uses a diffing function, so only specified keys that have new values will be changed
     * @param {object} o - options
     * @return {boolean} isChanged - Returns a boolean indicating whether any option has been changed
     * @override
     */

  }, {
    key: "setOptions",
    value: function setOptions(o) {
      var _this = this;
      o = o || {};
      var isChanged = false;

      Object.keys(o).forEach(function (key) {
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
     * @override
     */

  }, {
    key: "getState",
    value: function getState() {
      return this.state;
    }

    /**
     * Set the current state and redraw. As opposed to _setState(), does not trigger observer notification.
     * Uses a diffing function, so only state that is different will lead to an update.
     * @param {object} newState - The new state.
     * @return {boolean} isChanged - Returns a boolean indicating whether the state has been changed
     * @override
     */

  }, {
    key: "setState",
    value: function setState(newState) {
      var _this = this;
      newState = newState || {};
      var isChanged = false;

      Object.keys(newState).forEach(function (key) {
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
     * @override
     */

  }, {
    key: "_setState",
    value: function _setState(newState) {
      var _this = this;
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

  }, {
    key: "addObserver",
    value: function addObserver(newObserver) {
      var isChanged = false;

      if (!this.observers.find(function (observer) {
        return observer === newObserver;
      })) {
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

  }, {
    key: "removeObserver",
    value: function removeObserver(targetObserver) {
      var _this = this;
      var isChanged = false;

      this.observers.forEach(function (observer, idx) {
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

  }, {
    key: "_notifyObservers",
    value: function _notifyObservers() {
      var _this = this;
      this.observers.forEach(function (observer) {
        return observer(_this.state);
      });
    }

    /* ==============
     * Helper Methods
     * ==============*/

    /** Get the width of the svg container */

  }, {
    key: "_getWidth",
    value: function _getWidth() {
      return this.svg.getBoundingClientRect().width;
    }

    /** Get the height of the svg container */

  }, {
    key: "_getHeight",
    value: function _getHeight() {
      return this.svg.getBoundingClientRect().height;
    }

    /** Calculte the stroke width for the background and active arcs */

  }, {
    key: "_calcArcStrokeWidth",
    value: function _calcArcStrokeWidth() {
      return this._calcDialRadius() / 5;
    }

    /** Calculate the dial radius */

  }, {
    key: "_calcDialRadius",
    value: function _calcDialRadius() {
      var radius = Math.min(this._getWidth(), this._getHeight()) / 2 * 0.89;
      radius = Math.trunc(radius);
      return radius;
    }

    /** Calculate the needle angle for a given state val */

  }, {
    key: "_calcNeedleAngle",
    value: function _calcNeedleAngle() {
      var _this = this;

      return (
        // protect against divide by 0:
        this.o.maxVal - _this.o.minVal !== 0 ? (_this.state.val - _this.o.minVal) / (_this.o.maxVal - _this.o.minVal) * (1.7 * Math.PI) + 1.15 * Math.PI : 0.5 * (1.7 * Math.PI) + 1.15 * Math.PI
      );
    }

    /** Calculate the center of the needle, return {x, y} */

  }, {
    key: "_calcNeedleCenter",
    value: function _calcNeedleCenter() {
      var _this = this;
      return {
        x: Math.trunc(_this._getWidth() / 2),
        y: Math.trunc(_this._getHeight() / 2)
      };
    }

    /** Calculate position of end of the needle, return {x, y} */

  }, {
    key: "_calcNeedleEnd",
    value: function _calcNeedleEnd() {
      var _this = this;
      return {
        x: _this._calcNeedleCenter().x + Math.sin(_this._calcNeedleAngle()) * _this._calcDialRadius(),
        y: _this._calcNeedleCenter().y - Math.cos(_this._calcNeedleAngle()) * _this._calcDialRadius()
      };
    }

    /** Calculate the needle width */

  }, {
    key: "_calcNeedleWidth",
    value: function _calcNeedleWidth() {
      return this._calcDialRadius() / 5;
    }

    /** Calculate the path for an svg arc based on cx, cy, r, startAngle, endAngle */

  }, {
    key: "_calcSvgArcPath",
    value: function _calcSvgArcPath(cx, cy, r, startAngle, endAngle) {
      var x1 = cx + r * Math.cos(startAngle);
      var y1 = cy + r * Math.sin(startAngle);
      var x2 = cx + r * Math.cos(endAngle);
      var y2 = cy + r * Math.sin(endAngle);
      var largeArc = endAngle - startAngle < Math.PI ? 0 : 1;
      var sweep = endAngle - startAngle < Math.PI ? 1 : 1;

      return ["M", x1, y1, "A", r, r, 0, largeArc, sweep, x2, y2].join(" ");
    }
  }]);

  return WidgetDial;
}(_widget2.default);

exports.default = WidgetDial;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _widgetDial = __webpack_require__(0);

var _widgetDial2 = _interopRequireDefault(_widgetDial);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dial = new _widgetDial2.default(document.getElementById("dial"));

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Abstract base class that represents an svg widget that can be placed inside a DOM container.
 * @param {DOM element} container - DOM element that will contain the widget.
 * @param {object} o - Options.
 */
var Widget = function () {
  function Widget(container, o) {
    _classCallCheck(this, Widget);

    this.SVG_NS = "http://www.w3.org/2000/svg";
    this.container = container;

    o = o || {};

    this.svg = document.createElementNS(this.SVG_NS, "svg");
    this.container.appendChild(this.svg);
    this.svg.setAttribute("width", this.container.getBoundingClientRect().width);
    this.svg.setAttribute("height", this.container.getBoundingClientRect().height);
    this.svg.setAttribute("borderWidth", 0);

    /* Manifest of containers and namespaces */
    this.o = {}; // options namespace
    this.svgEls = {}; // svg element namespace
    this.handlers = {}; // mouse and touch event handler namespace
    this.state = {}; // state namespace
    this.observers = []; // observer callback container

    this._initOptions(o);
    this._initState();
    this._initSvgEls();
    this._initHandlers();
  }

  /*========================================
   * Init and Update Methods
   * Each derived class must implement these
   *========================================*/

  /**
   * Initialize the options
   */


  _createClass(Widget, [{
    key: "_initOptions",
    value: function _initOptions(o) {
      this.o = {};
    }

    /**
     * Initialize state
     */

  }, {
    key: "_initState",
    value: function _initState() {
      this.state = {};
    }

    /**
     * Initialize the svg elements
     */

  }, {
    key: "_initSvgEls",
    value: function _initSvgEls() {
      this.svgEls = {};
    }

    /**
     * Initialize mouse and touch event handlers
     */

  }, {
    key: "_initHandlers",
    value: function _initHandlers() {
      this.handlers = {};
    }

    /**
     * Update (redraw) component based on state
     */

  }, {
    key: "_update",
    value: function _update() {}

    /*====================
     * Getters and Setters
     *====================*/

    /**
     * Get the options object
     * @return {object} this.o - Options
     */

  }, {
    key: "getOptions",
    value: function getOptions() {
      return this.o;
    }

    /**
     * Set the options
     * Uses a diffing function, so only specified keys that have new values will be changed
     * @param {object} o - options
     * @return {boolean} isChanged - Returns a boolean indicating whether any option has been changed
     */

  }, {
    key: "setOptions",
    value: function setOptions(o) {
      var _this = this;
      o = o || {};
      var isChanged = false;

      Object.keys(o).forEach(function (key) {
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

  }, {
    key: "getState",
    value: function getState() {
      return this.state;
    }

    /**
     * Set the current state and redraw. As opposed to _setState(), does not trigger observer notification.
     * Uses a diffing function, so only state that is different will lead to an update.
     * @param {object} newState - The new state.
     * @return {boolean} isChanged - Returns a boolean indicating whether the state has been changed
     */

  }, {
    key: "setState",
    value: function setState(newState) {
      var _this = this;
      newState = newState || {};
      var isChanged = false;

      Object.keys(newState).forEach(function (key) {
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

  }, {
    key: "_setState",
    value: function _setState(newState) {
      var _this = this;
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

  }, {
    key: "addObserver",
    value: function addObserver(newObserver) {
      var isChanged = false;

      if (!this.observers.find(function (observer) {
        return observer === newObserver;
      })) {
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

  }, {
    key: "removeObserver",
    value: function removeObserver(targetObserver) {
      var _this = this;
      var isChanged = false;

      this.observers.forEach(function (observer, idx) {
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

  }, {
    key: "_notifyObservers",
    value: function _notifyObservers() {
      var _this = this;
      this.observers.forEach(function (observer) {
        return observer(_this.state);
      });
    }

    /* ==============
     * Helper Methods
     * ==============*/

    /** Get the width of the svg container */

  }, {
    key: "_getWidth",
    value: function _getWidth() {
      return this.svg.getBoundingClientRect().width;
    }

    /** Get the height of the svg container */

  }, {
    key: "_getHeight",
    value: function _getHeight() {
      return this.svg.getBoundingClientRect().height;
    }
  }]);

  return Widget;
}();

exports.default = Widget;

/***/ })
/******/ ]);