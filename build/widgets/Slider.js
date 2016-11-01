'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  /** Class representing a slider widget */

  var Slider = function () {

    /**
     * Create a slider
     * @param {object} [o] - Options object.
     * @param {object} [o.container=document.body] - The DOM element that wraps the widget canvas.
     * @param {number} [o.value=0] - The initial value for the slider.
     * @param {number} [o.minVal=0] - The minimum possible value the slider can represent.
     * @param {number} [o.maxVal=127] - The maximum possible value teh slider can represent.
     * @param {string} [o.sliderBarColor='#000'] - The color of the slider bar.
     * @param {string} [o.triangleBorderColor='#000'] - The color of the triangle used as the slider's needle.
     * @param {string} [o.triangleFillColor='#000'] - The fill color for the slider's triangle needle.
     */
    function Slider(o) {
      _classCallCheck(this, Slider);

      o = o || {};

      // observers get notified of changes to this.value
      this.observers = [];

      // value
      this._value = o.value || 0;
      this._minValue = o.minVal || o.minValue || 0;
      this._maxValue = o.maxVal || o.maxValue || 127;

      // display options
      this._sliderBarColor = o.sliderBarColor || 'black';
      this._triangleBorderColor = o.triangleBorderColor || 'black';
      this._triangleFillColor = o.triangleFillColor || 'black';

      // drawing context
      this.container = o.container || document.body;
      this.canvas = document.createElement('canvas');
      this.canvas.height = this.container.clientHeight;
      this.canvas.width = this.container.clientWidth;
      this.container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');

      // init
      this.drawUI();
      this.assignListeners();

      return this;
    }

    /* --- Observer methods --- */


    _createClass(Slider, [{
      key: 'subscribe',
      value: function subscribe(context, func) {
        this.observers.push({
          func: func,
          context: context
        });
        return this;
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe(context, func) {
        this.observers = this.observers.filter(function (observer) {
          return observer.func !== func || observer.context !== context;
        });
        return this;
      }
    }, {
      key: 'notify',
      value: function notify() {
        var _this = this;
        this.observers.forEach(function (observer) {
          observer.func.call(observer.context, _this._value);
        });
      }

      /* --- Getters and setters --- */

    }, {
      key: 'setCanvasWidth',
      value: function setCanvasWidth(newWidth) {
        this.canvasWidth = newWidth;
      }
    }, {
      key: 'setCanvasHeight',
      value: function setCanvasHeight(newHeight) {
        this.canvasHeight = newHeight;
      }
    }, {
      key: 'setValue',


      // setter used if needed to bind setValue as an observer
      value: function setValue(newValue) {
        this.value = newValue;
      }

      /* --- UI DRAWING -- */

    }, {
      key: 'drawSliderBar',
      value: function drawSliderBar() {
        var cX = this.sliderBarXPos;

        this.ctx.beginPath();
        this.ctx.moveTo(cX, this.sliderBarYOffset);
        this.ctx.lineTo(cX, this.canvas.height - this.sliderBarYOffset);
        this.ctx.strokeStyle = this._sliderBarColor;
        this.ctx.lineWidth = 2 * Math.round(this.sliderBarWidth / 2);
        this.ctx.stroke();
      }
    }, {
      key: 'drawSliderTriangle',
      value: function drawSliderTriangle() {
        var cX = this.sliderBarXPos;

        var sliderBarWidth = this.sliderBarWidth;
        var sliderBarHeight = this.sliderBarHeight;
        var triangleMedian = this.triangleMedianLength;
        var triangleYPos = this.triangleYPos;

        this.ctx.beginPath();
        this.ctx.moveTo(cX, triangleYPos);
        this.ctx.lineTo(cX + triangleMedian, triangleYPos - this.triangleHeight * 0.5);
        this.ctx.lineTo(cX + triangleMedian, triangleYPos + this.triangleHeight * 0.5);
        this.ctx.lineTo(cX, triangleYPos);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.fill();
      }
    }, {
      key: 'drawUI',
      value: function drawUI() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawSliderBar();
        this.drawSliderTriangle();
      }

      /* --- UI INTERACTION --- */

      /**
       * Is (x, y) within the active area for the slider?
       */

    }, {
      key: 'isWithinSliderBarActiveArea',
      value: function isWithinSliderBarActiveArea(x, y) {
        var xThreshold = 4;

        if (y <= this.canvas.height - this.sliderBarYOffset && y >= this.sliderBarYOffset) {
          if (x >= this.sliderBarXPos - xThreshold && x <= this.sliderBarXPos + xThreshold) {
            return true;
          }
        }
        return false;
      }

      /**
       * Is (x, y) inside the triangle handle?
       */

    }, {
      key: 'isWithinTriangle',
      value: function isWithinTriangle(x, y) {
        var _this = this;

        var leftTriangleEdge = this.sliderBarXPos;
        var rightTriangleEdge = leftTriangleEdge + this.triangleMedianLength;
        var xWithinTriangle = x - leftTriangleEdge;

        function triangleHypotenuseY(x) {
          var angle = Math.atan(_this.triangleHeight * 0.5 / _this.triangleMedianLength);
          var hypY = Math.tan(angle) * x;
          return hypY;
        }

        if (x >= leftTriangleEdge && x <= rightTriangleEdge) {
          if (y >= this.triangleYPos - triangleHypotenuseY(xWithinTriangle) && y <= this.triangleYPos + triangleHypotenuseY(xWithinTriangle)) {
            return true;
          }
        }
        return false;
      }
    }, {
      key: 'assignListeners',
      value: function assignListeners() {
        var _this = this;

        this.canvas.addEventListener('mousedown', mouseDownHandler);

        function mouseDownHandler(e) {
          var canvasBoundingClientRect = _this.canvas.getBoundingClientRect();
          var x = e.clientX - canvasBoundingClientRect.left;
          var y = e.clientY - canvasBoundingClientRect.top;

          if (_this.isWithinSliderBarActiveArea(x, y)) {
            setSliderValueByMousePos(e);
          }

          if (_this.isWithinTriangle(x, y)) {
            document.addEventListener('mousemove', setSliderValueByMousePos);
            document.addEventListener('mouseup', mouseUpHandler);
          };
        }

        function setSliderValueByMousePos(e) {
          e.preventDefault();

          var canvasTop = _this.canvas.getBoundingClientRect().top;
          var sliderBarHeight = _this.sliderBarHeight;
          var sliderY = sliderBarHeight - (e.clientY - canvasTop - _this.sliderBarYOffset);
          var newSliderValue = Math.trunc(sliderY / sliderBarHeight * (_this._maxValue - _this._minValue) + _this._minValue);

          _this.value = newSliderValue;
        }

        function mouseUpHandler(e) {
          document.removeEventListener('mousemove', setSliderValueByMousePos);
        }
      }
    }, {
      key: 'canvasWidth',
      set: function set(newWidth) {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._canvas.width = newWidth;
        this.drawUI();
        return this;
      }
    }, {
      key: 'canvasHeight',
      set: function set(newHeight) {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._canvas.height = newHeight;
        this.drawUI();
        return this;
      }
    }, {
      key: 'value',
      get: function get() {
        return this._value;
      },
      set: function set(newValue) {
        this._value = Math.max(Math.min(newValue, this._maxValue), this._minValue);
        this.drawUI();
        this.notify();
        return this;
      }
    }, {
      key: 'sliderBarXPos',
      get: function get() {
        var cX = Math.trunc(this.sliderBarWidth);
        return cX;
      }
    }, {
      key: 'sliderBarWidth',
      get: function get() {
        var sliderBarWidth = Math.trunc(this.canvas.height * 0.02);
        return sliderBarWidth;
      }
    }, {
      key: 'sliderBarYOffset',
      get: function get() {
        var yOffset = 5;
        return yOffset;
      }
    }, {
      key: 'sliderBarHeight',
      get: function get() {
        var sliderBarHeight = Math.trunc(this.canvas.height - this.sliderBarYOffset * 2);
        return sliderBarHeight;
      }
    }, {
      key: 'triangleYPos',
      get: function get() {
        var valuePortion = (this._value - this._minValue) / (this._maxValue - this._minValue);
        var valueScaledToSlider = valuePortion * this.sliderBarHeight;
        var triangleYPos = this.canvas.height - valueScaledToSlider - this.sliderBarYOffset;
        return triangleYPos;
      }
    }, {
      key: 'triangleMedianLength',
      get: function get() {
        var triangleMedianLength = this.sliderBarHeight * 0.13;
        return triangleMedianLength;
      }
    }, {
      key: 'triangleHeight',
      get: function get() {
        var triangleHeight = this.triangleMedianLength;
        return triangleHeight;
      }
    }]);

    return Slider;
  }();

  /* --- Module loader and global support --- */

  // support for AMD libraries


  if (typeof define === 'function') {
    define([], function () {
      return Slider;
    });
  }

  // support for CommonJS libraries
  else if (typeof exports !== 'undefined') {
      exports.Slider = Slider;
    }

    // support for window global
    else if (typeof window !== 'undefined') {
        window.Slider = Slider;
      }

      // support for Node.js global
      else if (typeof global !== 'undefined') {
          global.Slider = Slider;
        }
})();