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
/******/ 	return __webpack_require__(__webpack_require__.s = 45);
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

var _widgetMixinSvgns = __webpack_require__(9);

var _widgetMixinSvgns2 = _interopRequireDefault(_widgetMixinSvgns);

var _widgetMixinState = __webpack_require__(10);

var _widgetMixinState2 = _interopRequireDefault(_widgetMixinState);

var _widgetMixinOptions = __webpack_require__(11);

var _widgetMixinOptions2 = _interopRequireDefault(_widgetMixinOptions);

var _widgetMixinObserver = __webpack_require__(12);

var _widgetMixinObserver2 = _interopRequireDefault(_widgetMixinObserver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

'use strict';

/**
 * Abstract base class representing an SVG widget that can be placed inside a DOM container.
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
    value: function _initOptions(o) {}

    /**
     * Initialize state constraints
     * @abstract
     * @protected
     */

  }, {
    key: "_initStateConstraints",
    value: function _initStateConstraints() {}

    /**
     * Initialize state
     * @abstract
     * @protected
     */

  }, {
    key: "_initState",
    value: function _initState() {}

    /**
     * Initialize the svg elements.
     * Each implementation of this method must end with calls to _appendSvgEls() and _update(),
     * in that order, as shown in this template
     * @abstract
     * @protected
     */

  }, {
    key: "_initSvgEls",
    value: function _initSvgEls() {}

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
    value: function _initHandlers() {}

    /**
     * Update (redraw) component based on state
     * @abstract
     * @protected
     */

  }, {
    key: "_update",
    value: function _update() {}

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
    value: function getVal() {}

    /**
     * Set the current state in a format specific to each widget.
     * Same as setVal(), but will not cause an observer callback trigger.
     * @abstract 
     * @public
     */

  }, {
    key: "setInternalVal",
    value: function setInternalVal(newVal) {}

    /**
     * Set the current state in a format specific to each widget.
     * Same as setInternalVal(), but will cause an observer callback trigger.
     * @abstract @public
     */

  }, {
    key: "setVal",
    value: function setVal(newVal) {}

    /**
     * Get the current state.
     * @abstract
     * @public
     * @returns {object} - Copy of this.state
     */

  }, {
    key: "getState",
    value: function getState() {}

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
    value: function setInternalState(newState) {}

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
    value: function setState(newState) {}

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
    key: "_getRelativeY",
    value: function _getRelativeY(y) {
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


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = __webpack_require__(6);

var _util2 = _interopRequireDefault(_util);

var _shimWebAudioConnect = __webpack_require__(16);

var _shimWebAudioConnect2 = _interopRequireDefault(_shimWebAudioConnect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

'use strict';

/**
 * Base class representing an Audio Module.
 * An AudioModule wraps a set of AudioNodes to provide a higher-order component that can itself be
 * used as an AudioNode.
 * @abstract @class
 */

var AudioModule = function () {

  /**
   * @constructor
   * @param {AudioContext} - The Audio Context that the module participates in.
   * @param {number} numInputs - Number of inputs.
   * @param {number} numOutputs - Number of outputs.
   */
  function AudioModule(audioCtx, numInputs, numOutputs) {
    _classCallCheck(this, AudioModule);

    this.audioCtx = audioCtx;

    // marker boolean to distinguish current object from an AudioNode
    this.isAudioModule = true;

    // shim the connect method for the Audio Context so that AudioNodes can connect to AudioModules
    if (typeof this.audioCtx.webAudioConnect !== "function") {
      (0, _shimWebAudioConnect2.default)(this.audioCtx);
    }

    this.input = audioCtx.createGain();
    this.output = audioCtx.createGain();

    this.audioComponents = {};

    this._initAudioComponents();
    this._initAudioParams();
  }

  /* ============================================================================================= */
  /*  INITIALIZATION METHODS
  /* ============================================================================================= */

  /**
   * Initialize audio components and their connections.
   * @private @abstract
   */


  _createClass(AudioModule, [{
    key: "_initAudioComponents",
    value: function _initAudioComponents() {}

    /**
     * Initialize and expose Audio Params.
     * @private @abstract
     */

  }, {
    key: "_initAudioParams",
    value: function _initAudioParams() {}

    /* ============================================================================================ */
    /*  PUBLIC API
    /* ============================================================================================ */

    /**
     * Returns the AudioContext that the Audio Module is participating in.
     * @returns {AudioContext} - the AudioContext that the Audio Module is participating in. 
     */

  }, {
    key: "getContext",
    value: function getContext() {
      return this.audioCtx;
    }

    /**
     * Connect to another AudioNode or AudioModule
     * @public
     * @param {AudioNode | AudioModule} destination - AudioNode or AudioModule to connect to.
     * @param {number} outputIndex - Channel of the output to connect.
     * @param {number} outputIndex - Channel of the destintation to connect to. 
     */

  }, {
    key: "connect",
    value: function connect(destination, outputIndex, inputIndex) {
      // if destination has an input property, connect to it (destination is an AudioModule)
      if (destination.isAudioModule === true) {
        this.output.connect(destination._input);
      }
      // else destination is an AudioNode and can be connected to directly
      else {
          this.output.connect(destination);
        }
    }

    /**
     * Disconnect from an AudioNode or AudioModule
     * @param {AudioNode | AudioModule} destination - AudioNode or AudioModule to disconnect from.
     * @param {number} outputIndex - Channel of the output to disconnect.
     * @param {number} outputIndex - Channel of the destintation to disconnect from. 
     */

  }, {
    key: "disconnect",
    value: function disconnect(destination, outputIndex, inputIndex) {
      // if destination has an input property, disconnect from it (destination is an AudioModule)
      if (destination.isAudioModule === true) {
        this.output.disconnect(destination._audioModuleInput);
        // else destination is an AudioNode and can be disconnected from directly
      } else {
        this.output.disconnect(destination);
      }
    }
  }]);

  return AudioModule;
}();

exports.default = AudioModule;

/***/ }),
/* 4 */
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

var _utilMath = __webpack_require__(5);

var _utilMath2 = _interopRequireDefault(_utilMath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representing an SVG Dial widget.
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
   * @param {number=1} o.stepInterval - Interval of the steps in which the dial changes value. 
   * @param {string="#000"} o.needleColor - Dial needle color.
   * @param {string="#f40"} o.activeColor - Dial active color.
   */
  function Dial(container, o) {
    _classCallCheck(this, Dial);

    return _possibleConstructorReturn(this, (Dial.__proto__ || Object.getPrototypeOf(Dial)).call(this, container, o));
  }

  /* ===========================================================================
  *  PUBLIC API
  */

  /**
   * Returns the dial value.
   * @public @override
   * @returns {number} - Value of the dial.
   */


  _createClass(Dial, [{
    key: "getVal",
    value: function getVal() {
      return this.state.val;
    }

    /**
     * Sets the dial value.
     * Same as setVal(), but will not trigger observer callbacks.
     * @public @override
     * @param {number} newVal - The new value.
     */

  }, {
    key: "setInternalVal",
    value: function setInternalVal(newVal) {
      this.setInternalState({ val: newVal });
    }

    /**
     * Sets the dial value.
     * Same as setInternalVal(), but will trigger observer callbacks.
     * @public @override
     * @param {number} newVal - The new value.
     */

  }, {
    key: "setVal",
    value: function setVal(newVal) {
      this.setState({ val: newVal });
    }

    /**
     * Sets the options. 
     * @public @override
     * @param {object} o - Options.
     */

  }, {
    key: "setOptions",
    value: function setOptions(o) {
      _get(Dial.prototype.__proto__ || Object.getPrototypeOf(Dial.prototype), "setOptions", this).call(this, o);
      this.o.stepPrecision = _utilMath2.default.getPrecision(this.o.stepInterval);
    }

    /* ==============================================================================================
    *  INITIALIZATION METHODS
    */

    /**
     * Initializes the options.
     * @override
     * @private
     */

  }, {
    key: "_initOptions",
    value: function _initOptions(o) {
      // set the defaults
      this.o = {
        minVal: 0,
        maxVal: 127,
        stepInterval: 1,
        needleColor: "#414141",
        activeColor: "#f40",
        mouseSensitivity: 1.2
      };

      // override defaults with provided options
      _get(Dial.prototype.__proto__ || Object.getPrototypeOf(Dial.prototype), "_initOptions", this).call(this, o);

      // set the precision based on the step interval
      this.o.stepPrecision = _utilMath2.default.getPrecision(this.o.stepInterval);
    }

    /**
     * Initializes state constraints.
     * @override
     * @private
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
            return _utilMath2.default.quantize(num, _this.o.stepInterval, _this.o.stepPrecision);
          }
        })
      });
    }

    /**
     * Initializes state.
     * @override
     * @private
     */

  }, {
    key: "_initState",
    value: function _initState() {
      this.state = {
        val: 0
      };
    }

    /**
     * Initializes the svg elements.
     * @override
     * @private
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
     * Initializes mouse and touch event handlers.
     * @override
     * @private
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

          newVal = _this.state.val + yD * _this.o.mouseSensitivity * _this._calcMovePrecision();
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
     * Updates (redraws) components based on state.
     * @override
     * @private
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

    /* ==============================================================================================
    *  INTERNAL FUNCTIONALITY METHODS
    */

    /** 
     * Calcultes the stroke width for the background and active arcs.
     * @private
     * @returns {number} - Arc stroke width;
     */

  }, {
    key: "_calcArcStrokeWidth",
    value: function _calcArcStrokeWidth() {
      return this._calcDialRadius() / 5;
    }

    /** 
     * Calculates the dial radius.
     * @private
     * @returns {number} - Radius of the dial.
     */

  }, {
    key: "_calcDialRadius",
    value: function _calcDialRadius() {
      var radius = Math.min(this._getWidth(), this._getHeight()) / 2 * 0.89;
      radius = Math.trunc(radius);
      return radius;
    }

    /** 
     * Calculates the needle angle for a given state val.
     * @private
     * @returns {number} - Angle of the needle.
     */

  }, {
    key: "_calcNeedleAngle",
    value: function _calcNeedleAngle() {
      var _this = this;

      return (
        // protect against divide by 0:
        this.o.maxVal - _this.o.minVal !== 0 ? (_this.state.val - _this.o.minVal) / (_this.o.maxVal - _this.o.minVal) * (1.7 * Math.PI) + 1.15 * Math.PI : 0.5 * (1.7 * Math.PI) + 1.15 * Math.PI
      );
    }

    /** 
     * Calculates the center of the needle.
     * @private
     * @returns {object} - {x, y} object representing the needle center coordinates.
     */

  }, {
    key: "_calcNeedleCenter",
    value: function _calcNeedleCenter() {
      var _this = this;
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

  }, {
    key: "_calcNeedleEnd",
    value: function _calcNeedleEnd() {
      var _this = this;
      return {
        x: _this._calcNeedleCenter().x + Math.sin(_this._calcNeedleAngle()) * _this._calcDialRadius(),
        y: _this._calcNeedleCenter().y - Math.cos(_this._calcNeedleAngle()) * _this._calcDialRadius()
      };
    }

    /** 
     * Calculates the needle width.
     * @private
     * @returns {number} - The width of the needle in px.
     */

  }, {
    key: "_calcNeedleWidth",
    value: function _calcNeedleWidth() {
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

    /**
     * Calculates the precision with which the state value changes when moved.
     */

  }, {
    key: "_calcMovePrecision",
    value: function _calcMovePrecision() {
      var precision = (this.o.maxVal - this.o.minVal) / 127;
      return precision;
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
 * Useful Math Utility functions
 */
var MathUtil = {

  /**
   * Returns the decimal precision of a number.
   * @param {number} val - The value whose precision to check.
   * @returns {number} - Number of decimal places.
   */
  getPrecision: function getPrecision(val) {
    var decStr = ('' + val).split('.')[1];
    return decStr ? decStr.length : 0;
  },


  /**
   * Round a number to specified decimal precision.
   * Same as Number.prototype.toFixed, but does not use toString.
   * @param {nubmer} val - Value to be rounded.
   * @param {precision} val - 
   * @returns  
   */
  round: function round(val, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(val * factor) / factor;
  },

  /**
   * Quantize a value (set it to the closest value matching the interval)
   * Note: result will not necessarily reflect the same number of places of
   * as the q input due to floating point arithmetic.
   * @param {number} val - Value to quantize.
   * @param {number} q - The quantization interval.
   * @param {number} precision - The decimal precision of the result.
   * @returns {number} qVal - Quantized val.
   */
  quantize: function quantize(val, q, precision) {
    var qVal = void 0;

    if (q == 0) {
      return 0;
    } else if (q < 0) {
      q = Math.abs(q);
    }

    // quantize
    qVal = ~~(val / q) * q;

    qVal = Math.abs(val - qVal) > q / 2 ? qVal > 0 ? qVal + q : qVal - q : qVal;

    if (precision !== undefined) {
      qVal = MathUtil.round(qVal, precision);
    }

    return qVal;
  },

  /**
   * Alias for quantize(val, q)
   * @param {number} val - Value to quantize
   * @param {number} q - The quantization interval
   * @param {number} precision - The decimal precision of the result.
   * @returns {number} qVal - Quantized val
   */
  q: function q(val, q, precision) {
    return MathUtil.quantize(val, q, precision);
  }
};

exports.default = MathUtil;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A collection of static utility methods for Audio Modules
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
var AudioModuleUtil = {

  /**
   * Convert MIDI pitch to frequency
   * @param {number} midiPitch - The midi pitch number.
   * @param {number} [a4tuning=440] - Tuning of the note A4 (midi pitch 69) in Hz, 440Hz by default.
   * @return {number} freq - Frequency for the given MIDI pitch.
   */
  midiToFreq: function midiToFreq(midiPitch, a4tuning) {
    a4tuning = a4tuning || 440;
    var freq = -1;

    if (midiPitch !== -1) freq = Math.pow(2, (midiPitch - 69) / 12) * 440;
    return freq;
  },

  /**
   * Convert note name to MIDI pitch
   * @param {string} noteName - The note name to convert
   * @return {number} midiPitch - MIDI pitch for the given note name. Return -1 if invalid argument format.
   */
  noteNameToMidi: function noteNameToMidi(noteName) {
    var noteNameFormat = /^([a-g]|[A-G])(#|b)?([0-9]|10)$/;

    if (noteNameFormat.test(noteName) === false) {
      console.log('AudioModuleUtil.noteNameToMidi: invalid note name format');
      return -1;
    } else {
      var capture = noteNameFormat.exec(noteName);

      var note = capture[1];
      var accidental = capture[2];
      var octave = capture[3];

      var noteFundamentalMap = {
        'A': 9,
        'a': 9,
        'B': 11,
        'b': 11,
        'C': 0,
        'c': 0,
        'D': 2,
        'd': 2,
        'E': 4,
        'e': 4,
        'F': 5,
        'f': 5,
        'G': 7,
        'g': 7
      };

      var noteFundamental = noteFundamentalMap[note];

      if (accidental === '#') {
        noteFundamental++;
      } else if (accidental === 'b') {
        noteFundamental--;
      }

      var midiPitch = noteFundamental + 12 * octave;

      return midiPitch;
    }
  },

  /**
   * Convert note name to frequency
   * @param {string} noteName - The note name to convert
   * @param {number} [a4tuning=440] - Tuning of the note A4 (midi pitch 69) in Hz, 440Hz by default.
   * @return {number} freq - Frequency for the given MIDI pitch.
   */
  noteNameToFreq: function noteNameToFreq(noteName, a4tuning) {
    a4tuning = a4tuning || 440;
    return AudioModuleUtil.midiToFreq(AudioModuleUtil.noteNameToMidi(noteName), a4tuning);
  }
};

exports.default = AudioModuleUtil;

/***/ }),
/* 7 */,
/* 8 */,
/* 9 */
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
/* 10 */
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
/* 11 */
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
/* 12 */
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
/* 13 */,
/* 14 */
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
 * Class representing a Slider widget.
 * @class
 * @implements {Widget}
 */
var Slider = function (_Widget) {
  _inherits(Slider, _Widget);

  /**
   * @constructor
   * @param {object} container - DOM container for the widget.
   * @param {object} [o] - Options.
   * @param {number} [o.minVal=0] - The minimum possible value the slider can represent.
   * @param {number} [o.maxVal=127] - The maximum possible value teh slider can represent.
   * @param {string} [o.sliderBodyColor="#484848"] - The color of the slider bar.
   * @param {string} [o.sliderHandleColor="#484848"] - The color of the triangle used as the slider's needle.
   */
  function Slider(container, o) {
    _classCallCheck(this, Slider);

    return _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this, container, o));
  }

  /* ===========================================================================
  *  INITIALIZATION METHODS
  */

  /**
   * Initialize the options
   * @override
   * @protected
   */


  _createClass(Slider, [{
    key: "_initOptions",
    value: function _initOptions(o) {
      // set the defaults
      this.o = {
        minVal: 0,
        maxVal: 127,
        sliderBodyColor: "#484848",
        sliderHandleColor: "#484848",
        mouseSensitivity: 1.2
      };

      // override defaults with provided options
      _get(Slider.prototype.__proto__ || Object.getPrototypeOf(Slider.prototype), "_initOptions", this).call(this, o);
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
        val: new _constraint2.default({ min: _this.o.minVal, max: _this.o.maxVal, transform: function transform(num) {
            return num.toFixed(0);
          } })
      });
    }

    /**
     * Initialize state.
     * @override
     * @protected
     */

  }, {
    key: "_initState",
    value: function _initState() {
      this.state = {
        val: this.o.minVal
      };

      // keep track of dimensions
      this.dims = {
        offsetBottom: 5,
        offsetTop: 5,
        bodyWidth: 2,
        handleWidth: 10,
        handleHeight: 10
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
        body: document.createElementNS(_this.SVG_NS, "rect"),
        overlay: document.createElementNS(_this.SVG_NS, "rect"),
        handle: document.createElementNS(_this.SVG_NS, "polygon")
      };

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

      this.handlers = {

        touchBody: function touchBody(ev) {
          ev.preventDefault();
          ev.stopPropagation();

          var newVal = _this._calcTouchVal(ev.clientY);
          _this.setState({ val: newVal });

          _this.handlers.touchHandle(ev);
        },

        touchHandle: function touchHandle(ev) {
          ev.preventDefault();
          ev.stopPropagation();

          document.body.addEventListener("mousemove", _this.handlers.moveHandle);
          document.body.addEventListener("touchmove", _this.handlers.moveHandle);
          document.body.addEventListener("mouseup", _this.handlers.releaseHandle);
          document.body.addEventListener("touchend", _this.handlers.releaseHandle);
        },

        moveHandle: function moveHandle(ev) {
          ev.preventDefault();
          ev.stopPropagation();

          var newVal = _this._calcTouchVal(ev.clientY);
          _this.setState({ val: newVal });
        },

        releaseHandle: function releaseHandle(ev) {
          ev.preventDefault();
          ev.stopPropagation();

          document.body.removeEventListener("touchmove", _this.handlers.moveHandle);
          document.body.removeEventListener("mousemove", _this.handlers.moveHandle);
          document.body.removeEventListener("mouseup", _this.handlers.releaseHandle);
          document.body.removeEventListener("touchend", _this.handlers.releaseHandle);
        }
      };

      this.svgEls.overlay.addEventListener("mousedown", _this.handlers.touchBody);
      this.svgEls.overlay.addEventListener("touchstart", _this.handlers.touchBody);
      this.svgEls.handle.addEventListener("mousedown", _this.handlers.touchHandle);
      this.svgEls.handle.addEventListener("touchstart", _this.handlers.touchHandle);
    }

    /**
     * Update (redraw) component based on state
     * @override
     * @protected
     */

  }, {
    key: "_update",
    value: function _update() {
      var _this = this;

      var sliderBodyPos = _this._calcSliderBodyPos();

      this.svgEls.body.setAttribute("x", sliderBodyPos.x);
      this.svgEls.body.setAttribute("y", sliderBodyPos.y);
      this.svgEls.body.setAttribute("width", _this.dims.bodyWidth);
      this.svgEls.body.setAttribute("height", _this._calcSliderBodyHeight());
      this.svgEls.body.setAttribute("fill", _this.o.sliderBodyColor);

      this.svgEls.overlay.setAttribute("x", sliderBodyPos.x);
      this.svgEls.overlay.setAttribute("y", sliderBodyPos.y);
      this.svgEls.overlay.setAttribute("width", _this.dims.bodyWidth + _this.dims.handleWidth);
      this.svgEls.overlay.setAttribute("height", _this._calcSliderBodyHeight());
      this.svgEls.overlay.setAttribute("fill", "transparent");

      var sliderHandlePoints = _this._calcSliderHandlePoints();

      this.svgEls.handle.setAttribute("points", sliderHandlePoints);
      this.svgEls.handle.setAttribute("fill", _this.o.sliderHandleColor);
    }

    /* ===========================================================================
    *  PUBLIC API
    */

    /**
     * Get the slider value.
     * @public
     */

  }, {
    key: "getVal",
    value: function getVal() {
      return this.state.val;
    }

    /**
     * Set the current slider value.
     * Same as setVal(), but will not cause an observer callback trigger.
     * @public
     * @param {number} newVal - The new slider value.
     */

  }, {
    key: "setInternalVal",
    value: function setInternalVal(newVal) {
      this.setInternalState({ val: newVal });
    }

    /**
     * Set the current slider value.
     * Same as setInternalVal(), but will cause an observer callback trigger.
     * @public
     * @param {number} newVal - The new slider value.
     */

  }, {
    key: "setVal",
    value: function setVal(newVal) {
      this.setState({ val: newVal });
    }

    /* ===========================================================================
    *  HELPER METHODS
    */

    /**
     * Returns the position and dimensions for the slider body.
     * @private
     * @returns {object} - {x, y} position.
     */

  }, {
    key: "_calcSliderBodyPos",
    value: function _calcSliderBodyPos() {
      var _this = this;

      return {
        x: _this._getWidth() / 2 - 1,
        y: _this.dims.offsetTop
      };
    }

    /**
     * Returns the height of the slider body.
     * @private
     * @returns {number} - Height of the slider body.
     */

  }, {
    key: "_calcSliderBodyHeight",
    value: function _calcSliderBodyHeight() {
      return this._getHeight() - this.dims.offsetTop - this.dims.offsetBottom;
    }

    /**
     * Returns the height of the slider body.
     * @private
     * @returns {number} - Width of the slider body.
     */

  }, {
    key: "_calcSliderBodyWidth",
    value: function _calcSliderBodyWidth() {
      return this.dims.bodyWidth;
    }

    /**
    * Returns the position and dimensions for the slider body.
    * @private
    * @returns {object} - {x, y} position.
    */

  }, {
    key: "_calcSliderHandlePoints",
    value: function _calcSliderHandlePoints() {
      var _this = this;

      var sliderBodyHeight = _this._calcSliderBodyHeight();

      var x0 = _this._getWidth() / 2 + 1;
      var y0 = sliderBodyHeight - _this.state.val / (_this.o.maxVal - _this.o.minVal) * sliderBodyHeight + _this.dims.offsetBottom;
      var x1 = x0 + this.dims.handleWidth;
      var y1 = y0 - this.dims.handleHeight / 2;
      var x2 = x1;
      var y2 = y0 + this.dims.handleHeight / 2;

      return x0 + "," + y0 + " " + x1 + "," + y1 + " " + x2 + "," + y2;
    }

    /**
     * Calculate the value of the slider touched at position y.
     * @private
     * @param {number} y - Y-value of the touch location.
     * @returns {number} - Value of the slider at the touched location.
     */

  }, {
    key: "_calcTouchVal",
    value: function _calcTouchVal(y) {
      var valRange = this.o.maxVal - this.o.minVal;
      var bodyY = this._getHeight() - this._getRelativeY(y) - this.dims.offsetBottom;
      var touchVal = bodyY / this._calcSliderBodyHeight() * valRange + this.o.minVal;

      return touchVal;
    }
  }]);

  return Slider;
}(_widget2.default);

exports.default = Slider;

/***/ }),
/* 15 */,
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Shim the WebAudio connect and disconnect methods to allow WebAudio nodes to connect to Audio Modules.
 * @param {AudioContext} audioCtx - The Audio Context to shim.
 */
function shimWebAudioConnect(audioCtx) {
  var audioNodePrototype = Object.getPrototypeOf(Object.getPrototypeOf(audioCtx.createGain()));

  // keep a reference to the original connect and disconnect methods as webAudioConnect and webAudioDisconnect
  audioNodePrototype.webAudioConnect = audioNodePrototype.connect;
  audioNodePrototype.webAudioDisconnect = audioNodePrototype.disconnect;

  // if the destination object has an 'input' property, it is an Audio Module - connect to 'input'
  // else it is an AudioNode - connect directly
  audioNodePrototype.connect = function (destination, outputIndex, inputIndex) {
    if (destination.isAudioModule === true) {
      this.webAudioConnect(destination.input, outputIndex, inputIndex);
    } else {
      this.webAudioConnect(destination, outputIndex, inputIndex);
    }
  };

  audioNodePrototype.disconnect = function (destination, outputIndex, inputIndex) {
    if (destination.isAudioModule === true) {
      this.webAudioDisconnect(destination.input, outputIndex, inputIndex);
    } else {
      this.webAudioDisconnect(destination, outputIndex, inputIndex);
    }
  };
}

exports.default = shimWebAudioConnect;

/***/ }),
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Verifies that the given audio context has the requested features and attempts to shim features that are
 * missing.
 */
function VerifyAudioContextFeatures(audioCtx, features) {

  features.forEach(function (feature) {

    switch (feature) {

      case "Analyser":
        if (typeof audioCtx.createAnalyser !== "function") {
          throw new Error("Required module AnalyserNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "AudioBuffer":
        if (typeof audioCtx.createBuffer !== "function") {
          throw new Error("Required module AudioBufferNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "AudioBufferSource":
        if (typeof audioCtx.createBufferSource !== "function") {
          throw new Error("Required module AudioBufferSourceNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "BiquadFilter":
        if (typeof audioCtx.createBiquadFilter !== "function") {
          throw new Error("Required module BiquadFilterNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "ChannelMerger":
        if (typeof audioCtx.createChannelMerger !== "function") {
          throw new Error("Required module ChannelMergerNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "ChannelSplitter":
        if (typeof audioCtx.createChannelSplitter !== "function") {
          throw new Error("Required module ChannelSplitterNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "Convolver":
        if (typeof audioCtx.createConvolver !== "function") {
          throw new Error("Required module ConvolverNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "Delay":
        if (typeof audioCtx.createDelay !== "function") {
          throw new Error("Required module DelayNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "DynamicsCompressor":
        if (typeof audioCtx.createDynamicsCompressor !== "function") {
          throw new Error("Required module DynamicsCompressorNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "Gain":
        if (typeof audioCtx.createGain !== "function") {
          throw new Error("Required module GainNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "IIRFilter":
        if (typeof audioCtx.createIIRFilter !== "function") {
          throw new Error("Required module IIRFilterNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "Oscillator":
        if (typeof audioCtx.createOscillator !== "function") {
          throw new Error("Required module OscillatorNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "Panner":
        if (typeof audioCtx.createPannerr !== "function") {
          throw new Error("Required module PannerNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "StereoPanner":
        if (typeof audioCtx.createStereoPanner !== "function") {
          audioCtx.createStereoPanner = function () {
            return new StereoPannerShim(audioCtx);
          };
        }
        break;

      default:
        console.warn("A check for AudioContext feature ", feature, "is being requested, but no matching check is implemented");
        break;
    }
  });
}

exports.default = VerifyAudioContextFeatures;

/***/ }),
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _audioModule = __webpack_require__(3);

var _audioModule2 = _interopRequireDefault(_audioModule);

var _stereoPannerShim = __webpack_require__(46);

var _stereoPannerShim2 = _interopRequireDefault(_stereoPannerShim);

var _channelStrip = __webpack_require__(47);

var _channelStrip2 = _interopRequireDefault(_channelStrip);

var _dial = __webpack_require__(4);

var _dial2 = _interopRequireDefault(_dial);

var _slider = __webpack_require__(14);

var _slider2 = _interopRequireDefault(_slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AUDIO_CTX = new AudioContext();
var DEST = AUDIO_CTX.destination;

/* ============================================================================================= */
/* STEREO PANNER SHIM TEST
/* ============================================================================================= */

(function () {

  AUDIO_CTX.createStereoPanner = function () {
    console.log("Creating stereo panner...");
    return new _stereoPannerShim2.default(AUDIO_CTX);
  };

  var stereoPanner = AUDIO_CTX.createStereoPanner();
  var oscillator = AUDIO_CTX.createOscillator();
  var gain = AUDIO_CTX.createGain();

  oscillator.connect(stereoPanner);
  stereoPanner.connect(gain);
  gain.connect(DEST);

  gain.gain.value = 0;

  oscillator.frequency.value = 220;
  oscillator.start();

  // pan dial
  var panDial = new _dial2.default(document.getElementById("pan-dial"), {
    minVal: -1,
    maxVal: 1,
    stepInterval: 0.01
  });

  panDial.addObserver(function (val) {
    stereoPanner.pan.value = val;
  });

  // audio on/off toggle
  document.getElementById("stereo-panner-audio-toggle").addEventListener("change", function (ev) {
    gain.gain.value = ev.target.checked ? 0.5 : 0;
  });
})();

/* ============================================================================================= */
/* CHANNEL STRIP TEST
/* ============================================================================================= */

(function () {

  var channelStrip = new _channelStrip2.default(AUDIO_CTX);
  // let osc = AUDIO_CTX.createOscillator();
  // let gain = AUDIO_CTX.createGain();

  // osc.connect(channelStrip);
  // channelStrip.connect(gain);
  // gain.connect(DEST);

  // gain.gain.value = 0.5;
  // osc.frequency.value = 220;
  // osc.start();

  // document.querySelector(".channel-strip .audio-toggle").addEventListener("change", ev => {
  //   gain.gain.value = ev.target.checked ? 0.5 : 0;
  // });

  // // input gain slider
  // let inputGainSlider = new Slider(document.querySelector(".channel-strip .input-gain-slider"), {
  //   minVal: 0,
  //   maxVal: 1,
  //   stepInterval: 0.01
  // });
  // inputGainSlider.addObserver(gain => { channelStrip.setInputGain(gain); });

  // // pan dial;
  // let panDial = new Dial(document.querySelector(".channel-strip .pan-dial"), {
  //   minVal: -1,
  //   maxVal: 1,
  //   stepInterval: 0.01
  // });
  // panDial.addObserver(pan => { channelStrip.setPan(pan); });

  // // output gain slider
  // let outputGainSlider = new Slider(document.querySelector(".channel-strip .output-gain-slider"), {
  //   minVal: 0,
  //   maxVal: 1,
  //   stepInterval: 0.01
  // });
  // outputGainSlider.addObserver(gain => { channelStrip.setOutputGain(gain); });

})();

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _audioModule = __webpack_require__(3);

var _audioModule2 = _interopRequireDefault(_audioModule);

var _verifyAudioContextFeatures = __webpack_require__(23);

var _verifyAudioContextFeatures2 = _interopRequireDefault(_verifyAudioContextFeatures);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

'use strict';

/** 
 * Class representing a Stereo Panner Shim.
 * This shim provides an implementation of StereoPannerNode for WebAudio implementations that
 * do not provide it.
 * @class
 */

var StereoPannerShim = function (_AudioModule) {
  _inherits(StereoPannerShim, _AudioModule);

  /**
   * @constructor
   * @param {AudioContext} audioCtx - Audio Context in which this module participates. 
   */
  function StereoPannerShim(audioCtx) {
    _classCallCheck(this, StereoPannerShim);

    var _this2 = _possibleConstructorReturn(this, (StereoPannerShim.__proto__ || Object.getPrototypeOf(StereoPannerShim)).call(this, audioCtx));

    var _this = _this2;

    // generate a setter for the pan value
    (function generatePanSetter(val) {
      _this.pan = new Number(val);

      Object.defineProperty(_this.pan, "value", {
        set: function set(newVal) {
          newVal = newVal > 1 ? 1 : newVal;
          newVal = newVal < -1 ? -1 : newVal;

          _this.audioComponents.gainL.gain.value = -(newVal / 2) + 0.5;
          _this.audioComponents.gainR.gain.value = newVal / 2 + 0.5;

          generatePanSetter(newVal);
        }
      });
    })();
    return _this2;
  }

  /* ============================================================================================= */
  /*  INITIALIZATION METHODS
  /* ============================================================================================= */

  /**
   * Initialize audio components and their connections.
   * @private @override
   */


  _createClass(StereoPannerShim, [{
    key: "_initAudioComponents",
    value: function _initAudioComponents() {
      var _this = this;

      try {

        (0, _verifyAudioContextFeatures2.default)(_this.audioCtx, ["Gain", "ChannelMerger"]);

        this.audioComponents = {
          gainL: _this.audioCtx.createGain(),
          gainR: _this.audioCtx.createGain(),
          merger: _this.audioCtx.createChannelMerger(2)
        };

        this.input.connect(this.audioComponents.gainL);
        this.input.connect(this.audioComponents.gainR);
        this.audioComponents.gainL.connect(this.audioComponents.merger, 0, 0);
        this.audioComponents.gainR.connect(this.audioComponents.merger, 0, 1);
        this.audioComponents.merger.connect(this.output);

        console.log("initialized");
      } catch (err) {
        console.error(err);
      }
    }
  }]);

  return StereoPannerShim;
}(_audioModule2.default);

exports.default = StereoPannerShim;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _audioModule = __webpack_require__(3);

var _audioModule2 = _interopRequireDefault(_audioModule);

var _verifyAudioContextFeatures = __webpack_require__(23);

var _verifyAudioContextFeatures2 = _interopRequireDefault(_verifyAudioContextFeatures);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

'use strict';

/**
 * Class representing a Channel Strip.
 * A Channel Strip is a processing component similar to a channel strip found on a mixing board.
 * It facilitates control over input gain, output gain, and pan of a signal.
 * @class
 */

var ChannelStrip = function (_AudioModule) {
  _inherits(ChannelStrip, _AudioModule);

  /**
   * @constructor
   * @param {AudioContext} audioCtx 
   */
  function ChannelStrip(audioCtx) {
    _classCallCheck(this, ChannelStrip);

    return _possibleConstructorReturn(this, (ChannelStrip.__proto__ || Object.getPrototypeOf(ChannelStrip)).call(this, audioCtx));
  }

  /* ============================================================================================= */
  /*  INITIALIZATION METHODS
  /* ============================================================================================= */

  /**
   * Initialize audio components and their connections.
   * @private @override
   */


  _createClass(ChannelStrip, [{
    key: "_initAudioComponents",
    value: function _initAudioComponents() {
      var _this = this;

      try {
        (0, _verifyAudioContextFeatures2.default)(_this.audioCtx, ["Gain", "StereoPanner"]);

        this.audioComponents = {
          inputGain: _this.input,
          panner: _this.audioCtx.createStereoPanner(),
          outputGain: _this.output
        };

        this.audioComponents.inputGain.connect(this.audioComponents.panner);
        this.audioComponents.panner.connect(this.audioComponents.outputGain);
      } catch (err) {
        console.error(err);
      }
    }

    /**
     * Initialize and expose Audio Params.
     * @private @abstract
     */

  }, {
    key: "_initAudioParams",
    value: function _initAudioParams() {
      this.inputGain = this.audioComponents.inputGain.gain;
      this.outputGain = this.audioComponents.outputGain.gain;
      this.pan = this.audioComponents.panner.pan;
    }

    /* ============================================================================================= */
    /*  GETTERS AND SETTERS
    /* ============================================================================================= */

    /**
     * Get input gain value.
     * @returns {number} - Input gain value.
     */

  }, {
    key: "getInputGain",
    value: function getInputGain() {
      return this.audioComponents.inputGain.gain.value;
    }

    /**
     * Set input gain value.
     * @param {number} newVal - The new input gain value.
     */

  }, {
    key: "setInputGain",
    value: function setInputGain(newVal) {
      this.audioComponents.inputGain.gain.value = newVal;
    }

    /**
     * Get pan value.
     * @returns {number} - Pan value.
     */

  }, {
    key: "getPan",
    value: function getPan() {
      return this.audioComponents.panner.pan.value;
    }

    /**
     * Set pan value.
     * @param {number} newVal - The new pan value.
     */

  }, {
    key: "setPan",
    value: function setPan(newVal) {
      this.audioComponents.panner.pan.value = newVal;
    }

    /**
     * Get output gain value.
     * @returns {number} - Output gain value.
     */

  }, {
    key: "getOutputGain",
    value: function getOutputGain() {
      return this.audioComponents.outputGain.gain.value;
    }

    /**
     * Set output gain value.
     * @param {number} newVal - The new output gain value.
     */

  }, {
    key: "setOutputGain",
    value: function setOutputGain(newVal) {
      this.audioComponents.outputGain.gain.value = newVal;
    }
  }]);

  return ChannelStrip;
}(_audioModule2.default);

exports.default = ChannelStrip;

/***/ })
/******/ ]);
//# sourceMappingURL=manual-test-bundle.js.map