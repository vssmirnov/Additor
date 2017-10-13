import Widget from "./widget";

/**
 * Class representing an SVG _TEMPLATE widget
 *
 * @class
 * @implements {Widget}
 */
 //TODO: CHANGE CLASSNAME
class Widget_TEMPLATE extends Widget {

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
    // set the defaults
    this.o = {
      //TODO: IMPLEMENT OPTIONS
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

    //TODO: IMPLEMENT SVG_ELS ATTRIBUTES

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

//TODO: CHANGE EXPORT NAME
export default Widget_TEMPLATE
