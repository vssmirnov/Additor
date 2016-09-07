(function(){
  'use strict';

  class LiveDial {
    constructor (o) {
      o = o || {};

      this.observers = [];

      // value
      this._value = o.value || 0;
      this._minValue = o.minVal || o.minValue || 0;
      this._maxValue = o.maxVal || o.maxValue || 127;

      // display options
      this._needleColor = o.needleColor || '#000';
      this._activeColor = o.activeColor || '#f40';
      this._fontFamily = o.fontFamily || 'Arial';

      // set up the canvas
      this._container = o.container || document.body;
      this._canvas = document.createElement('canvas');
      this._canvas.width = this._container.clientWidth;
      this._canvas.height = this._container.clientHeight;
      this._container.appendChild(this._canvas);
      this._ctx = this._canvas.getContext('2d');

      this.init();
    }

    init () {
      this.drawUI();
      this.assignListeners();
    }

    /* --- Observer methods --- */
    subscribe (context, func) {
      this.observers.push({
        func: func,
        context: context
      });
      return this;
    }

    unsubscribe (context, func) {
      this.observers = this.observers.filter(observer => {
        return observer.func !== func || observer.context !== context;
      });
      return this;
    }

    notify () {
      var _this = this;
      this.observers.forEach(observer => {
        observer.func.call(observer.context, _this._value);
      });
    }

    /* --- Getters and setters --- */
    set canvasWidth (newWidth) {
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
      this._canvas.width = newWidth;
      this.drawUI()
      return this;
    }

    setCanvasWidth (newWidth) {
      this.canvasWidth = newWidth;
    }

    set canvasHeight (newHeight) {
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
      this._canvas.height = newHeight;
      this.drawUI();
      return this;
    }

    setCanvasHeight (newHeight) {
      this.canvasHeight = newHeight;
    }

    set value (newValue) {
      this._value = Math.max(Math.min(newValue, this._maxValue), this._minValue);
      this.drawUI();
      this.notify();
      return this;
    }

    get value () {
      return this._value;
    }

    setValue (newValue) {
      this.value = newValue;
    }

    getValue () {
      return this._value;
    }

    /* --- UI DRAWING --- */
    get cX () {
      return Math.trunc(this._canvas.width / 2);
    }

    get cY () {
      return Math.trunc(this._canvas.height / 2);
    }

    drawUI () {
      this._ctx.clearRect(0,0, this._canvas.width, this._canvas.height);

      var cX = this.cX;
      var cY = this.cY;

      var dialRadius = Math.trunc(Math.min(cX, cY) * 0.9);

      // calculate the needle angle
      var needleAngle = (this._value / this._maxValue) * 1.7*Math.PI + (1.15 * Math.PI);
      var needleEndX = cX + (Math.sin(needleAngle) * dialRadius);
      var needleEndY = cY - (Math.cos(needleAngle) * dialRadius);

      // draw the background circle
      this._ctx.beginPath();
      this._ctx.arc(cX, cY, dialRadius, 0.65*Math.PI, 2.35*Math.PI);
      this._ctx.lineWidth = dialRadius / 5;
      this._ctx.strokeStyle = this._needleColor;
      this._ctx.stroke();

      // draw the active circle
      this._ctx.beginPath();
      this._ctx.arc(cX, cY, dialRadius, 0.64*Math.PI, needleAngle - 0.51*Math.PI);
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
    assignListeners () {
      var _this = this;

      var turnStartVal, turnDelta, newVal;
      var canvasBoundingClientRect = this._canvas.getBoundingClientRect();

      this._canvas.addEventListener('mousedown', beginTurningListener);

      function beginTurningListener(e) {
        var canvasX = e.clientX - canvasBoundingClientRect.left;
        var canvasY = e.clientY - canvasBoundingClientRect.top;
        console.log('click XY: ' + canvasX + ', ' + canvasY + '\ncX, cY' + _this.cX + ', ' + _this.cY);

        turnStartVal = e.clientY;

        document.addEventListener('mousemove', continueTurningListener);
      }

      function continueTurningListener (e) {
        e.preventDefault()

        turnDelta = Math.trunc((turnStartVal - e.clientY) * 0.1);

        if((_this._value + turnDelta > _this._maxValue) || (_this._value + turnDelta < _this._minValue)) {
            turnStartVal = e.clientY;
        } else {
          _this.setValue(_this._value + turnDelta);
        }

        document.addEventListener('mouseup', endTurningListener);
      }

      function endTurningListener (e) {
        document.removeEventListener('mousemove', continueTurningListener);
        document.removeEventListener('mouseup', endTurningListener);
      }
    }
  }

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
