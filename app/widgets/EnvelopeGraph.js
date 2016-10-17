'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  var EnvelopeGraph = function () {

    /* =================== */
    /* --- Constructor --- */
    /* =================== */

    /**
     * An EnvelopeGraph represents a customizable and editable line graph
     * @param {object} [o] - Options
     * @param {DOM object} [o.container=document.body] - The DOM element to contain the canvas for this widget. If not specified, document.body will be used
     * @param {DOM object} [canvas] - The canvas to contain the UI. If not specified, a new canvas will be created within the container.
     * @param {number} [o.minXValue=0] - Minimum X value
     * @param {number} [o.maxXValue=100] - Maximum X value
     * @param {number} [o.minYValue=0] - Minimum Y value
     * @param {number} [o.maxYValue=100] - Maximum Y value
     * @param {number} [o.quantizeX] - X quantization (the smallest grid interval between X values, to which vertices will snap)
     * @param {number} [o.quantizeY] - Y quantization (the smallest grid interval between Y values, to which vertices will snap)
     * @param {boolean} [o.hasFixedStartPoint=false] - Boolean value specifying whether the graph has a fixed vertex at the minimum X value
     * @param {boolen} [o.hasFixedEndPoint=false] - Boolean value specifying whether the graph has a fixed vertex at the maximum X value
     * @param {number} [o.fixedStartPointY=0] - Y value for the fixed starting vertex, if used
     * @param {number} [o.fixedEndPointY=0] - Y value for the fixed ending vertex, if used
     * @param {number} [o.maxNumVertices=-1] - The maximum number of allowed vertices. A value of -1 means no maximum number
     * @param {boolean} [o.isEditable=true] - Boolean value specifying whether the user can edit the graph via the UI
     * @param {string} [o.vertexColor='#000'] - Color of the vertex points
     * @param {string} [o.lineColor='#000'] - Color of lines connecting the vertices
     * @param {string} [o.backgroundColor='#fff'] - Background color
     * @param {number} [vertexRadius=3px] - Radius of the vertex points
     */
    function EnvelopeGraph(o) {
      _classCallCheck(this, EnvelopeGraph);

      o = o || {};

      this._observers = [];

      this._container = o.container || window.document.body;

      this._vertices = [];

      this._minXValue = o.minXValue || 0;
      this._maxXValue = o.maxXValue || 100;
      this._minYValue = o.minYValue || 0;
      this._maxYValue = o.maxYValue || 100;

      // quantize is the smallest incremental interval for data points
      this._quantizeX = o.quantizeX || (this._maxXValue - this._minXValue) / 1000;
      this._quantizeY = o.quantizeY || (this._maxYValue - this._minYValue) / 1000;

      // fixed start and end points
      this._hasFixedStartPoint = o.hasFixedStartPoint || false;
      this._hasFixedEndPoint = o.hasFixedEndPoint || false;

      this._fixedStartPointY = o.fixedStartPointY || o.fixedStartPoint || 0;
      this._fixedEndPointY = o.fixedEndPointY || o.fixedEndPoint || 0;

      // maximum number of vertices, -1 means no maximum
      this._maxNumVertices = o.maxNumVertices || -1;

      // can you edit by clicking?
      this._isEditable = o.isEditable || true;

      // create fixed start and end points, if used
      if (this._hasFixedStartPoint === true) {
        this._vertices.push([this._minXValue, this._fixedStartPointY]);
      }
      if (this._hasFixedEndPoint === true) {
        this._vertices.push([this._maxXValue, this._fixedEndPointY]);
      }

      this._UIVertexColor = o.vertexColor || o.UIVertexColor || '#000';
      this._UILineColor = o.lineColor || o.UILineColor || '#000';
      this._UIBackgroundColor = o.backgroundColor || o.UIBackgroundColor || '#FFF';
      this._UIVertexRadius = o.vertexRadius || o.UIVertexRadius || 3;

      this._canvas = o.canvas || window.document.createElement('canvas');
      if (o.canvas === undefined) {
        this._canvas.width = this._container.clientWidth;
        this._canvas.height = this._container.clientHeight;
        this._canvas.style.position = 'absolute';
        this._canvas.style.left = '0px';
        this._canvas.style.top = '0px';
        this._canvas.style.width = this._container.clientWidth;
        this._canvas.style.height = this._container.clientHeight;
        this._container.appendChild(this._canvas);
      }
      this._ctx = this._canvas.getContext('2d');

      this.assignListeners();
      this._listenForResize();
      this._drawUI();

      return this;
    }

    /* =============== */
    /* --- Options --- */
    /* =============== */

    _createClass(EnvelopeGraph, [{
      key: 'setOptions',
      value: function setOptions(o) {
        o = o || {};
        this.options = o;
        return this;
      }

      /* =========================== */
      /* --- Getters and setters --- */
      /* =========================== */

      /** Canvas */

    }, {
      key: 'setCanvasWidth',
      value: function setCanvasWidth(newWidth) {
        this.canvasWidth = newWidth;
      }

      /** Canvas height */

    }, {
      key: 'setCanvasHeight',
      value: function setCanvasHeight(newHeight) {
        this.canvasHeight = newHeight;
      }

      /** Data points */

    }, {
      key: 'setFixedStartPointY',
      value: function setFixedStartPointY(newY) {
        this.fixedStartPointY = newY;
        return this;
      }

      /** Y-value of the fixed end point */

    }, {
      key: 'setFixedEndPointY',
      value: function setFixedEndPointY(newY) {
        this.fixedEndPointY = newY;
        return this;
      }
    }, {
      key: 'subscribe',


      /* ======================== */
      /* --- Observer support --- */
      /* ======================== */

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
        this.observers = this.observers.filter(function (observer) {
          return observer.context !== context || observer.func !== func;
        });
        return this;
      }
    }, {
      key: 'notifyObservers',
      value: function notifyObservers() {
        var _this = this;
        this._observers.forEach(function (observer) {
          observer.func.call(observer.context, _this._vertices.slice());
        });
        return this;
      }

      /* ========================= */
      /* --- Data manipulation --- */
      /* ========================= */

      /**
       * Add a vertex
       * @param {number} x
       * @param {number} y
       */

    }, {
      key: 'addVertex',
      value: function addVertex(x, y) {
        if ((this._vertices.length < this._maxNumVertices || this._maxNumVertices === -1) && (this._hasFixedStartPoint === false || x > this._minXValue) && (this._hasFixedEndPoint === false || x < this._maxXValue)) {

          this._vertices.push([x, y]);
          this.sortVertices();
          this.notifyObservers();
        }
      }

      /**
       * Sort the vertices
       */

    }, {
      key: 'sortVertices',
      value: function sortVertices() {
        this._vertices.sort(function (a, b) {
          var retVal = a[0] - b[0];
          if (retVal === 0) {
            var retVal = a[1] - b[1];
          }
          return retVal;
        });
      }

      /**
       * Delete a vertices
       * @param {number} vertexIndex
       */

    }, {
      key: 'deleteVertex',
      value: function deleteVertex(vertexIndex) {
        this._vertices.splice(vertexIndex, 1);
        this.sortVertices();
        this._drawUI();
      }

      /* =============== */
      /* --- Utility --- */
      /* =============== */

    }, {
      key: 'quantizeNum',
      value: function quantizeNum(rawVal, qFactor) {
        var lBoundRemainder = rawVal % qFactor;
        var uBoundRemainder = rawVal - rawVal % qFactor + qFactor - rawVal;
        var result;

        function numFixedDigits(a) {
          if (!isFinite(a)) return 0;
          var e = 1,
              p = 0;
          while (Math.round(a * e) / e !== a) {
            e *= 10;p++;
          }
          return p;
        }

        if (lBoundRemainder < uBoundRemainder) {
          result = rawVal - rawVal % qFactor;
        } else {
          result = rawVal - rawVal % qFactor + qFactor;
        }

        result = +result.toFixed(numFixedDigits(qFactor));

        return result;
      }
    }, {
      key: '_dataToCanvasX',
      value: function _dataToCanvasX(x) {
        var canvasX = (x - this._minXValue) / this.domain * this._canvas.width;
        return canvasX;
      }
    }, {
      key: '_dataToCanvasY',
      value: function _dataToCanvasY(y) {
        var canvasY = this._canvas.height - (y - this._minYValue) / this.range * this._canvas.height;
        return canvasY;
      }
    }, {
      key: '_canvasToDataX',
      value: function _canvasToDataX(canvasX) {
        var dataX = canvasX / this._canvas.width * this.domain + this._minXValue;
        dataX = this.quantizeNum(dataX, this.quantizeX);
        return dataX;
      }
    }, {
      key: '_canvasToDataY',
      value: function _canvasToDataY(canvasY) {
        var canvasYinv = this._canvas.height - canvasY;

        var dataY = canvasYinv / this._canvas.height * this.range + this._minYValue;
        dataY = this.quantizeNum(dataY, this.quantizeY);
        return dataY;
      }

      /* Which point (vertex) is clicked on? */

    }, {
      key: '_whichPointIsSelected',
      value: function _whichPointIsSelected(dataX, dataY, xBuffer, yBuffer) {
        var dataPointIndex = -1; // -1 means not found

        dataPointIndex = this._vertices.findIndex(function (vertex) {
          if (vertex[0] < dataX + xBuffer && vertex[0] > dataX - xBuffer && vertex[1] < dataY + yBuffer && vertex[1] > dataY - yBuffer) {
            return true;
          } else {
            return false;
          }
        });

        return dataPointIndex;
      }

      /* Which line connecting vertices is clicked on? */

    }, {
      key: '_whichLineIsSelected',
      value: function _whichLineIsSelected(dataX, dataY, xBuffer, yBuffer) {
        var _this = this;

        var lineIndex = -1;

        // line is between which two points?
        var lowerBoundIndex = this._vertices.findIndex(function (vertex, i, vertices) {
          if (vertices[i][0] < dataX && vertices[i + 1][0] > dataX) {
            return true;
          } else {
            return false;
          }
        });
        var upperBoundIndex = lowerBoundIndex + 1;

        // if lower bound was not found, return -1 - we're done
        if (lowerBoundIndex === -1) {
          return -1;
        }

        // what should the value of y be at point x, calculated from the slope?
        var yValueAtDataX = function () {
          var x1 = _this._vertices[lowerBoundIndex][0];
          var x2 = _this._vertices[upperBoundIndex][0];
          var y1 = _this._vertices[lowerBoundIndex][1];
          var y2 = _this._vertices[upperBoundIndex][1];

          var slope = (y2 - y1) / (x2 - x1);

          return slope * (dataX - x1) + y1;
        }();

        // is the y being clicked on (dataY) the same as calculated by yValueAtDataX (within the allowed buffer)?
        if (lowerBoundIndex !== -1 && dataY > yValueAtDataX - yBuffer && dataY < yValueAtDataX + yBuffer) {
          lineIndex = lowerBoundIndex;
        }

        return lineIndex;
      }

      /* ================== */
      /* --- UI drawing --- */
      /* ================== */

      /**
       * Force a redraw
       */

    }, {
      key: 'redraw',
      value: function redraw() {
        this._drawUI();
      }
    }, {
      key: '_drawUI',
      value: function _drawUI() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.fillStyle = this._UIBackgroundColor;
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

        for (var i = this._vertices.length - 1; i > 0; i--) {
          this._drawLineBetweenPoints(this.vertices[i][0], this.vertices[i][1], this.vertices[i - 1][0], this.vertices[i - 1][1]);
        }
        for (var _i = this._vertices.length - 1; _i > 0; _i--) {
          this._drawPoint(this.vertices[_i][0], this.vertices[_i][1]);
        }
        if (this.vertices.length > 0) {
          this._drawPoint(this.vertices[0][0], this.vertices[0][1]);
        }
      }
    }, {
      key: '_drawPoint',
      value: function _drawPoint(x, y) {
        var canvasX = this._dataToCanvasX(x);
        var canvasY = this._dataToCanvasY(y);

        this._ctx.beginPath();
        this._ctx.arc(canvasX, canvasY, this.vertexRadius, 0, 2 * Math.PI);
        this._ctx.fillStyle = this._UIVertexColor;
        this._ctx.fill();
      }
    }, {
      key: '_drawLineBetweenPoints',
      value: function _drawLineBetweenPoints(x1, y1, x2, y2) {
        var canvasX1 = this._dataToCanvasX(x1);
        var canvasX2 = this._dataToCanvasX(x2);
        var canvasY1 = this._dataToCanvasY(y1);
        var canvasY2 = this._dataToCanvasY(y2);

        this._ctx.beginPath();
        this._ctx.moveTo(canvasX1, canvasY1);
        this._ctx.lineTo(canvasX2, canvasY2);
        this._ctx.strokeStyle = this._UILineColor;
        this._ctx.stroke();
      }

      /* ====================== */
      /* --- UI interaction --- */
      /* ====================== */

    }, {
      key: 'assignListeners',
      value: function assignListeners() {
        var _this = this;

        var canvasBoundingRect = _this._canvas.getBoundingClientRect();
        var mouseX = void 0,
            mouseY = void 0; // mouse X and Y on the canvasY
        var dataX = void 0,
            dataY = void 0; // value of mouse X and Y
        var vertexIndex = void 0,
            lineIndex = void 0; // index of vertex or line being clicked on
        var linePrevY = void 0,
            lineDeltaY = void 0; // coordinates used for moving a line

        // listen for a mousedown
        _this._canvas.addEventListener('mousedown', mouseDownListener);

        function mouseDownListener(e) {
          if (_this._isEditable === true) {
            (function () {
              var deleteVertex = function deleteVertex(e) {
                _this.deleteVertex(vertexIndex);
                _this._container.removeEventListener('mouseup', deleteVertex);
                _this._container.removeEventListener('mousemove', moveVertex);
              };

              var moveVertex = function moveVertex(e) {
                // do not delete it when mouse is up, we are moving it
                _this._container.removeEventListener('mouseup', deleteVertex);

                var verticesLength = _this._vertices.length;

                // calculate where we are moving the mouse
                mouseX = e.clientX - canvasBoundingRect.left;
                mouseY = e.clientY - canvasBoundingRect.top;
                dataX = Math.max(Math.min(_this._canvasToDataX(mouseX), _this.maxXValue), _this.minXValue);
                dataY = Math.max(Math.min(_this._canvasToDataY(mouseY), _this.maxYValue), _this.minYValue);

                // move the vertex to where we moved the mouse
                _this._vertices[vertexIndex] = [dataX, dataY];

                // Reorder the vertices in _this._vertices[] if necessary
                var tempDataPoint = void 0; // used for temporary storage when reordering
                // if it's moved beyond the vertex directly to its right
                if (_this._vertices[vertexIndex + 1] && _this._vertices[vertexIndex][0] > _this._vertices[vertexIndex + 1][0]) {
                  tempDataPoint = _this._vertices[vertexIndex + 1];
                  _this._vertices[vertexIndex + 1] = _this._vertices[vertexIndex];
                  _this._vertices[vertexIndex] = tempDataPoint;
                  vertexIndex = vertexIndex + 1;
                  // if it's moved beyond the vertex directly to its left
                } else if (_this._vertices[vertexIndex - 1] && _this._vertices[vertexIndex][0] < _this._vertices[vertexIndex - 1][0]) {
                  tempDataPoint = _this._vertices[vertexIndex];
                  _this._vertices[vertexIndex] = _this._vertices[vertexIndex - 1];
                  _this._vertices[vertexIndex - 1] = tempDataPoint;
                  vertexIndex = vertexIndex - 1;
                }

                _this._drawUI();

                document.addEventListener('mouseup', mouseUpListener);
              };

              var moveLine = function moveLine(e) {
                // current mouse position
                mouseY = e.clientY - canvasBoundingRect.top;
                dataY = _this._canvasToDataY(mouseY);

                // how much has the line been moved?
                lineDeltaY = dataY - linePrevY;
                linePrevY = dataY;

                // move the apex vertices of the line by however much it moved, if not outside the max or min y value limits
                if (_this._vertices[lineIndex][1] + lineDeltaY < _this.maxYValue && _this._vertices[lineIndex + 1][1] + lineDeltaY < _this.maxYValue && _this._vertices[lineIndex][1] + lineDeltaY > _this.minYValue && _this._vertices[lineIndex + 1][1] + lineDeltaY > _this.minYValue) {
                  _this._vertices[lineIndex][1] = Math.max(Math.min(_this._vertices[lineIndex][1] + lineDeltaY, _this.maxYValue), _this.minYValue);
                  _this._vertices[lineIndex + 1][1] = Math.max(Math.min(_this._vertices[lineIndex + 1][1] + lineDeltaY, _this.maxYValue), _this.minYValue);
                }

                _this.notifyObservers();
                _this._drawUI();

                document.addEventListener('mouseup', mouseUpListener);
              };

              var mouseUpListener = function mouseUpListener() {
                _this._container.removeEventListener('mousemove', moveLine);
                _this._container.removeEventListener('mousemove', moveVertex);
              };

              mouseX = e.clientX - canvasBoundingRect.left;
              mouseY = e.clientY - canvasBoundingRect.top;
              dataX = _this._canvasToDataX(mouseX);
              dataY = _this._canvasToDataY(mouseY);

              vertexIndex = _this._whichPointIsSelected(dataX, dataY, _this._quantizeX * 10, _this._quantizeY * 10);
              lineIndex = _this._whichLineIsSelected(dataX, dataY, _this._quantizeX, _this._quantizeY * 5);

              // if a vertex has been clicked on, we delete it if mouse is up without being moved, or move it if mouse moves
              if (vertexIndex !== -1) {
                // if the vertex is not a fixed start or end point
                if ((_this._hasFixedStartPoint === false || vertexIndex > 0) && (_this._hasFixedEndPoint === false || vertexIndex < _this._vertices.length - 1)) {
                  // if the mouse is up without being moved first, delete the vertex
                  _this._container.addEventListener('mouseup', deleteVertex);
                  // if no mouse up occurs, we are moving (dragging) the vertex
                  _this._container.addEventListener('mousemove', moveVertex);
                }
              }
              // if a line connecting vertices is being clicked on
              else if (lineIndex !== -1) {
                  linePrevY = dataY;
                  _this._container.addEventListener('mousemove', moveLine);
                }
                // if we're not clicking on an existing vertex or a line, we add a new vertex
                else {
                    _this.addVertex(dataX, dataY);
                  }

              _this._drawUI();
            })();
          }
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

          _this._drawUI();
        }
      }
    }, {
      key: 'options',
      set: function set(o) {
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

        if (o.vertexColor || o.UIVertexColor) this._UIVertexColor = o.vertexColor || o.UIVertexColor;
        if (o.lineColor || o.UILineColor) this._UILineColor = o.lineColor || o.UILineColor;
        if (o.backgroundColor || o.UIBackgroundColor) this._UIBackgroundColor = o.backgroundColor || o.UIBackgroundColor;
        if (o.vertexRadius || o.UIVertexRadius) this.UIVertexRadius = o.vertexRadius || o.UIVertexRadius;

        this.notifyObservers();
        this._drawUI();

        return this;
      }
    }, {
      key: 'canvas',
      get: function get() {
        return this._canvas;
      },
      set: function set(newCanvas) {
        this._canvas = newCanvas;
        this._drawUI();
        return this;
      }

      /** Canvas width */

    }, {
      key: 'canvasWidth',
      set: function set(newWidth) {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._canvas.width = newWidth;
        this._drawUI();
        return this;
      }
    }, {
      key: 'canvasHeight',
      set: function set(newHeight) {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._canvas.height = newHeight;
        this._drawUI();
        return this;
      }
    }, {
      key: 'vertices',
      get: function get() {
        return this._vertices;
      },
      set: function set(newVertices) {
        this._vertices = newVertices;
        this._drawUI();
        this.notifyObservers();
        return this;
      }

      /** Editable */

    }, {
      key: 'isEditable',
      get: function get() {
        return this._isEditable;
      },
      set: function set(isEditable) {
        this._isEditable = isEditable;
        return this;
      }

      /** Minimum X Value */

    }, {
      key: 'minXValue',
      get: function get() {
        return this._minXValue;
      },
      set: function set(newVal) {
        this._minXValue = newVal;
        return this;
      }

      /** Maximum X Value */

    }, {
      key: 'maxXValue',
      get: function get() {
        return this._maxXValue;
      },
      set: function set(newVal) {
        this._maxXValue = newVal;
        return this;
      }

      /** Minimum Y Value */

    }, {
      key: 'minYValue',
      get: function get() {
        return this._minYValue;
      },
      set: function set(newVal) {
        this._minYValue = newVal;
        return this;
      }

      /** Maximum Y Value */

    }, {
      key: 'maxYValue',
      get: function get() {
        return this._maxYValue;
      },
      set: function set(newVal) {
        this._maxYValue = newVal;
        return this;
      }

      /** X quantization (smallest interval between points) value */

    }, {
      key: 'quantizeX',
      get: function get() {
        return this._quantizeX;
      },
      set: function set(newVal) {
        this._quantizeX = newVal;
        return this;
      }

      /** Y quantization quantization (smallest interval between points) value */

    }, {
      key: 'quantizeY',
      get: function get() {
        return this._quantizeY;
      },
      set: function set(newVal) {
        this._quantizeY = newVal;
        return this;
      }

      /** Domain */

    }, {
      key: 'domain',
      get: function get() {
        return this._maxXValue - this._minXValue;
      }

      /** Range */

    }, {
      key: 'range',
      get: function get() {
        return this._maxYValue - this._minYValue;
      }
    }, {
      key: 'vertexColor',
      get: function get() {
        return this._UIVertexColor;
      },
      set: function set(newColor) {
        this._UIVertexColor = newColor;
        this._drawUI();
        return this;
      }
    }, {
      key: 'lineColor',
      get: function get() {
        return this._UILineColor;
      },
      set: function set(newColor) {
        this._UILineColor = newColor;
        this._drawUI();
        return this;
      }
    }, {
      key: 'backgroundColor',
      get: function get() {
        return this._UIBackgroundColor;
      },
      set: function set(newColor) {
        this._UIBackgroundColor = newColor;
        this._drawUI();
        return this;
      }
    }, {
      key: 'vertexRadius',
      get: function get() {
        var UIVertexRadius = Math.min(this._canvas.width, this._canvas.height) * 0.015;
        this._UIVertexRadius = Math.max(UIVertexRadius, 2);
        return this._UIVertexRadius;
      },
      set: function set(newRadius) {
        this._UIVertexRadius = newRadius;
        this._drawUI();
        return this;
      }

      /** Y-value of the fixed start point */

    }, {
      key: 'fixedStartPointY',
      get: function get() {
        return this._fixedStartPointY;
      },
      set: function set(newY) {
        this._fixedStartPointY = newY;

        if (this._hasFixedStartPoint === true) {
          this._vertices[0] = [this._minXValue, this._fixedStartPointY];
        }

        this._drawUI();
        return this;
      }
    }, {
      key: 'fixedEndPointY',
      get: function get() {
        return this._fixedEndPointY;
      },
      set: function set(newY) {
        this._fixedEndPointY = newY;

        if (this._hasFixedEndPoint === true) {
          this._vertices[this._vertices.length - 1] = [this._maxXValue, this._fixedEndPointY];
        }

        this._drawUI();
        return this;
      }
    }, {
      key: 'hasFixedStartPoint',
      set: function set(isTrue) {
        if (this._hasFixedStartPoint === false && isTrue === true) {
          this._hasFixedStartPoint = true;
          this._vertices.push([this._minXValue, this._fixedStartPointY]);
          this.sortVertices();
          this.notifyObservers();
          this._drawUI();
        } else if (this._hasFixedStartPoint === true && isTrue === false) {
          this._hasFixedStartPoint = false;
          this._vertices.splice(0, 1);
          this.notifyObservers();
          this._drawUI();
        }
      }
    }, {
      key: 'hasFixedEndPoint',
      set: function set(isTrue) {
        if (this._hasFixedEndPoint === false && isTrue === true) {
          this._hasFixedEndPoint = true;
          this._vertices.push([this._maxXValue, this._fixedEndPointY]);
          this.sortVertices();
          this.notifyObservers();
          this._drawUI();
        } else if (this._hasFixedEndPoint === true && isTrue === false) {
          this._hasFixedEndPoint = false;
          this._vertices.splice(this._vertices.length - 1, 1);
          this.notifyObservers();
          this._drawUI();
        }
      }
    }]);

    return EnvelopeGraph;
  }();

  /* ============================= */
  /* --- Module loader support --- */
  /* ============================= */

  (function exportModule() {
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
})();