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

    /* ==============================================================================================
    *  PUBLIC API
    */

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

    /* ==============================================================================================
    *  INITIALIZATION METHODS
    */

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
            appendString: "",
            mouseSensitivity: 0.01
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
            text: document.createElementNS(_this.SVG_NS, "text"),
            overlay: document.createElementNS(_this.SVG_NS, "rect"),
        };

        this.svgEls.text.setAttribute("alignment-baseline", "middle");
        this.svgEls.text.setAttribute("text-anchor", "middle");
        this.svg.addEventListener("mouseover", function() {
            _this.svg.style.cursor = "text";
        });

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
        let power;

        this.handlers = {

            touch: function touch(ev) {
                ev.preventDefault();
                ev.stopPropagation();

                y0 = ev.clientY;
                x0 = ev.clientX;

                charNum = _this._getSelectedCharNumber(x0, y0);
                power = _this._getPowerOfSelectedDigit(charNum);

                document.addEventListener("mousemove", _this.handlers.move);
                document.addEventListener("touchmove", _this.handlers.move);
                document.addEventListener("mouseup", _this.handlers.kbdEdit);
                document.addEventListener("touchend", _this.handlers.kbdEdit);
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

                let charNum = _this._getSelectedCharNumber(ev.clientX, ev.clientY);
                let power = _this._getPowerOfSelectedDigit(charNum);

                document.removeEventListener("mousemove", _this.handlers.move);
                document.removeEventListener("touchmove", _this.handlers.move);
            },

            release: function release(ev) {
                ev.preventDefault();
                ev.stopPropagation();

                document.removeEventListener("mousemove", _this.handlers.move);
                document.removeEventListener("touchmove", _this.handlers.move);
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

        this.svgEls.text.textContent = this.state.val
            .toFixed(this.o.precision)
            + this.o.appendString;

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

    /* ==============================================================================================
    *  INTERNAL FUNCTIONALITY METHODS
    */

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