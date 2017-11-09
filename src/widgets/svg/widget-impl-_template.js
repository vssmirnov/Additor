import Widget from "./widget";
import Constraint from "./constraint";
import ConstraintSpce from "./constraint-spec";

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
   * @param {object=} o - Options.
   //TODO: ANNOTATE OPTIONS
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

    this.stateConstraits = new ConstraintSpec({
      //TODO: IMPLEMENT CONSTRAINTS
    });
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

  /* ===========================================================================
  *  PUBLIC API
  */

  /**
   * Get public representation of the state.
   * @abstract
   * @public
   * TODO: IMPLEMENT getVal()
   */
  getVal() {
    throw new Error("Abstract method getPublicState() must be implemented by subclass");
  }

  /**
   * Set the current state in a format specific to each widget.
   * Same as setVal(), but will not cause an observer callback trigger.
   * @abstract @public
   * TODO: IMPLEMENT setInternalVal()
   */
  setInternalVal(newVal) {
    throw new Error("Abstract method setInternalVal() must be implemented by subclass");
  },

  /**
   * Set the current state in a format specific to each widget.
   * Same as setInternalVal(), but will cause an observer callback trigger.
   * @abstract @public
   * TODO: IMPLEMENT setVal()
   */
  setVal(newVal) {
    throw new Error("Abstract method setVal() must be implemented by subclass");
  }

  /* ===========================================================================
  *  HELPER METHODS
  */

  //TODO: IMPLEMENT HELPER METHODS
}

//TODO: CHANGE EXPORT NAME
export default Widget_TEMPLATE
