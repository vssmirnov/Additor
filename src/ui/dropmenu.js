import Widget from "ui/widget";
import Constraint from "util/constraint";
import ConstraintSpec from "util/constraint-def";

/**
 * Class representing an Dropmenu widget
 * @class
 * @implements {Widget}
 */
class Dropmenu extends Widget {

  /**
   * @constructor
   * @param {object} container - DOM container for the widget.
   * @param {object} [o] - Options.
   * @param {string} [o.backgroundColor="#484848"] - The background color.
   * @param {string} [o.fontColor="#aaa"] - The font color.
   * @param {string} [o.fontSize="12px"] - The font size.
   * @param {string} [o.fontFamily="Arial"] - The font family.
   * @param {string} [o.menuItemFontSize="12px"] - The font size for items in the opened drop-down menu.
   * @param {string} [o.menuItemFontFamily="Arial"] - The font family for items in the opened drop-down menu.
   * @param {string} [o.selectedItemBackgroundColor="#ccc"] - The background cover for the selected (hovered) item in the opened drop-down menu.
   * @param {string} [o.selectedItemFontColor="#fff"] - The font color for the selected (hovered) item in the opened drop-down menu.
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
      backgroundColor: "#282828",
      fontColor: "#ddd",
      fontSize: "12px",
      fontFamily: "Arial",
      menuItemFontSize: "12px",
      menuItemFontFamily: "Arial",
      selectedItemBackgroundColor: "#ccc",
      selectedItemFontColor: "#fff",
      mouseSensitivity: 1.2
    };

    // override defaults with provided options
    super._initOptions(o);
  }

  /**
   * Initialize state constraints
   * @override
   * @protected
   */
  _initStateConstraints() {
    const _this = this;

    this.stateConstraits = new ConstraintSpec({
      menuItems: [new Constraint()],
      selectedItemIdx: new Constraint(),
      hasFocus: new Constraint()
    });
  }

  /**
   * Initialize state
   * @override
   * @protected
   */
  _initState() {
    this.state = {
      menuItems: ["one", "two", "three", "four"],
      selectedItemIdx: 0,
      hasFocus: false
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
      menuTogglePanel: document.createElementNS(_this.SVG_NS, "rect"),
      menuToggleText: document.createElementNS(_this.SVG_NS, "text"),
    };

    this.svgEls.menuToggleText.setAttribute("alignment-baseline", "middle");

    this.svgFloat = document.createElementNS(_this.SVG_NS, "svg");
    this.svgFloat.style.position = "absolute";
    this.svgFloat.style.visibility = "visible";

    this.svgFloatEls = {
      menuBodyPanel: document.createElementNS(_this.SVG_NS, "rect"),
      menuItemTextboxes: [],
      menuItemPanels: []
    }

    this.svgFloat.appendChild(this.svgFloatEls.menuBodyPanel);

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
    const _this = this;

    _this._updateEls();

    for (let i = 0; i < _this.state.menuItems.length; ++i) {
      _this.svgFloatEls.menuItemTextboxes[i].textContent = _this.state.menuItems[i];
    }

    this.svgEls.menuTogglePanel.setAttribute("fill", _this.o.backgroundColor);
    this.svgEls.menuTogglePanel.setAttribute("width", _this._getWidth());
    this.svgEls.menuTogglePanel.setAttribute("height", _this._getHeight());

    this.svgEls.menuToggleText.setAttribute("x", 10);
    this.svgEls.menuToggleText.setAttribute("y", 10);
    this.svgEls.menuToggleText.setAttribute("fill", _this.o.fontColor);

    this.svgEls.menuToggleText.textContent = _this.state.menuItems[_this.state.selectedItemIdx];
    
    let menuItemDims = _this._calcMenuItemDims();

    this.svgFloatEls.menuBodyPanel.setAttribute("height", menuItemDims.height * this.state.menuItems.length);
    this.svgFloatEls.menuBodyPanel.setAttribute("width", menuItemDims.width);

    this.svgFloat.style.position = this.svg.getBoundingClientRect().bottom;

    this.svgFloatEls.menuBodyPanel.setAttribute("y", 0);
  }

  /**
   * Update elements to match SVG representation with the state.
   * @private
   */
  _updateEls() {
    const _this = this;

    for (let i = this.svgFloatEls.menuItemTextboxes.length; i < this.state.menuItems.length; ++i) {
      _this._addSvgMenuItem();
    }

    for (let i = this.state.menuItems.length; i > this.svgFloatEls.menuItemTextboxes.length ; --i) {
      _this._removeSvgMenuItem();
    }
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
  }

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

  /**
   * Add svg elements representing a menu item.
   */
  _addSvgMenuItem() {
    let newItemText = document.createElementNS(this.SVG_NS, "text");
    let newItemPanel = document.createElementNS(this.SVG_NS, "rect");
    
    this.svgFloatEls.menuItemTextboxes.push(newItemText);
    this.svgFloatEls.menuItemPanels.push(newItemPanel);

    this.svg.appendChild(newItemPanel);
    this.svg.appendChild(newItemText);
  }

  /**
   * Remove svg elements representing a menu item.
   */
  _removeSvgMenuItem() {
    let targetItemTexbox = this.svgFloatEls.menuItemTextboxes.pop();
    let targetItemPanel = this.svgFloatEls.menuItemPanels.pop();

    this.svg.removeChild(targetItemTexbox);
    this.svg.removeChild(targetItemPanel);

    targetItemTexbox = null;
    targetItemPanel = null;
  }

  /**
   * Calculate the height of each menu item.
   * @returns {number} - Height in px.
   */
  _calcMenuItemDims() {
    let maxHeight = 0;
    let maxWidth = 0;
    
    this.svgFloatEls.menuItemTextboxes.forEach(item => {
      let bbox = item.getBoundingClientRect();
      maxHeight = maxHeight > bbox.height ? maxHeight : bbox.height;
      maxWidth  = maxWidth > bbox.width ? maxWidth : bbox.width;
    });

    return { width: maxWidth, height: maxHeight };
  }


}

//TODO: CHANGE EXPORT NAME
export default Dropmenu;
