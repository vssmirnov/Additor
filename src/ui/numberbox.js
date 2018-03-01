import Widget from "ui/core/widget";
import Constraint from "util/constraint";
import ConstraintSpec from "util/constraint-def";

/**
 * Class representing an Numberbox widget.
 * @class
 * @implements {Widget}
 */
class Numberbox extends Widget {

    /**
     * @constructor
     * @param {object} container - DOM container for the widget.
     * @param {object} [o] - Options.
     * @param {number} [o.minVal=null] - Minimum value. 
     * @param {number} [o.maxVal=null] - Maximum value.
     * @param {number} [o.precision=0] - Number of decimal places to use.
     * @param {string} [o.backgroundColor="#282828"] - The background color.
     * @param {string} [o.fontColor="#aaa"] - The font color.
     * @param {string} [o.fontSize="12px"] - The font size.
     * @param {string} [o.fontFamily="Arial"] - The font family.
     * @param {string} [o.appendString=""] - String to append to the value when displaying (i.e. " Hz").
     */
    constructor(container, o) {
        super(container, o);
        return this;
    }

/* ============================================================================================== */
/*  PUBLIC API
/* ============================================================================================== */

    /**
     * Returns the current value.
     * @public @override
     * @returns {number} - Current value.
     */
    getVal() {
        return this.state.val;
    }

    /**
     * Sets the current value.
     * Same as setVal(), but will not cause an observer callback trigger.
     * @public @override
     * @param {number} newVal - The new value.
     */
    setInternalVal(newVal) {
        this.setInternalState({ val: newVal });
    }

    /**
     * Sets the current value.
     * Same as setInternalVal(), but will cause an observer callback trigger.
     * @public @override
     * @param {number} newVal - The new value.
     */
    setVal(newVal) {
        this.setState({ val: newVal });
    }

    /**
     * Returns a string representation of the value.
     * @returns {string} - String representation of the value.
     */
    toString() {
        return this.state.val.toFixed(this.o.precision);
    }

/* ============================================================================================== */
/* INITIALIZATION METHODS
/* ============================================================================================== */

    /**
     * Initializes the options.
     * @private @override
     */
    _initOptions(o) {
        // set the defaults
        this.o = {
            minVal: 0,
            maxVal: 127,
            precision: 4,
            quantizeInterval: 1,
            backgroundColor: "#282828",
            fontColor: "#ccc",
            fontSize: "12px",
            fontFamily: "Arial",
            textSelectBackgroundColor: "rgba(0,10,250,0.5)",
            appendString: "",
            mouseSensitivity: 0.01,
            mouseFineSensitivity: 0.001     // Fine sensitivity is used when shift key is held
        };

        // override defaults with provided options
        super._initOptions(o);
    }

    /**
     * Initializes state constraints.
     * @private @override
     */
    _initStateConstraints() {
        const _this = this;

        let valConstraintDef = {};

        if (this.o.minVal !== null) {
            valConstraintDef.minVal = this.o.minVal;
        }

        if (this.o.maxVal !== null) {
            valConstraintDef.maxVal = this.o.maxVal;
        }

        this.stateConstraints = new ConstraintSpec({
            val: new Constraint(valConstraintDef)
        });
    }

    /**
     * Initializes the state.
     * @private @override
     */
    _initState() {
        this.state = {
            val: 0
        };
    }

    /**
     * Initializes the svg elements.
     * @private @override
     */
    _initSvgEls() {
        const _this = this;

        this.svgEls = {
            panel: document.createElementNS(_this.SVG_NS, "rect"),
            textUnderlay: document.createElementNS(_this.SVG_NS, "rect"),
            text: document.createElementNS(_this.SVG_NS, "text"),
            cursor: document.createElementNS(_this.SVG_NS, "rect"),      
            overlay: document.createElementNS(_this.SVG_NS, "rect")
        };

        this.svgEls.text.setAttribute("alignment-baseline", "middle");
        this.svgEls.text.setAttribute("text-anchor", "middle");
        this.svg.addEventListener("mouseover", function() {
            _this.svg.style.cursor = "text";
        });

        this.svgEls.textUnderlay.setAttribute("fill", "transparent");

        this.svgEls.cursor.setAttribute("fill", "rgba(0,0,0,0)");
        this.svgEls.cursor.setAttribute("stroke", "rgba(0,0,0,0)");


        this._appendSvgEls();
        this._update();
    }

    /**
     * Initializes mouse and touch event handlers.
     * @private @override
     */
    _initHandlers() {
        const _this = this;

        let x0 = 0;
        let y0 = 0;
        let yD = 0;
        let newVal = _this.getState().val;
        let charNum;
        let charBRect;
        let power;
        let prevTouchTime = Date.now();

        this.handlers = {

            touch: function touch(ev) {
                ev.preventDefault();
                ev.stopPropagation();

                // If this is a double-tap gesture
                if (Date.now() - prevTouchTime < 500) {

                    _this.handlers.selectAll();

                } else {

                    y0 = ev.clientY;
                    x0 = ev.clientX;

                    charNum = _this._getSelectedCharNumber(x0, y0);
                    power = _this._getPowerOfSelectedDigit(charNum);

                    document.addEventListener("mousemove", _this.handlers.move);
                    document.addEventListener("touchmove", _this.handlers.move);
                    document.addEventListener("mouseup", _this.handlers.kbdEdit);
                    document.addEventListener("touchend", _this.handlers.kbdEdit);
                }

                prevTouchTime = Date.now();
            },

            move: function move(ev) {
                ev.preventDefault();
                ev.stopPropagation();

                let clientX = ev.clientX;
                let clientY = ev.clientY;
                
                yD = y0 - clientY;

                let newVal = _this.getVal() + (yD * Math.pow(10, power) * _this.o.mouseSensitivity);

                _this.setState({ val: newVal });

                document.removeEventListener("mouseup", _this.handlers.kbdEdit);
                document.removeEventListener("touchend", _this.handlers.kbdEdit);
                document.addEventListener("mouseup", _this.handlers.release);
                document.addEventListener("touchend", _this.handlers.release);
            },

            // Edit the value by typing on a keyboard
            kbdEdit: function kbdEdit(ev) {
                ev.preventDefault();
                ev.stopPropagation();

                document.removeEventListener("mousemove", _this.handlers.move);
                document.removeEventListener("touchmove", _this.handlers.move);

                charNum = _this._getSelectedCharNumber(ev.clientX, ev.clientY);
                charBRect = _this.svgEls.text.getExtentOfChar(charNum);
                
                let editStr = _this.toString();

                // If the click is past the mid-point of the character, we select the next char, bounded by the length of the string
                if (ev.clientX > ((charBRect.x + (charBRect.x + charBRect.width)) * 0.55)) {
                    charNum = charNum + 1;
                }
    
                _this.svgEls.text.textContent = _this._editText(editStr, charNum); 
            },

            release: function release(ev) {
                ev.preventDefault();
                ev.stopPropagation();

                document.removeEventListener("mousemove", _this.handlers.move);
                document.removeEventListener("touchmove", _this.handlers.move);
            },

            selectAll: function selectAll(ev) {

                let textBRect = _this.svgEls.text.

                _this.svgEls.textUnderlay.setAttribute("fill", _this.o.textSelectBackgroundColor);
                _this.svgEls.textUnderlay.setAttribute("width", _this.svgEls.text.getAttribute("width"));
                _this.svgEls.textUnderlay.setAttribute("height", _this.svgEls.text.getAttribute("height"));
                _this.svgEls.text.setAttribute("fill", "#f00");

                console.log("select all");
            }
        };

        this.svg.addEventListener("mousedown", _this.handlers.touch);
        this.svg.addEventListener("touchstart", _this.handlers.touch);
    }

    /**
     * Updates (redraws) components based on state.
     * @private @override
     */
    _update() {
        const _this = this;

        this.svgEls.text.textContent = this.toString();

        let panelWidth = _this._getWidth();
        let panelHeight = _this._getHeight();
        let textWidth = this.svgEls.text.getBoundingClientRect().width;
        let textHeight = this.svgEls.text.getBoundingClientRect().height;

        this.svgEls.panel.setAttribute("fill", _this.o.backgroundColor);
        this.svgEls.panel.setAttribute("width", panelWidth);
        this.svgEls.panel.setAttribute("height", panelHeight);

        this.svgEls.text.setAttribute("x", panelWidth / 2);
        this.svgEls.text.setAttribute("y", panelHeight / 2);
        this.svgEls.text.setAttribute("fill", _this.o.fontColor);

        this.svgEls.overlay.setAttribute("fill", "transparent");
        this.svgEls.overlay.setAttribute("width", _this._getWidth());
        this.svgEls.overlay.setAttribute("height", _this._getHeight());
    }

/* ============================================================================================== */
/*  INTERNAL FUNCTIONALITY METHODS
/* ============================================================================================== */

    _editText(str, charNum) {
        
        const _this = this;

        this.svgEls.text.textContent = str;

        let showCursorTimeoutID = null;
        let hideCursorTimeoutID = null;

        showCursor();

        document.addEventListener("keydown", makeEdit);
        this.svg.addEventListener("mousedown", finishEditing);
        this.svg.addEventListener("touchstart", finishEditing);
        document.addEventListener("mousedown", finishEditing);
        document.addEventListener("touchstart", finishEditing);

        function makeEdit(ev) {

            let key = ev.key;
            
            switch(key) {
                
                case "Backspace":
                    str = deletePrev();
                    break;
                case "Delete":
                    str = deleteNext();
                    break;
                case "ArrowLeft":
                    moveLeft();
                    break;
                case "ArrowRight":
                    moveRight();
                    break;
                case "ArrowUp":
                    increment();
                    break;
                case "ArrowDown":
                    decrement();
                    break;
                case "-":
                    str = insertMinus();
                    break;
                case "1": case "2": case "3": case "4": case "5": 
                case "6": case "7": case "8": case "9": case ".":
                    str = insertChar(key);
                    break;
                case "Enter":
                case "Escape":
                    finishEditing();
                    break;
                default: 
                    break;
            }

            _this.svgEls.text.textContent = str;

            if (showCursorTimeoutID !== null) {
                clearTimeout(showCursorTimeoutID);
                showCursorTimeoutID = null;
            }

            if (hideCursorTimeoutID !== null) {
                clearTimeout(hideCursorTimeoutID);
                hideCursorTimeoutID = null;
            }

            showCursor();

            console.log(str);
        }

        function deletePrev() {
            str = str.substring(0, charNum - 1) + str.substr(charNum);
            charNum--;
            return str;
        }

        function deleteNext() {
            str = str.substring(0, charNum) + str.substr(charNum + 1);
            return str;
        }

        function moveLeft() {
            charNum = Math.max(0, charNum - 1);
        }

        function moveRight() {
            charNum = Math.min(str.length, charNum + 1);
        }

        function increment() {
            let power = _this._getPowerOfSelectedDigit(charNum);
            str = (parseFloat(str) + Math.pow(10, power))
                    .toFixed(_this.o.precision);
        }

        function decrement() {
            let power = _this._getPowerOfSelectedDigit(charNum);
            str = (parseFloat(str) - Math.pow(10, power))
                    .toFixed(_this.o.precision);
        }

        function insertMinus() {
            if (charNum === 0) {
                str = "-" + str;
                charNum++;
            }

            return str;
        }

        function insertChar(key) {
            str = str.substring(0, charNum) + key + str.substr(charNum);
            charNum++;
            return str;
        }

        function showCursor() {
            let charBRect = _this.svgEls.text.getExtentOfChar(Math.min(charNum, str.length - 1));

            _this.svgEls.cursor.setAttribute("height", charBRect.height);

            if (charNum == str.length) {
                let charEndPos = _this.svgEls.text.getEndPositionOfChar(str.length - 1);
                _this.svgEls.cursor.setAttribute("x", charBRect.x + charBRect.width);
            } else {
                _this.svgEls.cursor.setAttribute("x", charBRect.x - 0.5);
            }
            _this.svgEls.cursor.setAttribute("y", charBRect.y);
            _this.svgEls.cursor.setAttribute("width", 1);
            _this.svgEls.cursor.setAttribute("stroke", _this.o.fontColor);
            
            if (hideCursorTimeoutID !== null) {
                window.clearTimeout(hideCursorTimeoutID);
                hideCursorTimeoutID = null;
            }

            hideCursorTimeoutID = window.setTimeout(hideCursor, 500);
        }

        function hideCursor() {
            _this.svgEls.cursor.setAttribute("stroke", "rgba(0,0,0,0)");

            if (showCursorTimeoutID !== null) {
                window.clearTimeout(showCursorTimeoutID);
                showCursorTimeoutID = null;
            }

            showCursorTimeoutID = window.setTimeout(showCursor, 500);
        }

        function finishEditing() {
            document.removeEventListener("keydown", makeEdit);

            if (showCursorTimeoutID !== null) {
                window.clearTimeout(showCursorTimeoutID);
                showCursorTimeoutID = null;
            }

            if (hideCursorTimeoutID !== null) {
                window.clearTimeout(hideCursorTimeoutID);
                hideCursorTimeoutID = null;
            }

            _this.svgEls.cursor.setAttribute("stroke", "rgba(0,0,0,0)");
            _this.svgEls.cursor.setAttribute("fill", "rgba(0,0,0,0)");

            _this.setState({ val: parseFloat(str) });
        }

        return str;
    }

    /**
     * Returns the number of the selected character in the text box based on the client mouse x and y position.
     * @private
     * @param {number} clientX 
     * @param {number} clientY 
     * @returns {number} - Index of the selected digit.
     */
    _getSelectedCharNumber(clientX, clientY) {

        let svgBRect = this.svg.getBoundingClientRect();
        let textBRect = this.svgEls.text.getBoundingClientRect();
        let numChars = this.svgEls.text.getNumberOfChars();
        let charNum = 0;

        if (clientX <= textBRect.x) {
            charNum = 0;
        } else if (clientX >= (textBRect.x + textBRect.width)) {
            charNum = numChars - 1;
        } else {
            let svgX = clientX - svgBRect.x;
            let svgY = clientY - svgBRect.y;

            let svgPoint = this.svg.createSVGPoint();
            svgPoint.x = svgX;
            svgPoint.y = svgY;

            charNum = this.svgEls.text.getCharNumAtPosition(svgPoint);
        }

        // if we selected the "minus" sign of a negative number, select the first digit instead
        if (this.getVal() < 0 && charNum == 0) {
            charNum = 1;
        }

        return charNum;
    }

    /**
     * Returns the power of the selected digit. 
     * @private
     * @param {number} charNum - The index of the selected digit.
     * @returns {number} - Power of the selected digit.
     */
    _getPowerOfSelectedDigit(charNum) {

        let power;
        let precision = this.o.precision;
        let numChars = this.svgEls.text.getNumberOfChars();

        if (precision > 0) {

            // if the digit selected is to the left of the decimal point
            if ((numChars - charNum) > (this.o.precision + 1)) {
                power = ((numChars - (precision + 1)) - charNum) - 1;
            } else {
                power = -1 * ((precision + 1) - (numChars - charNum));
            }
        } else {
            power = (numChars - charNum) - 1;
        }

        return power;
    }


}

export default Numberbox;