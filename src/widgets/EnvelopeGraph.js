(function(){
  'use strict';

  class EnvelopeGraph {
    constructor(container, o){
      o = o || {};

      this._observers = [];

      this._container = container || window.document.body;

      this._dataPoints = [];

      this._minXValue = o.minXValue || 0;
      this._maxXValue = o.maxXValue || 100;
      this._minYValue = o.minYValue || 0;
      this._maxYValue = o.maxYValue || 100;

      // quantize is the smallest incremental interval for data points
      this._quantizeX = o.quantizeX || 1;
      this._quantizeY = o.quantizeY || 1;

      // fixed start and end points
      this._hasFixedStartPoint = o.hasFixedStartPoint || false;
      this._hasFixedEndPoint = o.hasFixedEndPoint || false;

      this._fixedStartPointY = o.fixedStartPointY || o.fixedStartPoint || 0;
      this._fixedEndPointY = o.fixedEndPointY || o.fixedEndPoint || 0;

      // create fixed start and end points, if used
      if (this._hasFixedStartPoint === true) {
        this._dataPoints.push([this._minXValue, this._fixedStartPointY]);
      }
      if (this._hasFixedEndPoint === true) {
        this._dataPoints.push([this._maxXValue, this._fixedEndPointY]);
      }

      this._UIVertexColor = o.vertexColor || o.UIVertexColor || '#000';
      this._UILineColor = o.lineColor || o.UILineColor || '#000';
      this._UIBackgroundColor = o.backgroundColor || o.UIBackgroundColor || '#FFF';
      this._UIVertexRadius = o.vertexRadius || o.UIVertexRadius || 3;

      this._canvas = window.document.createElement('canvas');
      this._canvas.width = this._container.clientWidth;
      this._canvas.height = this._container.clientHeight;
      this._container.appendChild(this._canvas);
      this._ctx = this._canvas.getContext('2d');

      this.assignListeners();
      this.drawUI();
    }

    /* --- Options --- */
    set options (o) {
      o = o || {};

      if (o.canvasWidth) this.canvasWidth = o.canvasWidth;
      if (o.canvasHeight) this.canvasHeight = o.canvasHeight;

      if (o.container) this.container = o.container;

      if (o.minXValue) this.minXValue = o.minXValue;
      if (o.maxXValue) this.maxXValue = o.maxXValue;
      if (o.minYValue) this.minYValue = o.minYValue;
      if (o.maxYValue) this.maxYValue = o.maxYValue;

      if (o.fixedStartPointY) this.fixedStartPointY = o.fixedStartPointY;
      if (o.fixedEndPointY) this.fixedEndPointY = o.fixedEndPointY;
      if (o.hasFixedStartPoint) this.hasFixedStartPoint = o.hasFixedStartPoint;
      if (o.hasFixedEndPoint) this.hasFixedEndPoint = o.hasFixedEndPoint;

      if (o.vertexColor || o.UIVertexColor) this.UIVertexColor = o.vertexColor || o.UIVertexColor;
      if (o.lineColor || o.UILineColor) this.UILineColor = o.lineColor || o.UILineColor;
      if (o.backgroundColor || o.UIBackgroundColor) this.UIBackgroundColor = o.backgroundColor || o.UIBackgroundColor;
      if (o.vertexRadius || o.UIVertexRadius) this.UIVertexRadius = o.vertexRadius || o.UIVertexRadius;

      this.notifyObservers();
      this.drawUI();

      return this;
    }

    setOptions (o) {
      o = o || {};
      this.options = o;
      return this;
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

    get dataPoints () {
      return this._dataPoints;
    }

    set dataPoints (newDataPoints) {
      this._dataPoints  = newDataPoints;
      this.drawUI();
      this.notifyObservers();
      return this;
    }

    get minXValue () {
      return this._minXValue;
    }

    set minXValue (newVal) {
      this._minXValue = newVal;
      return this;
    }

    get maxXValue () {
      return this._maxXValue;
    }

    set maxXValue (newVal) {
      this._maxXValue = newVal;
      return this;
    }

    get minYValue () {
      return this._minYValue;
    }

    set minYValue (newVal) {
      this._minYValue = newVal;
      return this;
    }

    get maxYValue () {
      return this._maxYValue;
    }

    set maxYValue (newVal) {
      this._maxYValue = newVal;
      return this;
    }

    get quantizeX () {
      return this._quantizeX;
    }

    set quantizeX (newVal) {
      this._quantizeX = newVal;
      return this;
    }

    get quantizeY () {
      return this._quantizeY;
    }

    set quantizeY (newVal) {
      this._quantizeY = newVal;
      return this;
    }

    get domain () {
      return this._maxXValue - this._minXValue;
    }

    get range () {
      return this._maxYValue - this._minYValue;
    }

    get UIPointColor () {
      return this._UIVertexColor;
    }

    set UIPointColor (newColor) {
      this._UIVertexColor = newColor;
      this.drawUI();
      return this;
    }

    get UILineColor () {
      return this._UILineColor;
    }

    set UILineColor (newColor) {
      this._UILineColor = newColor;
      this.drawUI();
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

    get UIVertexRadius () {
      var UIVertexRadius = Math.min(this._canvas.width, this._canvas.height)
                           * 0.015;
      this._UIVertexRadius = Math.max(UIVertexRadius, 2);
      return this._UIVertexRadius;
    }

    set UIVertexRadius (newRadius) {
      this._UIVertexRadius = newRadius;
      this.drawUI();
      return this;
    }

    set fixedStartPointY (newY) {
      this._fixedStartPointY = newY;

      if (this._hasFixedStartPoint === true) {
        this._dataPoints[0] = [this._minXValue, this._fixedStartPointY];
      }

      this.notifyObservers();
      this.drawUI();
      return this;
    }

    setFixedStartPointY (newY) {
      this.fixedStartPointY = newY;
      return this;
    }

    set fixedEndPointY (newY) {
      this._fixedEndPointY = newY;

      if (this._hasFixedEndPoint === true) {
        this._dataPoints[this._dataPoints.length - 1] = [this._maxXValue, this._fixedEndPointY];
      }

      this.notifyObservers();
      this.drawUI();
      return this;
    }

    setFixedEndPointY (newY) {
      this.fixedEndPointY = newY;
      return this;
    }

    set hasFixedStartPoint (isTrue) {
      if (this._hasFixedStartPoint === false && isTrue === true) {
        this._hasFixedStartPoint = true;
        this._dataPoints.push([this._minXValue, this._fixedStartPointY]);
        this.sortDataPoints();
        this.notifyObservers();
        this.drawUI();
      } else if (this._hasFixedStartPoint === true && isTrue === false) {
        this._hasFixedStartPoint = false;
        this._dataPoints.splice(0, 1);
        this.notifyObservers();
        this.drawUI();
      }
    }

    set hasFixedEndPoint (isTrue) {
      if (this._hasFixedEndPoint === false && isTrue === true) {
        this._hasFixedEndPoint = true;
        this._dataPoints.push([this._maxXValue, this._fixedEndPointY]);
        this.sortDataPoints();
        this.notifyObservers();
        this.drawUI();
      } else if (this._hasFixedEndPoint === true && isTrue === false) {
        this._hasFixedEndPoint = false;
        this._dataPoints.splice(this._dataPoints.length - 1, 1);
        this.notifyObservers();
        this.drawUI();
      }
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
      this.observers = this.observers.filter(observer => {
        return observer.context !== context || observer.func !== func;
      });
      return this;
    }

    notifyObservers () {
      var _this = this;
      this._observers.forEach(observer => {
        observer.func.call(observer.context, _this._dataPoints);
      });
      return this;
    }

    /* --- Data manipulaiton --- */
    addDataPoint (x, y) {
      if (
             (this._hasFixedStartPoint === false || x > this._minXValue )
          && (this._hasFixedEndPoint === false || x < this._maxXValue)
         ) {
        this._dataPoints.push([x, y]);
        this.sortDataPoints();
      }
    }

    sortDataPoints () {
      this._dataPoints.sort((a, b) => {
        var retVal = a[0] - b[0];
        if(retVal === 0) {
          var retVal = a[1] - b[1];
        }
        return retVal;
      });
    }

    /* --- Utility methods --- */
    quantizeNum (rawVal, qFactor) {
      var lBoundRemainder = (rawVal % qFactor);
      var uBoundRemainder = ((rawVal -
                              (rawVal % qFactor))
                             + qFactor)
                            - rawVal;
      var result;

      function numFixedDigits (a) {
        if (!isFinite(a)) return 0;
        var e = 1, p = 0;
        while (Math.round(a * e) / e !== a) { e *= 10; p++; }
        return p;
      }

      if (lBoundRemainder < uBoundRemainder) {
        result = rawVal - (rawVal % qFactor);
      } else {
        result = (rawVal - (rawVal % qFactor)) + qFactor;
      }

      result = +(result.toFixed(numFixedDigits(qFactor)));

      return result;
    }

    dataToCanvasX (x) {
      var canvasX = ((x - this._minXValue)
                  / this.domain)
                  * this._canvas.width;
      return canvasX;
    }

    dataToCanvasY (y) {
      var canvasY = this._canvas.height -
                    (((y - this._minYValue)
                      / this.range)
                     * this._canvas.height);
      return canvasY;
    }

    canvasToDataX (canvasX) {
      var dataX = ((canvasX / this._canvas.width)
                   * this.domain)
                  + this._minXValue;
      dataX = this.quantizeNum(dataX, this.quantizeX);
      return dataX;
    }

    canvasToDataY (canvasY) {
      var canvasYinv = this._canvas.height - canvasY;

      var dataY = ((canvasYinv / this._canvas.height)
                   * this.range)
                  + this._minYValue;
      dataY = this.quantizeNum(dataY, this.quantizeY);
      return dataY;
    }

    whichPointIsSelected (dataX, dataY, xBuffer, yBuffer) {
      var dataPointIndex = -1; // -1 means not found

      dataPointIndex = this.dataPoints.findIndex(dataPoint => {
        if (   (dataPoint[0] < dataX + xBuffer)
            && (dataPoint[0] > dataX - xBuffer)
            && (dataPoint[1] < dataY + yBuffer)
            && (dataPoint[1] > dataY - yBuffer)
           ) {
          return true;
        } else {
          return false;
        }
      });

      return dataPointIndex;
    }

    /* --- UI Drawing --- */
    drawUI () {
      this._ctx.fillStyle = this._UIBackgroundColor;
      this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

      for(var i = (this.dataPoints.length - 1); i > 0; i--) {
        this.drawLineBetweenPoints(this.dataPoints[i][0], this.dataPoints[i][1],
                                   this.dataPoints[i-1][0], this.dataPoints[i-1][1]);
      }
      for(var i = (this.dataPoints.length - 1); i > 0; i--) {
        this.drawPoint(this.dataPoints[i][0], this.dataPoints[i][1]);
      }
      if(this.dataPoints.length > 0) {
        this.drawPoint(this.dataPoints[0][0], this.dataPoints[0][1]);
      }
    }

    drawPoint (x, y) {
        var canvasX = this.dataToCanvasX(x);
        var canvasY = this.dataToCanvasY(y);

        this._ctx.beginPath();
        this._ctx.arc(canvasX, canvasY, this.UIVertexRadius, 0, 2*Math.PI);
        this._ctx.fillStyle = this.UIPointColor;
        this._ctx.fill();
    }

    drawLineBetweenPoints (x1, y1, x2, y2) {
      var canvasX1 = this.dataToCanvasX(x1);
      var canvasX2 = this.dataToCanvasX(x2);
      var canvasY1 = this.dataToCanvasY(y1);
      var canvasY2 = this.dataToCanvasY(y2);

      this._ctx.beginPath();
      this._ctx.moveTo(canvasX1, canvasY1);
      this._ctx.lineTo(canvasX2, canvasY2);
      this._ctx.strokeStyle = this.UILineColor;
      this._ctx.stroke();
    }

    /* --- UI Interaction --- */
    assignListeners () {
      var _this = this;

      this._canvas.addEventListener('mousedown', mouseDownListener);

      function mouseDownListener (e) {
        _this.mouseDownHandler(e);
      }
    }

    mouseDownHandler (e) {
      var _this = this;

      var boundingClientRect = e.target.getBoundingClientRect();
      var clickX = e.clientX - boundingClientRect.left;
      var clickY = e.clientY - boundingClientRect.top;
      var dataX = this.canvasToDataX(clickX);
      var dataY = this.canvasToDataY(clickY);

      var pointIndex = this.whichPointIsSelected(dataX, dataY, 1.2, 1.2);

      if ( pointIndex === -1 ) {
        this.addDataPoint(dataX, dataY);
      } else if (    (this._hasFixedStartPoint === false || pointIndex > 0)
                  && (this._hasFixedEndPoint === false || pointIndex < this._dataPoints.length - 1)
                ) {
        document.addEventListener('mousemove', mouseMoveListener);
      }

      function mouseMoveListener (e) {
        var dataPointsLength = _this._dataPoints.length;

        clickX = e.clientX - boundingClientRect.left;
        clickY = e.clientY - boundingClientRect.top;
        dataX = Math.max(Math.min(_this.canvasToDataX(clickX), _this.maxXValue), _this.minXValue);
        dataY = Math.max(Math.min(_this.canvasToDataY(clickY), _this.maxYValue), _this.minYValue);

        _this._dataPoints[pointIndex] = [dataX, dataY];

        // FIXTHIS
         if ( _this._dataPoints[pointIndex + 1]
              && _this._dataPoints[pointIndex][0] > _this._dataPoints[pointIndex + 1][0]
            ) {
                var tempDataPoint = _this._dataPoints[pointIndex + 1];
                _this._dataPoints[pointIndex + 1] = _this._dataPoints[pointIndex];
                _this._dataPoints[pointIndex] = tempDataPoint;
                pointIndex = pointIndex + 1;
        } else if ( _this._dataPoints[pointIndex - 1]
                    && _this._dataPoints[pointIndex][0] < _this._dataPoints[pointIndex - 1][0]
                  ) {
                var tempDataPoint = _this._dataPoints[pointIndex];
                _this._dataPoints[pointIndex] = _this._dataPoints[pointIndex - 1];
                _this._dataPoints[pointIndex - 1] = tempDataPoint;
                pointIndex = pointIndex - 1;
        }

        _this.drawUI();

        document.addEventListener('mouseup', mouseUpListener);
      }

      function mouseUpListener() {
        document.removeEventListener('mousemove', mouseMoveListener);
      }

      this.drawUI();
    }
  }

  /* --- Module loader and global support --- */

  // support for AMD libraries
  if (typeof define === 'function') {
    define([], function () {
      return EnvelopeGraph;
    });
  }

  // support for CommonJS libraries
  else if (typeof exports !== 'undefined') {
    exports.EnvelopeGraph = EnvelopeGraph;
  }

  // support for window global
  else if (typeof window !== 'undefined') {
    window.EnvelopeGraph = EnvelopeGraph;
  }

  // support for Node.js global
  else if (typeof global !== 'undefined') {
    global.EnvelopeGraph = EnvelopeGraph;
  }
})();