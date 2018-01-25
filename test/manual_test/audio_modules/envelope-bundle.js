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
/******/ 	return __webpack_require__(__webpack_require__.s = 50);
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

var _util = __webpack_require__(5);

var _util2 = _interopRequireDefault(_util);

var _shimWebAudioConnect = __webpack_require__(9);

var _shimWebAudioConnect2 = _interopRequireDefault(_shimWebAudioConnect);

var _audioModuleOptionsMixin = __webpack_require__(19);

var _audioModuleOptionsMixin2 = _interopRequireDefault(_audioModuleOptionsMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    if (this.audioCtx.isWebAudioConnectShimmed !== true) {
      (0, _shimWebAudioConnect2.default)(this.audioCtx);
    }

    this.input = audioCtx.createGain();
    this.output = audioCtx.createGain();

    this.audioComponents = {};

    this._initOptions();
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

    /**
     * Initialize the options.
     * @private @abstract
     */

  }, {
    key: "_initOptions",
    value: function _initOptions() {}

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
        this.output.connect(destination.input);
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
        this.output.disconnect(destination.input);
        // else destination is an AudioNode and can be disconnected from directly
      } else {
        this.output.disconnect(destination);
      }
    }
  }]);

  return AudioModule;
}();

Object.assign(AudioModule.prototype, _audioModuleOptionsMixin2.default);

exports.default = AudioModule;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _widgetMixinSvgns = __webpack_require__(11);

var _widgetMixinSvgns2 = _interopRequireDefault(_widgetMixinSvgns);

var _widgetMixinState = __webpack_require__(12);

var _widgetMixinState2 = _interopRequireDefault(_widgetMixinState);

var _widgetMixinOptions = __webpack_require__(13);

var _widgetMixinOptions2 = _interopRequireDefault(_widgetMixinOptions);

var _widgetMixinObserver = __webpack_require__(14);

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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _audioModule = __webpack_require__(2);

var _audioModule2 = _interopRequireDefault(_audioModule);

var _verifyAudioContextFeatures = __webpack_require__(8);

var _verifyAudioContextFeatures2 = _interopRequireDefault(_verifyAudioContextFeatures);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
  function ChannelStrip(audioCtx, o) {
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

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A collection of static utility methods for Audio Modules
 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _audioModule = __webpack_require__(2);

var _audioModule2 = _interopRequireDefault(_audioModule);

var _verifyAudioContextFeatures = __webpack_require__(8);

var _verifyAudioContextFeatures2 = _interopRequireDefault(_verifyAudioContextFeatures);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representing an Envelope.
 * An envelope controls the evolution of the amplitude of a audio signal over time.
 * The Envelope class defines an envelope with attack and release of an arbitrary number of points
 * (as opposed to, for example, an ADSR envelope, which has 1 point each for attack, decay, and release).
 * This envelope will follow the attack path and sustain until release is triggered, at which point 
 * it will floow the specified release path.
 * Attack and release paths are specified as 2D arrays in the form
 * [ [t(0), a(0)], [t(1), a(1)], ... [t(i), a(i)] ],
 * where t(i) specifies the time, in seconds,
 * and a(i) specifies the amplitude of the envelope at the vertex i.
 * @class
 */
var Envelope = function (_AudioModule) {
  _inherits(Envelope, _AudioModule);

  /**
   * @constructor
   * @param {AudioContext} audioCtx
   * @param {object} o - Options.
   * @param {array} [o.attackEnvelope] - 2D array specifying the attack envelope.
   * @param {array} [o.releaseEnvelope] - 2D array specifying the release envelope.
   */
  function Envelope(audioCtx, o) {
    _classCallCheck(this, Envelope);

    return _possibleConstructorReturn(this, (Envelope.__proto__ || Object.getPrototypeOf(Envelope)).call(this, audioCtx));
  }

  /* ============================================================================================= */
  /*  INITIALIZATION METHODS
  /* ============================================================================================= */

  /**
   * Initialize audio components and their connections.
   * @private @override
   */


  _createClass(Envelope, [{
    key: "_initAudioComponents",
    value: function _initAudioComponents() {
      var _this = this;

      try {
        (0, _verifyAudioContextFeatures2.default)(_this.audioCtx, ["Gain"]);

        this.audioComponents = {
          envGain: _this.audioCtx.createGain()
        };

        _this.audioComponents.envGain.gain.value = 0;
        _this.input.connect(_this.audioComponents.envGain);
        _this.audioComponents.envGain.connect(_this.output);
      } catch (err) {
        console.error(err);
      }
    }

    /**
     * Initialize options.
     * @private @override
     */

  }, {
    key: "_initOptions",
    value: function _initOptions(o) {

      this.o = {
        attackEnvelope: [[0, 0], [0.05, 1], [1, 1]],
        releaseEnvelope: [[0, 1], [0.5, 1], [1, 0]]
      };

      _get(Envelope.prototype.__proto__ || Object.getPrototypeOf(Envelope.prototype), "_initOptions", this).call(this, o);
    }

    /* ============================================================================================= */
    /*  GETTERS AND SETTERS
    /* ============================================================================================= */

    /**
     * Get the attack envelope.
     * @returns {array} - 2D array representing the attack envelope.
     */

  }, {
    key: "getAttackEnvelope",
    value: function getAttackEnvelope() {
      return this.o.attackEnvelope;
    }

    /**
     * Set the attack envelope.
     * @param {array} newEnv - A 2D array representing the new envelope, where each value is of the
     *                         form [t, a] where t is time in seconds, and a is amplitude in the range
     *                         [0. - 1.]
     * @returns {this} - A reference to the current envelope object for chaining.
     */

  }, {
    key: "setAttackEnvelope",
    value: function setAttackEnvelope(newEnv) {
      this.o.attackEnvelope = newEnv;
      return this;
    }

    /**
     * Get the release envelope.
     * @returns {array} - 2D array representing the release envelope.
     */

  }, {
    key: "getReleaseEnvelope",
    value: function getReleaseEnvelope() {
      return this.o.releaseEnvelope;
    }

    /**
     * Set the release envelope.
     * @param {array} newEnv - A 2D array representing the new envelope, where each value is of the
     *                         form [t, a] where t is time in seconds, and a is amplitude in the range
     *                         [0. - 1.] 
     * @returns {this} - A reference to the current envelope object for chaining.
     */

  }, {
    key: "setReleaseEnvelope",
    value: function setReleaseEnvelope(newEnv) {
      this.o.releaseEnvelope = newEnv;
      return this;
    }

    /* ============================================================================================= */
    /*  PUTLIC API
    /* ============================================================================================= */

    /**
     * Execute the attack envelope.
     * @returns {Promise} - Promise that returns the envelope when the envelope expires.
     */

  }, {
    key: "attack",
    value: function attack() {
      console.log(this.o.attackEnvelope);

      var startTime = this.audioCtx.currentTime;
      var env = this.o.attackEnvelope;
      var a0 = 0;
      var t0 = startTime;
      var a1 = env[1][1];
      var t1 = startTime + env[0][0];

      // cancel scheduled values in case another change is occuring
      this.audioComponents.envGain.gain.cancelScheduledValues(startTime);

      this.audioComponents.envGain.gain.setValueAtTime(0, t0);
      this.audioComponents.envGain.gain.linearRampToValueAtTime(a1, t1);

      // ramp to each subsequent value
      for (var i = 1; i < env.length - 1; i++) {
        a0 = env[i][1];
        t0 = startTime + env[i][0];
        a1 = env[i + 1][1];
        t1 = startTime + env[i + 1][0];

        this.audioComponents.envGain.gain.setValueAtTime(a0, t0);
        this.audioComponents.envGain.gain.linearRampToValueAtTime(a1, t1);
      }

      // set the final value
      a0 = env[env.length - 1][1];
      t0 = startTime + env[env.length - 1][0];
      this.audioComponents.envGain.gain.setValueAtTime(a0, t0);

      return new Promise(function (resolve, reject) {
        window.setTimeout(function () {
          resolve(env);
        }, env[env.length - 1][0] * 1000);
      });
    }

    /**
     * Execute the release envelope.
     * @returns {Promise} - Promise that returns the envelope when the envelope expires.
     */

  }, {
    key: "release",
    value: function release() {
      var startTime = this.audioCtx.currentTime;
      var env = this.o.releaseEnvelope;
      var a0 = 0;
      var t0 = startTime;
      var a1 = env[0][1];
      var t1 = startTime + env[0][0];

      // cancel scheduled values in case attack is still happening
      this.audioComponents.envGain.gain.cancelScheduledValues(startTime);

      // ramp to each subsequent value
      for (var i = 0; i < env.length - 1; i++) {
        a0 = env[i][1];
        t0 = startTime + env[i][0];
        a1 = env[i + 1][1];
        t1 = startTime + env[i + 1][0];

        this.audioComponents.envGain.gain.setValueAtTime(a0, t0);
        this.audioComponents.envGain.gain.linearRampToValueAtTime(a1, t1);
      }

      // if the gain value at the end is not 0, ramp it down to 0 in 1ms
      if (env[env.length - 1][1] !== 0) {
        a0 = 0;
        t0 = startTime + env[env.length - 1][0] + 0.001;

        this.audioComponents.envGain.gain.linearRampToValueAtTime(a0, t0);
      }

      return new Promise(function (resolve, reject) {
        window.setTimeout(function () {
          resolve(env);
        }, env[env.length - 1][0] * 1000);
      });
    }
  }]);

  return Envelope;
}(_audioModule2.default);

exports.default = Envelope;

/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Verifies that the given audio context has the requested features and attempts to shim features that are
 * missing.
 * @param {AudioContext} audioCtx - The Audio Context to check.
 * @param {array} features - Array of features to detect, listed as strings (i.e. "Gain", "Oscillator", "Analyser", etc.) 
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
/* 9 */
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

  // flag marking the webAudioConnect feature as shimmed
  audioCtx.isWebAudioConnectShimmed = true;
}

exports.default = shimWebAudioConnect;

/***/ }),
/* 10 */,
/* 11 */
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
/* 12 */
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
/* 13 */
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
/* 14 */
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
   * Alias for addObserver. Registers a listener (observer) function.
   * @param {function} newListener - The new listener (observer) function to be notified every time the state changes.
   * @return {boolean} isChanged - Indicates whether an observer was added.
   */
  addListener: function addListener(newListener) {
    this.addObserver(newListener);
  },

  /**
   * Alias for removeObserver. Removes a listener (observer) function.
   * @param {function} targetListener - The listener (observer) function to be removed.
   * @return {boolean} isChanged - Indicates whether an observer has been removed
   */
  removeListener: function removeListener(targetListener) {
    this.removeObserver(targetListener);
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _audioPatch = __webpack_require__(16);

var _audioPatch2 = _interopRequireDefault(_audioPatch);

var _util = __webpack_require__(5);

var _util2 = _interopRequireDefault(_util);

var _shimWebAudioConnect = __webpack_require__(9);

var _shimWebAudioConnect2 = _interopRequireDefault(_shimWebAudioConnect);

var _AdditiveSynth = __webpack_require__(17);

var _AdditiveSynth2 = _interopRequireDefault(_AdditiveSynth);

var _channelStrip = __webpack_require__(4);

var _channelStrip2 = _interopRequireDefault(_channelStrip);

var _envelope = __webpack_require__(6);

var _envelope2 = _interopRequireDefault(_envelope);

var _StereoFeedbackDelay = __webpack_require__(21);

var _StereoFeedbackDelay2 = _interopRequireDefault(_StereoFeedbackDelay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class representing an Audio Module Manager.
 * Audio Module Managers facilitate creating and managing Audio Patches.
 * @class
 */
var AudioModuleManager = function () {

  /**
   * @constructor
   * @param {AudioContext} [audioCtx] - The Audio Context to use. If this argument is not provided,
   *                                    a new Audio Context will be created and associated with this
   *                                    Audio Module Manager.
   */
  function AudioModuleManager(audioCtx) {
    _classCallCheck(this, AudioModuleManager);

    this.AUDIO_CTX = typeof audioCtx === "undefined" ? new AudioContext() : audioCtx;

    // Shim the WebAudio connect and disconnect methods so that we can connect and
    // disconnect AudioModules the same way as WebAudio AudioNodes and use AudioNodes
    // interchangably with AudioModules
    (0, _shimWebAudioConnect2.default)(this.AUDIO_CTX);

    this.destination = this.AUDIO_CTX.destination;
  }

  /**
   * Return the Audio Context associated with this Module Manager.
   * @returns {AudioContext} - The Audio Context associated with this Module Manager.
   */


  _createClass(AudioModuleManager, [{
    key: 'getContext',
    value: function getContext() {
      return this.AUDIO_CTX;
    }

    /**
    * Return the Audio Context destination associated with with this Module Manager.
    * @returns {AudioNode} - The audio destination node associated with this Module Manager.
    */

  }, {
    key: 'getDestination',
    value: function getDestination() {
      return this.AUDIO_CTX.destination;
    }

    /**
     * An audio patch is a collection of connected audio modules that form a meaningful unit
     * @param {object} initObj - An object specifying the initialization parameters,
     *                            containing two properties: modules, and connectionPaths
     * @param {object} initObj.modules - An object representing the named audio modules used in this patch
     * @param {array} initObj.connectionPaths - An 2D array of strings, where each string represents the name of
     *                              an Audio Module (matching the way it is named in the 'modules' object),
     *                              and the sequence of these names represents an audio path.
     *                              For example, the following is one possibility:
     *                                [["synth1", "delay", "reverb", "output"],
     *                                ["synth2", "reverb"]]
     *                              This connection specifies two connection paths:
     *                                synth1 -> delay -> reverb -> output
     *                              And the second, where synth2 is connected to the same reverb used
     *                              in the first paths
     *                                synth2 -> reverb -> output
     *                              Note that since the reverb is already connected to the output by the
     *                              first path, it does not need to be redundantly connected in the second path
     * @return {object} moduleMapObj - an object used as a map where keys are strings used to name each module,
     *                                 and values are the module objects themselves
     */

  }, {
    key: 'createAudioPatch',
    value: function createAudioPatch(initObj) {
      var _this = this;

      initObj = initObj || {};

      // moduleMap will store the modules created keyed by the names given to them
      // keys are arbitrary strings used as names for each module
      // values are the module objects themselves
      var moduleMapObj = {};

      try {
        // try to create the modules requested in the initObj and store them in moduleMapObj
        if (_typeof(initObj.modules) !== "object") throw "Exception in initAudioPatch: no audio modules provided in initiation object";

        Object.keys(initObj.modules).forEach(function (audioModuleName) {
          var audioModuleSpec = initObj.modules[audioModuleName];

          // if the audio module type is specified as a string, create the corresponding modules
          if (typeof audioModuleSpec === "string") {
            // placeholder to use when creating the new module
            var newAudioModule = null;

            // use name in lowercase with whitespace removed
            switch (audioModuleSpec.toLowerCase().replace(/\W+/g, "")) {
              case "channelstrip":
                newAudioModule = _this.createChannelStrip();
                break;
              case "destination":
                newAudioModule = _this.createDestination();
                break;
              case "envelope":
                newAudioModule = _this.createBiquadFilter();
                break;
              case "additivesynth":
                newAudioModule = _this.createAdditiveSynth();
                break;
              case "stereofeedbackdelay":
              case "delay":
                newAudioModule = _this.createStereoFeedbackDelay();
                break;
              case "biquadfilter":
              case "filter":
                newAudioModule = _this.createBiquadFilter();
                break;
              default:
                throw "Exception in initAudioPatch: no such module " + audioModuleSpec;
                break;
            }

            moduleMapObj[audioModuleName] = newAudioModule;
          }
        });

        // try to connect the modules
        if (_typeof(initObj.connections) === "object" && Array.isArray(initObj.connections)) {
          initObj.connections.forEach(function (connectionPath) {
            for (var i = 0; i < connectionPath.length - 1; i++) {
              var currentModule = moduleMapObj[connectionPath[i]];
              var nextModule = moduleMapObj[connectionPath[i + 1]];
              currentModule.connect(nextModule);
            }
          });
        }
      } catch (e) {
        console.log(e);
        moduleMapObj = null;
      }

      return new _audioPatch2.default(moduleMapObj, _this.AUDIO_CTX, _this);
    }

    /**
     * Create an Additive Synth Audio Module
     */

  }, {
    key: 'createAdditiveSynth',
    value: function createAdditiveSynth(o) {
      o = o || {};
      return new _AdditiveSynth2.default(this.AUDIO_CTX, o);
    }

    /**
     * Create a Biquad Filter Audio Module
     */

  }, {
    key: 'createBiquadFilter',
    value: function createBiquadFilter() {
      return this.AUDIO_CTX.createBiquadFilter();
    }

    /**
     * Create an Oscillator
     */

  }, {
    key: 'createOscillator',
    value: function createOscillator() {
      return this.AUDIO_CTX.createOscillator();
    }

    /**
     * Create an Oscillator
     */

  }, {
    key: 'createGain',
    value: function createGain() {
      return this.AUDIO_CTX.createGain();
    }

    /**
     * Create a Channel Strip Audio Module
     */

  }, {
    key: 'createChannelStrip',
    value: function createChannelStrip(o) {
      o = o || {};
      return new _channelStrip2.default(this.AUDIO_CTX, o);
    }

    /**
     * Create a destination node
     */

  }, {
    key: 'createDestination',
    value: function createDestination() {
      return this.AUDIO_CTX.destination;
    }

    /**
     * Create an Envelope Audio Module
     */

  }, {
    key: 'createEnvelope',
    value: function createEnvelope(o) {
      o = o || {};
      return new _envelope2.default(this.AUDIO_CTX, o);
    }

    /**
     * Create a Stereo Feedback Delay Audio Module
     */

  }, {
    key: 'createStereoFeedbackDelay',
    value: function createStereoFeedbackDelay(o) {
      o = o || {};
      return new _StereoFeedbackDelay2.default(this.AUDIO_CTX, o);
    }
  }]);

  return AudioModuleManager;
}();

exports.default = AudioModuleManager;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class representing an Audio Patch created by an Audio Module Manager.
 * @class 
 */
var AudioPatch = function () {

  /**
   * @constructor
   * @param {Object} moduleMap
   * @param {AudioContext} audioCtx
   * @param {AudioModuleManager} audioModuleManager
   */
  function AudioPatch(moduleMap, audioCtx, audioModuleManager) {
    _classCallCheck(this, AudioPatch);

    this.MODULE_MAP = moduleMap;
    this.AUDIO_CTX = audioCtx;
    this.AUDIO_MODULE_MANAGER = audioModuleManager;

    // a more consise alias
    this.modules = this.MODULE_MAP;
  }

  /**
   * Returns the Audio Context
   * @returns {AudioContext}
   */


  _createClass(AudioPatch, [{
    key: "getAudioContext",
    value: function getAudioContext() {
      return this.AUDIO_CTX;
    }

    /**
     * Alias for {getAudioContext}.
     * @returns {AudioContext}
     */

  }, {
    key: "getAudioCtx",
    value: function getAudioCtx() {
      return this.getAudioContext();
    }

    /**
     * Returns the module map.
     * @returns {object} - Object representing the module map.
     */

  }, {
    key: "getModuleMap",
    value: function getModuleMap() {
      return this.MODULE_MAP;
    }

    /**
     * Alias for {getModuleMap}. Returns the module map.
     * @returns {object} - Object representing the module map.
     */

  }, {
    key: "modules",
    value: function modules() {
      return this.MODULE_MAP;
    }

    /**
     * Returns the Audio Module Manager associated with this patch.
     * @returns {AudioModuleManager} - The Audio Module Manager associated with this patch.
     */

  }, {
    key: "getAudioModuleManager",
    value: function getAudioModuleManager() {
      return this.AUDIO_MODULE_MANAGER;
    }
  }]);

  return AudioPatch;
}();

exports.default = AudioPatch;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AdditiveSynthVoice = __webpack_require__(18);

var _AdditiveSynthVoice2 = _interopRequireDefault(_AdditiveSynthVoice);

var _channelStrip = __webpack_require__(4);

var _channelStrip2 = _interopRequireDefault(_channelStrip);

var _util = __webpack_require__(5);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AdditiveSynth = function () {
  function AdditiveSynth(audioCtx, o) {
    _classCallCheck(this, AdditiveSynth);

    o = o || {};

    this._audioCtx = audioCtx;

    var numVoices = o.numVoices || 16;
    this._numOvertones = o.numOvertones || 20;

    this._voices = [];
    this._availableVoices = [];
    this._busyVoices = []; // { voiceNum: {number}, pitch: {number} }
    this._channelStrip = new _channelStrip2.default(this._audioCtx);

    for (var i = 0; i < numVoices; i++) {
      this._voices.push(new _AdditiveSynthVoice2.default(this._audioCtx, { numOvertones: this._numOvertones }));
      this._voices[i].connect(this._channelStrip.input);
      this._availableVoices.push(i);
    }

    this.output = this._channelStrip.output;
    this._audioModuleOutput = this.output;
  }

  /* =================== */
  /* --- Audio setup --- */
  /* =================== */

  /**
   * Connect to another AudioNode or AudioModule
   */


  _createClass(AdditiveSynth, [{
    key: 'connect',
    value: function connect(destination) {
      // if destination has an input property, connect to it (destination is an AudioModule)
      if (_typeof(destination.input) === "object") {
        this.output.connect(destination.input);
      }
      // else destination is an AudioNode and can be connected to directly
      else {
          this.output.connect(destination);
        }
    }

    /**
     * Disconnect from an AudioNode or AudioModule
     */

  }, {
    key: 'disconnect',
    value: function disconnect(destination) {
      // if destination has an input property, disconnect from it (destination is an AudioModule)
      if (_typeof(destination.input) === "object") {
        this.output.disconnect(destination.input);
        // else destination is an AudioNode and can be disconnected from directly
      } else {
        this.output.disconnect(destination);
      }
    }

    /* =========================================================================================== */
    /* GETTERS AND SETTERS                                                                         */
    /* =========================================================================================== */

    /** Number of voices */

  }, {
    key: 'setNumVoices',
    value: function setNumVoices(newNumVoices) {
      this.numVoices = newNumVoices;
    }

    /** Number of overtones */

  }, {
    key: 'setNumOvertones',
    value: function setNumOvertones(newNumOvertones) {
      this.numOvertones = newNumOvertones;
    }

    /** Gain */

  }, {
    key: 'setGain',
    value: function setGain(newGain) {
      this.gain = newGain;
    }

    /** Pan */

  }, {
    key: 'setPan',
    value: function setPan(newPan) {
      this.pan = newPan;
    }

    /** Get overtone amplitude */

  }, {
    key: 'getOvertoneAmplitude',
    value: function getOvertoneAmplitude(voiceNum, otNum) {
      this._voices[voiceNum].getOvertoneAmplitude(otNum);
      return this;
    }

    /** Overtone amplitude */

  }, {
    key: 'setOvertoneAmplitude',
    value: function setOvertoneAmplitude(voiceNum, otNum, newAmp) {
      this._voices[voiceNum].setOvertoneAmplitude(otNum, newAmp);
      return this;
    }

    /* ========================= */
    /* --- Envelope controls --- */
    /* ========================= */

    /** Attack envelope */

  }, {
    key: 'setOvertoneAttackEnvelope',


    /** Set the attack envelope for an overtone
     *  @param {number} otNum - Number of overtone for which to set envelope
     *  @param {array} newEnv - 2D array representing the new envelope
     */
    value: function setOvertoneAttackEnvelope(otNum, newEnv) {
      this._voices.forEach(function (voice) {
        voice.setOvertoneAttackEnvelope(otNum, newEnv);
      });
      return this;
    }

    /** Set the release envelope for an overtone
     *  @param {number} otNum - Number of overtone for which to set envelope
     *  @param {array} newEnv - 2D array representing the new envelope
     */

  }, {
    key: 'setOvertoneReleaseEnvelope',
    value: function setOvertoneReleaseEnvelope(otNum, newEnv) {
      this._voices.forEach(function (voice) {
        voice.setOvertoneReleaseEnvelope(otNum, newEnv);
      });
      return this;
    }

    /**
     * Play a note using the current attack envelope
     * @param {(number|string)} note - MIDI pitch value or note name (i.e. A0 or F#8)
     */

  }, {
    key: 'playNote',
    value: function playNote(note) {
      var noteNameFormat = /^([a-g]|[A-G])(#|b)?([0-9]|10)$/;
      var selectedVoice = -1;
      var freq = -1;

      // check for correct note format and convert to freq
      if (typeof note === 'number' && note >= 0 && note <= 127) {
        freq = _util2.default.midiToFreq(note);
      } else if (typeof note === 'string' && noteNameFormat.test(note) === true) {
        note = _util2.default.noteNameToMidi(note); // convert to MIDI so we can keep track of active note in _busyVoices
        freq = _util2.default.midiToFreq(note);
      }

      // if the correct format for note was received
      if (freq !== -1) {
        //pick a voice
        if (this._availableVoices.length > 0) {
          selectedVoice = this._availableVoices.shift();
        } else {
          selectedVoice = this._busyVoices.shift().voiceNum;
          this.releaseVoice(selectedVoice);
        }
        this._busyVoices.push({ voiceNum: selectedVoice, note: note });

        this.attackVoice(selectedVoice, freq);
      }
    }

    /**
     * Release a currently playing note
     * @param {(number|string)} note - MIDI pitch value or note name (i.e. A0 or F#8)
     */

  }, {
    key: 'releaseNote',
    value: function releaseNote(note) {
      var noteNameFormat = /^([a-g]|[A-G])(#|b)?([0-9]|10)$/;
      var selectedVoice = -1;

      // check for correct note format and convert to freq
      if (typeof note === 'number' && note >= 0 && note <= 127) {} else if (typeof note === 'string' && noteNameFormat.test(note) === true) {
        note = _util2.default.noteNameToMidi(note);
      } else {
        note = -1;
      }

      if (note !== -1) {
        var selectedBusyNodeIndex = this._busyVoices.findIndex(function (busyVoice) {
          return busyVoice.note === note;
        });

        if (selectedBusyNodeIndex !== -1) {
          selectedVoice = this._busyVoices[selectedBusyNodeIndex].voiceNum;

          this._availableVoices.push(selectedVoice);
          this._busyVoices.splice(selectedBusyNodeIndex, 1);
        }
      }

      if (selectedVoice !== -1) {
        this.releaseVoice(selectedVoice);
      } else return this;
    }

    /**
     * Execute the attack for a given voice with a given frequency
     **/

  }, {
    key: 'attackVoice',
    value: function attackVoice(voiceNum, freq) {
      this._voices[voiceNum].setFrequency(freq);
      this._voices[voiceNum].attack();
    }

    /**
     * Execute the release for a given voice
     **/

  }, {
    key: 'releaseVoice',
    value: function releaseVoice(voiceNum) {
      this._voices[voiceNum].release();
    }
  }, {
    key: 'numVoices',
    get: function get() {
      return this._voices.length;
    },
    set: function set(newNumVoices) {
      var _this = this;

      // if the new number of voices is more than previous number, we add voices
      if (newNumVoices > this.numVoices) {
        for (var i = this.numVoices; i < newNumVoices; i++) {
          this._voices.push(new _AdditiveSynthVoice2.default(this._audioCtx, { numOvertones: this._numOvertones }));
          this._voices[i].connect(this._channelStrip.input);
          this._availableVoices.push(i);
        }

        // if the new number is less than previous, remove voices
      } else if (newNumVoices < this.numVoices) {
        var _deleteAvailableVoices = function _deleteAvailableVoices(numVoicesToDelete) {
          var _loop = function _loop(_i) {
            var voiceToDelete = _this._availableVoices[_i];

            _this._voices.splice(voiceToDelete, 1);
            _this._availableVoices.splice(_i, 1);

            // remap the available and busy voices because we modified the voices stack
            _this._availableVoices = _this._availableVoices.map(function (voice) {
              return voice > voiceToDelete ? voice - 1 : voice;
            });
            _this._busyVoices = _this._busyVoices.map(function (voice) {
              return {
                voiceNum: voice.voiceNum > voiceToDelete ? voice.voiceNum - 1 : voice.voiceNum,
                pitch: voice.pitch
              };
            });
          };

          for (var _i = 0; _i < numVoicesToDelete; _i++) {
            _loop(_i);
          }
        };

        var _deleteBusyVoices = function _deleteBusyVoices(numBusyVoicesToDelete) {
          var _loop2 = function _loop2(_i2) {
            var voiceToDelete = _this._busyVoices[_i2].voiceNum;

            _this.releaseVoice(voiceToDelete);
            _this._voices.splice(voiceToDelete, 1);
            _this._busyVoices.splice(_i2, 1);

            // remap the busy voices pointer stack because we modified the voices stack
            _this._busyVoices = _this._busyVoices.map(function (voice) {
              return {
                voiceNum: voice.voiceNum > voiceToDelete ? voice.voiceNum - 1 : voice.voiceNum,
                pitch: voice.pitch
              };
            });
          };

          // delete the required number of busy voices
          for (var _i2 = 0; _i2 < numBusyVoicesToDelete; _i2++) {
            _loop2(_i2);
          }
        };

        var numVoicesToDelete = this.numVoices - newNumVoices;
        var numAvailableVoices = this._availableVoices.length;

        // if the number of voices to delete is less then or equal to the number of available (inactive) voices, delete these voices
        if (numVoicesToDelete <= numAvailableVoices) {
          _deleteAvailableVoices(numVoicesToDelete);
        }

        // else delete all available (inactive) voices and also required number of busy voices
        else {
            var numBusyVoicesToDelete = numVoicesToDelete - numAvailableVoices;

            _deleteAvailableVoices(numAvailableVoices);
            _deleteBusyVoices(numBusyVoicesToDelete);
          }
      }
      console.log('newNumVoices: ' + this.numVoices);
      return this;
    }
  }, {
    key: 'numOvertones',
    get: function get() {
      return this._numOvertones;
    },
    set: function set(newNumOvertones) {
      this._voices.forEach(function (voice) {
        voice.numOvertones = newNumOvertones;
      });
      this._numOvertones = newNumOvertones;
      return this;
    }
  }, {
    key: 'gain',
    get: function get() {
      return this._channelStrip.outputGain;
    },
    set: function set(newGain) {
      this._channelStrip.outputGain = newGain;
      return this;
    }
  }, {
    key: 'pan',
    get: function get() {
      return this._channelStrip.pan;
    },
    set: function set(newPan) {
      this._channelStrip.pan = newPan;
      return this;
    }
  }, {
    key: 'attackEnvelope',
    set: function set(newEnv) {
      this._voices.forEach(function (voice) {
        voice.attackEnvelope = newEnv;
      });
    }

    /** Release envelope */

  }, {
    key: 'releaseEnvelope',
    set: function set(newEnv) {
      this._voices.forEach(function (voice) {
        voice.releaseEnvelope = newEnv;
      });
    }
  }]);

  return AdditiveSynth;
}();

exports.default = AdditiveSynth;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _channelStrip = __webpack_require__(4);

var _channelStrip2 = _interopRequireDefault(_channelStrip);

var _envelope = __webpack_require__(6);

var _envelope2 = _interopRequireDefault(_envelope);

var _Overtone = __webpack_require__(20);

var _Overtone2 = _interopRequireDefault(_Overtone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AdditiveSynthVoice = function () {
  function AdditiveSynthVoice(audioCtx, o) {
    _classCallCheck(this, AdditiveSynthVoice);

    o = o || {};

    this._audioCtx = audioCtx;

    this._channelStrip = new _channelStrip2.default(this._audioCtx);
    this._envelope = new _envelope2.default(this._audioCtx);

    var numOvertones = o.numOvertones || o.numberOfOvertones || 20;
    this._overtones = [];
    for (var i = 0; i < numOvertones; i++) {
      this._overtones.push(new _Overtone2.default(this._audioCtx));
      this._overtones[i].connect(this._envelope.input);
      this._envelope.connect(this._channelStrip.input);
      this._overtones[i].gain = 1 / numOvertones;
    }

    this.output = this._channelStrip.output;
    this._audioModuleOutput = this.output;

    // this.frequency = o.frequency || o.freq || 440;
    // this.pan = o.pan || 0; // -1: hard left, 1: hard right
    // this.gain = o.gain || 1;
  }

  /* =================== */
  /* --- Audio setup --- */
  /* =================== */

  /**
   * Connect to another AudioNode or AudioModule
   */


  _createClass(AdditiveSynthVoice, [{
    key: 'connect',
    value: function connect(destination) {
      // if destination has an input property, connect to it (destination is an AudioModule)
      if (_typeof(destination.input) === "object") {
        this.output.connect(destination.input);
      }
      // else destination is an AudioNode and can be connected to directly
      else {
          this.output.connect(destination);
        }
    }

    /**
     * Disconnect from an AudioNode or AudioModule
     */

  }, {
    key: 'disconnect',
    value: function disconnect(destination) {
      // if destination has an input property, disconnect from it (destination is an AudioModule)
      if (_typeof(destination.input) === "object") {
        this.output.disconnect(destination.input);
        // else destination is an AudioNode and can be disconnected from directly
      } else {
        this.output.disconnect(destination);
      }
    }

    /* =========================== */
    /* --- Getters and setters --- */
    /* =========================== */

    /** Options */

  }, {
    key: 'setOptions',
    value: function setOptions(o) {
      o = o || {};
      this.options = o;
    }

    /** Number of overtones (including the fundamental) */

  }, {
    key: 'setNumOvertones',
    value: function setNumOvertones(newNumOvertones) {
      this.numOvertones = newNumOvertones;
    }

    /** Fundamental frequency */

  }, {
    key: 'setFrequency',
    value: function setFrequency(newFreq) {
      this.frequency = newFreq;
    }

    /** Gain */

  }, {
    key: 'setGain',
    value: function setGain(newGain) {
      this.gain = newGain;
    }

    /** Pan */

  }, {
    key: 'setPan',
    value: function setPan(newPan) {
      this.pan = newPan;
    }

    /** Get overtone amplitude
     * @param {number} otNum - Overtone number (0 for the fundamental).
     */

  }, {
    key: 'getOvertoneAmplitude',
    value: function getOvertoneAmplitude(otNum) {
      return this._overtones[otNum].amplitude;
    }
    /** Set overtone amplitude
     * @param {number} otNum - Overtone number (0 for the fundamental).
     * @param {number} newAmp - New amplitude (useful range: 0.0 - 1.0).
     */

  }, {
    key: 'setOvertoneAmplitude',
    value: function setOvertoneAmplitude(otNum, newAmp) {
      var _this = this;

      try {
        if (this._overtones[otNum] !== undefined) {
          this._overtones[otNum].amplitude = newAmp;
        } else {
          throw "Illegal overtone number";
        }
      } catch (e) {
        console.log(e);
      }

      return this;
    }

    /** Set overtone amplitudes by a formula function
     * @param {function} func - The function specifying the amplitude of each overtone number n.
     */

  }, {
    key: 'setOvertoneAmplitudesByFormula',
    value: function setOvertoneAmplitudesByFormula(func) {
      for (var n = this.numOvertones - 1; n >= 0; n--) {
        this.setOvertoneAmplitude(n, func(n + 1));
      }
      return this;
    }

    /** Attack envelope */

  }, {
    key: 'setAttackEnvelope',
    value: function setAttackEnvelope(newEnv) {
      this.attackEnvelope = newEnv;
    }

    /** Release envelope */

  }, {
    key: 'setReleaseEnvelope',
    value: function setReleaseEnvelope(newEnv) {
      this.releaseEnvelope = newEnv;
    }

    /** Set the attack envelope for an overtone
     *  @param {number} otNum - Number of overtone for which to set envelope
     *  @param {array} newEnv - 2D array representing the new envelope
     */

  }, {
    key: 'setOvertoneAttackEnvelope',
    value: function setOvertoneAttackEnvelope(otNum, newEnv) {
      this._overtones[otNum].attackEnvelope = newEnv;
      return this;
    }

    /** Set the release envelope for an overtone
     *  @param {number} otNum - Number of overtone for which to set envelope
     *  @param {array} newEnv - 2D array representing the new envelope
     */

  }, {
    key: 'setOvertoneReleaseEnvelope',
    value: function setOvertoneReleaseEnvelope(otNum, newEnv) {
      this._overtones[otNum].releaseEnvelope = newEnv;
      return this;
    }

    /* ========================= */
    /* --- Envelope controls --- */
    /* ========================= */

    /**
     * Execute the attack envelope.
     * Individual envelopes are executed for each overtone, and the envelope for this voice is executed.
     */

  }, {
    key: 'attack',
    value: function attack(o) {
      if (o) this.options = o;

      for (var i = this.numOvertones - 1; i >= 0; i--) {
        this._overtones[i].attack();
      }
      this._envelope.attack();
    }

    /**
     * Execute the release envelope
     * Individual envelopes are executed for each overtone, and the envelope for this voice is executed.
     */

  }, {
    key: 'release',
    value: function release() {
      for (var i = this.numOvertones - 1; i >= 0; i--) {
        this._overtones[i].release();
      }
      this._envelope.release();
    }
  }, {
    key: 'options',
    get: function get() {
      return {
        numOvertones: this.numOvertones,
        frequency: this.frequency,
        gain: this.gain,
        pan: this.pan
      };
    },
    set: function set(o) {
      o = o || {};

      if (o.numOvertones) this.numOvertones = o.numOvertones;
      if (o.frequency) this.frequency = o.frequency;
      if (o.gain) this.gain = o.gain;
      if (o.pan) this.pan = o.pan;

      return this;
    }
  }, {
    key: 'numOvertones',
    get: function get() {
      return this._overtones.length;
    },
    set: function set(newNumOvertones) {
      if (newNumOvertones > this.numOvertones) {
        var fundFreq = this.frequency;
        for (var i = this.numOvertones; i < newNumOvertones && (i + 1) * fundFreq < this._audioCtx.sampleRate / 2; i++) {
          this._overtones.push(new _Overtone2.default(this._audioCtx));
          this._overtones[i].frequency = (i + 1) * fundFreq;
          this._overtones[i].gain = 1 / newNumOvertones;
        }
      } else if (newNumOvertones < this.numOvertones) {
        for (var i = this.numOvertones; i > this.newNumOvertones; i--) {
          this._overtones.pop();
          this._overtones[i].gain = 1 / newNumOvertones;
        }
      }
      return this;
    }
  }, {
    key: 'frequency',
    get: function get() {
      return this._overtones[0].frequency;
    },
    set: function set(newFreq) {
      var freqCeil = this._audioCtx.sampleRate / 2;
      var numOvertones = this.numOvertones;

      for (var i = this.numOvertones - 1; i >= 0; i--) {
        if ((i + 1) * newFreq < freqCeil) {
          this._overtones[i].frequency = (i + 1) * newFreq;
          this._overtones[i].gain = 1 / numOvertones;
        } else {
          this._overtones[i].gain = 0;
        }
      }
      return this;
    }
  }, {
    key: 'gain',
    get: function get() {
      return this._channelStrip.outputGain;
    },
    set: function set(newGain) {
      this._channelStrip.outputGain = newGain;
      return this;
    }
  }, {
    key: 'pan',
    get: function get() {
      return this._channelStrip.pan;
    },
    set: function set(newPan) {
      this._channelStrip.pan = newPan;
      return this;
    }
  }, {
    key: 'attackEnvelope',
    get: function get() {
      return this._envelope.attackEnvelope;
    },
    set: function set(newEnv) {
      this._envelope.attackEnvelope = newEnv;
      return this;
    }
  }, {
    key: 'releaseEnvelope',
    get: function get() {
      return this._envelope.releaseEnvelope;
    },
    set: function set(newEnv) {
      this._envelope.releaseEnvelope = newEnv;
      return this;
    }
  }]);

  return AdditiveSynthVoice;
}();

exports.default = AdditiveSynthVoice;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Mixin for methods related to options
 * @mixin
 */
var AudioModuleOptionsMixin = {

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

exports.default = AudioModuleOptionsMixin;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _audioModule = __webpack_require__(2);

var _audioModule2 = _interopRequireDefault(_audioModule);

var _channelStrip = __webpack_require__(4);

var _channelStrip2 = _interopRequireDefault(_channelStrip);

var _envelope = __webpack_require__(6);

var _envelope2 = _interopRequireDefault(_envelope);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 
 */
var Oscillator = function (_AudioModule) {
  _inherits(Oscillator, _AudioModule);

  function Oscillator(audioCtx, o) {
    _classCallCheck(this, Oscillator);

    var _this = _possibleConstructorReturn(this, (Oscillator.__proto__ || Object.getPrototypeOf(Oscillator)).call(this, audioCtx));

    o = o || {};

    _this._audioCtx = audioCtx;

    _this._oscillator = _this._audioCtx.createOscillator();
    _this._envelope = new _envelope2.default(_this._audioCtx);
    _this._channelStrip = new _channelStrip2.default(_this._audioCtx);

    _this._oscillator.connect(_this._envelope.input);
    _this._envelope.connect(_this._channelStrip.input);

    _this._oscillator.start();

    _this.output = _this._channelStrip.output;
    _this._audioModuleOutput = _this.output;

    // this.frequency = o.frequency || 440;
    // this.pan = o.pan || 1;
    // this.amplitude = o.amplitude || 1;
    return _this;
  }

  /* =========================== */
  /* --- Getters and setters --- */
  /* =========================== */

  /** Oscillator frequency */


  _createClass(Oscillator, [{
    key: 'connect',


    /* =================== */
    /* --- Audio setup --- */
    /* =================== */

    /**
     * Connect to another AudioNode or AudioModule
     */
    value: function connect(destination) {
      // if destination has an input property, connect to it (destination is an AudioModule)
      if (_typeof(destination.input) === "object") {
        this.output.connect(destination.input);
      }
      // else destination is an AudioNode and can be connected to directly
      else {
          this.output.connect(destination);
        }
    }

    /**
     * Disconnect from an AudioNode or AudioModule
     */

  }, {
    key: 'disconnect',
    value: function disconnect(destination) {
      // if destination has an input property, disconnect from it (destination is an AudioModule)
      if (_typeof(destination.input) === "object") {
        this.output.disconnect(destination.input);
        // else destination is an AudioNode and can be disconnected from directly
      } else {
        this.output.disconnect(destination);
      }
    }

    /* ========================= */
    /* --- Envelope controls --- */
    /* ========================= */

    /** Execute the attack envelope */

  }, {
    key: 'attack',
    value: function attack() {
      this._envelope.attack();
    }

    /** Execute the release envelope */

  }, {
    key: 'release',
    value: function release() {
      this._envelope.release();
    }
  }, {
    key: 'frequency',
    get: function get() {
      return this._oscillator.frequency;
    },
    set: function set(newFreq) {
      var curTime = this._audioCtx.currentTime;
      this._oscillator.frequency.value = newFreq;
      return this;
    }

    /** Pan */

  }, {
    key: 'pan',
    get: function get() {
      return this._channelStrip.pan;
    },
    set: function set(newPan) {
      this._channelStrip.pan = newPan;
      return this;
    }

    /** Overtone amplitude */

  }, {
    key: 'amplitude',
    get: function get() {
      return this._channelStrip.inputGain;
    },
    set: function set(newAmp) {
      this._channelStrip.inputGain = newAmp;
      return this;
    }

    /** Overtone output gain (used for balancing volume when several overtones are used in a voice) */

  }, {
    key: 'gain',
    get: function get() {
      return this._channelStrip.outputGain;
    },
    set: function set(newGain) {
      this._channelStrip.outputGain = newGain;
      return this;
    }

    /** Attack envelope */

  }, {
    key: 'attackEnvelope',
    get: function get() {
      return this._envelope.attackEnvelope;
    },
    set: function set(newEnv) {
      this._envelope.attackEnvelope = newEnv;
      return this;
    }

    /** Release envelope */

  }, {
    key: 'releaseEnvelope',
    get: function get() {
      return this._envelope.releaseEnvelope;
    },
    set: function set(newEnv) {
      this._envelope.releaseEnvelope = newEnv;
      return this;
    }
  }]);

  return Oscillator;
}(_audioModule2.default);

exports.default = Oscillator;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _audioModule = __webpack_require__(2);

var _audioModule2 = _interopRequireDefault(_audioModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StereoFeedbackDelay = function (_AudioModule) {
  _inherits(StereoFeedbackDelay, _AudioModule);

  /**
   * Stereo delay with feedback
   * @param {object} [o] - Options
   * @param {number} [o.delayTimeL]
   * @param {number} [o.delayTimeR]
   * @param {number} [o.feedbackL]
   * @param {number} [o.feedbackR]
   * @param {number} [o.crossfeedL]
   * @param {number} [o.crossfeedR]
   * @param {number} [o.dryMixL]
   * @param {number} [o.dryMixR]
   * @param {number} [o.wetMixL]
   * @param {number} [o.wetMixR]
   */
  function StereoFeedbackDelay(audioCtx, o) {
    _classCallCheck(this, StereoFeedbackDelay);

    try {

      // shim StereoPanner if it's not implemented
      var _this = _possibleConstructorReturn(this, (StereoFeedbackDelay.__proto__ || Object.getPrototypeOf(StereoFeedbackDelay)).call(this, audioCtx));

      if (typeof _this._audioCtx.createStereoPanner === 'undefined') {
        _this._audioCtx.createStereoPanner = function () {
          return new StereoPannerShim(this);
        };
      }

      o = o || {};
      _this._audioCtx = audioCtx;
      _this._maxDelayTime = o.maxDelayTime || 10;

      _this._input = _this._audioCtx.createGain();
      _this._channelSplitter = _this._audioCtx.createChannelSplitter(2);
      _this._dryMixL = _this._audioCtx.createGain();
      _this._dryMixR = _this._audioCtx.createGain();
      _this._wetMixL = _this._audioCtx.createGain();
      _this._wetMixR = _this._audioCtx.createGain();
      _this._delayL = _this._audioCtx.createDelay(_this._maxDelayTime);
      _this._delayR = _this._audioCtx.createDelay(_this._maxDelayTime);
      _this._feedbackL = _this._audioCtx.createGain();
      _this._feedbackR = _this._audioCtx.createGain();
      _this._crossfeedL = _this._audioCtx.createGain();
      _this._crossfeedR = _this._audioCtx.createGain();
      _this._channelMerger = _this._audioCtx.createChannelMerger(2);
      _this._output = _this._audioCtx.createGain();

      _this._connectAudioNodes();
      _this._setAudioDefaults(o);

      _this.input = _this._input;
      _this.output = _this._output;
    } catch (err) {

      console.error(err);
      throw new Error("Failed to create StereoFeedbackDelay audio module.");
    }
    return _this;
  }

  _createClass(StereoFeedbackDelay, [{
    key: "_connectAudioNodes",
    value: function _connectAudioNodes() {
      this._input.connect(this._channelSplitter);
      this._channelSplitter.connect(this._dryMixL, 0);
      this._channelSplitter.connect(this._dryMixR, 1);
      this._channelSplitter.connect(this._delayL, 0);
      this._channelSplitter.connect(this._delayR, 1);
      this._delayL.connect(this._feedbackL);
      this._delayR.connect(this._feedbackR);
      this._feedbackL.connect(this._delayL);
      this._feedbackR.connect(this._delayR);
      this._delayL.connect(this._crossfeedR);
      this._delayR.connect(this._crossfeedL);
      this._crossfeedL.connect(this._delayL);
      this._crossfeedR.connect(this._delayR);
      this._delayL.connect(this._wetMixL);
      this._delayR.connect(this._wetMixR);
      this._dryMixL.connect(this._channelMerger, 0, 0);
      this._dryMixR.connect(this._channelMerger, 0, 1);
      this._wetMixL.connect(this._channelMerger, 0, 0);
      this._wetMixR.connect(this._channelMerger, 0, 1);
      this._channelMerger.connect(this._output);

      return this;
    }
  }, {
    key: "_setAudioDefaults",
    value: function _setAudioDefaults(o) {
      o = o || {};

      this._input.gain.value = 1;
      this._delayL.delayTime.value = o.delayTimeL || 0.5;
      this._delayR.delayTime.value = o.delayTimeR || 0.5;
      this._dryMixL.gain.value = o.dryMixL || 1;
      this._dryMixR.gain.value = o.dryMixR || 1;
      this._wetMixL.gain.value = o.wetMixL || 0.2;
      this._wetMixR.gain.value = o.wetMixR || 0.2;
      this._feedbackL.gain.value = o.feedbackL || 0.1;
      this._feedbackR.gain.value = o.feedbackR || 0.1;
      this._crossfeedL.gain.value = o.crossfeedL || 0;
      this._crossfeedR.gain.value = o.crossfeedR || 0;
      this._output.gain.value = 1;

      return this;
    }

    /**
     * Connect to another AudioNode or AudioModule
     */

  }, {
    key: "connect",
    value: function connect(destination) {
      // if destination has an input property, connect to it (destination is an AudioModule)
      if (_typeof(destination.input) === "object") {
        this.output.connect(destination.input);
      }
      // else destination is an AudioNode and can be connected to directly
      else {
          this.output.connect(destination);
        }
    }

    /**
     * Disconnect from an AudioNode or AudioModule
     */

  }, {
    key: "disconnect",
    value: function disconnect(destination) {
      // if destination has an input property, disconnect from it (destination is an AudioModule)
      if (_typeof(destination.input) === "object") {
        this.output.disconnect(destination.input);
        // else destination is an AudioNode and can be disconnected from directly
      } else {
        this.output.disconnect(destination);
      }
    }

    /* =========================== */
    /* --- Getters and setters --- */
    /* =========================== */

    /** Delay time left */

  }, {
    key: "delayTimeL",
    get: function get() {
      return this._delayL.delayTime;
    },
    set: function set(time) {
      this._delayL.delayTime.value = time;
      return this;
    }

    /** Delay time right */

  }, {
    key: "delayTimeR",
    get: function get() {
      return this._delayR.delayTime;
    },
    set: function set(time) {
      this._delayR.delayTime.value = time;
      return this;
    }

    /** Feedback L */

  }, {
    key: "feedbackL",
    get: function get() {
      return this._feedbackL.gain;
    },
    set: function set(gain) {
      this._feedbackL.gain.value = gain;
      return this;
    }

    /** Feedback R */

  }, {
    key: "feedbackR",
    get: function get() {
      return this._feedbackR.gain;
    },
    set: function set(gain) {
      this._feedbackR.gain.value = gain;
      return this;
    }

    /** Cross-feed L */

  }, {
    key: "crossfeedL",
    get: function get() {
      return this._crossfeedL.gain;
    },
    set: function set(gain) {
      this._crossfeedL.gain.value = gain;
      return this;
    }

    /** Cross-feed R */

  }, {
    key: "crossfeedR",
    get: function get() {
      return this._crossfeedR.gain;
    },
    set: function set(gain) {
      this._crossfeedR.gain.value = gain;
      return this;
    }

    /** Dry mix L */

  }, {
    key: "dryMixL",
    get: function get() {
      return this._dryMixL.gain;
    },
    set: function set(gain) {
      this._dryMixL.gain.value = gain;
      return this;
    }

    /** Dry mix R */

  }, {
    key: "dryMixR",
    get: function get() {
      return this._dryMixR.gain;
    },
    set: function set(gain) {
      this._dryMixR.gain.value = gain;
      return this;
    }

    /** Wet mix L */

  }, {
    key: "wetMixL",
    get: function get() {
      return this._wetMixL.gain;
    },
    set: function set(gain) {
      this._wetMixL.gain.value = gain;
      return this;
    }

    /** Wet mix R */

  }, {
    key: "wetMixR",
    get: function get() {
      return this._wetMixR.gain;
    },
    set: function set(gain) {
      this._wetMixR.gain.value = gain;
      return this;
    }
  }]);

  return StereoFeedbackDelay;
}(_audioModule2.default);

exports.default = StereoFeedbackDelay;

/***/ }),
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _widget = __webpack_require__(3);

var _widget2 = _interopRequireDefault(_widget);

var _constraint = __webpack_require__(0);

var _constraint2 = _interopRequireDefault(_constraint);

var _constraintDef = __webpack_require__(1);

var _constraintDef2 = _interopRequireDefault(_constraintDef);

var _utilMath = __webpack_require__(7);

var _utilMath2 = _interopRequireDefault(_utilMath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representing a Graph widget.
 * @class 
 * @implements {Widget}
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
  *  PUBLIC API
  */

  /**
   * Sets the options.
   * @public @override
   */


  _createClass(Graph, [{
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
    * Returns the state as an array of [x, y] pairs.
    * @public @override
    */

  }, {
    key: "getVal",
    value: function getVal() {
      console.log(this.state.vertices);
      return this.state.vertices.map(function (vtx) {
        return [vtx.x, vtx.y];
      });
    }

    /**
    * Sets the state as an array of [x, y] vertex pairs.
    * Same as setVal(), but will not trigger observer callback methods.
    * @public @override
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
    * Sets the state as an array of [x, y] vertex pairs.
    * Same as setInternalVal(), but will trigger observer callback methods.
    * @public @override
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
     * Adds a new vertex to the state
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
     * Initializes state constraints.
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
     * Initializes state.
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
     * Initializes the svg elements.
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
     * Initializes mouse and touch event handlers.
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
     * Updates (redraws) component based on state.
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

    /* ==============================================================================================
    *  INTERNAL FUNCTIONALITY METHODS
    */

    /**
     * Deletes a vertex.
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
     * Adds a new SVG vertex representation.
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
     * Adds an SVG line connecting two vertices.
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
     * Removes an SVG vertex.
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
     * Removes an SVG line connecting two vertices.
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
      * Moves a line.
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
    * Moves a vertex.
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
     * Calculates the x and y for a vertex in the graph according to its state value.
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
     * Calculates the x and y for a vertex state based on position on the graph.
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
     * Converts on-screen x distance to scaled x state-value.
     * @private
     */

  }, {
    key: "_xPxToVal",
    value: function _xPxToVal(x) {
      return x / this._getWidth() * (this.o.maxXVal - this.o.minXVal);
    }

    /**
     * Converts on-screen y distance to scaled y state-value.
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
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _audioModuleManager = __webpack_require__(15);

var _audioModuleManager2 = _interopRequireDefault(_audioModuleManager);

var _graph = __webpack_require__(28);

var _graph2 = _interopRequireDefault(_graph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* ============================================================================================= */
/* ENVELOPE TEST
/* ============================================================================================= */

var AMM = new _audioModuleManager2.default(new AudioContext());

var osc = AMM.createOscillator();
var envelope = AMM.createEnvelope();
var gain = AMM.createGain();

osc.connect(envelope);
envelope.connect(gain);
gain.connect(AMM.destination);

osc.frequency.value = 220;
gain.gain.value = 0;
osc.start();

var attackGraph = new _graph2.default(document.querySelector("#attack-graph"), {
  minXVal: 0,
  maxXVal: 2,
  minYVal: 0,
  maxYVal: 1
});
attackGraph.addListener(function (env) {
  console.log(env);
  envelope.setAttackEnvelope(env);
});

var releaseGraph = new _graph2.default(document.querySelector("#release-graph"), {
  minXVal: 0,
  maxXVal: 2,
  minYVal: 0,
  maxYVal: 1
});
releaseGraph.addListener(function (env) {
  return envelope.setReleaseEnvelope(env);
});

var attackBtn = document.querySelector("#attack-button");
var releaseBtn = document.querySelector("#release-button");
var audioToggle = document.querySelector("#audio-toggle");
var messageBox = document.querySelector(".message");

audioToggle.addEventListener("change", function (ev) {
  gain.gain.value = ev.target.checked ? 0.5 : 0;
});

attackBtn.addEventListener("click", function (ev) {
  envelope.attack().then(function (env) {
    messageBox.innerHTML = "Attack finished, attack env: " + env;
  });
});

releaseBtn.addEventListener("click", function (ev) {
  envelope.release().then(function (env) {
    messageBox.innerHTML = "Release finished, release env: " + env;
  });
});

/***/ })
/******/ ]);
//# sourceMappingURL=envelope-bundle.js.map