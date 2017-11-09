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
      activeNotes: [{
        pitch: new Constraint({ min: 0, max: 127 }),
        vel: new Constraint({ min: 0, max: 127})
      }]
    });
  }

  /**
   * Initialize state.
   *
   * @description State is represented as an array of active notes, each of which is an object
   * { pitch, vel }, where pitch is MIDI pitch (0 - 127) and vel is MIDI velocity
   * (0 - 127). A vel of 0 is reported once for each note-off event, and not
   * reported on subsequent callback notifications.
   *
   * @override
   * @protected
   */
  _initState() {
    this.state = {
      activeNotes: []
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
   * Get current keyboard value.
   *
   * @description Get the current state as an array of pitch and velocity ( { pitch, vel } ) objects.
   * Notes that were just turned off (noteoff) will be represented with a 0 vel value.
   *
   * @public
   * @returns {array} - An array of active notes.
   */
  getVal() {
    return this.getState().activeNotes;
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
