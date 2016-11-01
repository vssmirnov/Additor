'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  /** Class representing a histogram */

  var Histogram = function () {

    /**
     * Create a Histogram
     * @param {object} [o] - Options object.
     * @param {object} [o.container=document.body] - The DOM element that wraps the widget canvas.
     * @param {number} [o.numBins=10] - The number of bins (lines representing a chunk of data) in the histogram.
     * @param {number} [o.minVal=0] - The minimum possible value of each bin.
     * @param {number} [o.maxVal=100] - The maximum possible value of each bin.
     * @param {string} [o.backgroundColor='#fff'] - The UI background color.
     * @param {string} [o.barColor='#000'] - The color of the bars that represent the data bins.
     */
    function Histogram(o) {
      _classCallCheck(this, Histogram);

      o = o || {};

      this._observers = [];

      this._numBins = o.numBins || o.numBars || o.numberOfBins || 10;

      this._dataBins = [];
      for (var i = 0; i < this._numBins; i++) {
        this._dataBins.push(0);
      }

      this._minVal = o.minVal || o.minValue || 0;
      this._maxVal = o.maxVal || o.maxValue || 100;

      this._UIBackgroundColor = o.backgroundColor || o.UIBackgroundColor || '#FFF';
      this._UIBarColor = o.barColor || o.UIBarColor || '#000';

      // create the canvas
      this._container = o.container || document.body;
      this._container.style.position = 'relative';
      this._canvas = document.createElement('canvas');
      this._canvas.width = this._container.clientWidth;
      this._canvas.height = this._container.clientHeight;
      this._container.appendChild(this._canvas);
      this._canvas.style.position = 'absolute';
      this._canvas.style.left = '0px';
      this._canvas.style.top = '0px';
      this._ctx = this._canvas.getContext('2d');

      this.init();

      return this;
    }

    _createClass(Histogram, [{
      key: 'init',
      value: function init() {
        this.assignListeners();
        this.drawUI();
        this._listenForResize();
      }

      /* --- Options --- */

    }, {
      key: 'setOptions',
      value: function setOptions(o) {
        o = o || {};
        this.options = o;
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
      key: 'setUpNewDataBins',
      value: function setUpNewDataBins(newNum) {
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
    }, {
      key: 'setBinVal',
      value: function setBinVal(binNum, val) {
        this._dataBins[binNum] = val;
        this.drawUI();
        return this;
      }
    }, {
      key: 'subscribe',


      /* --- Observer methods --- */
      value: function subscribe(context, func) {
        this._observers.push({
          context: context,
          func: func
        });
        return this;
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe(context, func) {
        this._observers = this._observers.filter(function (observer) {
          return observer.context !== context || observer.func !== func;
        });
        return this;
      }
    }, {
      key: 'notifyObservers',
      value: function notifyObservers() {
        var _this = this;
        this._observers.forEach(function (observer) {
          observer.func.call(observer.context, _this._dataBins);
        });
        return this;
      }

      /* --- Utility methods --- */

    }, {
      key: 'setDataPointByCanvasPos',
      value: function setDataPointByCanvasPos(x, y) {
        var binNum = Math.floor(x / this._canvas.width * this._numBins);
        var invY = this._canvas.height - y;
        var binVal = (this._maxVal - this._minVal) * (invY / this._canvas.height) + this._minVal;

        this._dataBins[binNum] = binVal;

        this.notifyObservers();
        this.drawUI();
      }
    }, {
      key: 'binXPos',
      value: function binXPos(binNum) {
        return binNum * this.binWidth;
      }
    }, {
      key: 'binYPos',
      value: function binYPos(binNum) {
        var binYPos = this._canvas.height - (this._dataBins[binNum] - this._minVal) / (this._maxVal - this._minVal) * this._canvas.height;
        return binYPos;
      }

      /* --- UI drawing --- */

    }, {
      key: 'drawUI',
      value: function drawUI() {
        var binXPos = void 0,
            binYPos = void 0;

        this._ctx.fillStyle = this._UIBackgroundColor;
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

        for (var i = 0; i < this._numBins; i++) {
          binXPos = this.binXPos(i) + 1;
          binYPos = this.binYPos(i);

          this._ctx.fillStyle = this._UIBarColor;
          this._ctx.fillRect(binXPos, binYPos, this.binWidth - 2, this._canvas.height - binYPos);
        }
      }

      /* --- UI interaction --- */

    }, {
      key: 'assignListeners',
      value: function assignListeners() {
        var _this = this;

        var boundingClientRect = void 0;
        var canvasX = void 0,
            canvasY = void 0;

        this._canvas.addEventListener('mousedown', mouseDownListener);
        this._canvas.addEventListener('touchstart', mouseDownListener);

        function mouseDownListener(e) {
          e.preventDefault();

          boundingClientRect = _this._canvas.getBoundingClientRect();

          if (e.type === 'touchstart') {
            e.clientX = e.touches[0].clientX;
            e.clientY = e.touches[0].clientY;
          }

          canvasX = e.clientX - boundingClientRect.left;
          canvasY = e.clientY - boundingClientRect.top;
          _this.setDataPointByCanvasPos(canvasX, canvasY);

          _this._canvas.addEventListener('mousemove', mouseMoveListener);
          _this._canvas.addEventListener('touchmove', mouseMoveListener);
        }

        function mouseMoveListener(e) {
          if (e.type === 'touchmove') {
            e.clientX = e.touches[0].clientX;
            e.clientY = e.touches[0].clientY;
          }

          canvasX = e.clientX - boundingClientRect.left;
          canvasY = e.clientY - boundingClientRect.top;
          _this.setDataPointByCanvasPos(canvasX, canvasY);

          document.addEventListener('mouseup', mouseUpListener);
          document.addEventListener('touchend', mouseUpListener);
        }

        function mouseUpListener() {
          _this._canvas.removeEventListener('mousemove', mouseMoveListener);
          _this._canvas.removeEventListener('touchmove', mouseMoveListener);
        }
      }

      /**
       * Listens for whether the container's dimensions changed and resize the canvas if they did
       */

    }, {
      key: '_listenForResize',
      value: function _listenForResize() {
        var _this = this;

        // on window resize, adjust the canvas size in case the container size changes
        window.addEventListener('resize', windowResizeThrottle);

        function windowResizeThrottle() {
          window.requestAnimationFrame(windowResize);
        }

        function windowResize() {
          _this._canvas.width = _this._container.clientWidth;
          _this._canvas.height = _this._container.clientHeight;

          _this.drawUI();
        }
      }
    }, {
      key: 'options',
      set: function set(o) {
        o = o || {};

        if (o.canvasWidth) this.canvasWidth = o.canvasWidth;
        if (o.canvasHeight) this.canvasHeight = o.canvasHeight;

        if (o.numBins || o.numberOfBins) {
          this.setUpNewDataBins(o.numBins);
          this._numBins = o.numBins || o.numberOfBins || this.numBins;
        }

        if (o.minVal || o.minValue) this.minVal = o.minVal || o.minValue;
        if (o.maxVal || o.maxValue) this.maxVal = o.maxVal || o.maxValue;

        if (o.backgroundColor || o.UIBackgroundColor) this.UIBackgroundColor = o.backgroundColor || o.UIBackgroundColor;
        if (o.barColor || o.UIBarColor) this.UIBarColor = o.barColor || o.UIBarColor;

        this.notifyObservers();
        this.drawUI();
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
      key: 'numBins',
      get: function get() {
        return this._numBins;
      },
      set: function set(newNum) {
        this.setUpNewDataBins(newNum);
        this._numBins = newNum;

        this.notifyObservers();
        this.drawUI();
        return this;
      }
    }, {
      key: 'binWidth',
      get: function get() {
        var binWidth = this._canvas.width / this.numBins;
        return binWidth;
      }
    }, {
      key: 'dataBins',
      get: function get() {
        return this._dataBins;
      },
      set: function set(newdataBins) {
        this._dataBins = newdataBins;
        this.notifyObservers();
        this.drawUI();
        return this;
      }
    }, {
      key: 'minVal',
      get: function get() {
        return this._minVal;
      },
      set: function set(newVal) {
        this._minVal = newVal;
        this.drawUI();
        this.notifyObservers();
        return this;
      }
    }, {
      key: 'maxVal',
      get: function get() {
        return this._maxVal;
      },
      set: function set(newVal) {
        this._maxVal = newVal;
        this.drawUI();
        this.notifyObservers();
        return this;
      }
    }, {
      key: 'UIBackgroundColor',
      get: function get() {
        return this._UIBackgroundColor;
      },
      set: function set(newColor) {
        this._UIBackgroundColor = newColor;
        this.drawUI();
        return this;
      }
    }, {
      key: 'UIBarColor',
      get: function get() {
        return this._UIBarColor;
      },
      set: function set(newColor) {
        this._UIBarColor = newColor;
        this.drawUI();
        return this;
      }
    }]);

    return Histogram;
  }();

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