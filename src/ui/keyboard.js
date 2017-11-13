import Widget from "ui/widget";
import Constraint from "util/constraint";
import ConstraintSpec from "util/constraint-def";

/**
 * Class representing an piano keyboard widget
 *
 * @class
 * @implements {Widget}
 */
class Keyboard extends Widget {

  /**
   * @constructor
   * @param {object} container - DOM container for the widget.
   * @param {object} [o] - Options.
   * @param {number} [o.bottomNote=48] - The bottom note (MIDI pitch) of the keyboard.
   * @param {number} [o.topNote=71] - The top note (MIDI pitch) of the keyboard.
   * @param {string} [o.keyBorderColor="#484848"] - The color of the border separating the keys.
   * @param {string} [o.blackKeyColor="#484848"] - The color used for the black keys.
   * @param {string} [o.whiteKeyColor="#fff"] - The color used for the white keys.
   * @param {string} [o.blackKeyActiveColor="#888"] - The color used to represent an active black key.
   * @param {string} [o.whiteKeyActiveColor="#333"] - The color used to represent an active white key.
   * @param {string} [o.orientation="horizontal"] - The keyboard orientation. sible values are 'monophonic'
   *                                       (only one active note at a time), or 'polyphonic'
   *                                       (can have several active notes at a time).
   * @param {boolean} [o.isEditable=true] - Boolean specifying whether the keyboard
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
   * @private
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
      orientation: "horizontal",
      isEditable: true,
      mouseSensitivity: 1.2
    };

    // override defaults with provided options
    super._initOptions(o);
  }

  /**
   * Initialize state constraints
   * @override
   * @private
   */
  _initStateConstraints() {
    const _this = this;

    this.stateConstraints = new ConstraintSpec({
      activeNotes: [{
        pitch: new Constraint({ min: 0, max: 127 }),
        vel: new Constraint({ min: 0, max: 127})
      }],
      curNote: {
        pitch: new Constraint({ min: 0, max: 127 }),
        vel: new Constraint({ min: 0, max: 127 })
      }
    });
  }

  /**
   * Initializes the state.
   * State is represented as an array of active notes, each of which is an object
   * { pitch, vel }, where pitch is MIDI pitch (0 - 127) and vel is MIDI velocity
   * (0 - 127). A vel of 0 is reported once for each note-off event, and not
   * reported on subsequent callback notifications.
   *
   * @override
   * @private
   */
  _initState() {
    this.state = {
      activeNotes: [{pitch: 0, vel: 0}],
      curNote: {pitch: 0, vel: 0}
    };
  }

  /**
   * Initialize the svg elements
   * @override
   * @private
   */
  _initSvgEls() {
    const _this = this;

    this.svgEls = {
      keys: []
    };

    this._updateSvgEls();

    this._appendSvgEls();
    this._update();
  }

  /**
   * Updates the SVG elements. 
   */
   _updateSvgEls() {
    
    // add SVG elements representing keys to match current number of keys
    for (let i = this.svgEls.keys.length; i < this._getNumKeys(); ++i) {
      this._addSvgKey();
    }

    // remove SVG elements representing keys to match current number of keys
    for (let i = this.svgEls.keys.length; i > this._getNumKeys(); ++i) {
      this._removeSvgKey();
    }
  }

  /**
   * Initializes mouse and touch event handlers.
   * @override
   * @private
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
   * Updates (redraws) component based on state.
   *
   * @override
   * @private
   */
  _update() {
    var x, y, width, height, fill, stroke;
    let blackKeys = [];

    this._updateSvgEls();

    for (let keyIdx = 0, whiteKeyIdx = 0; keyIdx < this.svgEls.keys.length; ++keyIdx) {
      let pitch = this._getPitchForKeyIdx(keyIdx);
      let attr = {};

      if (this._isWhiteKey(pitch)) {
        attr.x = this._getWhiteKeyWidth() * whiteKeyIdx;
        attr.y = 0;
        attr.width = this._getWhiteKeyWidth();
        attr.height = this._getKeyboardHeight();
        attr.fill = this.getOptions().whiteKeyColor;
        attr.stroke = this.getOptions().keyBorderColor;

        ++whiteKeyIdx;       
      } else {
        blackKeys.push(this.svgEls.keys[keyIdx]);

        // black keys are offset by 2/3 of white key width, and are 2/3 width and height of black keys
        attr.x = (this._getWhiteKeyWidth() * whiteKeyIdx) + ( (2/3) * this._getWhiteKeyWidth() );
        attr.y = 0;
        attr.width = (2/3) * this._getWhiteKeyWidth();
        attr.height = (2/3) * this._getKeyboardHeight();
        attr.fill = this.getOptions().blackKeyColor;
        attr.stroke = this.getOptions().keyBorderColor;
      }

      this._setKeyAttributes(keyIdx, attr);
    }

    // remove and reappend black keys so they are on top of the white keys
    for (let i = 0; i < blackKeys.length; ++i) {
      this.svg.removeChild(blackKeys[i]);
      this.svg.appendChild(blackKeys[i]);
    }
  }

  /* ===========================================================================
  *  PUBLIC API
  */

  /**
   * Sets the options.
   * @public
   * @override
   * @param {object} [o] - Options to set. See {@link Keyboard#constructor} for list of options. 
   */
  setOptions(o) {
    o = o || {};

    // ensure that the bottom note is a white key (a black key cannot be at the edge when drawing the keyboard)
    if (o.bottomNote !== undefined && !this._isWhiteKey(o.bottomNote)) {
      --o.bottomNote;
    }

    // ensure that the bottom note is a white key (a black key cannot be at the edge when drawing the keyboard)
    if (o.topNote !== undefined && !this._isWhiteKey(o.topNote)) {
      ++o.topNote;
    }

    super.setOptions(o);
  }

  /**
   * Returns the last 
   * @public
   * @override
   * @returns {array} - An array of active notes.
   */
  getVal() {
    return this.getState().curNote;
  }

  /**
   * Sets the current keyboard state using an array of {pitch, val} objects.
   * Same as setVal(), but will not cause an observer callback trigger.
   * @public
   * @override
   * @param {array} newNote - New value (array representing active notes with each entry in the form {pitch, val}).
   */
  setInternalVal(newNote) {
    let newState = _getNewStateFromNewNote(newNote);
    this.setInternalState(newState);
  }

  /**
   * Sets the current keyboard state using an array of {pitch, val} objects.
   * Same as setInternalVal(), but will cause an observer callback trigger.
   * @public
   * @param {array} newVal - New value (array representing active notes with each entry in the form {pitch, val}).
   */
  setVal(newVal) {
    let newState = _getNewStateFromNewNote(newNote);
    this.setState(newState);
  }

  /* ===========================================================================
  *  INTERNAL FUNCTIONALITY
  */

  /**
   * Returns a newState object representing a new keyboard state based on a new note provided. 
   * @param {object} newNote - A note object of format { pitch: number, vel: number }.
   * @param {number} newNote.pitch
   * @param {number} newNote.vel
   * @returns {object} An object representing the new state. 
   */
  _getNewStateFromNewNote(newNote) {
    let newState = {};
    newState.activeNotes = this.getState().activeNotes;
    newState.curNote = newNote;

    let noteIdx = newState.activeNotes.findIndex(note => note.pitch === newNote.pitch);

    if (newNote.vel > 0) {

      // if the note is already one of the active notes, change its velocity
      // else add it to the list of active notes
      if (noteIdx !== -1) {
        newState.activeNotes[noteIdx].vel = newNote.vel;
      } else {
        newState.activeNotes.push(newNote);
      }
    } else {

      // if the note is one of the active notes, remove it from active notes since vel=0 means noteoff
      // else do nothing, since sending a note of vel=0 if its not currently active is meaningless
      if (noteIdx !== -1) {
        newState.activeNotes.splice(noteIdx, 1);
      }
    }

    return newState;
  }

  /**
   * Adds an SVG element representing a key.
   */
  _addSvgKey() {
    let newKey = document.createElementNS(this.SVG_NS, "rect");
    this.svg.appendChild(newKey);
    this.svgEls.keys.push(newKey);
  }

  /**
   * Removes an SVG element representing a key.
   */
  _removeSvgKey() {
    let key = this.svgEls.keys[this.svgEls.keys.length - 1];

    this.svg.removeChild(key);
    key = null;
    this.svgEls.keys.pop();
  }

  /* ===========================================================================
  *  HELPER METHODS
  */

  /**
   * Sets attributes for an SVG rectangle representing a key with the given index.
   */
  _setKeyAttributes(keyIdx, attr) {
    console.log("hegith", attr.height, this._getKeyboardWidth());

    this.svgEls.keys[keyIdx].setAttribute("x", attr.x);
    this.svgEls.keys[keyIdx].setAttribute("y", attr.y);
    this.svgEls.keys[keyIdx].setAttribute("width", attr.width);
    this.svgEls.keys[keyIdx].setAttribute("height", attr.height);
    this.svgEls.keys[keyIdx].setAttribute("fill", attr.fill);
    this.svgEls.keys[keyIdx].setAttribute("stroke", attr.stroke);
  }

  /**
   * Returns the width of the keyboard, taking orientation into account.
   * If orientation is horizontal, width of the keyboard would equal
   * width of the canvas. If orientation is vertical, width of the
   * keyboard would equal the height of the canvas.
   * @private
   * @throws {Error} if o.orientation is not one of the allowed values.
   */
  _getKeyboardWidth() {
    let orientation = this.getOptions().orientation;

    if (orientation === "horizontal" || orientation === "horizontal-mirrored") {
      return this._getWidth();
    } else if (orientation === "vertical" || orientation === "vertical-mirrored") {
      return this._getHeight();
    } 
  }

  /**
   * Returns the height of the keyboard, taking orientation into account.
   * If orientation is horizontal, height of the keyboard would equal
   * height of the canvas. If orientation is vertical, height of the
   * keyboard would equal the width of the canvas.
   * @private
   * @throws {Error} if o.orientation is not one of the allowed values.
   */
  _getKeyboardHeight() {
    let orientation = this.getOptions().orientation;

    if (orientation === "horizontal" || orientation === "horizontal-mirrored") {
      return this._getHeight();
    } else if (orientation === "vertical" || orientation === "vertical-mirrored") {
      return this._getWidth();
    } 
  }

  /**
   * Returns the MIDI note number for the given key number.
   * @private
   * @param {number} keyIdx - The index of the key to be queried.
   * @returns {number} - MIDI note number for the given key number
   */
  _getPitchForKeyIdx(keyIdx) {
    return this.getOptions().bottomNote + keyIdx;
  }

  /** 
   * Returns the total number of keys on the keyboard. 
   * @private
   * @returns {number} - Total number of keys.
   */
  _getNumKeys() {
    return (this.o.topNote - this.o.bottomNote) + 1;
  }

  /**  
   * Returns the number of white keys on the keyboard.
   * @private
   * @returns {number} - Number of white keys. 
   */
  _getNumWhiteKeys() {
    let whiteKeyCount = 0;

    for (let curNote = this.getOptions().bottomNote; curNote <= this.getOptions().topNote; ++curNote) {
      if (this._isWhiteKey(curNote)) {
        ++whiteKeyCount;
      }
    }

    return whiteKeyCount;
  }

  /** 
   * Returns the width of each white key in px.
   * @private
   * @returns {number} - Width of each white key in px.
   */
  _getWhiteKeyWidth() {
    return this._getKeyboardWidth() / this._getNumWhiteKeys();
  }

  /**
   * Returns true if the given MIDI note number is a white key on the piano.
   * @private
   * @param {number} note - The MIDI note number for the given note. 
   * @returns {boolean} - True if the note is a white key, false if not.
   */
  _isWhiteKey(note) {
    if (note % 12 === 0  
      || note % 12 === 2 
      || note % 12 === 4 
      || note % 12 === 5 
      || note % 12 === 7 
      || note % 12 === 9 
      || note % 12 === 11) {
        return true;
    } else {
      return false;
    }
  }



  //TODO: IMPLEMENT HELPER METHODS


}

export default Keyboard
