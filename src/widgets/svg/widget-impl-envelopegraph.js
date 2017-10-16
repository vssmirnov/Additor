import Widget from "./widget";
import Constraint from "./constraint";
import ConstraintSpec from "./constraint-spec";
import MathUtil from "./util-math";

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
   * @param {object=} o - Options.
   * @param {number=0} o.minXVal - Minimum X value.
   * @param {number=0} o.minYVal - Minimum Y value.
   * @param {number=100} o.maxXVal - Maximum X value.
   * @param {number=100} o.maxYVal - Maximum Y value.
   * @param {number=-1} o.maxNumVertices - Maximum number of vertices.
   * @param {number=0.1} o.quantizeX - X-quantization ("grid") value.
   * @param {number=0.1} o.quantizeY - Y-quantization ("grid") value.
   * @param {boolean=false} o.hasFixedStartPoint - Is there a fixed start vertex?
   * @param {boolean=false} o.hasFixedEndPoint - Is there a fixed end vertex?
   * @param {number=0} o.fixedStartPointY - Y value of the fixed start vertex, if exists.
   * @param {number=0} o.fixedEndPointY - Y value of the fixed end vertex, if exists.
   * @param {boolean=true} o.isEditable - Is the graph editable?
   * @param {string="#000"} o.vertexColor - Color of vertex points.
   * @param {string="#000"} o.lineColor - Color of lines connecting the vertices.
   * @param {string="#fff"} o.bgColor - Background color.
   * @param {number=3} o.vertexRadius - Radius of the vertex points.
   * @param {number=1.2} o.mouseSensitivity - Mouse sensitivity (how much moving the mouse affects the interaction).
   */
  constructor(container, o) {
    super(container, o);
  }

  /**
   * Initialize the options
   * @override
   * @protected
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
      hasFixedStartPoint: false,
      hasFixedEndPoint: false,
      fixedStartPointY: 0,
      fixedEndPointY: 0,
      isEditable: true,
      vertexColor: "#000",
      lineColor: "#000",
      bgColor: "#fff",
      vertexRadius: 3,
      mouseSensitivity: 1.2
    };

    // override defaults with provided options
    this.setOptions(o);
  }

  /**
   * Initialize state constraints
   * @override
   * @protected
   */
  _initStateConstraints() {
    const _this = this;

    this.stateConstraints = new ConstraintSpec({
      vertices: [{
        x: new Constraint({
          min: _this.o.minXVal,
          max: _this.o.maxXVal,
          transform: (num) => MathUtil.quantize(num, _this.o.quantizeX)
        }),
        y: new Constraint({
          min: _this.o.minYVal,
          max: _this.o.maxYVal,
          transform: (num) => MathUtil.quantize(num, _this.o.quantizeY)
        })
      }]
    });
  }

  /**
   * Initialize state
   * @override
   * @protected
   */
  _initState() {
    this.state = {
      // verices contains an array of vertices
      // each vertex is an object of form {x, y}
      vertices: [{x: 10, y: 10}, {x: 20, y: 20}, {x: 50, y: 1}]
    };
  }

  /**
   * Initialize the svg elements
   * @override
   * @protected
   */
  _initSvgEls() {
    const _this = this;

    this.svgEls = {
      //TODO: IMPLEMENT SVG_ELS
      panel: document.createElementNS(this.SVG_NS, "rect"),
      vertices: [],
      lines: []
    };

    //TODO: IMPLEMENT SVG_ELS ATTRIBUTES
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
   * @protected
   */
   _initHandlers() {
      const _this = this;

      //TODO: IMPLEMENT HANDLER FUNCTIONS
      this.handlers = {
         touchPanel: function touchPanel(ev) {
           let xPos = ev.clientX - _this._getLeft();
           let yPos = ev.clientY - _this._getTop()
           let vertexState = _this._calcVertexState({x: xPos, y: yPos});

           _this.addVertex(vertexState);

           _this.svgEls.vertices.forEach(vtx => {
             vtx.addEventListener("mousedown", _this.handlers.touchVertex);
             vtx.addEventListener("touchdown", _this.handlers.touchVertex);
           });
         },
         touchVertex: function touchVertex(ev) {
           document.addEventListener("mousemove", _this.handlers.moveVertex);
           document.addEventListener("touchmove", _this.handlers.moveVertex);
           ev.target.addEventListener("mouseup", _this.handlers.deleteVertex);
           ev.target.addEventListener("touchend", _this.handlers.deleteVertex);
         },
         deleteVertex: function deleteVertex(ev) {
           document.removeEventListener("mousemove", _this.handlers.moveVertex);
           document.removeEventListener("touchmove", _this.handlers.moveVertex);
           ev.target.removeEventListener("mouseup", _this.handlers.deleteVertex);
           ev.target.removeEventListener("touchend", _this.handlers.deleteVertex);
           _this._deleteVertex(ev.target);
         },
         moveVertex: function moveVertex(ev) {
           let xPos = ev.clientX - _this._getLeft();
           let yPos = ev.clientY - _this._getTop();

           _this._moveVertex(ev.target, {x: xPos, y: yPos});

           document.addEventListener("mouseup", _this.handlers.endMoveVertex);
           document.addEventListener("touchend", _this.handlers.endMoveVertex);
         },
         endMoveVertex: function endMoveVertex(ev) {
           document.removeEventListener("mousemove", _this.handlers.moveVertex);
           document.removeEventListener("touchmove", _this.handlers.moveVertex);
         },
         move: function(ev) {
         },
         release: function() {
         }
      };

      this.svgEls.panel.addEventListener("mousedown", _this.handlers.touchPanel);
      this.svgEls.panel.addEventListener("touchdown", _this.handlers.touchPanel);

      this.svgEls.vertices.forEach(vtx => {
        vtx.addEventListener("mousedown", _this.handlers.touchVertex);
        vtx.addEventListener("touchdown", _this.handlers.touchVertex);
      });
      //TODO: ASSIGN INIT HANDLERS
   }

  /**
   * Update (redraw) component based on state
   * @override
   * @protected
   */
  _update() {
      const _this = this;

      for (let i = _this.svgEls.vertices.length; i < _this.state.vertices.length; ++i) {
        _this._addSvgVertex();
      }

      for (let i = _this.svgEls.vertices.length; i > _this.state.vertices.length; --i) {
        _this._removeSvgVertex();
      }

      //TODO: IMPLEMENT UPDATE
      _this.state.vertices.forEach((stateVtx, idx) => {
        let nextStateVtx = (idx < _this.state.vertices.length - 1) ? _this.state.vertices[idx + 1] : null;

        let svgVtx = _this.svgEls.vertices[idx];
        let svgLine = (nextStateVtx !== null) ? _this.svgEls.lines[idx] : null;

        let pos = _this._calcVertexPos(stateVtx);
        let nextPos = (nextStateVtx !== null) ? _this._calcVertexPos(nextStateVtx) : null;

        svgVtx.setAttribute("cx", pos.x);
        svgVtx.setAttribute("cy", pos.y);
        svgVtx.setAttribute("r", _this.o.vertexRadius);
        svgVtx.setAttribute("fill", _this.o.vertexColor);

        if (svgLine !== null) {
          svgLine.setAttribute("d", "M " + pos.x + " " + pos.y + " L " + nextPos.x + " " + nextPos.y);
          svgLine.setAttribute("fill", "transparent");
          svgLine.setAttribute("stroke", _this.o.lineColor);
        }
      });

      //TODO: IMPLEMENT UPDATE EDGE CASES
   }

  /* ==============
   * Helper Methods
   * ==============
   */

   /** Calculate the x and y for a vertex in the graph according to its state value */
   _calcVertexPos(vertexState) {
     return {
       x: this._getWidth() * (vertexState.x / this.o.maxXVal),
       y: this._getHeight() - (this._getHeight() * (vertexState.y / this.o.maxYVal))
     }
   }

   /** Calculate the x and y for a vertex state based on position on the graph
    *  (inverse of _calcVertexPos)
    */
  _calcVertexState(vertexPos) {
    return {
      x: this.o.maxXVal * (vertexPos.x / this._getWidth()),
      y: this.o.maxYVal - (this.o.maxYVal * (vertexPos.y / this._getHeight()))
    }
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

     this._setState({
       vertices: newVertices
     });
   }

   /**
    * Delete a vertex
    * @private
    * @param {SVGElement} targetVtx - Vertex to Delete
    */
   _deleteVertex(targetVtx) {
     const _this = this;

     console.log(targetVtx);

     let vtxIdx = this.svgEls.vertices.findIndex(vtx => vtx === targetVtx);
     if (vtxIdx !== -1) {
       let newVertices = this.getState().vertices.map(x=>x);

       newVertices.splice(vtxIdx, 1);

       _this._setState({
         vertices: newVertices
       });
     }
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
     let vertices = _this.getState().vertices.map(x=>x);

     console.log("vtxIdx" + vtxIdx);
     vertices[vtxIdx].x = vtxState.x;
     vertices[vtxIdx].y = vtxState.y;

     _this._setState({
       vertices: vertices
     });
   }

   /** Add a new SVG vertex representation */
   _addSvgVertex() {
     const _this = this;
     let newVertex = document.createElementNS(_this.SVG_NS, "circle");
     let newLine = document.createElementNS(_this.SVG_NS, "path");
     _this.svgEls.vertices.push(newVertex);
     _this.svgEls.lines.push(newLine);
     _this.svg.appendChild(newLine);
     _this.svg.appendChild(newVertex);
   }

   /** Remove an SVG vertex */
   _removeSvgVertex() {
     let vertex = this.svgEls.vertices.pop();
     let line = this.svgEls.lines.pop();
     vertex = null;
     line = null;
   }


}

export default WidgetEnvelopeGraph
