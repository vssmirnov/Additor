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
/******/ 	return __webpack_require__(__webpack_require__.s = 49);
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

var _util = __webpack_require__(3);

var _util2 = _interopRequireDefault(_util);

var _shimWebAudioConnect = __webpack_require__(9);

var _shimWebAudioConnect2 = _interopRequireDefault(_shimWebAudioConnect);

var _audioModuleOptionsMixin = __webpack_require__(20);

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
/**
 * A collection of static utility methods for Audio Modules
 */
var AudioModuleUtil = {

  /**
   * Convert MIDI pitch to frequency.
   * @param {number} midiPitch - The midi pitch number.
   * @param {number} [a4tuning=440] - Tuning of the note A4 (midi pitch 69) in Hz, 440Hz by default.
   * @return {number} freq - Frequency for the given MIDI pitch.
   */
  midiToFreq: function midiToFreq(midiPitch) {
    var a4tuning = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 440;

    var freq = -1;

    if (midiPitch !== -1) freq = Math.pow(2, (midiPitch - 69) / 12) * 440;
    return freq;
  },

  /**
   * Convert MIDI velocity (0 - 127) to gain (0. - 1.).
   * @param {number} vel - MIDI velocity (0 - 127).
   * @returns {number} - Gain (0. - 1.). 
   */
  midiVelToGain: function midiVelToGain(vel) {
    return vel / 127;
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _widgetMixinSvgns = __webpack_require__(12);

var _widgetMixinSvgns2 = _interopRequireDefault(_widgetMixinSvgns);

var _widgetMixinState = __webpack_require__(13);

var _widgetMixinState2 = _interopRequireDefault(_widgetMixinState);

var _widgetMixinOptions = __webpack_require__(14);

var _widgetMixinOptions2 = _interopRequireDefault(_widgetMixinOptions);

var _widgetMixinObserver = __webpack_require__(15);

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
   * @param {DOM element | string} container - DOM element that will contain the widget,
   *                                           or string passed to querySelector to find
   *                                           said DOM element.
   * @param {object=} o - Options.
   */
  function Widget(container, o) {
    _classCallCheck(this, Widget);

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
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _audioModule = __webpack_require__(2);

var _audioModule2 = _interopRequireDefault(_audioModule);

var _verifyAudioContextFeatures = __webpack_require__(5);

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
     * @private @override
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _audioModule = __webpack_require__(2);

var _audioModule2 = _interopRequireDefault(_audioModule);

var _verifyAudioContextFeatures = __webpack_require__(5);

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
        attackEnvelope: [[0.1, 1], [1, 1]],
        releaseEnvelope: [[0.5, 1], [1, 0]]
      };

      _get(Envelope.prototype.__proto__ || Object.getPrototypeOf(Envelope.prototype), "_initOptions", this).call(this, o);

      this._normalizeAttackEnvelope();
      this._normalizeReleaseEnvelope();
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
      this._normalizeAttackEnvelope();
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
      this._normalizeReleaseEnvelope();
      return this;
    }

    /* ============================================================================================= */
    /*  PUBLIC API
    /* ============================================================================================= */

    /**
     * Execute the attack envelope.
     * @returns {Promise} - Promise that returns the envelope when the envelope expires.
     */

  }, {
    key: "attack",
    value: function attack() {
      var _this = this;
      var envGain = this.audioComponents.envGain;
      var env = this.o.attackEnvelope;

      var a = void 0,
          t = void 0;

      // cancel scheduled values in case another change is occuring
      envGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
      envGain.gain.setValueAtTime(envGain.gain.value, this.audioCtx.currentTime);

      var startTime = this.audioCtx.currentTime;

      // ramp to each subsequent value
      for (var i = 0; i < env.length; i++) {
        a = env[i][1];
        t = startTime + env[i][0];

        if (t > this.audioCtx.currentTime) {
          envGain.gain.linearRampToValueAtTime(a, t);
        }
      }

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
      var _this = this;
      var envGain = this.audioComponents.envGain;
      var env = this.o.releaseEnvelope;

      var a = void 0,
          t = void 0;

      // cancel scheduled values in case another change is occuring
      envGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
      envGain.gain.setValueAtTime(envGain.gain.value, this.audioCtx.currentTime);

      var startTime = this.audioCtx.currentTime;

      // ramp to each subsequent value
      for (var i = 0; i < env.length; i++) {
        a = env[i][1];
        t = startTime + env[i][0];

        if (t > this.audioCtx.currentTime) {
          envGain.gain.linearRampToValueAtTime(a, t);
        }
      }

      return new Promise(function (resolve, reject) {
        window.setTimeout(function () {
          resolve(env);
        }, env[env.length - 1][0] * 1000);
      });
    }

    /* ============================================================================================= */
    /* INTERNAL FUNCTIONALITY AND HELPER METHODS
    /* ============================================================================================= */

    /**
     * Normalizes the attack envelope.
     * Envelope points must be strictly positive (non-zero) and <= 1.
     * @private
     */

  }, {
    key: "_normalizeAttackEnvelope",
    value: function _normalizeAttackEnvelope() {
      this.o.attackEnvelope.forEach(function (point) {
        point[1] = point[1] <= 0 ? 0.0001 : point[1] > 1 ? 1 : point[1];
      });
    }

    /**
     * Normalizes the release envelope.
     * Envelope points must be strictly positive (non-zero) and <= 1.
     * @private
     */

  }, {
    key: "_normalizeReleaseEnvelope",
    value: function _normalizeReleaseEnvelope() {
      this.o.releaseEnvelope.forEach(function (point) {
        point[1] = point[1] <= 0 ? 0.0001 : point[1] > 1 ? 1 : point[1];
      });
    }
  }]);

  return Envelope;
}(_audioModule2.default);

exports.default = Envelope;

/***/ }),
/* 8 */
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _audioModule = __webpack_require__(2);

var _audioModule2 = _interopRequireDefault(_audioModule);

var _verifyAudioContextFeatures = __webpack_require__(5);

var _verifyAudioContextFeatures2 = _interopRequireDefault(_verifyAudioContextFeatures);

var _oscillatorVoice = __webpack_require__(11);

var _oscillatorVoice2 = _interopRequireDefault(_oscillatorVoice);

var _envelope = __webpack_require__(7);

var _envelope2 = _interopRequireDefault(_envelope);

var _channelStrip = __webpack_require__(6);

var _channelStrip2 = _interopRequireDefault(_channelStrip);

var _util = __webpack_require__(3);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representing an Additive Synth Voice
 // TODO: WRITE DESCRIPTION
 * @class
 */
var AdditiveSynthVoice = function (_AudioModule) {
  _inherits(AdditiveSynthVoice, _AudioModule);

  /**
   * @constructor
   * @param {AudioContext} audioCtx
   * @param {object} o - Options.
   // TODO: ANNOTATE OPTIONS
   */
  function AdditiveSynthVoice(audioCtx, o) {
    _classCallCheck(this, AdditiveSynthVoice);

    return _possibleConstructorReturn(this, (AdditiveSynthVoice.__proto__ || Object.getPrototypeOf(AdditiveSynthVoice)).call(this, audioCtx));
  }

  /* ============================================================================================= */
  /*  INITIALIZATION METHODS
  /* ============================================================================================= */

  /**
   * Initialize audio components and their connections.
   * @private @override
   */


  _createClass(AdditiveSynthVoice, [{
    key: "_initAudioComponents",
    value: function _initAudioComponents() {
      var _this = this;

      try {
        (0, _verifyAudioContextFeatures2.default)(_this.audioCtx, []);

        this.audioComponents = {

          overtones: function () {
            var ot = [];

            for (var i = 0; i < _this.o.numOvertones; i++) {
              ot.push(new _oscillatorVoice2.default(_this.audioCtx));
            }

            return ot;
          }(),

          envelope: new _envelope2.default(_this.audioCtx),

          channelStrip: new _channelStrip2.default(_this.audioCtx)
        };

        _this.audioComponents.overtones.forEach(function (ot) {
          ot.connect(_this.audioComponents.envelope);
        });
        _this.audioComponents.envelope.connect(_this.audioComponents.channelStrip);
        _this.audioComponents.channelStrip.connect(_this.output);
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
      this.pan = this.audioComponents.channelStrip.pan;
      this.gain = this.audioComponents.channelStrip.outputGain;
      // TODO: can also expose frequency as frequency of first overtone?
    }

    /**
     * Initialize options.
     * @private @override
     */

  }, {
    key: "_initOptions",
    value: function _initOptions(o) {

      this.o = {
        numOvertones: 10,
        glide: 0
      };

      _get(AdditiveSynthVoice.prototype.__proto__ || Object.getPrototypeOf(AdditiveSynthVoice.prototype), "_initOptions", this).call(this, o);
    }

    /* ============================================================================================= */
    /*  GETTERS AND SETTERS
    /* ============================================================================================= */

    /**
     * Returns the gain.
     * @returns {number} - Gain.
     */

  }, {
    key: "getGain",
    value: function getGain() {
      return this.audioComponents.channelStrip.getOutputGain();
    }

    /**
     * Sets the gain.
     * @param {number} gain - Gain between 0. and 1.
     */

  }, {
    key: "setGain",
    value: function setGain(gain) {
      this.audioComponents.channelStrip.setOutputGain(gain);
      return this;
    }

    /**
     * Returns the pan.
     * @returns {number} - Pan.
     */

  }, {
    key: "getPan",
    value: function getPan() {
      return this.audioComponents.channelStrip.getPan();
    }

    /**
     * Sets the pan.
     * @param {number} pan - Pan between -1. (L) and 1. (R).
     */

  }, {
    key: "setPan",
    value: function setPan(pan) {
      this.audioComponents.channelStrip.setPan(pan);
      return this;
    }

    /**
     * Returns the oscillator frequency.
     * @returns {number} - Oscillator frequency.
     */

  }, {
    key: "getFrequency",
    value: function getFrequency() {
      var freq = this.audioComponents.overtones[0].getFrequency();
      return freq;
    }

    /**
     * Sets the oscillator frequency.
     * @param {number} freq - Frequency.
     * @param {number} [glide] - Glide time in ms.
     */

  }, {
    key: "setFrequency",
    value: function setFrequency(freq, glide) {
      var overtones = this.audioComponents.overtones;

      glide = glide === undefined ? this.o.glide : glide;

      overtones.forEach(function (ot, otIdx) {
        ot.setFrequency(freq * (otIdx + 1));
      });

      return this;
    }

    /**
     * Get either the main attack envelope, or the attack envelope for
     * one of the overtones.
     * @param {number} [otIdx] - Index of the overtone whose attack envelope to return.
     * @returns {array} - 2D array representing the attack envelope.
     */

  }, {
    key: "getAttackEnvelope",
    value: function getAttackEnvelope(otIdx) {
      var env = [];

      if (typeof otIdx === "number") {
        env = this.audioComponents.overtones[otIdx].getAttackEnvelope();
      } else {
        env = this.audioComponents.envelope.getAttackEnvelope();
      }

      return env;
    }

    /**
     * Set either the main attack envelope, or the attack envelope for
     * one of the overtones.
     * @param {array} env - A 2D array representing the new envelope, where each value is of the
     *                         form [t, a] where t is time in seconds, and a is amplitude in the range
     *                         [0. - 1.]
     * @param {number} otIdx - Index of the overtone whose attack envelope to set.
     * @returns {this} - A reference to the current object for chaining.
     */

  }, {
    key: "setAttackEnvelope",
    value: function setAttackEnvelope(env, otIdx) {
      var target = {};

      if (typeof otIdx === "number") {
        target = this.audioComponents.overtones[otIdx];
      } else {
        target = this.audioComponents.envelope;
      }

      target.setAttackEnvelope(env);

      return this;
    }

    /**
     * Get either the main release envelope, or the release envelope for
     * one of the overtones.
     * @param {number} [otIdx] - Index of the overtone whose release envelope to return.
     * @returns {array} - 2D array representing the release envelope.
     */

  }, {
    key: "getReleaseEnvelope",
    value: function getReleaseEnvelope(otIdx) {
      var env = [];

      if (typeof otIdx === "number") {
        env = this.audioComponents.overtones[otIdx].getReleaseEnvelope();
      } else {
        env = this.audioComponents.envelope.getReleaseEnvelope();
      }

      return env;
    }

    /**
     * Set either the main release envelope, or the release envelope for
     * one of the overtones.
     * @param {array} env - A 2D array representing the new envelope, where each value is of the
     *                         form [t, a] where t is time in seconds, and a is amplitude in the range
     *                         [0. - 1.]
     * @param {number} otIdx - Index of the overtone whose release envelope to set.
     * @returns {this} - A reference to the current object for chaining.
     */

  }, {
    key: "setReleaseEnvelope",
    value: function setReleaseEnvelope(env) {
      var taget = {};

      if (typeof otIdx === "number") {
        target = this.audioComponents.overtones[otIdx];
      } else {
        target = this.audioComponents.envelope;
      }

      target.setReleaseEnvelope(env);

      return this;
    }

    /**
     * Set the gain of an overtone.
     * @param {number} gain - Gain - value in the range [0. - 1.]
     * @param {number} otIdx - Overtone index. 
     */

  }, {
    key: "setOvertoneGain",
    value: function setOvertoneGain(gain, otIdx) {
      if (otIdx >= 0 && otIdx < this.audioComponents.overtones.length) {
        this.audioComponents.overtones[otIdx].setGain(gain);
      }
    }

    /**
     * Set the gain for multiple overtones using an array.
     * @param {array} gainArr
     */

  }, {
    key: "setOvertoneGains",
    value: function setOvertoneGains(gainArr) {
      for (var i = 0; i < this.audioComponents.overtones.length && i < gainArr.length; i++) {
        this.setOvertoneGain(gainArr[i], i);
      }
    }

    /**
     * Get the number of overtones.
     * @returns {number} - Number of overtones.
     */

  }, {
    key: "getNumOvertones",
    value: function getNumOvertones() {
      return this.audioComponents.overtones.length;
    }

    /**
     * Set the number of overtones.
     * @param {number} newNumOvertones - Number of overtones. 
     */

  }, {
    key: "setNumOvertones",
    value: function setNumOvertones(newNumOvertones) {
      var curNumOvertones = this.getNumOvertones();

      if (curNumOvertones > newNumOvertones) {
        for (var i = curNumOvertones; i > newNumOvertones; i--) {
          this.audioComponents.overtones[i] = null;
          this.audioComponents.overtones.pop();
        }
      } else if (curNumOvertones < newNumOvertones) {
        var baseFreq = this.getFrequency();

        for (var _i = curNumOvertones; _i < newNumOvertones; _i++) {
          var newOscillatorVoice = new _oscillatorVoice2.default();
          newOscillatorVoice.setFrequency((_i + 1) * baseFreq);
          this.audioComponents.overtones.push(newOscillatorVoice);
        }
      }
    }

    /* ============================================================================================= */
    /*  PUBLIC API
    /* ============================================================================================= */

    /**
     * Execute the attack envelope.
     * @returns {Promise} - Promise that returns the envelope when the envelope expires.
     */

  }, {
    key: "attack",
    value: function attack() {
      var overtones = this.audioComponents.overtones;

      overtones.forEach(function (ot) {
        ot.attack();
      });

      return this.audioComponents.envelope.attack();
    }

    /**
     * Execute the release envelope.
     * @returns {Promise} - Promise that returns the envelope when the envelope expires.
     */

  }, {
    key: "release",
    value: function release() {
      var overtones = this.audioComponents.overtones;

      overtones.forEach(function (ot) {
        ot.release();
      });

      return this.audioComponents.envelope.release();
    }

    /**
     * Play a note with the given MIDI pitch and MIDI velocity.
     * @public
     * @param {number} pitch - MIDI pitch.
     * @param {number} [vel=127] - MIDI velocity. 
     * @param {array} [glide] - Glide time in ms.
     */

  }, {
    key: "playNote",
    value: function playNote(pitch) {
      var vel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 127;
      var glide = arguments[2];

      var freq = _util2.default.midiToFreq(pitch);
      var gain = _util2.default.midiVelToGain(vel);

      if (vel === 0) {
        this.release();
      } else {
        this.setFrequency(freq, glide);
        this.setGain(gain);
        this.attack();
      }
    }
  }]);

  return AdditiveSynthVoice;
}(_audioModule2.default);

exports.default = AdditiveSynthVoice;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _audioModule = __webpack_require__(2);

var _audioModule2 = _interopRequireDefault(_audioModule);

var _verifyAudioContextFeatures = __webpack_require__(5);

var _verifyAudioContextFeatures2 = _interopRequireDefault(_verifyAudioContextFeatures);

var _envelope = __webpack_require__(7);

var _envelope2 = _interopRequireDefault(_envelope);

var _channelStrip = __webpack_require__(6);

var _channelStrip2 = _interopRequireDefault(_channelStrip);

var _util = __webpack_require__(3);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representing an Oscillator Voice. 
 * An Oscillator Voice has an oscillator, and a channel strip.
 * @class
 */
var OscillatorVoice = function (_AudioModule) {
  _inherits(OscillatorVoice, _AudioModule);

  /**
   * @constructor
   * @param {AudioContext} audioCtx
   * @param {object} [o] - Options.
   * @param {number} [o.glide] - Glide time in ms.
   */
  function OscillatorVoice(audioCtx, o) {
    _classCallCheck(this, OscillatorVoice);

    return _possibleConstructorReturn(this, (OscillatorVoice.__proto__ || Object.getPrototypeOf(OscillatorVoice)).call(this, audioCtx));
  }

  /* ============================================================================================= */
  /*  INITIALIZATION METHODS
  /* ============================================================================================= */

  /**
   * Initialize audio components and their connections.
   * @private @override
   */


  _createClass(OscillatorVoice, [{
    key: "_initAudioComponents",
    value: function _initAudioComponents() {
      var _this = this;

      try {
        (0, _verifyAudioContextFeatures2.default)(_this.audioCtx, ["Oscillator"]);

        this.audioComponents = {
          oscillator: _this.audioCtx.createOscillator(),
          envelope: new _envelope2.default(_this.audioCtx),
          channelStrip: new _channelStrip2.default(_this.audioCtx)
        };

        this.audioComponents.oscillator.connect(this.audioComponents.envelope);
        this.audioComponents.envelope.connect(this.audioComponents.channelStrip);
        this.audioComponents.channelStrip.connect(this.output);
        this.audioComponents.channelStrip.setInputGain(1);
        this.audioComponents.oscillator.start();
      } catch (err) {
        console.error(err);
      }
    }

    /**
     * Initialize and expose Audio Params.
     * @private @override
     */

  }, {
    key: "_initAudioParams",
    value: function _initAudioParams() {
      this.pan = this.audioComponents.channelStrip.pan;
      this.gain = this.audioComponents.channelStrip.outputGain;
      this.frequency = this.audioComponents.oscillator.frequency;
    }

    /**
     * Initialize options.
     * @private @override
     */

  }, {
    key: "_initOptions",
    value: function _initOptions(o) {

      this.o = {
        glide: 0
      };

      _get(OscillatorVoice.prototype.__proto__ || Object.getPrototypeOf(OscillatorVoice.prototype), "_initOptions", this).call(this, o);
    }

    /* ============================================================================================= */
    /*  GETTERS AND SETTERS
    /* ============================================================================================= */

    /**
     * Returns the type of the waveform set for this oscillator.
     * @returns {string} - Type of waveform. One of "sine", "square", "sawtooth", "triangle", or "custom".
     */

  }, {
    key: "getWaveformType",
    value: function getWaveformType() {
      return this.audioComponents.oscillator.type;
    }

    /**
     * Set the type of waveform - one of "sine", "square", "sawtooth", "triangle", or "custom".
     * If "custom" is selected, you may also provide the real and imaginary components to create
     * the custom waveform.
     * @param {string} type - Type of waveform - one of "sine", "square", "sawtooth", "triangle", or "custom".
     * @param {Float32Array} [real] - Real part (cosine terms) of an array used to create the custom waveform.
     * @param {Float32Array} [imag] - Imaginary part (sine terms) of an array used to create the custom waveform.
     */

  }, {
    key: "setWaveformType",
    value: function setWaveformType(type, real, imag) {

      switch (type) {
        case "sine":
          this.audioComponents.oscillator.type = "sine";
          break;
        case "square":
          this.audioComponents.oscillator.type = "squre";
          break;
        case "sawtooth":
        case "saw":
          this.audioComponents.oscillator.type = "sawtooth";
          break;
        case "triangle":
          this.audioComponents.oscillator.type = "triangle";
          break;
        case "custom":
          if ((typeof real === "undefined" ? "undefined" : _typeof(real)) === "object" && real.constructor.name === "Float32Array" && (typeof imag === "undefined" ? "undefined" : _typeof(imag)) === "object" && imag.constructor.name === "Float32Array") {
            var wave = this.audioCtx.createPeriodicWave(real, imag);
            this.audioComponents.oscillator.setPeriodicWave(wave);
          }
          break;
        default:
          break;
      }
    }

    /**
     * Set a custom waveform using arrays of real (cosine) and imaginary (sine) terms.
     * @param {Float32Array} real 
     * @param {Float32Array} imag 
     */

  }, {
    key: "setCustomWaveform",
    value: function setCustomWaveform(real, imag) {
      this.setWaveformType("custom", real, imag);
      return this;
    }

    /**
     * Returns the gain.
     * @returns {number} - Gain.
     */

  }, {
    key: "getGain",
    value: function getGain() {
      return this.audioComponents.channelStrip.getOutputGain();
    }

    /**
     * Sets the gain.
     * @param {number} gain - Gain between 0. and 1.
     */

  }, {
    key: "setGain",
    value: function setGain(gain) {
      this.audioComponents.channelStrip.setOutputGain(gain);
      return this;
    }

    /**
     * Returns the pan.
     * @returns {number} - Pan.
     */

  }, {
    key: "getPan",
    value: function getPan() {
      return this.audioComponents.channelStrip.getPan();
    }

    /**
     * Sets the pan.
     * @param {number} pan - Pan between -1. (L) and 1. (R).
     */

  }, {
    key: "setPan",
    value: function setPan(pan) {
      this.audioComponents.channelStrip.setPan(pan);
      return this;
    }

    /**
     * Returns the oscillator frequency.
     * @returns {number} - Oscillator frequency.
     */

  }, {
    key: "getFrequency",
    value: function getFrequency() {
      var osc = this.audioComponents.oscillator;

      return osc.frequency.value;
    }

    /**
     * Sets the oscillator frequency.
     * @param {number} freq - Frequency.
     * @param {number} [glide] - Glide time in ms.
     */

  }, {
    key: "setFrequency",
    value: function setFrequency(freq, glide) {
      var osc = this.audioComponents.oscillator;

      glide = glide === undefined ? this.o.glide : glide;
      glide = glide / 1000; // convert to secs

      osc.frequency.cancelScheduledValues(this.audioCtx.currentTime);
      osc.frequency.setValueAtTime(osc.frequency.value, this.audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(freq, this.audioCtx.currentTime + glide);

      return this;
    }

    /**
     * Get the attack envelope.
     * @returns {array} - 2D array representing the attack envelope.
     */

  }, {
    key: "getAttackEnvelope",
    value: function getAttackEnvelope() {
      return this.audioComponents.envelope.getAttackEnvelope();
    }

    /**
     * Set the attack envelope.
     * @param {array} env - A 2D array representing the new envelope, where each value is of the
     *                         form [t, a] where t is time in seconds, and a is amplitude in the range
     *                         [0. - 1.]
     * @returns {this} - A reference to the current envelope object for chaining.
     */

  }, {
    key: "setAttackEnvelope",
    value: function setAttackEnvelope(env) {
      this.audioComponents.envelope.setAttackEnvelope(env);
      return this;
    }

    /**
     * Get the release envelope.
     * @returns {array} - 2D array representing the release envelope.
     */

  }, {
    key: "getReleaseEnvelope",
    value: function getReleaseEnvelope() {
      return this.audioComponents.envelope.getReleaseEnvelope();
    }

    /**
     * Set the release envelope.
     * @param {array} env - A 2D array representing the new envelope, where each value is of the
     *                         form [t, a] where t is time in seconds, and a is amplitude in the range
     *                         [0. - 1.] 
     * @returns {this} - A reference to the current envelope object for chaining.
     */

  }, {
    key: "setReleaseEnvelope",
    value: function setReleaseEnvelope(env) {
      this.audioComponents.envelope.setReleaseEnvelope(env);
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
      return this.audioComponents.envelope.attack();
    }

    /**
     * Execute the release envelope.
     * @returns {Promise} - Promise that returns the envelope when the envelope expires.
     */

  }, {
    key: "release",
    value: function release() {
      return this.audioComponents.envelope.release();
    }

    /**
     * Play a note with the given MIDI pitch and MIDI velocity.
     * @public
     * @param {number} pitch - MIDI pitch.
     * @param {number} [vel=127] - MIDI velocity. 
     * @param {array} [glide] - Glide time in ms.
     */

  }, {
    key: "playNote",
    value: function playNote(pitch) {
      var vel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 127;
      var glide = arguments[2];

      var freq = _util2.default.midiToFreq(pitch);
      var gain = _util2.default.midiVelToGain(vel);

      this.setFrequency(freq, glide);
      this.setGain(gain);

      this.attack();
    }
  }]);

  return OscillatorVoice;
}(_audioModule2.default);

exports.default = OscillatorVoice;

/***/ }),
/* 12 */
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
/* 13 */
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
/* 14 */
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
/* 15 */
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _widget = __webpack_require__(4);

var _widget2 = _interopRequireDefault(_widget);

var _constraint = __webpack_require__(0);

var _constraint2 = _interopRequireDefault(_constraint);

var _constraintDef = __webpack_require__(1);

var _constraintDef2 = _interopRequireDefault(_constraintDef);

var _utilMath = __webpack_require__(8);

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
   * @param {number=1} o.step - Interval of the steps in which the dial changes value. 
   * @param {string="#000"} o.needleColor - Dial needle color.
   * @param {string="#f40"} o.activeColor - Dial active color.
   */
  function Dial(container, o) {
    var _ret;

    _classCallCheck(this, Dial);

    var _this2 = _possibleConstructorReturn(this, (Dial.__proto__ || Object.getPrototypeOf(Dial)).call(this, container, o));

    return _ret = _this2, _possibleConstructorReturn(_this2, _ret);
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
      this.o.stepPrecision = _utilMath2.default.getPrecision(this.o.step);
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
        step: 1,
        needleColor: "#414141",
        activeColor: "#f40",
        mouseSensitivity: 1.2
      };

      // override defaults with provided options
      _get(Dial.prototype.__proto__ || Object.getPrototypeOf(Dial.prototype), "_initOptions", this).call(this, o);

      // set the precision based on the step interval
      this.o.stepPrecision = _utilMath2.default.getPrecision(this.o.step);
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
            return _utilMath2.default.quantize(num, _this.o.step, _this.o.stepPrecision);
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _audioPatch = __webpack_require__(18);

var _audioPatch2 = _interopRequireDefault(_audioPatch);

var _util = __webpack_require__(3);

var _util2 = _interopRequireDefault(_util);

var _shimWebAudioConnect = __webpack_require__(9);

var _shimWebAudioConnect2 = _interopRequireDefault(_shimWebAudioConnect);

var _AdditiveSynth = __webpack_require__(19);

var _AdditiveSynth2 = _interopRequireDefault(_AdditiveSynth);

var _channelStrip = __webpack_require__(6);

var _channelStrip2 = _interopRequireDefault(_channelStrip);

var _envelope = __webpack_require__(7);

var _envelope2 = _interopRequireDefault(_envelope);

var _StereoFeedbackDelay = __webpack_require__(21);

var _StereoFeedbackDelay2 = _interopRequireDefault(_StereoFeedbackDelay);

var _oscillatorVoice = __webpack_require__(11);

var _oscillatorVoice2 = _interopRequireDefault(_oscillatorVoice);

var _additiveSynthVoice = __webpack_require__(10);

var _additiveSynthVoice2 = _interopRequireDefault(_additiveSynthVoice);

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
            switch (audioModuleSpec.toLowerCase().replace(/[\W-]+/g, "")) {
              case "additivesynth":
                newAudioModule = _this.createAdditiveSynth();
                break;

              case "additivesynthvoice":
                newAudioModule = _this.createAdditiveSynthVoice();
                break;

              case "biquadfilter":
              case "filter":
                newAudioModule = _this.createBiquadFilter();
                break;

              case "channelstrip":
                newAudioModule = _this.createChannelStrip();
                break;

              case "destination":
                newAudioModule = _this.createDestination();
                break;

              case "envelope":
                newAudioModule = _this.createBiquadFilter();
                break;

              case "oscillator":
                newAudioModule = _this.createOscillator();
                break;

              case "oscillatorvoice":
                newAudioModule = _this.createOscillatorVoice();
                break;

              case "stereofeedbackdelay":
              case "delay":
                newAudioModule = _this.createStereoFeedbackDelay();
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
     * Create an Additive Synth Voice Audio Module 
     */

  }, {
    key: 'createAdditiveSynthVoice',
    value: function createAdditiveSynthVoice(o) {
      o = o || {};
      return new _additiveSynthVoice2.default(this.AUDIO_CTX, o);
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
     * Create an Oscillator Voice
     */

  }, {
    key: 'createOscillatorVoice',
    value: function createOscillatorVoice(o) {
      o = o || {};
      return new _oscillatorVoice2.default(this.AUDIO_CTX, o);
    }

    /**
     * Create an Gain
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
/* 18 */
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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _additiveSynthVoice = __webpack_require__(10);

var _additiveSynthVoice2 = _interopRequireDefault(_additiveSynthVoice);

var _channelStrip = __webpack_require__(6);

var _channelStrip2 = _interopRequireDefault(_channelStrip);

var _util = __webpack_require__(3);

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
      this._voices.push(new _additiveSynthVoice2.default(this._audioCtx, { numOvertones: this._numOvertones }));
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
          this._voices.push(new _additiveSynthVoice2.default(this._audioCtx, { numOvertones: this._numOvertones }));
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
/* 20 */
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
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _widget = __webpack_require__(4);

var _widget2 = _interopRequireDefault(_widget);

var _constraint = __webpack_require__(0);

var _constraint2 = _interopRequireDefault(_constraint);

var _constraintDef = __webpack_require__(1);

var _constraintDef2 = _interopRequireDefault(_constraintDef);

var _utilMath = __webpack_require__(8);

var _utilMath2 = _interopRequireDefault(_utilMath);

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
   * @param {number} [o.step=1] - Step granularity.
   * @param {string} [o.sliderBodyColor="#484848"] - The color of the slider bar.
   * @param {string} [o.sliderHandleColor="#484848"] - The color of the triangle used as the slider's needle.
   */
  function Slider(container, o) {
    var _ret;

    _classCallCheck(this, Slider);

    var _this2 = _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this, container, o));

    return _ret = _this2, _possibleConstructorReturn(_this2, _ret);
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
        step: 1,
        sliderBodyColor: "#484848",
        sliderHandleColor: "#484848",
        mouseSensitivity: 1.2
      };

      // override defaults with provided options
      _get(Slider.prototype.__proto__ || Object.getPrototypeOf(Slider.prototype), "_initOptions", this).call(this, o);

      // set the precision (num of decimal places used) based on the step interval
      this.o.stepPrecision = _utilMath2.default.getPrecision(this.o.step);
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
            return _utilMath2.default.quantize(num, _this.o.step, _this.o.stepPrecision);
          }
        })
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

  return Slider;
}(_widget2.default);

exports.default = Slider;

/***/ }),
/* 23 */,
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
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _audioModuleManager = __webpack_require__(17);

var _audioModuleManager2 = _interopRequireDefault(_audioModuleManager);

var _channelStrip = __webpack_require__(6);

var _channelStrip2 = _interopRequireDefault(_channelStrip);

var _dial = __webpack_require__(16);

var _dial2 = _interopRequireDefault(_dial);

var _slider = __webpack_require__(22);

var _slider2 = _interopRequireDefault(_slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* ============================================================================================= */
/* CHANNEL STRIP
/* ============================================================================================= */

var AUDIO_CTX = new AudioContext();
var AMM = new _audioModuleManager2.default(new AudioContext());

var channelStrip = AMM.createChannelStrip();
var osc = AMM.createOscillator();
var gain = AMM.createGain();

osc.connect(channelStrip);
channelStrip.connect(gain);
gain.connect(AMM.destination);

gain.gain.value = 0;
osc.frequency.value = 220;
osc.start();

document.querySelector(".channel-strip .audio-toggle").addEventListener("change", function (ev) {
  gain.gain.value = ev.target.checked ? 0.5 : 0;
});

// input gain slider
var inputGainSlider = new _slider2.default(document.querySelector(".channel-strip .input-gain-slider"), {
  minVal: 0,
  maxVal: 1,
  step: 0.01
});
inputGainSlider.addObserver(function (gain) {
  channelStrip.setInputGain(gain);
});

// pan dial;
var panDial = new _dial2.default(document.querySelector(".channel-strip .pan-dial"), {
  minVal: -1,
  maxVal: 1,
  step: 0.01
});
panDial.addObserver(function (pan) {
  channelStrip.setPan(pan);
});

// output gain slider
var outputGainSlider = new _slider2.default(document.querySelector(".channel-strip .output-gain-slider"), {
  minVal: 0,
  maxVal: 1,
  step: 0.01
});
outputGainSlider.addObserver(function (gain) {
  channelStrip.setOutputGain(gain);
});

/***/ })
/******/ ]);
//# sourceMappingURL=channel-strip-bundle.js.map