(function(){
  'use strict';

  class LiveSlider {
    constructor (container, o) {
      o = o || {};

      // observers get notified of changes to this.value
      this.observers = [];

      // value
      this._value = o.value || 0;
      this._minValue = o.minValue || 0;
      this._maxValue = o.maxValue || 127;

      // display options
      this._displayName = o.displayName || '';
      this._displayNameFontColor = o.displayNameFontColor || 'black';
      this._fontFamily = o.fontFamily || 'Arial';
      this._sliderBarColor = o.sliderBarColor || 'black';
      this._triangleBorderColor = o.triangleBorderColor || 'black';
      this._triangleFillColor = o.triangleFillColor || 'black';

      // drawing context
      this.container = container || document.body;
      this.canvas = document.createElement('canvas');
      this.canvas.height = this.container.offsetHeight;
      this.canvas.width = this.container.offsetWidth;
      this.container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');

      // init
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

    get value () {
      return this._value;
    }

    set value (newValue) {
      this._value = Math.max(Math.min(newValue, this._maxValue), this._minValue);
      this.drawUI();
      this.notify();
      return this;
    }

    // setter used if needed to bind setValue as an observer
    setValue (newValue) {
      this.value = newValue;
    }

    /* --- UI DRAWING -- */
    get sliderBarXPos () {
      var cX = this.canvas.width / 2;
      return cX;
    }

    get displayNameFontSize () {
      var fontSize = Math.trunc(this.sliderBarYOffset);
      return fontSize;
    }

    get sliderBarWidth () {
      return this.canvas.height * 0.02;
    }

    get sliderBarHeight () {
      var sliderBarHeight = this.canvas.height - (this.sliderBarYOffset * 2);
      return sliderBarHeight;
    }

    get sliderBarYOffset () {
      var yOffset = Math.trunc(Math.pow(this.canvas.height, 0.6));
      return yOffset;
    }

    get triangleYPos () {
      var valuePortion = (this._value - this._minValue) / (this._maxValue - this._minValue);
      var valueScaledToSlider = valuePortion * this.sliderBarHeight;
      var triangleYPos = this.canvas.height - valueScaledToSlider - this.sliderBarYOffset;
      return triangleYPos;
    }

    get triangleMedianLength () {
      var triangleMedianLength = this.sliderBarHeight * 0.17;
      return triangleMedianLength;
    }

    get triangleHeight () {
      var triangleHeight = this.triangleMedianLength;
      return triangleHeight;
    }

    drawSliderBar () {
      var cX = this.sliderBarXPos;

      this.ctx.beginPath();
      this.ctx.moveTo(cX, this.sliderBarYOffset);
      this.ctx.lineTo(cX, this.canvas.height - this.sliderBarYOffset);
      this.ctx.strokeStyle = this._sliderBarColor;
      this.ctx.lineWidth = this.sliderBarWidth;
      this.ctx.stroke();
    }

    drawSliderTriangle () {
      var cX = this.sliderBarXPos;

      var sliderBarWidth = this.sliderBarWidth;
      var sliderBarHeight = this.sliderBarHeight;
      var triangleMedian = this.triangleMedianLength;
      var triangleYPos = this.triangleYPos;

      this.ctx.beginPath();
      this.ctx.moveTo(cX, triangleYPos);
      this.ctx.lineTo(cX + triangleMedian, triangleYPos - (this.triangleHeight*0.5));
      this.ctx.lineTo(cX + triangleMedian, triangleYPos + (this.triangleHeight*0.5));
      this.ctx.lineTo(cX, triangleYPos);
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
      this.ctx.fill();
    }

    drawDisplayName () {
      this.ctx.font = this.displayNameFontSize + 'px ' + this._fontFamily;
      this.ctx.fillStyle = this._displayNameFontColor;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this._displayName, this.sliderBarXPos, this.sliderBarYOffset - this.sliderBarYOffset/5);
    }

    drawValueDisplay () {
      this.ctx.font = this.displayNameFontSize + 'px ' + this._fontFamily;
      this.ctx.fillStyle = this._displayNameFontColor;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this._value, this.sliderBarXPos, this.canvas.height - this.sliderBarYOffset + this.displayNameFontSize);
    }

    drawUI () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawSliderBar();
      this.drawSliderTriangle();
      this.drawDisplayName();
      this.drawValueDisplay();
    }

    /* --- UI INTERACTION --- */

    /**
     * Is (x, y) within the active area for the slider?
     */
    isWithinSliderBarActiveArea (x, y) {
      var xThreshold = 4;

      if (y <= (this.canvas.height - this.sliderBarYOffset) && y >= this.sliderBarYOffset) {
        if (x >= (this.sliderBarXPos - xThreshold) && x <= (this.sliderBarXPos + xThreshold)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Is (x, y) inside the triangle handle?
     */
    isWithinTriangle (x, y) {
      var _this = this;

      var leftTriangleEdge = this.sliderBarXPos;
      var rightTriangleEdge = leftTriangleEdge + this.triangleMedianLength;
      var xWithinTriangle = x - leftTriangleEdge;

      function triangleHypotenuseY(x) {
        var angle = Math.atan((_this.triangleHeight * 0.5)/_this.triangleMedianLength);
        var hypY = Math.tan(angle) * x;
        return hypY;
      }

      if (x >= leftTriangleEdge && x <= rightTriangleEdge) {
        if (y >= this.triangleYPos - triangleHypotenuseY(xWithinTriangle) &&
            y <= this.triangleYPos + triangleHypotenuseY(xWithinTriangle)) {
          return true;
        }
      }
      return false;
    }

    assignListeners () {
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
        var canvasTop = _this.canvas.getBoundingClientRect().top;
        var sliderBarHeight = _this.sliderBarHeight;
        var sliderY = sliderBarHeight - (e.clientY - canvasTop - _this.sliderBarYOffset);
        var newSliderValue = Math.trunc((sliderY/sliderBarHeight) * (_this._maxValue - _this._minValue) + _this._minValue);

        _this.value = newSliderValue;
      }

      function mouseUpHandler(e) {
        document.removeEventListener('mousemove', setSliderValueByMousePos);
      }
    }
  }

  /* --- Module loader and global support --- */

  // support for AMD libraries
  if (typeof define === 'function') {
    define([], function () {
      return LiveSlider;
    });
  }

  // support for CommonJS libraries
  else if (typeof exports !== 'undefined') {
    exports.LiveSlider = LiveSlider;
  }

  // support for window global
  else if (typeof window !== 'undefined') {
    window.LiveSlider = LiveSlider;
  }

  // support for Node.js global
  else if (typeof global !== 'undefined') {
    global.LiveSlider = LiveSlider;
  }
})();
