import Widget from "./widget";

/**
 * Class representing an Envelop Graph widget
 *
 * @class
 * @implements {Widget}
 */
class WidgetEnvelopeGraph extends Widget {

  /**
   * @constructor
   * @param {object} container - DOM container for the widget.
   * @param {object=} o - options.
   //TODO: ANNOTATE OPTIONS
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

    this.stateConstraits = {
      //TODO: IMPLEMENT CONSTRAINTS
      vertices: [{
        x: {
          min: _this.o.minXVal,
          max: _this.o.maxXVal
        },
        y: {
          min: _this.o.minYVal,
          max: _this.o.maxYVal
        }
      }]
    }
  }

  /**
   * Initialize state
   * @override
   * @protected
   */
  _initState() {
    this.state = {
      //TODO: IMPLEMENT STATE
      // verices contains an array of vertices
      // each vertex is an object of form {x, y}
      vertices: []
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
    };

    Object.keys(_this.svgEls).forEach(key => {
      _this.svg.appendChild(_this.svgEls[key]);
      _this.svgEls[key].setAttribute("shape-rendering", "geometricPrecision");
    });

    //TODO: IMPLEMENT SVG_ELS ATTRIBUTES

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
       touch: function(ev) {
       },
       move: function(ev) {
       },
       release: function() {
       }
      };

      //TODO: ASSIGN INIT HANDLERS
   }

  /**
   * Update (redraw) component based on state
   * @override
   * @protected
   */
   _update() {
      //TODO: IMPLEMENT UPDATE
      //TODO: IMPLEMENT UPDATE EDGE CASES
   }

  /* ==============
   * Helper Methods
   * ==============
   */

   //TODO: IMPLEMENT HELPER METHODS
}

export default WidgetEnvelopeGraph
