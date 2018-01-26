import Widget from "ui/core/widget";
import Constraint from "util/constraint";
import ConstraintSpec from "util/constraint-def";
import MathUtil from "util/util-math";

/**
 * Class representing a Graph widget.
 * @class 
 * @implements {Widget}
 */
class Graph extends Widget {

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
   * @param {boolean} [o.isEditable=true] - Is the graph editable?
   * @param {string} [o.vertexColor="#f40"] - Color of vertex points.
   * @param {string} [o.lineColor="#484848"] - Color of lines connecting the vertices.
   * @param {string} [o.backgroundColor="#fff"] - Background color.
   * @param {number} [o.lineWidth=2] - Width of the connecting lines.
   * @param {number} [o.vertexRadius=4] - Radius of the vertex points.
   * @param {number} [o.mouseSensitivity=1.2] - Mouse sensitivity (how much moving the mouse affects the interaction).
   */
  constructor(container, o) {
    super(container, o);
  }

  /* ===========================================================================
  *  PUBLIC API
  */

  /**
   * Sets the options.
   * @public @override
   */
  setOptions(o) {
    o = o || {};

    super.setOptions(o);
  }

  /**
  * Returns the state as an array of [x, y] pairs.
  * @public @override
  */
  getVal() {
    return this.state.vertices.map(vtx => [vtx.x, vtx.y]);
  }

  /**
  * Sets the state as an array of [x, y] vertex pairs.
  * Same as setVal(), but will not trigger observer callback methods.
  * @public @override
  * @param {array} - An array of [x, y] points
  */
  setInternalVal(vertexArray) {
   let vertices = vertexArray.map(xyPair => { return {x: xyPair[0], y: xyPair[1]}; });

   this.setInternalState({ vertices: vertices });
  }

  /**
  * Sets the state as an array of [x, y] vertex pairs.
  * Same as setInternalVal(), but will trigger observer callback methods.
  * @public @override
  * @param {array} - An array of [x, y] points.
  */
  setVal(vertexArray) {
    let vertices = vertexArray.map(xyPair => { return {x: xyPair[0], y: xyPair[1]}; });

    this.setState({ vertices: vertices });
  }

  /**
   * Adds new vertices to the state.
   * Each vertex is represented as x and y values, as well as optional boolean flags
   * specifying whether the x, y, or both values should be fixed (unchangeble).
   * The x and y values may also take the strings "min", "max" to specify that the coordinates 
   * should be tied to the minimum or maximum possible x or y values for the graph.
   * @public
   * @param {...object} vtx - Object representing the new vertex to add.
   * @param {number} [vtx.x=minXVal] - X coordinate for the new vertex.
   * @param {number} [vtx.y=minYVal] - Y coordinate for the new vertex.
   * @param {boolean} [vtx.isXFixed=false] - Is the X coordinate fixed (unable to move)?
   * @param {boolean} [vtx.isYFixed=false] - Is the Y coordinate fixed (unable to move)?
   */
  addVertex(...vtx) {
    for (let i = 0; i < vtx.length; i++) {
      let newVtx = vtx[i];

      newVtx = (typeof newVtx !== 'undefined') ? newVtx : {};
      newVtx.x = (typeof newVtx.x !== 'undefined') ? newVtx.x : this.o.minXVal;
      newVtx.y = (typeof newVtx.y !== 'undefined') ? newVtx.y : this.o.minYVal;
      newVtx.isXFixed = (typeof newVtx.isXFixed !== 'undefined') ? newVtx.isXFixed : false;
      newVtx.isYFixed = (typeof newVtx.isYFixed !== 'undefined') ? newVtx.isYFixed : false;
      newVtx.xAnchor = "";
      newVtx.yAnchor = "";

      if (newVtx.x === "max") {
        newVtx.isXFixed = true;
        newVtx.x = this.o.maxXVal;
        newVtx.xAnchor = "max";
      } else if (newVtx.x === "min") {
        newVtx.isXFixed = true;
        newVtx.x = this.o.minXVal;
        newVtx.xAnchor = "min";
      }

      if (newVtx.y === "max") {
        newVtx.isYFixed = true;
        newVtx.y = this.o.maxYVal;
        newVtx.yAnchor = "max";
      } else if (newVtx.x === "min") {
        newVtx.isYFixed = true;
        newVtx.y = this.o.minYVal;
        newVtx.yAnchor = "min";
      }

      let newVertices = this.getState().vertices.map(x=>x);

      newVertices.push(newVtx);
      newVertices.sort((a, b) => a.x - b.x);

      this.setState({
        vertices: newVertices
      });
    }
  }

  /**
   * Adds a vertex with fixed x and y coordinates.
   * @param {object} vtx - Vertex coordinates in format {x, y}
   * @param {number} vtx.x - X coordinate of the vertex.
   * @param {number} vtx.y - Y coordinate of the vertex.
   */
  addFixedVertex(...vtx) {
    for (let i = 0; i < vtx.length; i++) {
      let newVtx = vtx[i];
      this.addVertex({ x: newVtx.x, y: newVtx.y, isXFixed: true, isYFixed: true });
    }
  }

  /**
   * Adds a vertex with fixed y coordinate.
   * @param {object} vtx - Vertex coordinates in format {x, y}
   * @param {number} vtx.x - X coordinate of the vertex.
   * @param {number} vtx.y - Y coordinate of the vertex.
   */
  addFixedXVertex(...vtx) {
    for (let i = 0; i < vtx.length; i++) {
      let newVtx = vtx[i];
      this.addVertex({ x: newVtx.x, y: newVtx.y, isXFixed: true, isYFixed: false });
    }
  }


  /**
   * Adds a vertex with fixed y coordinate.
   * @param {object} vtx - Vertex coordinates in format {x, y}
   * @param {number} vtx.x - X coordinate of the vertex.
   * @param {number} vtx.y - Y coordinate of the vertex.
   */
  addFixedYVertex(...vtx) {
    for (let i = 0; i < vtx.length; i++) {
      let newVtx = vtx[i];
      this.addVertex({ x: newVtx.x, y: newVtx.y, isXFixed: false, isYFixed: true });
    }
  }

  /* ============================================================================================= */
  /* INITIALIZATION METHODS
  /* ============================================================================================= */

  /**
   * Initializes the options.
   * @override
   * @private
   */
  _initOptions(o) {
    // set defaults
    this.o = {};

    this.o.minXVal = 0;
    this.o.minYVal = 0;
    this.o.maxXVal = 100;
    this.o.maxYVal = 100;
    this.o.maxNumVertices = -1;
    this.o.quantizeX = 0.1;
    this.o.quantizeY = 0.1;
    this.o.xDecimalPrecision = 1;
    this.o.yDecimalPrecision = 1;
    this.o.isEditable = true;
    this.o.vertexColor = "#f40";
    this.o.fixedVertexColor = this.o.vertexColor;
    this.o.lineColor = "#484848";
    this.o.backgroundColor = "#fff";
    this.o.vertexRadius = 4;
    this.o.lineWidth = 2;
    this.o.mouseSensitivity = 1.2;

    // override defaults with provided options
    super._initOptions(o);
  }

  /**
   * Initializes state constraints.
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
            return MathUtil.quantize(num, _this.o.quantizeX);
          }
        }),
        y: new Constraint({
          min: _this.o.minYVal,
          max: _this.o.maxYVal,
          transform: (num) => {
            return MathUtil.quantize(num, _this.o.quantizeY);
          }
        })
      }]
    });
  }

  /**
   * Initializes state.
   * @override
   * @private
   */
  _initState() {
    this.state = {
      // verices contains an array of vertices
      // each vertex is an object of form 
      // {
      //   x: numbber, 
      //   y: number, 
      //   isXFixed: boolean, 
      //   isYFixed: boolean,
      //   xAnchor: string,
      //   yAnchor: string
      // }
      // isXFixed and isYFixed are boolean values that tell if a given
      // vertex may be moved in the x and y planes
      vertices: []
    };
  }

  /**
   * Initializes the svg elements.
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
    this.svgEls.panel.setAttribute("fill", this.o.backgroundColor);
    this.svgEls.panel.setAttribute("stroke", this.o.lineColor);

    this._appendSvgEls();
    this._update();
  }

  /**
   * Initializes mouse and touch event handlers.
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
         let yPos = ev.clientY - _this._getTop();
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
         };

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
   * Updates (redraws) component based on state.
   * @override
   * @private
   */
  _update() {
    const _this = this;

    // update vertices to have min and max values if specified
    _this.state.vertices.forEach(vtx => {
      vtx.x = (vtx.xAnchor === "max") ? _this.o.maxXVal :
                (vtx.xAnchor === "min") ? _this.o.minXVal :
                vtx.x;

      vtx.y = (vtx.yAnchor === "max") ? _this.o.maxYVal :
                (vtx.yAnchor === "min") ? _this.o.minYVal :
                vtx.y;
    });

    // sort svg vertexes using a sort map
    let idxSortMap = _this.state.vertices.map((vtx, idx) => { return { vtx: vtx, idx: idx }; });
    idxSortMap.sort((a, b) => a.vtx.x - b.vtx.x);
    _this.state.vertices = idxSortMap.map(el => _this.state.vertices[el.idx]);

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
        line.setAttribute("stroke", _this.o.lineColor);
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

  /* ==============================================================================================
  *  INTERNAL FUNCTIONALITY METHODS
  */

  /**
   * Deletes a vertex.
   * @private
   * @param {SVGElement} targetVtx - Vertex to Delete
   */
  _deleteVertex(targetVtx) {
    const _this = this;

    let vtxIdx = this.svgEls.vertices.findIndex(vtx => vtx === targetVtx);
    let isRemovable = !(this.state.vertices[vtxIdx].isXFixed || this.state.vertices[vtxIdx].isYFixed)

    if (vtxIdx !== -1 && isRemovable) {
      let newVertices = this.getState().vertices.map(x=>x);

      newVertices.splice(vtxIdx, 1);
      _this.setState({
        vertices: newVertices
      });
    }
  }

  /**
   * Adds a new SVG vertex representation.
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
   * Adds an SVG line connecting two vertices.
   * @private
   */
  _addSvgLine() {
    let newLine = document.createElementNS(this.SVG_NS, "path");
    this.svg.appendChild(newLine);
    this.svgEls.lines.push(newLine);
  }

  /**
   * Removes an SVG vertex.
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
   * Removes an SVG line connecting two vertices.
   * @private
   */
  _removeSvgLine() {
    let line = this.svgEls.lines[this.svgEls.lines.length - 1];

    this.svg.removeChild(line);
    line = null;
    this.svgEls.lines.pop();
  }

  /**
    * Moves a line.
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
        x: (lineIdx > 0) ? 
               parseInt(_this.svgEls.vertices[lineIdx - 1].getAttribute("cx"))
            : _this._calcVertexPos({x: _this.o.minXVal, y: _this.o.minYVal}).x,
        y: _this._calcVertexPos({x: _this.o.minXVal, y: _this.o.minYVal}).y
      };

      let boundaryTR = {
        x: (lineIdx + 2 < _this.svgEls.vertices.length) ? 
              parseInt(_this.svgEls.vertices[lineIdx + 2].getAttribute("cx"))
            : _this._calcVertexPos({x: _this.o.maxXVal, y: _this.o.maxYVal}).x,
        y: _this._calcVertexPos({x: _this.o.maxXVal, y: _this.o.maxYVal}).y
      };

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
    if (vtx1newPos.x < vtxPos0.boundaryBL.x || 
        vtx2newPos.x < vtxPos0.boundaryBL.x || 
        vtx1newPos.x > vtxPos0.boundaryTR.x || 
        vtx2newPos.x > vtxPos0.boundaryTR.x) {
      vtx1newPos.x = vtx1curPos.x;
      vtx2newPos.x = vtx2curPos.x;
    }

    // if moving would take y values outside of boundaries, keep y values the same
    // remember that y-coordinates are inverted when dealing with the canvas
    if (vtx1newPos.y > vtxPos0.boundaryBL.y || 
        vtx2newPos.y > vtxPos0.boundaryBL.y || 
        vtx1newPos.y < vtxPos0.boundaryTR.y || 
        vtx2newPos.y < vtxPos0.boundaryTR.y) {
      vtx1newPos.y = vtx1curPos.y;
      vtx2newPos.y = vtx2curPos.y;
    }

    this._moveVertex(vtx1, vtx1newPos);
    this._moveVertex(vtx2, vtx2newPos);

    // return the original position so that it may be used again if the line move is not finished
    return vtxPos0;
  }

  /**
  * Moves a vertex.
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

    let vertices = _this.getState().vertices.map(x=>x);

    // move the vertex if it's not fixed in x or y direction
    vertices[vtxIdx].x = (vertices[vtxIdx].isXFixed) ? vertices[vtxIdx].x : vtxState.x;
    vertices[vtxIdx].y = (vertices[vtxIdx].isYFixed) ? vertices[vtxIdx].y : vtxState.y;

    _this.setState({
      vertices: vertices
    });
  }

  /* ===========================================================================
  *  HELPER METHODS
  */

  /**
   * Calculates the x and y for a vertex in the graph according to its state value.
   * @private
   */
  _calcVertexPos(vertexState) {
    return {
     x: this._getWidth() * (vertexState.x / this.o.maxXVal),
     y: this._getHeight() - (this._getHeight() * (vertexState.y / this.o.maxYVal))
    };
  }

  /**
   * Calculates the x and y for a vertex state based on position on the graph.
   * (inverse of _calcVertexPos).
   * @private
   */
  _calcVertexState(vertexPos) {
    return {
      x: this.o.maxXVal * (vertexPos.x / this._getWidth()),
      y: this.o.maxYVal - (this.o.maxYVal * (vertexPos.y / this._getHeight()))
    };
  }

  /**
   * Converts on-screen x distance to scaled x state-value.
   * @private
   */
  _xPxToVal(x) {
    return (x / this._getWidth()) * (this.o.maxXVal - this.o.minXVal);
  }

  /**
   * Converts on-screen y distance to scaled y state-value.
   * @private
   */
  _yPxToVal(y) {
    return (y / this._getHeight()) * (this.o.maxYVal - this.o.minYVal);
  }
}

export default Graph;