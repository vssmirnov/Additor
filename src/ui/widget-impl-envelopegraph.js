import Widget from "./widget";
import Constraint from "util/constraint";
import ConstraintSpec from "util/constraint-spec";
import MathUtil from "util/util-math";

/**
 * Class representing an Envelope Graph widget
 *
 * @class
 * @implements {Widget}
 */
class WidgetEnvelopeGraph extends Widget {

  /**
   * @constructor
   * @param {object} container - DOM container for the widget.
   * @param {object} [o] - Options.
   * @param {number} [o.minXVal=0] - Minimum X value.
   * @param {number} [o.minYVal=0] - Minimum Y value.
   * @param {number} [o.maxXVal=100] - Maximum X value.
   * @param {number} [o.maxYVal=100] - Maximum Y value.
   * @param {number} [o.maxNumVertices=-1] - Maximum number of vertices.
   * @param {number} [o.quantizeX=0.1] - X-quantization ("grid") value.
   * @param {number} [o.quantizeY=0.1] - Y-quantization ("grid") value.
   * @param {number} [o.xDecimalPrecision=1] - Number of decimal places for output of the X values.
   * @param {number} [o.yDecimalPrecision=1] - Number of decimal places for output of the Y values.
   * @param {boolean} [o.hasFixedStartPoint=false] - Is there a fixed start vertex?
   * @param {boolean} [o.hasFixedEndPoint=false] - Is there a fixed end vertex?
   * @param {number} [o.fixedStartPointY=0] - Y value of the fixed start vertex, if exists.
   * @param {number} [o.fixedEndPointY=0] - Y value of the fixed end vertex, if exists.
   * @param {boolean} [o.isEditable=true] - Is the graph editable?
   * @param {string} [o.vertexColor="#f40"] - Color of vertex points.
   * @param {string} [o.lineColor="#484848"] - Color of lines connecting the vertices.
   * @param {string} [o.bgColor="#fff"] - Background color.
   * @param {number} [o.lineWidth=2] - Width of the connecting lines.
   * @param {number} [o.vertexRadius=4] - Radius of the vertex points.
   * @param {number} [o.mouseSensitivity=1.2] - Mouse sensitivity (how much moving the mouse affects the interaction).
   */
  constructor(container, o) {
    super(container, o);
  }

  /* ===========================================================================
  *  INITIALIZATION METHODS
  */

  /**
   * Initialize the options
   * @override
   * @private
   */
  _initOptions(o) {
    // set defaults
    this.o = {
      minXVal: 0,
      minYVal: 0,
      maxXVal: 100,
      maxYVal: 100,
      maxNumVertices: -1,
      quantizeX: 0.1,
      quantizeY: 0.1,
      xDecimalPrecision: 1,
      yDecimalPrecision: 1,
      hasFixedStartPoint: false,
      hasFixedEndPoint: false,
      fixedStartPointY: 0,
      fixedEndPointY: 0,
      isEditable: true,
      vertexColor: "#f40",
      lineColor: "#484848",
      bgColor: "#fff",
      vertexRadius: 4,
      lineWidth: 2,
      mouseSensitivity: 1.2
    };

    // override defaults with provided options
    this.setOptions(o);
  }

  /**
   * Initialize state constraints
   * @override
   * @private
   */
  _initStateConstraints() {
    const _this = this;

    this.stateConstraints = new ConstraintSpec({
      vertices: [{
        x: new Constraint({
          min: _this.o.minXVal,
          max: _this.o.maxXVal,
          transform: (num) => {
            return MathUtil.quantize(num, _this.o.quantizeX)
              .toFixed(_this.o.xDecimalPrecision);
          }
        }),
        y: new Constraint({
          min: _this.o.minYVal,
          max: _this.o.maxYVal,
          transform: (num) => {
            return MathUtil.quantize(num, _this.o.quantizeY)
              .toFixed(_this.o.yDecimalPrecision);
          }
        })
      }]
    });
  }

  /**
   * Initialize state
   * @override
   * @private
   */
  _initState() {
    this.state = {
      // verices contains an array of vertices
      // each vertex is an object of form {x, y}
      vertices: []
    };

    // Flags for whether fixed start and end points have been
    // added to the state vertex array.
    // These are used in the _update() method - if the flags
    // are not set, and o.hasFixedStartPoint or o.hasFixedEndPoint
    // are set, verticies representing the fixed points are to be added.
    // If the flags are set, while o.hasFixedStartPoint or o.hasFixedEndPoint
    // is not set, then vertices representing the fixed points are to be removed.
    this.isFixedStartPointInitialized = false;
    this.isFixedEndPointInitialized = false;
  }

  /**
   * Initialize the svg elements
   * @override
   * @private
   */
  _initSvgEls() {
    const _this = this;

    this.svgEls = {
      panel: document.createElementNS(this.SVG_NS, "rect"),
      vertices: [],
      lines: []
    };

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
   * @private
   */
  _initHandlers() {
    const _this = this;

    let targetVtx = null;
    let targetLine = null;
    let vtxPos0 = {}; // original poisition of two vertices affected by a line move
    let x0 = 0;
    let y0 = 0;
    let x1 = 0;
    let y1 = 0;
    let dx = 0;
    let dy = 0;

    this.handlers = {

       touchPanel: function touchPanel(ev) {
         ev.preventDefault();

         let xPos = ev.clientX - _this._getLeft();
         let yPos = ev.clientY - _this._getTop()
         let vertexState = _this._calcVertexState({x: xPos, y: yPos});

         _this.addVertex(vertexState);
       },

       touchVertex: function touchVertex(ev) {
         ev.preventDefault();

         targetVtx = ev.target;

         document.addEventListener("mousemove", _this.handlers.moveVertex);
         document.addEventListener("touchmove", _this.handlers.moveVertex);
         ev.target.addEventListener("mouseup", _this.handlers.deleteVertex);
         ev.target.addEventListener("touchend", _this.handlers.deleteVertex);
       },

       touchLine: function touchLine(ev) {
         ev.preventDefault();

         targetLine = ev.target;

         x0 = ev.clientX - _this._getLeft();
         y0 = ev.clientY - _this._getTop();
         vtxPos0 = null;

         document.addEventListener("mousemove", _this.handlers.moveLine);
         document.addEventListener("touchmove", _this.handlers.moveLine);
       },

       moveLine: function moveLine(ev) {
         ev.preventDefault();

         document.addEventListener("mouseup", _this.handlers.endMoveLine);
         document.addEventListener("touchend", _this.handlers.endMoveLine);

         x1 = ev.clientX - _this._getLeft();
         y1 = ev.clientY - _this._getTop();

         // delta position (change in position)
         let dPos = {
           x: x1 - x0,
           y: y1 - y0
         }

         vtxPos0 = _this._moveLine(targetLine, dPos, vtxPos0);
       },

       endMoveLine: function endMoveLine(ev) {
         ev.preventDefault();

         vtxPos0 = null;

         document.removeEventListener("mousemove", _this.handlers.moveLine);
         document.removeEventListener("touchmove", _this.handlers.moveLine);
       },

       deleteVertex: function deleteVertex(ev) {
         ev.preventDefault();

         document.removeEventListener("mousemove", _this.handlers.moveVertex);
         document.removeEventListener("touchmove", _this.handlers.moveVertex);

         _this._deleteVertex(ev.target);

         ev.target.removeEventListener("mouseup", _this.handlers.deleteVertex);
         ev.target.removeEventListener("touchend", _this.handlers.deleteVertex);
       },

       moveVertex: function moveVertex(ev) {
         ev.preventDefault();

         targetVtx.removeEventListener("mouseup", _this.handlers.deleteVertex);
         targetVtx.removeEventListener("touchend", _this.handlers.deleteVertex);

         document.addEventListener("mouseup", _this.handlers.endMoveVertex);
         document.addEventListener("touchend", _this.handlers.endMoveVertex);

         let xPos = ev.clientX - _this._getLeft();
         let yPos = ev.clientY - _this._getTop();

         _this._moveVertex(targetVtx, {x: xPos, y: yPos});
       },

       endMoveVertex: function endMoveVertex(ev) {
         ev.preventDefault();

         document.removeEventListener("mousemove", _this.handlers.moveVertex);
         document.removeEventListener("touchmove", _this.handlers.moveVertex);
       }
    };

    this.svgEls.panel.addEventListener("mousedown", _this.handlers.touchPanel);
    this.svgEls.panel.addEventListener("touchdown", _this.handlers.touchPanel);

    this.svgEls.vertices.forEach(vtx => {
      vtx.addEventListener("mousedown", _this.handlers.touchVertex);
      vtx.addEventListener("touchdown", _this.handlers.touchVertex);
    });

    this.svgEls.lines.forEach(line => {
      line.addEventListener("mousedown", _this.handlers.touchLine);
      line.addEventListener("touchdown", _this.handlers.touchLine);
    });
  }

  /**
   * Update (redraw) component based on state
   * @override
   * @private
   */
  _update() {
    const _this = this;

    // add fixed start vertex if the option is set, but has not been initialized
    if (this.o.hasFixedStartPoint && !this.isFixedStartPointInitialized) {
      this.state.vertices.push({ x: _this.o.minXVal, y: _this.o.fixedStartPointY });
      this.isFixedStartPointInitialized = true;
    }

    // add fixed end vertex if the option is set, but has not been initialized
    if (this.o.hasFixedEndPoint && !this.isFixedEndPointInitialized) {
      this.state.vertices.push({ x: _this.o.maxXVal, y: _this.o.fixedEndPointY });
      this.isFixedEndPointInitialized = true;
    }

    // sort svg vertexes using a sort map
    let idxSortMap = _this.state.vertices.map((vtx, idx) => { return { vtx: vtx, idx: idx }});
    idxSortMap.sort((a, b) => a.vtx.x - b.vtx.x);
    _this.state.vertices = idxSortMap.map(el => _this.state.vertices[el.idx]);

    // update fixed start vertex to the correct y value
    if (this.o.hasFixedStartPoint && this.isFixedStartPointInitialized) {
      _this.state.vertices[0].y = _this.o.fixedStartPointY;
    }

    // update fixed end vertex to the correct y value
    if (this.o.hasFixedEndPoint && this.isFixedEndPointInitialized) {
      _this.state.vertices[_this.state.vertices.length - 1].y = _this.o.fixedEndPointY;
    }

    // remove fixed start vertex if had been initialized, but the option is unset
    if (!this.o.hasFixedStartPoint && this.isFixedStartPointInitialized) {
      this.state.vertices.splice(0, 1);
      idxSortMap.splice(0, 1);
      idxSortMap.forEach(el => el.idx--);
      this.isFixedStartPointInitialized = false;
    }

    // remove fixed end vertex if has been initialized, but the option is unset
    if (!this.o.hasFixedEndPoint && this.isFixedEndPointInitialized) {
      this.state.vertices.pop();
      idxSortMap.pop();
      this.isFixedEndPointInitialized = false;
    }

    // if there are more state vertices than svg vertices, add a corresponding number of svg vertices and lines
    for (let i = _this.svgEls.vertices.length; i < _this.state.vertices.length; ++i) {
      _this._addSvgVertex();
    }

    // if there are more svg vertices than state vertices, remove a corresponding number of svg vertices and lines
    for (let i = _this.svgEls.vertices.length; i > _this.state.vertices.length; --i) {
      _this._removeSvgVertex();
    }

    // sort the svg vertices according to the vertex sort map
    _this.svgEls.vertices = idxSortMap.map(el => _this.svgEls.vertices[el.idx]);

    // set the correct position coordinates for every vertex
    _this.state.vertices.forEach((stateVtx, idx) => {
      let svgVtx = _this.svgEls.vertices[idx];
      let pos = _this._calcVertexPos(stateVtx);

      svgVtx.setAttribute("cx", pos.x);
      svgVtx.setAttribute("cy", pos.y);
      svgVtx.setAttribute("r", _this.o.vertexRadius);
      svgVtx.setAttribute("fill", _this.o.vertexColor);

      // for every vertex other than the first, draw a line to the previous vertex
      if (idx > 0) {
        let prevVtx = _this.state.vertices[idx - 1];
        let prevPos = _this._calcVertexPos(prevVtx);
        let line = _this.svgEls.lines[idx - 1];

        line.setAttribute("d", "M " + pos.x + " " + pos.y + " L " + prevPos.x + " " + prevPos.y);
        line.setAttribute("fill", "transparent");
        line.setAttribute("stroke-width", _this.o.lineWidth);
        line.setAttribute("stroke", _this.o.lineColor)
      }
    });

    // remove and reappend all svg elements so that vertices are on top of lines
    _this.svgEls.lines.forEach(svgLine => {
      _this.svg.removeChild(svgLine);
      _this.svg.appendChild(svgLine);
    });

    _this.svgEls.vertices.forEach(svgVtx => {
      _this.svg.removeChild(svgVtx);
      _this.svg.appendChild(svgVtx);
    });

    // reassign listeners
    _this.svgEls.vertices.forEach(vtx => {
      vtx.addEventListener("mousedown", _this.handlers.touchVertex);
      vtx.addEventListener("touchdown", _this.handlers.touchVertex);
    });

    _this.svgEls.lines.forEach(line => {
      line.addEventListener("mousedown", _this.handlers.touchLine);
      line.addEventListener("touchdown", _this.handlers.touchLine);
    });
  }

  /* ===========================================================================
  *  PUBLIC API
  */

  /**
   * Set the options
   * @override
   * @public
   */
  setOptions(o) {
    o = o || {};

    if (o.fixedStartPointY !== undefined) {
      o.fixedStartPointY = Math.min(o.fixedStartPointY, this.o.maxYVal);
      o.fixedStartPointY = Math.max(o.fixedStartPointY, this.o.minYVal);
    }

    if (o.fixedEndPointY !== undefined) {
      o.fixedEndPointY = Math.min(o.fixedEndPointY, this.o.maxYVal);
      o.fixedEndPointY = Math.max(o.fixedEndPointY, this.o.minYVal);
    }

    super.setOptions(o);
  }

  /**
  * Return the state as an array of [x, y] pairs
  * @override
  */
  getVal() {
    return this.state.vertices.map(vtx => [vtx.x, vtx.y]);
  }

  /**
  * Set the state as an array of [x, y] vertex pairs.
  * Same as setVal(), but will not trigger observer callback methods.
  * @param {array} - An array of [x, y] points
  */
  setInternalVal(vertexArray) {
   let vertices = vertexArray.map(xyPair => { return {x: xyPair[0], y: xyPair[1]} });

   this.setInternalState({ vertices: vertices });
  }

  /**
  * Set the state as an array of [x, y] vertex pairs.
  * Same as setInternalVal(), but will trigger observer callback methods.
  * @param {array} - An array of [x, y] points.
  */
  setVal(vertexArray) {
    let vertices = vertexArray.map(xyPair => { return {x: xyPair[0], y: xyPair[1]} });

    this.setState({ vertices: vertices });
  }

  /**
   * Add a new vertex to the state
   * @public
   * @param {object} pos
   * @param {number} pos.x
   * @param {number} pos.y
   */
  addVertex(pos) {
    let newVertices = this.getState().vertices.map(x=>x);

    newVertices.push({x: pos.x, y: pos.y});
    newVertices.sort((a, b) => a.x - b.x);

    this.setState({
     vertices: newVertices
    });
  }

  /* ===========================================================================
  *  INTERNAL FUNCTIONALITY METHODS
  */

  /**
   * Delete a vertex.
   * @private
   * @param {SVGElement} targetVtx - Vertex to Delete
   */
  _deleteVertex(targetVtx) {
    const _this = this;

    let vtxIdx = this.svgEls.vertices.findIndex(vtx => vtx === targetVtx);

    if (vtxIdx !== -1) {
     let newVertices = this.getState().vertices.map(x=>x);
     newVertices.splice(vtxIdx, 1);
     _this.setState({
       vertices: newVertices
     });
    }
  }

  /**
   * Add a new SVG vertex representation.
   * @private
   */
  _addSvgVertex() {
    const _this = this;

    let newVertex = document.createElementNS(_this.SVG_NS, "circle");
    _this.svgEls.vertices.push(newVertex);
    _this.svg.appendChild(newVertex);

    // if there is more than 1 svg vertex, we also need to draw lines between them
    if (_this.svgEls.vertices.length > 1) {
      this._addSvgLine();
    }
  }

  /**
   * Add an SVG line connecting two vertices.
   * @private
   */
  _addSvgLine() {
    let newLine = document.createElementNS(this.SVG_NS, "path");
    this.svg.appendChild(newLine);
    this.svgEls.lines.push(newLine);
  }

  /**
   * Remove an SVG vertex.
   * @private
   */
  _removeSvgVertex() {
    let vertex = this.svgEls.vertices[this.svgEls.vertices.length - 1];

    this.svg.removeChild(vertex);
    vertex = null;
    this.svgEls.vertices.pop();

    if (this.svgEls.lines.length > 0) {
     this._removeSvgLine();
    }
  }

  /**
   * Remove an SVG line connecting two vertices
   * @private
   */
  _removeSvgLine() {
    let line = this.svgEls.lines[this.svgEls.lines.length - 1];

    this.svg.removeChild(line);
    line = null;
    this.svgEls.lines.pop();
  }

  /**
    * Move a line
    * @private
    * @param {SVGElement} targetLine - The target line
    * @param {object} dPos -
    * @param {number} dPos.x
    * @param {number} dPos.y
    * @param {object} vtxPos0 - Original position (before moving)
    *                           of the two vertices immediately to the left
    *                           and right of the line being moved in the
    *                           form { vtx1: {x, y}, vtx2: {x, y}, boundaryBL: {x, y}, boundaryTR: {x, y} }
    *                           If null, will be calculated from the
    *                           corresponding svg element.
    * @param {obect} [vtxPos0.vtx1]
    * @param {number} [vtxPos0.vtx1.x]
    * @param {number} [vtxPos0.vtx1.y]
    * @param {obect} [vtxPos0.vtx2]
    * @param {number} [vtxPos0.vtx2.x]
    * @param {number} [vtxPos0.vtx2.y]
    * @returns {object} Original position of the two vertices affected by the line move in the form
    *                   { vtx1: {x, y}, vtx2: {x, y}, boundaryBL: {x, y}, boundaryTR: {x, y} }.
    */
  _moveLine(targetLine, dPos, vtxPos0) {
    const _this = this;

    let lineIdx = _this.svgEls.lines.findIndex(line => line === targetLine);

    // get vertices to the left and right of the selected line
    let vtx1 = _this.svgEls.vertices[lineIdx];
    let vtx2 = _this.svgEls.vertices[lineIdx + 1];

    let vtx1curPos = {
      x: parseInt(_this.svgEls.vertices[lineIdx].getAttribute("cx")),
      y: parseInt(_this.svgEls.vertices[lineIdx].getAttribute("cy"))
    };
    let vtx2curPos = {
      x: parseInt(_this.svgEls.vertices[lineIdx + 1].getAttribute("cx")),
      y: parseInt(_this.svgEls.vertices[lineIdx + 1].getAttribute("cy"))
    };

    // if vtxPos0 is null or undefined, this is the first time this function
    // was called in the line move, and we need to get the position of affected
    // vertices from the svg attributes.
    // vtx1 and vtx2 are the left and right vertices bounding the line
    // boundaryBL is the bottom left boundary restricting movement of the line
    // boundaryTR is the top right boundary restricting movement of the line
    if (vtxPos0 === null || vtxPos0 === undefined) {

      let boundaryBL = {
        x: (lineIdx > 0)
            ? parseInt(_this.svgEls.vertices[lineIdx - 1].getAttribute("cx"))
            : _this._calcVertexPos({x: _this.o.minXVal, y: _this.o.minYVal}).x,
        y: _this._calcVertexPos({x: _this.o.minXVal, y: _this.o.minYVal}).y
      }

      let boundaryTR = {
        x: (lineIdx + 2 < _this.svgEls.vertices.length)
            ? parseInt(_this.svgEls.vertices[lineIdx + 2].getAttribute("cx"))
            : _this._calcVertexPos({x: _this.o.maxXVal, y: _this.o.maxYVal}).x,
        y: _this._calcVertexPos({x: _this.o.maxXVal, y: _this.o.maxYVal}).y
      }

      vtxPos0 = {
       vtx1: vtx1curPos,
       vtx2: vtx2curPos,
       boundaryBL: boundaryBL,
       boundaryTR: boundaryTR
      };
    }

    // calculate the new positions for the two affected vertices
    let vtx1newPos = {
      x: vtxPos0.vtx1.x + dPos.x,
      y: vtxPos0.vtx1.y + dPos.y
    };

    let vtx2newPos = {
      x: vtxPos0.vtx2.x + dPos.x,
      y: vtxPos0.vtx2.y + dPos.y
    };

    // if moving would take x values outside of boundaries, keep x values the same
    if (vtx1newPos.x < vtxPos0.boundaryBL.x
      || vtx2newPos.x < vtxPos0.boundaryBL.x
      || vtx1newPos.x > vtxPos0.boundaryTR.x
      || vtx2newPos.x > vtxPos0.boundaryTR.x) {

        vtx1newPos.x = vtx1curPos.x;
        vtx2newPos.x = vtx2curPos.x;
    }

    // if moving would take y values outside of boundaries, keep y values the same
    // remember that y-coordinates are inverted when dealing with the canvas
    if (vtx1newPos.y > vtxPos0.boundaryBL.y
      || vtx2newPos.y > vtxPos0.boundaryBL.y
      || vtx1newPos.y < vtxPos0.boundaryTR.y
      || vtx2newPos.y < vtxPos0.boundaryTR.y) {

        vtx1newPos.y = vtx1curPos.y;
        vtx2newPos.y = vtx2curPos.y;
    }

    this._moveVertex(vtx1, vtx1newPos);
    this._moveVertex(vtx2, vtx2newPos);

    // return the original position so that it may be used again if the line move is not finished
    return vtxPos0;
  }

  /**
  * Move a vertex
  * @private
  * @param {SVGElement} targetVtx - The target vertex
  * @param {Object} newPos - The new position
  * @param {number} newPos.x
  * @param {number} newPos.y
  */
  _moveVertex(targetVtx, newPos) {
    const _this = this;

    let vtxState = _this._calcVertexState(newPos);
    let vtxIdx = _this.svgEls.vertices.findIndex(vtx => vtx === targetVtx);

    // move the vertex if it's not a fixed start or end point
    if (!(vtxIdx === 0 && this.o.hasFixedStartPoint)
        && !(vtxIdx === this.state.vertices.length - 1 && this.o.hasFixedEndPoint)) {

      let vertices = _this.getState().vertices.map(x=>x);

      vertices[vtxIdx].x = vtxState.x;
      vertices[vtxIdx].y = vtxState.y;

      _this.setState({
        vertices: vertices
      });
    }
  }

  /* ===========================================================================
  *  HELPER METHODS
  */

  /**
   * Calculate the x and y for a vertex in the graph according to its state value.
   * @private
   */
  _calcVertexPos(vertexState) {
    return {
     x: this._getWidth() * (vertexState.x / this.o.maxXVal),
     y: this._getHeight() - (this._getHeight() * (vertexState.y / this.o.maxYVal))
    }
  }

  /**
   * Calculate the x and y for a vertex state based on position on the graph
   * (inverse of _calcVertexPos).
   * @private
   */
  _calcVertexState(vertexPos) {
    return {
      x: this.o.maxXVal * (vertexPos.x / this._getWidth()),
      y: this.o.maxYVal - (this.o.maxYVal * (vertexPos.y / this._getHeight()))
    }
  }

  /**
   * Convert on-screen x distance to scaled x state-value.
   * @private
   */
  _xPxToVal(x) {
    return (x / this._getWidth()) * (this.o.maxXVal - this.o.minXVal);
  }

  /**
   * Convert on-screen y distance to scaled y state-value.
   * @private
   */
  _yPxToVal(y) {
    return (y / this._getHeight()) * (this.o.maxYVal - this.o.minYVal);
  }
}

export default WidgetEnvelopeGraph
