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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * Constraint object represents constraints on a value.
 * Instances of Constraint are used as leaves on a ConstraintSpec definition.
 * A ConstraintSpec useses Constraints to apply a constraint to leaves of an
 * arbitrarily nested object, whose leaves represent values that may be constrained.
 */
var Constraint =

/**
 * @constructor
 * @param {object} [spec] - Spec specifying the constraints.
 * @param {number} [spec.min] - Minimum value.
 * @param {number} [spec.max] - Maximum value.
 * @param {array} [spec.enum] - Array of possible enumerable values.
 * @param {function} [spec.transform] - A transformation function to apply to the value.
 */
function Constraint(spec) {
  _classCallCheck(this, Constraint);

  spec = spec || {};

  this.min = spec.min;
  this.max = spec.max;
  this.enum = spec.enum;
  this.transform = spec.transform;
};

exports.default = Constraint;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constraint = __webpack_require__(0);

var _constraint2 = _interopRequireDefault(_constraint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ConstraintSpec is used to apply a constraining function to a state object of arbitrary nestedness,
 * whose leaves are values that need to be constrained (i.e. to min or max values).
 * In order for ConstraintSpec to work properly, it's constructor must be given an object that
 * exactly mirrors the nested structure of the object to be constrained, with the leaves
 * containing instances of the Constraint class. Additional requirements (i.e. how to deal with nested arrays)
 * are outlined below.
 * TODO: expand explanation
 *
 * @class
 */
var ConstraintSpec = function () {

  /**
   * @constructor
   * @param {object} specDefObj - The constraint spec definition object, which defines the nesting
   *                              structure of the objects that need to be constrained. The leaves
   *                              of this specDef object must be objects of type Constraint, which
   *                              act as the constraint definitions for each leaf.
   */
  function ConstraintSpec(specDefObj) {
    _classCallCheck(this, ConstraintSpec);

    this.constraintMap = [[]];
    this._parseMap(specDefObj, this.constraintMap[0], this.constraintMap);
  }

  /**
   * Check a constraint map for constraint specs and apply them to obj.
   * Note: will not mutate the original object. New value is returned.
   * @public
   * @param {object} targetObj - The state object to check
   * @return {number | string | object | array} val - The constrained value.
   */


  _createClass(ConstraintSpec, [{
    key: "constrain",
    value: function constrain(targetObj) {
      var _this = this;
      _this.constraintMap.forEach(function (keyBranch) {
        _this._constrainBranch(targetObj, keyBranch);
      });
    }

    /**
     * Apply a constraint.
     * @private
     * @param {object} target - The target object to constrain
     * @param {Constraint} constraint - The constraint object to use.
     * @param {symbol} key - The key to use to access the constraint.
     * @return {number | string | object | array} val - The constrained value.
     */

  }, {
    key: "_applyConstraint",
    value: function _applyConstraint(target, constraint, key) {
      if (constraint.min !== undefined) {
        target[key] = Math.max(target[key], constraint.min);
      }
      if (constraint.max !== undefined) {
        target[key] = Math.min(target[key], constraint.max);
      }
      if (constraint.enum !== undefined && constraint.enum instanceof Array) {
        target[key] = constraint.enum.find(target[key]) !== undefined ? target[key] : constraint.enum[0];
      }
      if (constraint.transform !== undefined && typeof constraint.transform === "function") {
        target[key] = constraint.transform(target[key]);
      }

      return target;
    }

    /**
     * Parse a constraint map
     * @private
     * @param {object} c - The map object currently being examined.
     *                     At the top level, this would be the whole map.
     *                     At the terminal level, this would be an instance of Constraint object.
     * @param {array} keyBranch - An array of keys that will specify how to get to each Constraint.
     *                            The last element in this array will be the constraint itself.
     * @param {array} cMap - An mutable array of key branches.
     */

  }, {
    key: "_parseMap",
    value: function _parseMap(c, keyBranch, cMap) {
      var _this = this;

      if (c instanceof Array) {
        /* if c is an array, add "_arr_" to the current map, and examine the first element.
         * all elements in an array are required to have identical structure, so examining
         * the first one is enough.
         */
        keyBranch.push("_arr_");
        _this._parseMap(c[0], keyBranch, cMap);
      } else if (c instanceof Object && !(c instanceof _constraint2.default)) {
        // keep a copy of the parent branch to create new branches from
        var parentBranch = keyBranch.map(function (x) {
          return x;
        });

        // create new branch for each key after the first key using the parentBranch clone
        Object.keys(c).forEach(function (key, keyIdx) {
          if (keyIdx === 0) {
            keyBranch.push(key);
            _this._parseMap(c[key], keyBranch, cMap);
          } else {
            var newKeyBranch = parentBranch.map(function (x) {
              return x;
            });
            cMap.push(newKeyBranch);
            newKeyBranch.push(key);
            _this._parseMap(c[key], newKeyBranch, cMap);
          }
        });
      } else if (c instanceof _constraint2.default) {

        // this will be the last element in the branch - the Constraint object itself
        keyBranch.push(c);
      }
    }

    /**
     * Apply constraints to one branch of the constraint map.
     * @private
     * @param {object} targetObj - The state object to apply the constraint to
     * @param {object} defObj - The constraint definition object to use.
     * @param {array} keyBranch - An array of keys representing a path to a constraint object.
     */

  }, {
    key: "_constrainBranch",
    value: function _constrainBranch(targetObj, keyBranch) {
      var _this = this;

      var curKey = void 0;
      var constraint = keyBranch[keyBranch.length - 1];
      var arrFlag = false;

      /* Drill into targetObj and defObj following keyBranch keys
       * We go to length - 2, because the next-to-last element might be an
       * array, and the last element is the Constraint object itself.
       */
      for (var i = 0; i < keyBranch.length - 2 && !arrFlag; ++i) {
        curKey = keyBranch[i];

        // if we encounter an array, drill into each corresponding arry element in targetObj
        if (curKey === "_arr_") {
          arrFlag = true;

          var keyBranchSlice = keyBranch.slice(i + 1, keyBranch.length);

          for (var j = 0; j < targetObj.length; ++j) {
            _this._constrainBranch(targetObj[j], keyBranchSlice);
          }
        } else {
          targetObj = targetObj[curKey];
        }
      }

      // if arrFlag is set, we've encountered an array somewhere other than on the leaves
      // in this case we don't need to operate on it
      if (!arrFlag) {
        // Apply the constraints
        curKey = keyBranch[keyBranch.length - 2];

        if (curKey === "_arr_") {
          for (var _i = 0; _i < targetObj.length; ++_i) {
            _this._applyConstraint(targetObj, constraint, _i);
          }
        } else {
          _this._applyConstraint(targetObj, constraint, curKey);
        }
      }
    }
  }]);

  return ConstraintSpec;
}();

exports.default = ConstraintSpec;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _widgetMixinSvgns = __webpack_require__(5);

var _widgetMixinSvgns2 = _interopRequireDefault(_widgetMixinSvgns);

var _widgetMixinState = __webpack_require__(6);

var _widgetMixinState2 = _interopRequireDefault(_widgetMixinState);

var _widgetMixinOptions = __webpack_require__(7);

var _widgetMixinOptions2 = _interopRequireDefault(_widgetMixinOptions);

var _widgetMixinObserver = __webpack_require__(8);

var _widgetMixinObserver2 = _interopRequireDefault(_widgetMixinObserver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Abstract base class representing an SVG widget that can be placed inside a DOM container.
 * Classes implementing this abstract class must implement the following:
 *  1) _initOptions(o)
 *  2) _initStateConstraints()
 *  3) _initState()
 *  4) _initSvgEls()
 *  5) _initHandlers()
 *  6) getVal()
 *  7) _update()
 *
 * @class
 * @abstract
 */
var Widget = function () {

  /**
   * @constructor
   * @mixes WidgetSvgNsMixin
   * @mixes WidgetStateMixin
   * @mixes WidgetOptionsMixin
   * @mixes WidgetObserverMixin
   * @param {DOM element} container - DOM element that will contain the widget.
   * @param {object=} o - Options.
   */
  function Widget(container, o) {
    _classCallCheck(this, Widget);

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
    this.o = {}; // options namespace
    this.svgEls = {}; // svg element namespace
    this.handlers = {}; // mouse and touch event handler namespace
    this.state = {}; // state namespace
    this.stateConstraints = {}; // state constraints namespace
    this.observers = []; // observer callback container

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


  _createClass(Widget, [{
    key: "_initOptions",
    value: function _initOptions(o) {
      throw new Error("Abstract method _initOptions(o) must be implemented by subclass");
    }

    /**
     * Initialize state constraints
     * @abstract
     * @protected
     */

  }, {
    key: "_initStateConstraints",
    value: function _initStateConstraints() {
      throw new Error("Abstract method _initState() must be implemented by subclass");
    }

    /**
     * Initialize state
     * @abstract
     * @protected
     */

  }, {
    key: "_initState",
    value: function _initState() {
      throw new Error("Abstract method _initState() must be implemented by subclass");
    }

    /**
     * Initialize the svg elements.
     * Each implementation of this method must end with calls to _appendSvgEls() and _update(),
     * in that order, as shown in this template
     * @abstract
     * @protected
     */

  }, {
    key: "_initSvgEls",
    value: function _initSvgEls() {
      throw new Error("Abstract method _initSvgEls() must be implemented by subclass");

      this._appendSvgEls();
      this._update();
    }

    /**
     * Append the newly created svg elements to the svg container.
     * This method should be called exctly once by each implementation of the _initSvgEls() method.
     * @protected
     */

  }, {
    key: "_appendSvgEls",
    value: function _appendSvgEls() {
      var _this = this;

      Object.values(_this.svgEls).forEach(function (svgEl) {
        appendSvgEls(svgEl);
      });

      function appendSvgEls(child) {
        if (child instanceof Array) {
          child.forEach(function (arrEl) {
            return appendSvgEls(arrEl);
          });
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

  }, {
    key: "_initHandlers",
    value: function _initHandlers() {
      throw new Error("Abstract method _initHandlers() must be implemented by subclass");
    }

    /**
     * Update (redraw) component based on state
     * @abstract
     * @protected
     */

  }, {
    key: "_update",
    value: function _update() {
      throw new Error("Abstract method _update() must be implemented by subclass");
    }

    /* ===========================================================================
    *  PUBLIC API
    */

    /**
     * Get public representation of the state.
     * @abstract
     * @public
     */

  }, {
    key: "getVal",
    value: function getVal() {
      throw new Error("Abstract method must be implemented");
    }

    /**
     * Set the current state in a format specific to each widget.
     * Same as setVal(), but will not cause an observer callback trigger.
     * @abstract 
     * @public
     */

  }, {
    key: "setInternalVal",
    value: function setInternalVal(newVal) {
      throw new Error("Abstract method must be implemented");
    }

    /**
     * Set the current state in a format specific to each widget.
     * Same as setInternalVal(), but will cause an observer callback trigger.
     * @abstract @public
     */

  }, {
    key: "setVal",
    value: function setVal(newVal) {
      throw new Error("Abstract method must be implemented");
    }

    /**
     * Get the current state.
     * @abstract
     * @public
     * @returns {object} - Copy of this.state
     */

  }, {
    key: "getState",
    value: function getState() {
      throw new Error("Abstract method must be implemented");
    }

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

  }, {
    key: "setInternalState",
    value: function setInternalState(newState) {
      throw new Error("Abstract method must be implemented");
    }

    /**
     * Sets the current state and redraws.
     * @description As opposed to setInternalState(), setState() will call the observer callback functions,
     * so may lead to an infinate loop if an observer calls this method.
     * @abstract
     * @public
     * @param {object} [newState] - The new state.
     * @returns {boolean} A flag indicating whether the state has been changed.
     */

  }, {
    key: "setState",
    value: function setState(newState) {
      throw new Error("Abstract method must be implemented");
    }

    /* ===========================================================================
    *  HELPER METHODS
    */

    /** Helper method: get x relative to the container */

  }, {
    key: "_getRelativeX",
    value: function _getRelativeX(x) {
      return x - this._getLeft();
    }

    /** Helper method: get y relative to the container */

  }, {
    key: "_getRelativeX",
    value: function _getRelativeX(y) {
      return y - this._getTop();
    }

    /** Helper method: get the width of the svg container */

  }, {
    key: "_getWidth",
    value: function _getWidth() {
      return this.svg.getBoundingClientRect().width;
    }

    /** Helper method: get the height of the svg container */

  }, {
    key: "_getHeight",
    value: function _getHeight() {
      return this.svg.getBoundingClientRect().height;
    }

    /** Helper method: get the top edge position of the svg container */

  }, {
    key: "_getTop",
    value: function _getTop() {
      return this.svg.getBoundingClientRect().top;
    }

    /** Helper method: get the left edge position of the svg container */

  }, {
    key: "_getLeft",
    value: function _getLeft() {
      return this.svg.getBoundingClientRect().left;
    }
  }]);

  return Widget;
}();

Object.assign(Widget.prototype, _widgetMixinSvgns2.default);
Object.assign(Widget.prototype, _widgetMixinState2.default);
Object.assign(Widget.prototype, _widgetMixinOptions2.default);
Object.assign(Widget.prototype, _widgetMixinObserver2.default);

exports.default = Widget;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _dial = __webpack_require__(4);

var _dial2 = _interopRequireDefault(_dial);

var _graph = __webpack_require__(9);

var _graph2 = _interopRequireDefault(_graph);

var _keyboard = __webpack_require__(11);

var _keyboard2 = _interopRequireDefault(_keyboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Dial */
var dialContainer = document.getElementById("dial");
var dialDisplay = dialContainer.nextElementSibling;
var dial = new _dial2.default(dialContainer);
dial.addObserver(function (state) {
  dialDisplay.innerHTML = state;
});
dial.setVal(300);

/** Envelope Graph */
var envelopeGraphContainer = document.getElementById("envelope-graph");
var envelopeGraphDisplay = document.getElementById("envelope-graph-display");

var envelopeGraph = new _graph2.default(envelopeGraphContainer);

envelopeGraph.addObserver(function (state) {
  envelopeGraphDisplay.innerHTML = state.map(function (xyPair) {
    return "[" + xyPair[0] + ", " + xyPair[1] + "]";
  });
});
envelopeGraph.setVal([[0.0, 100], [2.3, 81.2], [5.3, 65.9], [7.3, 48.5], [8.7, 40.1], [12.7, 36.0], [15.3, 40.5], [16.7, 46.5], [20.0, 51.9], [22.3, 49.9], [23.7, 48.5], [25.0, 42.5], [26.0, 37.9], [27.7, 25.9], [28.0, 24.5], [30.7, 20.5], [32.7, 30.0], [33.7, 43.2], [34.3, 50.5], [36.3, 55.9], [39.0, 64.5], [41.7, 67.9], [45.3, 69.2], [48.3, 63.9], [50.7, 51.9], [52.0, 38.5], [53.3, 27.2], [57.0, 17.2], [61.3, 15.9], [65.7, 17.9], [69.3, 25.9], [73.0, 33.9], [74.7, 39.9], [76.3, 46.5], [78.7, 47.9], [81.0, 43.9], [82.0, 37.9], [83.0, 30.5], [84.0, 23.9], [86.0, 17.9], [88.7, 13.9], [91.0, 19.2], [92.0, 28.5], [92.7, 36.5], [93.0, 44.5], [93.0, 56.5], [95.0, 69.2], [97.3, 81.9], [100.0, 100]]);

/** Keyboard */
var keyboardContainer = document.getElementById("keyboard");
var keyboardDisplay = document.getElementById("keyboard-display");
keyboardContainer.style.backgroundColor = "red";
var keyboard = new _keyboard2.default(keyboardContainer, {
  bottomNote: 36,
  topNote: 83
});
keyboard.setVal({ pitch: 38, vel: 20 });

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _widget = __webpack_require__(2);

var _widget2 = _interopRequireDefault(_widget);

var _constraint = __webpack_require__(0);

var _constraint2 = _interopRequireDefault(_constraint);

var _constraintDef = __webpack_require__(1);

var _constraintDef2 = _interopRequireDefault(_constraintDef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representing an SVG Dial widget
 *
 * @class
 * @implements {Widget}
 */
var Dial = function (_Widget) {
  _inherits(Dial, _Widget);

  /**
   * @constructor
   * @param {object} container - DOM container for the widget.
   * @param {object=} o - options.
   * @param {number=0} o.minVal - Minimum value constraint.
   * @param {number=127} o.maxVal - Maximum value constraint.
   * @param {string="#000"} o.needleColor - Dial needle color.
   * @param {string="#f40"} o.activeColor - Dial active color.
   */
  function Dial(container, o) {
    _classCallCheck(this, Dial);

    return _possibleConstructorReturn(this, (Dial.__proto__ || Object.getPrototypeOf(Dial)).call(this, container, o));
  }

  /**
   * Initialize the options
   * @override
   * @protected
   */


  _createClass(Dial, [{
    key: "_initOptions",
    value: function _initOptions(o) {
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
     * Initialize state constraints
     * @override
     * @protected
     */

  }, {
    key: "_initStateConstraints",
    value: function _initStateConstraints() {
      var _this = this;

      this.stateConstraints = new _constraintDef2.default({
        val: new _constraint2.default({
          min: _this.o.minVal,
          max: _this.o.maxVal,
          transform: function transform(num) {
            return ~~num;
          }
        })
      });
    }

    /**
     * Initialize state
     * @override
     * @protected
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
     * @protected
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

      // draw the background arc
      this.svgEls.bgArc.setAttribute("d", _this._calcSvgArcPath(_this._calcNeedleCenter().x, _this._calcNeedleCenter().y, _this._calcDialRadius(), 0.67 * Math.PI, 2.35 * Math.PI));
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
     * Initialize mouse and touch event handlers
     * @override
     * @protected
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
          ev.preventDefault();

          yD = y0 - ev.clientY;
          y0 = ev.clientY;

          newVal = _this.state.val + yD * _this.o.mouseSensitivity;
          newVal = Math.max(newVal, _this.o.minVal);
          newVal = Math.min(newVal, _this.o.maxVal);

          _this.setState({
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
     * @protected
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

    /**
     * Get the dial value
     * @public
     * @override
     */

  }, {
    key: "getVal",
    value: function getVal() {
      return this.state.val;
    }

    /**
     * Set dial value.
     * Same as setVal(), but will not trigger observer callbacks.
     * @param {number} newVal - The new value.
     */

  }, {
    key: "setInternalVal",
    value: function setInternalVal(newVal) {
      this.setInternalState({ val: newVal });
    }

    /**
     * Set dial value.
     * Same as setInternalVal(), but will trigger observer callbacks.
     * @param {number} newVal - The new value.
     */

  }, {
    key: "setVal",
    value: function setVal(newVal) {
      this.setState({ val: newVal });
    }

    /* ==============
     * Helper Methods
     * ==============
     */

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

  return Dial;
}(_widget2.default);

exports.default = Dial;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Mixin specifying the xml namespace for SVG
 * @mixin
 */
var SVG_NS = { SVG_NS: "http://www.w3.org/2000/svg" };

exports.default = SVG_NS;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constraint = __webpack_require__(0);

var _constraint2 = _interopRequireDefault(_constraint);

var _constraintDef = __webpack_require__(1);

var _constraintDef2 = _interopRequireDefault(_constraintDef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Mixin for methods related to state management
 * @mixin
 */
var WidgetStateMixin = {

  /**
   * Get the current state.
   *
   * @public
   * @returns {object} - Copy of this.state
   */
  getState: function getState() {
    return Object.assign({}, this.state);
  },

  /**
   * Set the current state and redraw.
   *
   * @description If no new state argument is provided, will reassign old state, taking into account the stateConstraints.
   * As opposed to setState(), setInternalState() does not trigger observer notification.
   * Will use Widget.stateConstraints to constrain each state value to each constraints min, max, or enum
   *
   * @protected
   * @param {object=} newState - The new state.
   * @return {boolean} isChanged - Returns a boolean indicating whether the state has been changed
   */
  setInternalState: function setInternalState(newState) {
    var _this = this;
    var isChanged = false;

    newState = newState || this.getState();

    Object.keys(newState).forEach(function (key) {
      if (_this.state.hasOwnProperty(key) && _this.state[key] !== newState[key]) {
        _this.state[key] = newState[key];
        isChanged = true;
      }
    });

    _this.stateConstraints.constrain(_this.state);
    this._update();

    return isChanged;
  },

  /**
   * Set the current state and redraw.
   *
   * @description As opposed to setInternalState(), setState() will call the observer callback functions,
   * so may lead to an infinate loop if an observer calls this method.
   *
   * @protected
   * @param {object=} newState - The new state.
   * @return {boolean} isChanged - Returns a boolean indicating whether the state has been changed
   */
  setState: function setState(newState) {
    var _this = this;
    var isChanged = false;

    isChanged = this.setInternalState(newState);

    this._notifyObservers();

    return isChanged;
  }
};

exports.default = WidgetStateMixin;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Mixin for methods related to options
 * @mixin
 */
var WidgetOptionsMixin = {

  /**
   * Initializes the options.
   * @private
   * @param {object} o - Options.
   */
  _initOptions: function _initOptions(o) {
    var _this = this;
    o = o || {};

    Object.keys(o).forEach(function (key) {
      if (_this.o.hasOwnProperty(key) && _this.o[key] !== o[key]) {
        _this.o[key] = o[key];
      }
    });
  },

  /**
   * Get the options object
   * @public
   * @return {object} this.o - Options
   */
  getOptions: function getOptions() {
    return Object.assign({}, this.o);
  },

  /**
   * Set the options
   * Uses a diffing function, so only specified keys that have new values will be changed
   * @public
   * @param {object} o - options
   * @return {boolean} isChanged - Returns a boolean indicating whether any option has been changed
   */
  setOptions: function setOptions(o) {
    var _this = this;
    o = o || {};
    var isChanged = false;

    Object.keys(o).forEach(function (key) {
      if (_this.o.hasOwnProperty(key) && _this.o[key] !== o[key]) {
        _this.o[key] = o[key];
        isChanged = true;
      }
    });

    if (isChanged) {
      this.setState();
    }

    return isChanged;
  }
};

exports.default = WidgetOptionsMixin;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Mixin for methods related to observer callback support
 * @mixin
 */
var WidgetObserverMixin = {

  /**
   * Register a new observer function that will recieve the state value every time the state is updated.
   * @public
   * @param {function} newObserver - The new observer function to be notified every time the state changes.
   * @return {boolean} isChanged - Indicates whether an observer was added.
   */
  addObserver: function addObserver(newObserver) {
    var isChanged = false;

    if (!this.observers.find(function (observer) {
      return observer === newObserver;
    })) {
      this.observers.push(newObserver);
      isChanged = true;
    }

    return isChanged;
  },

  /**
   * Remove an observer function from being notified when the state changes.
   * @public
   * @param {function} targetObserver - The observer function to be removed.
   * @return {boolean} isChanged - Indicates whether an observer has been removed
   */
  removeObserver: function removeObserver(targetObserver) {
    var _this = this;
    var isChanged = false;

    this.observers.forEach(function (observer, idx) {
      if (observer === targetObserver) {
        _this.observers.splice(idx, 1);
        isChanged = true;
      }
    });

    return isChanged;
  },

  /**
   * Notify all observers of new state
   * @protected
   */
  _notifyObservers: function _notifyObservers() {
    var _this = this;
    this.observers.forEach(function (observer) {
      return observer(_this.getVal());
    });
  }
};

exports.default = WidgetObserverMixin;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _widget = __webpack_require__(2);

var _widget2 = _interopRequireDefault(_widget);

var _constraint = __webpack_require__(0);

var _constraint2 = _interopRequireDefault(_constraint);

var _constraintDef = __webpack_require__(1);

var _constraintDef2 = _interopRequireDefault(_constraintDef);

var _utilMath = __webpack_require__(10);

var _utilMath2 = _interopRequireDefault(_utilMath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representing a Graph widget.
 *
 * @class 
 * @implements Widget
 * @augments Widget
 */
var Graph = function (_Widget) {
  _inherits(Graph, _Widget);

  /**
   * @constructor
   * @param {object} container - DOM container for the widget.
   * @param {object} [o] - Options.
   * @param {number} [o.minXVal=0] - Minimum X value.
   * @param {number} [o.minYVal=0] - Minimum Y value.
   * @param {number} [o.maxXVal=100] - Maximum X value.
   * @param {number} [o.maxYVal=100] - Maximum Y value.
   * @param {number} [o.maxNumVertices=-1] - Maximum number of vertices.
   * @param {number} [o.quantizeX=0.1] - X-quantization ("grid") value.
   * @param {number} [o.quantizeY=0.1] - Y-quantization ("grid") value.
   * @param {number} [o.xDecimalPrecision=1] - Number of decimal places for output of the X values.
   * @param {number} [o.yDecimalPrecision=1] - Number of decimal places for output of the Y values.
   * @param {boolean} [o.hasFixedStartPoint=false] - Is there a fixed start vertex?
   * @param {boolean} [o.hasFixedEndPoint=false] - Is there a fixed end vertex?
   * @param {number} [o.fixedStartPointY=0] - Y value of the fixed start vertex, if exists.
   * @param {number} [o.fixedEndPointY=0] - Y value of the fixed end vertex, if exists.
   * @param {boolean} [o.isEditable=true] - Is the graph editable?
   * @param {string} [o.vertexColor="#f40"] - Color of vertex points.
   * @param {string} [o.lineColor="#484848"] - Color of lines connecting the vertices.
   * @param {string} [o.backgroundColor="#fff"] - Background color.
   * @param {number} [o.lineWidth=2] - Width of the connecting lines.
   * @param {number} [o.vertexRadius=4] - Radius of the vertex points.
   * @param {number} [o.mouseSensitivity=1.2] - Mouse sensitivity (how much moving the mouse affects the interaction).
   */
  function Graph(container, o) {
    _classCallCheck(this, Graph);

    return _possibleConstructorReturn(this, (Graph.__proto__ || Object.getPrototypeOf(Graph)).call(this, container, o));
  }

  /* ===========================================================================
  *  INITIALIZATION METHODS
  */

  /**
   * Initialize the options.
   * @override
   * @private
   */


  _createClass(Graph, [{
    key: "_initOptions",
    value: function _initOptions(o) {
      // set defaults
      this.o = {
        minXVal: 0,
        minYVal: 0,
        maxXVal: 100,
        maxYVal: 100,
        maxNumVertices: -1,
        quantizeX: 0.1,
        quantizeY: 0.1,
        xDecimalPrecision: 1,
        yDecimalPrecision: 1,
        hasFixedStartPoint: false,
        hasFixedEndPoint: false,
        fixedStartPointY: 0,
        fixedEndPointY: 0,
        isEditable: true,
        vertexColor: "#f40",
        lineColor: "#484848",
        backgroundColor: "#fff",
        vertexRadius: 4,
        lineWidth: 2,
        mouseSensitivity: 1.2
      };

      // override defaults with provided options
      _get(Graph.prototype.__proto__ || Object.getPrototypeOf(Graph.prototype), "_initOptions", this).call(this, o);
    }

    /**
     * Initialize state constraints
     * @override
     * @private
     */

  }, {
    key: "_initStateConstraints",
    value: function _initStateConstraints() {
      var _this = this;

      this.stateConstraints = new _constraintDef2.default({
        vertices: [{
          x: new _constraint2.default({
            min: _this.o.minXVal,
            max: _this.o.maxXVal,
            transform: function transform(num) {
              return _utilMath2.default.quantize(num, _this.o.quantizeX).toFixed(_this.o.xDecimalPrecision);
            }
          }),
          y: new _constraint2.default({
            min: _this.o.minYVal,
            max: _this.o.maxYVal,
            transform: function transform(num) {
              return _utilMath2.default.quantize(num, _this.o.quantizeY).toFixed(_this.o.yDecimalPrecision);
            }
          })
        }]
      });
    }

    /**
     * Initialize state
     * @override
     * @private
     */

  }, {
    key: "_initState",
    value: function _initState() {
      this.state = {
        // verices contains an array of vertices
        // each vertex is an object of form {x, y}
        vertices: []
      };

      // Flags for whether fixed start and end points have been
      // added to the state vertex array.
      // These are used in the _update() method - if the flags
      // are not set, and o.hasFixedStartPoint or o.hasFixedEndPoint
      // are set, verticies representing the fixed points are to be added.
      // If the flags are set, while o.hasFixedStartPoint or o.hasFixedEndPoint
      // is not set, then vertices representing the fixed points are to be removed.
      this.isFixedStartPointInitialized = false;
      this.isFixedEndPointInitialized = false;
    }

    /**
     * Initialize the svg elements
     * @override
     * @private
     */

  }, {
    key: "_initSvgEls",
    value: function _initSvgEls() {
      var _this = this;

      this.svgEls = {
        panel: document.createElementNS(this.SVG_NS, "rect"),
        vertices: [],
        lines: []
      };

      this.svgEls.panel.setAttribute("width", this._getWidth());
      this.svgEls.panel.setAttribute("height", this._getHeight());
      this.svgEls.panel.setAttribute("fill", this.o.backgroundColor);
      this.svgEls.panel.setAttribute("stroke", this.o.lineColor);

      this._appendSvgEls();
      this._update();
    }

    /**
     * Initialize mouse and touch event handlers
     * @override
     * @private
     */

  }, {
    key: "_initHandlers",
    value: function _initHandlers() {
      var _this = this;

      var targetVtx = null;
      var targetLine = null;
      var vtxPos0 = {}; // original poisition of two vertices affected by a line move
      var x0 = 0;
      var y0 = 0;
      var x1 = 0;
      var y1 = 0;
      var dx = 0;
      var dy = 0;

      this.handlers = {

        touchPanel: function touchPanel(ev) {
          ev.preventDefault();

          var xPos = ev.clientX - _this._getLeft();
          var yPos = ev.clientY - _this._getTop();
          var vertexState = _this._calcVertexState({ x: xPos, y: yPos });

          _this.addVertex(vertexState);
        },

        touchVertex: function touchVertex(ev) {
          ev.preventDefault();

          targetVtx = ev.target;

          document.addEventListener("mousemove", _this.handlers.moveVertex);
          document.addEventListener("touchmove", _this.handlers.moveVertex);
          ev.target.addEventListener("mouseup", _this.handlers.deleteVertex);
          ev.target.addEventListener("touchend", _this.handlers.deleteVertex);
        },

        touchLine: function touchLine(ev) {
          ev.preventDefault();

          targetLine = ev.target;

          x0 = ev.clientX - _this._getLeft();
          y0 = ev.clientY - _this._getTop();
          vtxPos0 = null;

          document.addEventListener("mousemove", _this.handlers.moveLine);
          document.addEventListener("touchmove", _this.handlers.moveLine);
        },

        moveLine: function moveLine(ev) {
          ev.preventDefault();

          document.addEventListener("mouseup", _this.handlers.endMoveLine);
          document.addEventListener("touchend", _this.handlers.endMoveLine);

          x1 = ev.clientX - _this._getLeft();
          y1 = ev.clientY - _this._getTop();

          // delta position (change in position)
          var dPos = {
            x: x1 - x0,
            y: y1 - y0
          };

          vtxPos0 = _this._moveLine(targetLine, dPos, vtxPos0);
        },

        endMoveLine: function endMoveLine(ev) {
          ev.preventDefault();

          vtxPos0 = null;

          document.removeEventListener("mousemove", _this.handlers.moveLine);
          document.removeEventListener("touchmove", _this.handlers.moveLine);
        },

        deleteVertex: function deleteVertex(ev) {
          ev.preventDefault();

          document.removeEventListener("mousemove", _this.handlers.moveVertex);
          document.removeEventListener("touchmove", _this.handlers.moveVertex);

          _this._deleteVertex(ev.target);

          ev.target.removeEventListener("mouseup", _this.handlers.deleteVertex);
          ev.target.removeEventListener("touchend", _this.handlers.deleteVertex);
        },

        moveVertex: function moveVertex(ev) {
          ev.preventDefault();

          targetVtx.removeEventListener("mouseup", _this.handlers.deleteVertex);
          targetVtx.removeEventListener("touchend", _this.handlers.deleteVertex);

          document.addEventListener("mouseup", _this.handlers.endMoveVertex);
          document.addEventListener("touchend", _this.handlers.endMoveVertex);

          var xPos = ev.clientX - _this._getLeft();
          var yPos = ev.clientY - _this._getTop();

          _this._moveVertex(targetVtx, { x: xPos, y: yPos });
        },

        endMoveVertex: function endMoveVertex(ev) {
          ev.preventDefault();

          document.removeEventListener("mousemove", _this.handlers.moveVertex);
          document.removeEventListener("touchmove", _this.handlers.moveVertex);
        }
      };

      this.svgEls.panel.addEventListener("mousedown", _this.handlers.touchPanel);
      this.svgEls.panel.addEventListener("touchdown", _this.handlers.touchPanel);

      this.svgEls.vertices.forEach(function (vtx) {
        vtx.addEventListener("mousedown", _this.handlers.touchVertex);
        vtx.addEventListener("touchdown", _this.handlers.touchVertex);
      });

      this.svgEls.lines.forEach(function (line) {
        line.addEventListener("mousedown", _this.handlers.touchLine);
        line.addEventListener("touchdown", _this.handlers.touchLine);
      });
    }

    /**
     * Update (redraw) component based on state
     * @override
     * @private
     */

  }, {
    key: "_update",
    value: function _update() {
      var _this = this;

      // add fixed start vertex if the option is set, but has not been initialized
      if (this.o.hasFixedStartPoint && !this.isFixedStartPointInitialized) {
        this.state.vertices.push({ x: _this.o.minXVal, y: _this.o.fixedStartPointY });
        this.isFixedStartPointInitialized = true;
      }

      // add fixed end vertex if the option is set, but has not been initialized
      if (this.o.hasFixedEndPoint && !this.isFixedEndPointInitialized) {
        this.state.vertices.push({ x: _this.o.maxXVal, y: _this.o.fixedEndPointY });
        this.isFixedEndPointInitialized = true;
      }

      // sort svg vertexes using a sort map
      var idxSortMap = _this.state.vertices.map(function (vtx, idx) {
        return { vtx: vtx, idx: idx };
      });
      idxSortMap.sort(function (a, b) {
        return a.vtx.x - b.vtx.x;
      });
      _this.state.vertices = idxSortMap.map(function (el) {
        return _this.state.vertices[el.idx];
      });

      // update fixed start vertex to the correct y value
      if (this.o.hasFixedStartPoint && this.isFixedStartPointInitialized) {
        _this.state.vertices[0].y = _this.o.fixedStartPointY;
      }

      // update fixed end vertex to the correct y value
      if (this.o.hasFixedEndPoint && this.isFixedEndPointInitialized) {
        _this.state.vertices[_this.state.vertices.length - 1].y = _this.o.fixedEndPointY;
      }

      // remove fixed start vertex if had been initialized, but the option is unset
      if (!this.o.hasFixedStartPoint && this.isFixedStartPointInitialized) {
        this.state.vertices.splice(0, 1);
        idxSortMap.splice(0, 1);
        idxSortMap.forEach(function (el) {
          return el.idx--;
        });
        this.isFixedStartPointInitialized = false;
      }

      // remove fixed end vertex if has been initialized, but the option is unset
      if (!this.o.hasFixedEndPoint && this.isFixedEndPointInitialized) {
        this.state.vertices.pop();
        idxSortMap.pop();
        this.isFixedEndPointInitialized = false;
      }

      // if there are more state vertices than svg vertices, add a corresponding number of svg vertices and lines
      for (var i = _this.svgEls.vertices.length; i < _this.state.vertices.length; ++i) {
        _this._addSvgVertex();
      }

      // if there are more svg vertices than state vertices, remove a corresponding number of svg vertices and lines
      for (var _i = _this.svgEls.vertices.length; _i > _this.state.vertices.length; --_i) {
        _this._removeSvgVertex();
      }

      // sort the svg vertices according to the vertex sort map
      _this.svgEls.vertices = idxSortMap.map(function (el) {
        return _this.svgEls.vertices[el.idx];
      });

      // set the correct position coordinates for every vertex
      _this.state.vertices.forEach(function (stateVtx, idx) {
        var svgVtx = _this.svgEls.vertices[idx];
        var pos = _this._calcVertexPos(stateVtx);

        svgVtx.setAttribute("cx", pos.x);
        svgVtx.setAttribute("cy", pos.y);
        svgVtx.setAttribute("r", _this.o.vertexRadius);
        svgVtx.setAttribute("fill", _this.o.vertexColor);

        // for every vertex other than the first, draw a line to the previous vertex
        if (idx > 0) {
          var prevVtx = _this.state.vertices[idx - 1];
          var prevPos = _this._calcVertexPos(prevVtx);
          var line = _this.svgEls.lines[idx - 1];

          line.setAttribute("d", "M " + pos.x + " " + pos.y + " L " + prevPos.x + " " + prevPos.y);
          line.setAttribute("fill", "transparent");
          line.setAttribute("stroke-width", _this.o.lineWidth);
          line.setAttribute("stroke", _this.o.lineColor);
        }
      });

      // remove and reappend all svg elements so that vertices are on top of lines
      _this.svgEls.lines.forEach(function (svgLine) {
        _this.svg.removeChild(svgLine);
        _this.svg.appendChild(svgLine);
      });

      _this.svgEls.vertices.forEach(function (svgVtx) {
        _this.svg.removeChild(svgVtx);
        _this.svg.appendChild(svgVtx);
      });

      // reassign listeners
      _this.svgEls.vertices.forEach(function (vtx) {
        vtx.addEventListener("mousedown", _this.handlers.touchVertex);
        vtx.addEventListener("touchdown", _this.handlers.touchVertex);
      });

      _this.svgEls.lines.forEach(function (line) {
        line.addEventListener("mousedown", _this.handlers.touchLine);
        line.addEventListener("touchdown", _this.handlers.touchLine);
      });
    }

    /* ===========================================================================
    *  PUBLIC API
    */

    /**
     * Set the options
     * @override
     * @public
     */

  }, {
    key: "setOptions",
    value: function setOptions(o) {
      o = o || {};

      if (o.fixedStartPointY !== undefined) {
        o.fixedStartPointY = Math.min(o.fixedStartPointY, this.o.maxYVal);
        o.fixedStartPointY = Math.max(o.fixedStartPointY, this.o.minYVal);
      }

      if (o.fixedEndPointY !== undefined) {
        o.fixedEndPointY = Math.min(o.fixedEndPointY, this.o.maxYVal);
        o.fixedEndPointY = Math.max(o.fixedEndPointY, this.o.minYVal);
      }

      _get(Graph.prototype.__proto__ || Object.getPrototypeOf(Graph.prototype), "setOptions", this).call(this, o);
    }

    /**
    * Return the state as an array of [x, y] pairs
    * @override
    */

  }, {
    key: "getVal",
    value: function getVal() {
      return this.state.vertices.map(function (vtx) {
        return [vtx.x, vtx.y];
      });
    }

    /**
    * Set the state as an array of [x, y] vertex pairs.
    * Same as setVal(), but will not trigger observer callback methods.
    * @param {array} - An array of [x, y] points
    */

  }, {
    key: "setInternalVal",
    value: function setInternalVal(vertexArray) {
      var vertices = vertexArray.map(function (xyPair) {
        return { x: xyPair[0], y: xyPair[1] };
      });

      this.setInternalState({ vertices: vertices });
    }

    /**
    * Set the state as an array of [x, y] vertex pairs.
    * Same as setInternalVal(), but will trigger observer callback methods.
    * @param {array} - An array of [x, y] points.
    */

  }, {
    key: "setVal",
    value: function setVal(vertexArray) {
      var vertices = vertexArray.map(function (xyPair) {
        return { x: xyPair[0], y: xyPair[1] };
      });

      this.setState({ vertices: vertices });
    }

    /**
     * Add a new vertex to the state
     * @public
     * @param {object} pos
     * @param {number} pos.x
     * @param {number} pos.y
     */

  }, {
    key: "addVertex",
    value: function addVertex(pos) {
      var newVertices = this.getState().vertices.map(function (x) {
        return x;
      });

      newVertices.push({ x: pos.x, y: pos.y });
      newVertices.sort(function (a, b) {
        return a.x - b.x;
      });

      this.setState({
        vertices: newVertices
      });
    }

    /* ===========================================================================
    *  INTERNAL FUNCTIONALITY METHODS
    */

    /**
     * Delete a vertex.
     * @private
     * @param {SVGElement} targetVtx - Vertex to Delete
     */

  }, {
    key: "_deleteVertex",
    value: function _deleteVertex(targetVtx) {
      var _this = this;

      var vtxIdx = this.svgEls.vertices.findIndex(function (vtx) {
        return vtx === targetVtx;
      });

      if (vtxIdx !== -1) {
        var newVertices = this.getState().vertices.map(function (x) {
          return x;
        });
        newVertices.splice(vtxIdx, 1);
        _this.setState({
          vertices: newVertices
        });
      }
    }

    /**
     * Add a new SVG vertex representation.
     * @private
     */

  }, {
    key: "_addSvgVertex",
    value: function _addSvgVertex() {
      var _this = this;

      var newVertex = document.createElementNS(_this.SVG_NS, "circle");
      _this.svgEls.vertices.push(newVertex);
      _this.svg.appendChild(newVertex);

      // if there is more than 1 svg vertex, we also need to draw lines between them
      if (_this.svgEls.vertices.length > 1) {
        this._addSvgLine();
      }
    }

    /**
     * Add an SVG line connecting two vertices.
     * @private
     */

  }, {
    key: "_addSvgLine",
    value: function _addSvgLine() {
      var newLine = document.createElementNS(this.SVG_NS, "path");
      this.svg.appendChild(newLine);
      this.svgEls.lines.push(newLine);
    }

    /**
     * Remove an SVG vertex.
     * @private
     */

  }, {
    key: "_removeSvgVertex",
    value: function _removeSvgVertex() {
      var vertex = this.svgEls.vertices[this.svgEls.vertices.length - 1];

      this.svg.removeChild(vertex);
      vertex = null;
      this.svgEls.vertices.pop();

      if (this.svgEls.lines.length > 0) {
        this._removeSvgLine();
      }
    }

    /**
     * Remove an SVG line connecting two vertices
     * @private
     */

  }, {
    key: "_removeSvgLine",
    value: function _removeSvgLine() {
      var line = this.svgEls.lines[this.svgEls.lines.length - 1];

      this.svg.removeChild(line);
      line = null;
      this.svgEls.lines.pop();
    }

    /**
      * Move a line
      * @private
      * @param {SVGElement} targetLine - The target line
      * @param {object} dPos -
      * @param {number} dPos.x
      * @param {number} dPos.y
      * @param {object} vtxPos0 - Original position (before moving)
      *                           of the two vertices immediately to the left
      *                           and right of the line being moved in the
      *                           form { vtx1: {x, y}, vtx2: {x, y}, boundaryBL: {x, y}, boundaryTR: {x, y} }
      *                           If null, will be calculated from the
      *                           corresponding svg element.
      * @param {obect} [vtxPos0.vtx1]
      * @param {number} [vtxPos0.vtx1.x]
      * @param {number} [vtxPos0.vtx1.y]
      * @param {obect} [vtxPos0.vtx2]
      * @param {number} [vtxPos0.vtx2.x]
      * @param {number} [vtxPos0.vtx2.y]
      * @returns {object} Original position of the two vertices affected by the line move in the form
      *                   { vtx1: {x, y}, vtx2: {x, y}, boundaryBL: {x, y}, boundaryTR: {x, y} }.
      */

  }, {
    key: "_moveLine",
    value: function _moveLine(targetLine, dPos, vtxPos0) {
      var _this = this;

      var lineIdx = _this.svgEls.lines.findIndex(function (line) {
        return line === targetLine;
      });

      // get vertices to the left and right of the selected line
      var vtx1 = _this.svgEls.vertices[lineIdx];
      var vtx2 = _this.svgEls.vertices[lineIdx + 1];

      var vtx1curPos = {
        x: parseInt(_this.svgEls.vertices[lineIdx].getAttribute("cx")),
        y: parseInt(_this.svgEls.vertices[lineIdx].getAttribute("cy"))
      };
      var vtx2curPos = {
        x: parseInt(_this.svgEls.vertices[lineIdx + 1].getAttribute("cx")),
        y: parseInt(_this.svgEls.vertices[lineIdx + 1].getAttribute("cy"))
      };

      // if vtxPos0 is null or undefined, this is the first time this function
      // was called in the line move, and we need to get the position of affected
      // vertices from the svg attributes.
      // vtx1 and vtx2 are the left and right vertices bounding the line
      // boundaryBL is the bottom left boundary restricting movement of the line
      // boundaryTR is the top right boundary restricting movement of the line
      if (vtxPos0 === null || vtxPos0 === undefined) {

        var boundaryBL = {
          x: lineIdx > 0 ? parseInt(_this.svgEls.vertices[lineIdx - 1].getAttribute("cx")) : _this._calcVertexPos({ x: _this.o.minXVal, y: _this.o.minYVal }).x,
          y: _this._calcVertexPos({ x: _this.o.minXVal, y: _this.o.minYVal }).y
        };

        var boundaryTR = {
          x: lineIdx + 2 < _this.svgEls.vertices.length ? parseInt(_this.svgEls.vertices[lineIdx + 2].getAttribute("cx")) : _this._calcVertexPos({ x: _this.o.maxXVal, y: _this.o.maxYVal }).x,
          y: _this._calcVertexPos({ x: _this.o.maxXVal, y: _this.o.maxYVal }).y
        };

        vtxPos0 = {
          vtx1: vtx1curPos,
          vtx2: vtx2curPos,
          boundaryBL: boundaryBL,
          boundaryTR: boundaryTR
        };
      }

      // calculate the new positions for the two affected vertices
      var vtx1newPos = {
        x: vtxPos0.vtx1.x + dPos.x,
        y: vtxPos0.vtx1.y + dPos.y
      };

      var vtx2newPos = {
        x: vtxPos0.vtx2.x + dPos.x,
        y: vtxPos0.vtx2.y + dPos.y
      };

      // if moving would take x values outside of boundaries, keep x values the same
      if (vtx1newPos.x < vtxPos0.boundaryBL.x || vtx2newPos.x < vtxPos0.boundaryBL.x || vtx1newPos.x > vtxPos0.boundaryTR.x || vtx2newPos.x > vtxPos0.boundaryTR.x) {

        vtx1newPos.x = vtx1curPos.x;
        vtx2newPos.x = vtx2curPos.x;
      }

      // if moving would take y values outside of boundaries, keep y values the same
      // remember that y-coordinates are inverted when dealing with the canvas
      if (vtx1newPos.y > vtxPos0.boundaryBL.y || vtx2newPos.y > vtxPos0.boundaryBL.y || vtx1newPos.y < vtxPos0.boundaryTR.y || vtx2newPos.y < vtxPos0.boundaryTR.y) {

        vtx1newPos.y = vtx1curPos.y;
        vtx2newPos.y = vtx2curPos.y;
      }

      this._moveVertex(vtx1, vtx1newPos);
      this._moveVertex(vtx2, vtx2newPos);

      // return the original position so that it may be used again if the line move is not finished
      return vtxPos0;
    }

    /**
    * Move a vertex
    * @private
    * @param {SVGElement} targetVtx - The target vertex
    * @param {Object} newPos - The new position
    * @param {number} newPos.x
    * @param {number} newPos.y
    */

  }, {
    key: "_moveVertex",
    value: function _moveVertex(targetVtx, newPos) {
      var _this = this;

      var vtxState = _this._calcVertexState(newPos);
      var vtxIdx = _this.svgEls.vertices.findIndex(function (vtx) {
        return vtx === targetVtx;
      });

      // move the vertex if it's not a fixed start or end point
      if (!(vtxIdx === 0 && this.o.hasFixedStartPoint) && !(vtxIdx === this.state.vertices.length - 1 && this.o.hasFixedEndPoint)) {

        var vertices = _this.getState().vertices.map(function (x) {
          return x;
        });

        vertices[vtxIdx].x = vtxState.x;
        vertices[vtxIdx].y = vtxState.y;

        _this.setState({
          vertices: vertices
        });
      }
    }

    /* ===========================================================================
    *  HELPER METHODS
    */

    /**
     * Calculate the x and y for a vertex in the graph according to its state value.
     * @private
     */

  }, {
    key: "_calcVertexPos",
    value: function _calcVertexPos(vertexState) {
      return {
        x: this._getWidth() * (vertexState.x / this.o.maxXVal),
        y: this._getHeight() - this._getHeight() * (vertexState.y / this.o.maxYVal)
      };
    }

    /**
     * Calculate the x and y for a vertex state based on position on the graph
     * (inverse of _calcVertexPos).
     * @private
     */

  }, {
    key: "_calcVertexState",
    value: function _calcVertexState(vertexPos) {
      return {
        x: this.o.maxXVal * (vertexPos.x / this._getWidth()),
        y: this.o.maxYVal - this.o.maxYVal * (vertexPos.y / this._getHeight())
      };
    }

    /**
     * Convert on-screen x distance to scaled x state-value.
     * @private
     */

  }, {
    key: "_xPxToVal",
    value: function _xPxToVal(x) {
      return x / this._getWidth() * (this.o.maxXVal - this.o.minXVal);
    }

    /**
     * Convert on-screen y distance to scaled y state-value.
     * @private
     */

  }, {
    key: "_yPxToVal",
    value: function _yPxToVal(y) {
      return y / this._getHeight() * (this.o.maxYVal - this.o.minYVal);
    }
  }]);

  return Graph;
}(_widget2.default);

exports.default = Graph;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Useful Math Utility functions
 */
var MathUtil = {

  /**
   * Quantize a value (set it to the closest value matching the interval)
   * Note: result will not necessarily reflect the same number of places of
   * as the q input due to floating point arithmetic.
   * @param {number} val - Value to quantize
   * @param {number} q - The quantization interval
   * @return {number} qVal - Quantized val
   */
  quantize: function quantize(val, q) {
    var qVal = void 0;

    if (q == 0) {
      return 0;
    } else if (q < 0) {
      q = Math.abs(q);
    }

    // quantize
    qVal = ~~(val / q) * q;

    qVal = Math.abs(val - qVal) > q / 2 ? qVal > 0 ? qVal + q : qVal - q : qVal;

    return qVal;
  },

  /**
   * Alias for quantize(val, q)
   * @param {number} val - Value to quantize
   * @param {number} q - The quantization interval
   * @return {number} qVal - Quantized val
   */
  q: function q(val, q) {
    return MathUtil.quantize(val, q);
  }
};

exports.default = MathUtil;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _widget = __webpack_require__(2);

var _widget2 = _interopRequireDefault(_widget);

var _constraint = __webpack_require__(0);

var _constraint2 = _interopRequireDefault(_constraint);

var _constraintDef = __webpack_require__(1);

var _constraintDef2 = _interopRequireDefault(_constraintDef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representing an piano keyboard widget
 *
 * @class
 * @implements {Widget}
 */
var Keyboard = function (_Widget) {
  _inherits(Keyboard, _Widget);

  /**
   * @constructor
   * @param {object} container - DOM container for the widget.
   * @param {object} [o] - Options.
   * @param {number} [o.bottomNote=48] - The bottom note (MIDI pitch) of the keyboard.
   * @param {number} [o.topNote=71] - The top note (MIDI pitch) of the keyboard.
   * @param {string} [o.keyBorderColor="#484848"] - The color of the border separating the keys.
   * @param {string} [o.blackKeyColor="#484848"] - The color used for the black keys.
   * @param {string} [o.whiteKeyColor="#fff"] - The color used for the white keys.
   * @param {string} [o.blackKeyActiveColor="#888"] - The color used to represent an active black key.
   * @param {string} [o.whiteKeyActiveColor="#333"] - The color used to represent an active white key.
   * @param {number} [o.blackKeyHeightAspect=0.6] - The aspect ratio of black key height to white key height.
   * @param {number} [o.blackKeyWidthAspect=0.66] - The aspect ratio of black key width to white key width.
   * @param {string} [o.orientation="horizontal"] - The keyboard orientation. sible values are 'monophonic'
   *                                       (only one active note at a time), or 'polyphonic'
   *                                       (can have several active notes at a time).
   * @param {boolean} [o.isEditable=true] - Boolean specifying whether the keyboard
   *                                      is editable by the mouse or touch interactions.
   *                                      A non-editable keyboard may be used as a visual
   *                                      diagram, for example.
   */
  function Keyboard(container, o) {
    _classCallCheck(this, Keyboard);

    return _possibleConstructorReturn(this, (Keyboard.__proto__ || Object.getPrototypeOf(Keyboard)).call(this, container, o));
  }

  /* ===========================================================================
  *  INITIALIZATION METHODS
  */

  /**
   * Initialize the options
   * @override
   * @private
   */


  _createClass(Keyboard, [{
    key: "_initOptions",
    value: function _initOptions(o) {
      // set the defaults
      this.o = {
        bottomNote: 48,
        topNote: 71,
        keyBorderColor: "#484848",
        blackKeyColor: "#484848",
        whiteKeyColor: "#fff",
        blackKeyActiveColor: "#888",
        whiteKeyActiveColor: "#333",
        blackKeyHeightAspect: 0.6,
        blackKeyWidthAspect: 0.66,
        mode: "polyphonic",
        orientation: "horizontal",
        isEditable: true,
        mouseSensitivity: 1.2
      };

      // override defaults with provided options
      _get(Keyboard.prototype.__proto__ || Object.getPrototypeOf(Keyboard.prototype), "_initOptions", this).call(this, o);
    }

    /**
     * Initialize state constraints
     * @override
     * @private
     */

  }, {
    key: "_initStateConstraints",
    value: function _initStateConstraints() {
      var _this = this;

      this.stateConstraints = new _constraintDef2.default({
        notes: [{
          pitch: new _constraint2.default({ min: 0, max: 127 }),
          vel: new _constraint2.default({ min: 0, max: 127 })
        }]
      });
    }

    /**
     * Initializes the state.
     * State is represented as an array of active notes, each of which is an object
     * { pitch, vel }, where pitch is MIDI pitch (0 - 127) and vel is MIDI velocity
     * (0 - 127). A vel of 0 is reported once for each note-off event, and not
     * reported on subsequent callback notifications.
     * @override
     * @private
     */

  }, {
    key: "_initState",
    value: function _initState() {
      this.state = {
        notes: [{ pitch: 0, vel: 0 }]
      };

      this._updateStatePitches();
    }

    /**
     * Updates state pitches.
     */

  }, {
    key: "_updateStatePitches",
    value: function _updateStatePitches() {
      var _this = this;
      this.state.notes = new Array(this._getNumKeys());

      var bottomNote = this.getOptions().bottomNote;

      // set the notes to the right pitches
      for (var i = 0; i < this.state.notes.length; ++i) {
        this.state.notes[i] = { pitch: bottomNote + i, vel: 0 };
      }

      console.log("init notes: ", this.state.notes);
    }

    /**
     * Initialize the svg elements
     * @override
     * @private
     */

  }, {
    key: "_initSvgEls",
    value: function _initSvgEls() {
      var _this = this;

      this.svgEls = {
        keys: []
      };

      this._updateSvgEls();

      this._appendSvgEls();
      this._update();
    }

    /**
     * Updates the SVG elements. 
     */

  }, {
    key: "_updateSvgEls",
    value: function _updateSvgEls() {

      // add SVG elements representing keys to match current number of keys
      for (var i = this.svgEls.keys.length; i < this._getNumKeys(); ++i) {
        this._addSvgKey();
      }

      // remove SVG elements representing keys to match current number of keys
      for (var _i = this.svgEls.keys.length; _i > this._getNumKeys(); ++_i) {
        this._removeSvgKey();
      }
    }

    /**
     * Initializes mouse and touch event handlers.
     * @override
     * @private
     */

  }, {
    key: "_initHandlers",
    value: function _initHandlers() {
      var _this = this;

      this.handlers = {
        touch: function touch(ev) {},
        move: function move(ev) {},
        release: function release() {}
      };

      for (var i = 0; i < this.svgEls.keys.length; ++i) {
        this.svgEls.keys[i].addEventListener("mousedown", this.handlers.touch);
        this.svgEls.keys[i].addEventListener("touchdown", this.handlers.touch);
      }
    }

    /**
     * Updates (redraws) component based on state.
     *
     * @override
     * @private
     */

  }, {
    key: "_update",
    value: function _update() {
      var x, y, width, height, fill, stroke;
      var blackKeys = [];

      this._updateStatePitches();
      this._updateSvgEls();

      for (var keyIdx = 0, whiteKeyIdx = 0; keyIdx < this.svgEls.keys.length; ++keyIdx) {
        var pitch = this._getPitchForKeyIdx(keyIdx);
        var attr = {};

        if (this._isWhiteKey(pitch)) {
          attr.x = this._getWhiteKeyWidth() * whiteKeyIdx;
          attr.y = 0;
          attr.width = this._getWhiteKeyWidth();
          attr.height = this._getKeyboardHeight();
          attr.fill = this.getState().notes[keyIdx].vel === 0 ? this.getOptions().whiteKeyColor : this.getOptions().whiteKeyActiveColor;
          attr.stroke = this.getOptions().keyBorderColor;

          ++whiteKeyIdx;
        } else {
          blackKeys.push(this.svgEls.keys[keyIdx]);

          // black keys are offset by 2/3 of white key width, and are 2/3 width and height of black keys
          attr.x = this._getWhiteKeyWidth() * whiteKeyIdx - this.getOptions().blackKeyWidthAspect * this._getWhiteKeyWidth() / 2;
          attr.y = 0;
          attr.width = this.getOptions().blackKeyWidthAspect * this._getWhiteKeyWidth();
          attr.height = this.getOptions().blackKeyHeightAspect * this._getKeyboardHeight();
          attr.fill = this.getState().notes[keyIdx].vel === 0 ? this.getOptions().blackKeyColor : this.getOptions().blackKeyActiveColor;
          attr.stroke = this.getOptions().keyBorderColor;
        }

        this._setKeyAttributes(keyIdx, attr);
      }

      // remove and reappend black keys so they are on top of the white keys
      for (var i = 0; i < blackKeys.length; ++i) {
        this.svg.removeChild(blackKeys[i]);
        this.svg.appendChild(blackKeys[i]);
      }

      console.log(this.getState());
    }

    /* ===========================================================================
    *  PUBLIC API
    */

    /**
     * Sets the options.
     * @public
     * @override
     * @param {object} [o] - Options to set. See {@link Keyboard#constructor} for list of options. 
     */

  }, {
    key: "setOptions",
    value: function setOptions(o) {
      o = o || {};

      // ensure that the bottom note is a white key (a black key cannot be at the edge when drawing the keyboard)
      if (o.bottomNote !== undefined && !this._isWhiteKey(o.bottomNote)) {
        --o.bottomNote;
      }

      // ensure that the bottom note is a white key (a black key cannot be at the edge when drawing the keyboard)
      if (o.topNote !== undefined && !this._isWhiteKey(o.topNote)) {
        ++o.topNote;
      }

      _get(Keyboard.prototype.__proto__ || Object.getPrototypeOf(Keyboard.prototype), "setOptions", this).call(this, o);
    }

    /**
     * Returns the last 
     * @public
     * @override
     * @returns {array} - An array of active notes.
     */

  }, {
    key: "getVal",
    value: function getVal() {
      return this.getState().curNote;
    }

    /**
     * Sets the current keyboard state using an array of {pitch, val} objects.
     * Same as setVal(), but will not cause an observer callback trigger.
     * @public
     * @override
     * @param {array} newNote - New value (array representing active notes with each entry in the form {pitch, val}).
     */

  }, {
    key: "setInternalVal",
    value: function setInternalVal(newNote) {
      var newState = _getNewStateFromNewNote(newNote);
      this.setInternalState(newState);
    }

    /**
     * Sets the current keyboard state using an array of {pitch, val} objects.
     * Same as setInternalVal(), but will cause an observer callback trigger.
     * @public
     * @param {array} newVal - New value (array representing active notes with each entry in the form {pitch, val}).
     */

  }, {
    key: "setVal",
    value: function setVal(newNote) {
      var newState = this._getNewStateFromNewNote(newNote);
      console.log("newNote", newNote);
      console.log("newState", newState);
      this.setState(newState);
    }

    /* ===========================================================================
    *  INTERNAL FUNCTIONALITY
    */

    /**
     * Returns a newState object representing a new keyboard state based on a new note provided. 
     * @param {object} newNote - A note object of format { pitch: number, vel: number }.
     * @param {number} newNote.pitch
     * @param {number} newNote.vel
     * @returns {object} An object representing the new state. 
     */

  }, {
    key: "_getNewStateFromNewNote",
    value: function _getNewStateFromNewNote(newNote) {
      var newState = {
        notes: this.state.notes.map(function (note) {
          return {
            pitch: note.pitch,
            vel: note.pitch === newNote.pitch ? newNote.vel : note.vel
          };
        })
      };

      return newState;
    }

    /**
     * Adds an SVG element representing a key.
     */

  }, {
    key: "_addSvgKey",
    value: function _addSvgKey() {
      var newKey = document.createElementNS(this.SVG_NS, "rect");
      this.svg.appendChild(newKey);
      this.svgEls.keys.push(newKey);
    }

    /**
     * Removes an SVG element representing a key.
     */

  }, {
    key: "_removeSvgKey",
    value: function _removeSvgKey() {
      var key = this.svgEls.keys[this.svgEls.keys.length - 1];

      this.svg.removeChild(key);
      key = null;
      this.svgEls.keys.pop();
    }

    /* ===========================================================================
    *  HELPER METHODS
    */

    /**
     * Sets attributes for an SVG rectangle representing a key with the given index.
     */

  }, {
    key: "_setKeyAttributes",
    value: function _setKeyAttributes(keyIdx, attr) {
      this.svgEls.keys[keyIdx].setAttribute("x", attr.x);
      this.svgEls.keys[keyIdx].setAttribute("y", attr.y);
      this.svgEls.keys[keyIdx].setAttribute("width", attr.width);
      this.svgEls.keys[keyIdx].setAttribute("height", attr.height);
      this.svgEls.keys[keyIdx].setAttribute("fill", attr.fill);
      this.svgEls.keys[keyIdx].setAttribute("stroke", attr.stroke);
    }

    /**
     * Returns the width of the keyboard, taking orientation into account.
     * If orientation is horizontal, width of the keyboard would equal
     * width of the canvas. If orientation is vertical, width of the
     * keyboard would equal the height of the canvas.
     * @private
     * @throws {Error} if o.orientation is not one of the allowed values.
     */

  }, {
    key: "_getKeyboardWidth",
    value: function _getKeyboardWidth() {
      var orientation = this.getOptions().orientation;

      if (orientation === "horizontal" || orientation === "horizontal-mirrored") {
        return this._getWidth();
      } else if (orientation === "vertical" || orientation === "vertical-mirrored") {
        return this._getHeight();
      }
    }

    /**
     * Returns the height of the keyboard, taking orientation into account.
     * If orientation is horizontal, height of the keyboard would equal
     * height of the canvas. If orientation is vertical, height of the
     * keyboard would equal the width of the canvas.
     * @private
     * @throws {Error} if o.orientation is not one of the allowed values.
     */

  }, {
    key: "_getKeyboardHeight",
    value: function _getKeyboardHeight() {
      var orientation = this.getOptions().orientation;

      if (orientation === "horizontal" || orientation === "horizontal-mirrored") {
        return this._getHeight();
      } else if (orientation === "vertical" || orientation === "vertical-mirrored") {
        return this._getWidth();
      }
    }

    /**
     * Returns the MIDI note number for the given key number.
     * @private
     * @param {number} keyIdx - The index of the key to be queried.
     * @returns {number} - MIDI note number for the given key number
     */

  }, {
    key: "_getPitchForKeyIdx",
    value: function _getPitchForKeyIdx(keyIdx) {
      return this.getOptions().bottomNote + keyIdx;
    }

    /** 
     * Returns the total number of keys on the keyboard. 
     * @private
     * @returns {number} - Total number of keys.
     */

  }, {
    key: "_getNumKeys",
    value: function _getNumKeys() {
      return this.o.topNote - this.o.bottomNote + 1;
    }

    /**  
     * Returns the number of white keys on the keyboard.
     * @private
     * @returns {number} - Number of white keys. 
     */

  }, {
    key: "_getNumWhiteKeys",
    value: function _getNumWhiteKeys() {
      var whiteKeyCount = 0;

      for (var curNote = this.getOptions().bottomNote; curNote <= this.getOptions().topNote; ++curNote) {
        if (this._isWhiteKey(curNote)) {
          ++whiteKeyCount;
        }
      }

      return whiteKeyCount;
    }

    /** 
     * Returns the width of each white key in px.
     * @private
     * @returns {number} - Width of each white key in px.
     */

  }, {
    key: "_getWhiteKeyWidth",
    value: function _getWhiteKeyWidth() {
      return this._getKeyboardWidth() / this._getNumWhiteKeys();
    }

    /**
     * Returns true if the given MIDI note number is a white key on the piano.
     * @private
     * @param {number} note - The MIDI note number for the given note. 
     * @returns {boolean} - True if the note is a white key, false if not.
     */

  }, {
    key: "_isWhiteKey",
    value: function _isWhiteKey(note) {
      if (note % 12 === 0 || note % 12 === 2 || note % 12 === 4 || note % 12 === 5 || note % 12 === 7 || note % 12 === 9 || note % 12 === 11) {
        return true;
      } else {
        return false;
      }
    }

    //TODO: IMPLEMENT HELPER METHODS


  }]);

  return Keyboard;
}(_widget2.default);

exports.default = Keyboard;

/***/ })
/******/ ]);