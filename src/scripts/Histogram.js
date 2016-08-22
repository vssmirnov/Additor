(function(){
  'use strict';

  class Histogram {
    constructor (container, o) {
      o = o || {};

      this._observers = [];

      this._numBins = o.numBins || o.numberOfBins || 10;

      this._dataBins = [];
      for (var i = 0; i < this._numBins; i++) {
        this._dataBins.push(0);
      }

      this._minVal = o.minVal || o.minValue || 0;
      this._maxVal = o.maxVal || o.maxValue || 100;

      this._UIBackgroundColor = o.backgroundColor || o.UIBackgroundColor || '#FFF';
      this._UIBarColor = o.barColor || o.UIBarColor || '#000';

      // create the canvas
      this._container = container || document.body;
      this._canvas = document.createElement('canvas');
      this._canvas.width = this._container.clientWidth;
      this._canvas.height = this._container.clientHeight;
      this._container.appendChild(this._canvas);
      this._ctx = this._canvas.getContext('2d');

      this.init();
    }

    init () {
      this.assignListeners();
      this.drawUI();
    }

    set options (o) {
      o = o || {};

      if(o.numBins || o.numberOfBins) {
        this.setUpNewDataBins(o.numBins);
        this._numBins = o.numBins || o.numberOfBins || this.numBins;
      }

      this._minVal = o.minVal || o.minValue || this.minVal;
      this._maxVal = o.maxVal || o.maxValue || this.maxVal;

      this._UIBackgroundColor = o.backgroundColor || o.UIBackgroundColor || this.UIBackgroundColor;
      this._UIBarColor = o.barColor || o.UIBarColor || this.UIBarColor;

      notifyObservers();
      drawUI();
    }

    setOptions (o) {
      o = o || {};
      this.options = o;
    }

    /* --- Observer methods --- */
    subscribe (context, func) {
      this._observers.push({
        context: context,
        func: func
      });
      return this;
    }

    unsubscribe (context, func) {
      this._observers = this._observers.filter(observer => {
        return observer.context !== context || observer.func !== func;
      });
      return this;
    }

    notifyObservers () {
      var _this = this;
      this._observers.forEach(observer => {
        observer.func.call(observer.context, _this._dataBins);
      });
      return this;
    }

    /* --- Getters and setters --- */
    get numBins () {
      return this._numBins;
    }

    set numBins (newNum) {
      this.setUpNewDataBins(newNum);
      this._numBins = newNum;

      this.notifyObservers();
      this.drawUI();
      return this;
    }

    setUpNewDataBins (newNum) {
      if (newNum > this._numBins) {
        for (var i = this._numBins; i < newNum; i++) {
          this._dataBins.push(0);
        }
      } else if (newNum < this._numBins) {
        for (var i = this._numBins; i > newNum; i--) {
          this._dataBins.pop();
        }
      }
      return this;
    }

    get binWidth () {
      var binWidth = this._canvas.width / this.numBins;
      return binWidth;
    }

    get dataBins () {
      return this._dataBins;
    }

    set dataBins (newdataBins) {
      this._dataBins = newdataBins;
      this.notifyObservers();
      this.drawUI();
      return this;
    }

    get minVal () {
      return this._minVal;
    }

    set minVal (newVal) {
      this._minVal = newVal;
      this.drawUI();
      this.notifyObservers();
      return this;
    }

    get maxVal () {
      return this._maxVal;
    }

    set maxVal (newVal) {
      this._maxVal = newVal;
      this.drawUI();
      this.notifyObservers();
      return this;
    }

    get UIBackgroundColor () {
      return this._UIBackgroundColor;
    }

    set UIBackgroundColor (newColor) {
      this._UIBackgroundColor = newColor;
      this.drawUI();
      return this;
    }

    get UIBarColor () {
      return this._UIBarColor;
    }

    set UIBarColor (newColor) {
      this._UIBarColor = newColor;
      this.drawUI();
      return this;
    }

    /* --- Utility methods --- */
    setDataPointByCanvasPos (x, y) {
      var binNum = Math.floor((x / this._canvas.width) * this._numBins);
      var invY = this._canvas.height - y;
      var binVal = (   (this._maxVal - this._minVal)
                     * (invY / this._canvas.height)
                   ) + this._minVal;

      this._dataBins[binNum] = binVal;

      this.notifyObservers();
      this.drawUI();
    }

    binXPos (binNum) {
      return binNum * this.binWidth;
    }

    binYPos (binNum) {
      var binYPos = this._canvas.height
                    - ( (this._dataBins[binNum] - this._minVal)
                       /(this._maxVal - this._minVal)
                      ) * this._canvas.height;
      return binYPos;
    }

    /* --- UI drawing --- */
    drawUI () {
      var binXPos, binYPos;

      this._ctx.fillStyle = this._UIBackgroundColor;
      this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

      for(var i = 0; i < this._numBins; i++) {
        binXPos = this.binXPos(i) + 1;
        binYPos = this.binYPos(i);

        this._ctx.fillStyle = this._UIBarColor;
        this._ctx.fillRect(binXPos, binYPos, this.binWidth - 2, this._canvas.height - binYPos);
      }
    }

    /* --- UI interaction --- */
    assignListeners () {
      var _this = this;

      var boundingClientRect = this._canvas.getBoundingClientRect();
      var canvasX, canvasY;

      this._canvas.addEventListener('mousedown', mouseDownListener);

      function mouseDownListener (e) {
        canvasX = e.clientX - boundingClientRect.left;
        canvasY = e.clientY - boundingClientRect.top;
        _this.setDataPointByCanvasPos(canvasX, canvasY);

        _this._canvas.addEventListener('mousemove', mouseMoveListener);
      }

      function mouseMoveListener (e) {
        canvasX = e.clientX - boundingClientRect.left;
        canvasY = e.clientY - boundingClientRect.top;
        _this.setDataPointByCanvasPos(canvasX, canvasY);

        document.addEventListener('mouseup', mouseUpListener);
      }

      function mouseUpListener () {
        _this._canvas.removeEventListener('mousemove', mouseMoveListener);
      }
    }
  }

  /* --- Module loader and global support --- */

  // support for AMD libraries
  if (typeof define === 'function') {
    define([], function () {
      return Histogram;
    });
  }

  // support for CommonJS libraries
  else if (typeof exports !== 'undefined') {
    exports.Histogram = Histogram;
  }

  // support for window global
  else if (typeof window !== 'undefined') {
    window.Histogram = Histogram;
  }

  // support for Node.js global
  else if (typeof global !== 'undefined') {
    global.Histogram = Histogram;
  }
})();
