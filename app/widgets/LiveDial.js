'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  var LiveDial = function () {
    function LiveDial(o) {
      _classCallCheck(this, LiveDial);

      o = o || {};

      this.observers = [];

      // value
      this._value = o.value || 0;
      this._minValue = o.minVal || o.minValue || 0;
      this._maxValue = o.maxVal || o.maxValue || 127;

      // display options
      this._needleColor = o.needleColor || '#000';
      this._activeColor = o.activeColor || '#0f0'; //'#f40';
      this._fontFamily = o.fontFamily || 'Arial';

      // set up the canvas
      this._container = o.container || document.body;
      this._canvas = document.createElement('canvas');
      this._canvas.width = this._container.clientWidth;
      this._canvas.height = this._container.clientHeight;
      this._container.appendChild(this._canvas);
      this._ctx = this._canvas.getContext('2d');

      this.init();

      return this;
    }

    _createClass(LiveDial, [{
      key: 'init',
      value: function init() {
        this.drawUI();
        this.assignListeners();
      }

      /* --- Observer methods --- */

    }, {
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
      value: function setValue(newValue) {
        this.value = newValue;
      }
    }, {
      key: 'getValue',
      value: function getValue() {
        return this._value;
      }

      /* --- UI DRAWING --- */

    }, {
      key: 'drawUI',
      value: function drawUI() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        var cX = this.cX;
        var cY = this.cY;

        var dialRadius = this.r;

        // calculate the needle angle
        var needleAngle = (this._value - this._minValue) / (this._maxValue - this._minValue) * 1.7 * Math.PI + 1.15 * Math.PI;
        var needleEndX = cX + Math.sin(needleAngle) * dialRadius;
        var needleEndY = cY - Math.cos(needleAngle) * dialRadius;

        // draw the background circle
        this._ctx.beginPath();
        this._ctx.arc(cX, cY, dialRadius, 0.65 * Math.PI, 2.35 * Math.PI);
        this._ctx.lineWidth = dialRadius / 5;
        this._ctx.strokeStyle = this._needleColor;
        this._ctx.stroke();

        // draw the active circle
        this._ctx.beginPath();
        this._ctx.arc(cX, cY, dialRadius, 0.64 * Math.PI, needleAngle - 0.51 * Math.PI);
        this._ctx.lineWidth = dialRadius / 5;
        this._ctx.strokeStyle = this._activeColor;
        this._ctx.stroke();

        // draw the needle
        this._ctx.beginPath();
        this._ctx.moveTo(cX, cY);
        this._ctx.lineTo(needleEndX, needleEndY);
        this._ctx.lineCap = 'round';
        this._ctx.lineWidth = dialRadius / 5;
        this._ctx.strokeStyle = this._needleColor;
        this._ctx.stroke();
      }

      /* --- UI INTERACTION --- */

      /** Leeway threshold (in px) for which a click is considered to be within boundary */

    }, {
      key: 'assignListeners',
      value: function assignListeners() {
        var _this = this;

        var canvasBoundingClientRect = this._canvas.getBoundingClientRect();
        var turnStartVal = void 0,
            turnDelta = void 0,
            newVal = void 0;

        this._canvas.addEventListener('mousedown', beginTurningListener);

        function beginTurningListener(e) {
          var canvasX = e.clientX - canvasBoundingClientRect.left;
          var canvasY = e.clientY - canvasBoundingClientRect.top;
          var clickRadius = Math.hypot(canvasX - _this.cX, canvasY - _this.cY);

          // if the click is within radius from the center
          if (clickRadius < _this.r + _this.clickThresh && clickRadius > _this.r - _this.clickThresh) {
            console.log('click on dial radius');
          }

          turnStartVal = e.clientY;

          document.addEventListener('mousemove', continueTurningListener);
        }

        function continueTurningListener(e) {
          e.preventDefault();

          turnDelta = Math.trunc((turnStartVal - e.clientY) * 0.7);

          if (_this._value + turnDelta > _this._maxValue || _this._value + turnDelta < _this._minValue) {
            turnStartVal = e.clientY;
          } else {
            _this.setValue(_this._value + turnDelta);
          }

          document.addEventListener('mouseup', endTurningListener);
        }

        function endTurningListener(e) {
          document.removeEventListener('mousemove', continueTurningListener);
          document.removeEventListener('mouseup', endTurningListener);
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
      set: function set(newValue) {
        this._value = Math.max(Math.min(newValue, this._maxValue), this._minValue);
        this.drawUI();
        this.notify();
        return this;
      },
      get: function get() {
        return this._value;
      }
    }, {
      key: 'r',
      get: function get() {
        return Math.trunc(Math.min(this.cX, this.cY) * 0.9);
      }
    }, {
      key: 'cX',
      get: function get() {
        return Math.trunc(this._canvas.width / 2);
      }
    }, {
      key: 'cY',
      get: function get() {
        return Math.trunc(this._canvas.height / 2);
      }
    }, {
      key: 'clickThresh',
      get: function get() {
        return 3;
      }
    }]);

    return LiveDial;
  }();

  /* --- Module loader and global support --- */

  // support for AMD libraries


  if (typeof define === 'function') {
    define([], function () {
      return LiveDial;
    });
  }

  // support for CommonJS libraries
  else if (typeof exports !== 'undefined') {
      exports.LiveDial = LiveDial;
    }

    // support for window global
    else if (typeof window !== 'undefined') {
        window.LiveDial = LiveDial;
      }

      // support for Node.js global
      else if (typeof global !== 'undefined') {
          global.LiveDial = LiveDial;
        }
})();
