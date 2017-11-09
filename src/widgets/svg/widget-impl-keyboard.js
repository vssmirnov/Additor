import Widget from "./widget";
import Constraint from "./constraint";
import ConstraintSpce from "./constraint-spec";

/**
 * Class representing an piano keyboard widget
 *
 * @class
 * @implements {Widget}
 */
class WidgetKeyboard extends Widget {

  /**
   * @constructor
   * @param {object} container - DOM container for the widget.
   * @param {object=} o - Options.
   * @param {number=48} o.bottomNote - The bottom note (MIDI pitch) of the keyboard.
   * @param {number=71} o.topNote - The top note (MIDI pitch) of the keyboard.
   * @param {string="#484848"} o.keyBorderColor - The color of the border separating the keys.
   * @param {string="#484848"} o.blackKeyColor - The color used for the black keys.
   * @param {string="#fff"} o.whiteKeyColor - The color used for the white keys.
   * @param {string="#888"} o.blackKeyActiveColor - The color used to represent an active black key.
   * @param {string="#333"} o.whiteKeyActiveColor - The color used to represent an active white key.
   * @param {string="polyphonic"} o.mode - The polyphony mode. Possible values are 'monophonic'
   *                                       (only one active note at a time), or 'polyphonic'
   *                                       (can have several active notes at a time).
   * @param {boolean=true} o.isEditable - Boolean specifying whether the keyboard
   *                                      is editable by the mouse or touch interactions.
   *                                      A non-editable keyboard may be used as a visual
   *                                      diagram, for example.
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
      bottomNote: 48,
      topNote: 71,
      keyBorderColor: "#484848",
      blackKeyColor: "#484848",
      whiteKeyColor: "#fff",
      blackKeyActiveColor: "#888",
      whiteKeyActiveColor: "#333",
      mode: "polyphonic",
      isEditable: true,
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
  *  HELPER METHODS
  */

  //TODO: IMPLEMENT HELPER METHODS
}

//TODO: CHANGE EXPORT NAME
export default Widget_TEMPLATE
