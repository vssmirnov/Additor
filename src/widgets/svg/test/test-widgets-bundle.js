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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Constraint object represents constraints on a value including min, max, and enum.
 * Constraint class also provides static methods for applying constraints to a state
 * object using a map object that represents the constraints of the state.
 *
 * Consider we need to keep track of the state of two pies as they bake.
 * The object representing the state at some time might look like this:
 *
 * state: {
 *   pies: [
 *     {crust: {temp: 200, thickness: 2}, filling: "apple"},
 *     {crust: {temp: 370, thickness: 5}, filling: "cherry"}
 *   ]
 * }
 *
 * Then the constraint map should look something like this:
 * constraint: {
 *   pies: [{
 *     crust: {
 *       temp: new Constraint({min: 250, max: 350}),
 *       thickness: new Constraint({min: 1, max: 4})
 *     },
 *     filling: new Constraint({ enum: ["apple", "cherry", "pineapple"]})
 *   }]
 * }
 * @class
 */
var Constraint = function () {

  /**
   * @constructor
   * @param {object=} spec - Spec specifying the constraints.
   * @param {number=} spec.min - Minimum value.
   * @param {number=} spec.max - Maximum value.
   * @param {array=} spec.enum - Array of possible enumerable values.
   * @param {function=} spec.transform - A transformation function to apply to the value.
   */
  function Constraint(spec) {
    _classCallCheck(this, Constraint);

    spec = spec || {};

    this.min = spec.min;
    this.max = spec.max;
    this.enum = spec.enum;
    this.transform = spec.transform;
  }

  /**
   * Check a constraint map for constraint specs and apply them to obj.
   * Note: will not mutate the original object. New value is returned.
   * @public @static
   * @param {object} obj - The state object to check
   * @param {object} cMap - The constraint map to use
   * @return {number | string | object | array} val - The constrained value.
   * TODO: should build a map so that each time getting a constraint is O(1)
   * FIXME:
   */


  _createClass(Constraint, null, [{
    key: "constrain",
    value: function constrain(obj, cMap) {
      console.log(cMap + " obj: " + obj);
      console.log(cMap instanceof Constraint);

      Object.keys(cMap).forEach(function (key) {

        //FIXME: how to values without return?

        if (cMap[key] instanceof Constraint) {
          Constraint._applyConstraint(obj[key], cMap[key]);
        } else if (cMap[key] instanceof Array) {
          if (cMap[key][0] instanceof Constraint) {
            Constraint._applyConstraint(obj[key], cMap[key][0]);
          } else {
            Constraint.constrain(objs[key][0], cMap[key][0]);
          }
        } else {
          Constraint.constrain(obj[key], cMap[key]);
        }
      });

      // if (constraintMap instanceof Constraint) {
      //   return Constraint._applyConstraint(obj, constraintMap);
      // } else if (constraintMap instanceof Array && constraintMap[0] instanceof Constraint) {
      //   if (constraintMap[0] instanceof Constraint) {
      //     return Constraint._applyConstraint(obj, constraintMap[0]);
      //   } else {
      //     return Constraint.constrain(obj[0], constraintMap[0]);
      //   }
      // } else {
      //   Object.keys(constraintMap).forEach(key => {
      //     return Constraint.constrain(obj[key], constraintMap[key]);
      //   });
      // }
    }

    /**
     * Apply a constraint.
     * @private @static
     * @param {number | string | object | array} val - The value to constrain.
     * @param {Constraint} constraint - The constraint object to use.
     * @param {symbol} key - The key to use to access the constraint.
     * @return {number | string | object | array} val - The constrained value.
     */

  }, {
    key: "_applyConstraint",
    value: function _applyConstraint(val, constraint, key) {
      if (val[key] instanceof Array) {
        val[key].forEach(function (valInst) {
          Constraint._applyConstraint(valInst, constraint);
        });
      } else {
        if (constraint.min !== undefined) {
          val = Math.max(val, constraint.min);
        }
        if (constraint.max !== undefined) {
          val = Math.min(val, constraint.max);
        }
        if (constraint.enum !== undefined && constraint.enum instanceof Array) {
          val = constraint.enum.find(val) !== undefined ? val : constraint.enum[0];
        }
        if (constraint.transform !== undefined && typeof constraint.transform === "function") {
          val = constraint.transform(val);
        }
      }

      return val;
    }
  }]);

  return Constraint;
}();

exports.default = Constraint;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _widget = __webpack_require__(8);

var _widget2 = _interopRequireDefault(_widget);

var _constraint = __webpack_require__(0);

var _constraint2 = _interopRequireDefault(_constraint);

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
var WidgetDial = function (_Widget) {
  _inherits(WidgetDial, _Widget);

  /**
   * @constructor
   * @param {object} container - DOM container for the widget.
   * @param {object=} o - options.
   * @param {number=0} o.minVal - Minimum value constraint.
   * @param {number=127} o.maxVal - Maximum value constraint.
   * @param {string="#000"} o.needleColor - Dial needle color.
   * @param {string="#f40"} o.activeColor - Dial active color.
   */
  function WidgetDial(container, o) {
    _classCallCheck(this, WidgetDial);

    return _possibleConstructorReturn(this, (WidgetDial.__proto__ || Object.getPrototypeOf(WidgetDial)).call(this, container, o));
  }

  /**
   * Initialize the options
   * @override
   * @protected
   */


  _createClass(WidgetDial, [{
    key: "_initOptions",
    value: function _initOptions(o) {
      // set the defaults
      this.o = {
        minVal: 0,
        maxVal: 127,
        needleColor: "#000",
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

      this.stateConstraints = {
        val: new _constraint2.default({
          min: _this.o.minVal,
          max: _this.o.maxVal,
          transform: function transform(num) {
            return ~~num;
          }
        })
      };
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

  return WidgetDial;
}(_widget2.default);

exports.default = WidgetDial;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _widget = __webpack_require__(8);

var _widget2 = _interopRequireDefault(_widget);

var _constraint = __webpack_require__(0);

var _constraint2 = _interopRequireDefault(_constraint);

var _utilMath = __webpack_require__(9);

var _utilMath2 = _interopRequireDefault(_utilMath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representing an Envelope Graph widget
 *
 * @class
 * @implements {Widget}
 */
var WidgetEnvelopeGraph = function (_Widget) {
  _inherits(WidgetEnvelopeGraph, _Widget);

  /**
   * @constructor
   * @param {object} container - DOM container for the widget.
   * @param {object=} o - Options.
   * @param {number=0} o.minXVal - Minimum X value.
   * @param {number=0} o.minYVal - Minimum Y value.
   * @param {number=100} o.maxXVal - Maximum X value.
   * @param {number=100} o.maxYVal - Maximum Y value.
   * @param {number=-1} o.maxNumVertices - Maximum number of vertices.
   * @param {number=0.1} o.quantizeX - X-quantization ("grid") value.
   * @param {number=0.1} o.quantizeY - Y-quantization ("grid") value.
   * @param {boolean=false} o.hasFixedStartPoint - Is there a fixed start vertex?
   * @param {boolean=false} o.hasFixedEndPoint - Is there a fixed end vertex?
   * @param {number=0} o.fixedStartPointY - Y value of the fixed start vertex, if exists.
   * @param {number=0} o.fixedEndPointY - Y value of the fixed end vertex, if exists.
   * @param {boolean=true} o.isEditable - Is the graph editable?
   * @param {string="#000"} o.vertexColor - Color of vertex points.
   * @param {string="#000"} o.lineColor - Color of lines connecting the vertices.
   * @param {string="#fff"} o.bgColor - Background color.
   * @param {number=3} o.vertexRadius - Radius of the vertex points.
   * @param {number=1.2} o.mouseSensitivity - Mouse sensitivity (how much moving the mouse affects the interaction).
   */
  function WidgetEnvelopeGraph(container, o) {
    _classCallCheck(this, WidgetEnvelopeGraph);

    return _possibleConstructorReturn(this, (WidgetEnvelopeGraph.__proto__ || Object.getPrototypeOf(WidgetEnvelopeGraph)).call(this, container, o));
  }

  /**
   * Initialize the options
   * @override
   * @protected
   */


  _createClass(WidgetEnvelopeGraph, [{
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
        hasFixedStartPoint: false,
        hasFixedEndPoint: false,
        fixedStartPointY: 0,
        fixedEndPointY: 0,
        isEditable: true,
        vertexColor: "#000",
        lineColor: "#000",
        bgColor: "#fff",
        vertexRadius: 3,
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

      this.stateConstraits = {
        vertices: [{
          x: new _constraint2.default({
            min: _this.o.minXVal,
            max: _this.o.maxXVal,
            transform: function transform(num) {
              return _utilMath2.default.quantize(num, _this.o.quantizeX);
            }
          }),
          y: new _constraint2.default({
            min: _this.o.minYVal,
            max: _this.o.maxYVal,
            transform: function transform(num) {
              return _utilMath2.default.quantize(num, _this.o.quantizeY);
            }
          })
        }]
      };
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
        // verices contains an array of vertices
        // each vertex is an object of form {x, y}
        vertices: [{ x: 10, y: 10 }, { x: 20, y: 20 }, { x: 50, y: 1 }]
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
        //TODO: IMPLEMENT SVG_ELS
        panel: document.createElementNS(this.SVG_NS, "rect"),
        vertices: [],
        lines: []
      };

      //TODO: IMPLEMENT SVG_ELS ATTRIBUTES
      this.svgEls.panel.setAttribute("width", this._getWidth());
      this.svgEls.panel.setAttribute("height", this._getHeight());
      this.svgEls.panel.setAttribute("fill", this.o.bgColor);
      this.svgEls.panel.setAttribute("stroke", this.o.lineColor);

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

      //TODO: IMPLEMENT HANDLER FUNCTIONS
      this.handlers = {
        touchGraph: function touchGraph(ev) {
          _this._createVertex();
        },
        move: function move(ev) {},
        release: function release() {}
      };

      //TODO: ASSIGN INIT HANDLERS
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

      for (var i = _this.svgEls.vertices.length; i < _this.state.vertices.length; ++i) {
        _this._addSvgVertex();
      }

      for (var _i = _this.svgEls.vertices.length; _i > _this.state.vertices.length; --_i) {
        _this.removeSvgVertex();
      }

      //TODO: IMPLEMENT UPDATE
      _this.state.vertices.forEach(function (stateVtx, idx) {
        var nextStateVtx = idx < _this.state.vertices.length - 1 ? _this.state.vertices[idx + 1] : null;

        var svgVtx = _this.svgEls.vertices[idx];
        var svgLine = nextStateVtx !== null ? _this.svgEls.lines[idx] : null;

        var pos = _this._calcVertexPos(stateVtx);
        var nextPos = nextStateVtx !== null ? _this._calcVertexPos(nextStateVtx) : null;

        svgVtx.setAttribute("cx", pos.x);
        svgVtx.setAttribute("cy", pos.y);
        svgVtx.setAttribute("r", _this.o.vertexRadius);
        svgVtx.setAttribute("fill", _this.o.vertexColor);

        if (svgLine !== null) {
          svgLine.setAttribute("d", "M " + pos.x + " " + pos.y + " L " + nextPos.x + " " + nextPos.y);
          svgLine.setAttribute("fill", "transparent");
          svgLine.setAttribute("stroke", _this.o.lineColor);
        }
      });

      //TODO: IMPLEMENT UPDATE EDGE CASES
    }

    /* ==============
     * Helper Methods
     * ==============
     */

    /** Calculate the x and y for a vertex in the graph according to its state value */

  }, {
    key: "_calcVertexPos",
    value: function _calcVertexPos(vertexState) {
      return {
        x: this._getWidth() * (vertexState.x / this.o.maxXVal),
        y: this._getHeight() - this._getHeight() * (vertexState.y / this.o.maxYVal)
      };
    }

    /**
     * Add a new vertex to the state
     * @public
     * @param {number} x
     * @param {number} y
     */

  }, {
    key: "addVertex",
    value: function addVertex(x, y) {
      var newVertices = this.getState().vertices.map(function (a) {
        return a;
      });

      newVertices.push({ x: x, y: y });
      newVertices.sort(function (a, b) {
        return a.x - b.x;
      });

      this._setState({
        vertices: newVertices
      });
    }

    /** Add a new SVG vertex representation */

  }, {
    key: "_addSvgVertex",
    value: function _addSvgVertex() {
      var _this = this;
      var newVertex = document.createElementNS(_this.SVG_NS, "circle");
      var newLine = document.createElementNS(_this.SVG_NS, "path");
      _this.svgEls.vertices.push(newVertex);
      _this.svgEls.lines.push(newLine);
      _this.svg.appendChild(newVertex);
      _this.svg.appendChild(newLine);
    }

    /** Remove an SVG vertex */

  }, {
    key: "_removeSvgVertex",
    value: function _removeSvgVertex() {
      var vertex = this.svgEls.vertices.pop();
      var line = this.svgEls.lines.pop();
      vertex = null;
      line = null;
    }
  }]);

  return WidgetEnvelopeGraph;
}(_widget2.default);

exports.default = WidgetEnvelopeGraph;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _widgetImplDial = __webpack_require__(1);

var _widgetImplDial2 = _interopRequireDefault(_widgetImplDial);

var _widgetImplEnvelopegraph = __webpack_require__(2);

var _widgetImplEnvelopegraph2 = _interopRequireDefault(_widgetImplEnvelopegraph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Dial */
var dialContainer = document.getElementById("dial");
var dialDisplay = dialContainer.nextElementSibling;
var dial = new _widgetImplDial2.default(dialContainer);
dial.addObserver(function (state) {
  dialDisplay.innerHTML = state.val;
});
dial._setState({ val: 50 });

/** Envelope Graph */
var envelopeGraphContainer = document.getElementById("envelope-graph");
var envelopeGraphDisplay = envelopeGraphContainer.nextElementSibling;
var envelopeGraph = new _widgetImplEnvelopegraph2.default(envelopeGraphContainer);

envelopeGraph.addVertex(2, 20);

/***/ }),
/* 4 */
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
      return observer(_this.state);
    });
  }
};

exports.default = WidgetObserverMixin;

/***/ }),
/* 5 */
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
   * Get the options object
   * @public
   * @return {object} this.o - Options
   */
  getOptions: function getOptions() {
    return this.o;
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
      this._initStateConstraints();
      this._setState();
    }

    return isChanged;
  }
};

exports.default = WidgetOptionsMixin;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constraint = __webpack_require__(0);

var _constraint2 = _interopRequireDefault(_constraint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Mixin for methods related to state management
 * @mixin
 */
var WidgetStateMixin = {

  /**
   * Get the current state
   * @public
   * @return {object} this.state
   * @override
   */
  getState: function getState() {
    return this.state;
  },

  /**
   * Set the current state and redraw.
   * If no new state argument is provided, will reassign old state, taking into account the stateConstraints.
   * As opposed to _setState(), does not trigger observer notification.
   * Uses a diffing function, so only state that is different will lead to an update.
   * Will use Widget.stateConstraints to constrain each state value to each constraints min, max, or enum
   * @public
   * @param {object=} newState - The new state.
   * @return {boolean} isChanged - Returns a boolean indicating whether the state has been changed
   */
  setState: function setState(newState) {
    var _this = this;
    var isChanged = false;

    newState = newState || this.getState();

    Object.keys(newState).forEach(function (key) {
      if (_this.state.hasOwnProperty(key) && _this.state[key] !== newState[key]) {
        _this.state[key] = newState[key];

        // constrain the state to the provided constraints
        _this.state[key] = _constraint2.default.constrain(_this.state[key], _this.stateConstraints[key]);

        isChanged = true;
      }
    });

    if (isChanged === true) {
      this._update();
    }

    return isChanged;
  },

  /**
   * Set the current state.
   * As opposed to the public version (setState()), _setState() will call the observer callback functions,
   * so may lead to an infinate loop if an observer calls this method.
   * Uses a diffing function, so only state that is different will lead to an update.
   * @protected
   * @param {object=} newState - The new state.
   * @return {boolean} isChanged - Returns a boolean indicating whether the state has been changed
   */
  _setState: function _setState(newState) {
    var _this = this;

    if (this.setState(newState)) {
      this._notifyObservers();
      return true;
    }

    return false;
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
 * Mixin specifying the xml namespace for SVG
 * @mixin
 */
exports.default = {
  SVG_NS: "http://www.w3.org/2000/svg"
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _widgetMixinSvgns = __webpack_require__(7);

var _widgetMixinSvgns2 = _interopRequireDefault(_widgetMixinSvgns);

var _widgetMixinState = __webpack_require__(6);

var _widgetMixinState2 = _interopRequireDefault(_widgetMixinState);

var _widgetMixinOptions = __webpack_require__(5);

var _widgetMixinOptions2 = _interopRequireDefault(_widgetMixinOptions);

var _widgetMixinObserver = __webpack_require__(4);

var _widgetMixinObserver2 = _interopRequireDefault(_widgetMixinObserver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Abstract base class representing an SVG widget that can be placed inside a DOM container.
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
  }]);

  return Widget;
}();

Object.assign(Widget.prototype, _widgetMixinSvgns2.default);
Object.assign(Widget.prototype, _widgetMixinState2.default);
Object.assign(Widget.prototype, _widgetMixinOptions2.default);
Object.assign(Widget.prototype, _widgetMixinObserver2.default);

exports.default = Widget;

/***/ }),
/* 9 */
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

/***/ })
/******/ ]);