import Widget from "./widget";

class WidgetDial extends Widget {
  constructor(container, o) {
    super(container, o);
  }

  /*========================
   * Init and Update Methods
   *========================*/

  /**
   * Initialize the options
   */
  _initOptions(o) {
    this.o = {
      minVal: 0,
      maxVal: 127,
      needleColor: "#000",
      activeColor: "#f40",
      mouseSensitivity: 0.1
    };

    this.setOptions(o);
  }

  /**
   * Initialize state
   */
  _initState() {
    this.state = {
      val: 4
    };
  }

  /**
   * Initialize the svg elements
   */
  _initSvgEls() {
    const _this = this;

    this.svgEls = {
      bgArc: document.createElementNS(this.SVG_NS, "path"),
      activeArc: document.createElementNS(this.SVG_NS, "path"),
      needle: document.createElementNS(this.SVG_NS, "line")
    };

    Object.keys(_this.svgEls).forEach(key => {
      _this.svg.appendChild(_this.svgEls[key]);
    });

    // draw the background arc
    this.svgEls.bgArc.setAttribute("d",
      _this._calcSvgArcPath(
        _this._calcNeedleCenter().x,
        _this._calcNeedleCenter().y,
        _this._calcDialRadius(),
        0.67 * Math.PI,
        2.35 * Math.PI
    ));
    this.svgEls.bgArc.setAttribute("stroke-width", _this._calcArcStrokeWidth());
    this.svgEls.bgArc.setAttribute("stroke", _this.o.needleColor);
    this.svgEls.bgArc.setAttribute("fill", "transparent");
    this.svgEls.bgArc.setAttribute("stroke-linecap", "round");

    // draw the active arc
    this.svgEls.activeArc.setAttribute("d",
      _this._calcSvgArcPath(
        _this._calcNeedleCenter().x,
        _this._calcNeedleCenter().y,
        _this._calcDialRadius(),
        0.69 * Math.PI,
        _this._calcNeedleAngle() - 0.51 * Math.PI
    ));
    this.svgEls.activeArc.setAttribute("stroke-width", _this._calcArcStrokeWidth() + 1);
    this.svgEls.activeArc.setAttribute("stroke", _this.o.activeColor);
    this.svgEls.activeArc.setAttribute("fill", "transparent");
    this.svgEls.activeArc.setAttribute("stroke-linecap", "round");

    // draw the needle
    this.svgEls.needle.setAttribute("x1", _this._calcNeedleCenter().x);
    this.svgEls.needle.setAttribute("y1", _this._calcNeedleCenter().y);
    this.svgEls.needle.setAttribute("x2", _this._calcNeedleEnd().x);
    this.svgEls.needle.setAttribute("y2", _this._calcNeedleEnd().y);
    this.svgEls.needle.setAttribute("stroke-width", _this._calcNeedleWidth());
    this.svgEls.needle.setAttribute("stroke", _this.o.needleColor);
    this.svgEls.needle.setAttribute("z-index", "1000");
    this.svgEls.needle.setAttribute("stroke-linecap", "round");
  }

  /**
   * Initialize mouse and touch event handlers
   */
   _initHandlers() {
      const _this = this;

      let y0 = 0;
      let yD = 0;
      let newVal = _this.getState().val;

      this.handlers = {
       touch: function(ev) {
         console.log("touch");
         y0 = ev.clientY;

         document.addEventListener("mousemove", _this.handlers.move);
         document.addEventListener("touchmove", _this.handlers.move);
         document.addEventListener("mouseup", _this.handlers.release);
         document.addEventListener("touchend", _this.handlers.release);
       },
       move: function(ev) {
         yD = y0 - ev.clientY;

         newVal = _this.state.val + (yD * _this.o.mouseSensitivity);
         newVal = Math.max(newVal, _this.o.minVal);
         newVal = Math.min(newVal, _this.o.maxVal);

         _this._setState({
           val: newVal
         })
       },
       release: function() {
         document.removeEventListener("mousemove", _this.handlers.move);
         document.removeEventListener("touchmove", _this.handlers.move);
       }
      };

      this.svg.addEventListener("mousedown", _this.handlers.touch);
      this.svg.addEventListener("touchstart", _this.handlers.touch);
   }

  /**
   * Update (redraw) component based on state
   */
   _update() {
     this.svgEls.needle.setAttribute("x1", this._calcNeedleCenter().x);
     this.svgEls.needle.setAttribute("y1", this._calcNeedleCenter().y);
     this.svgEls.needle.setAttribute("x2", this._calcNeedleEnd().x);
     this.svgEls.needle.setAttribute("y2", this._calcNeedleEnd().y);

     this.svgEls.activeArc.setAttribute("d",
       this._calcSvgArcPath(
         this._calcNeedleCenter().x,
         this._calcNeedleCenter().y,
         this._calcDialRadius(),
         0.65 * Math.PI,
         this._calcNeedleAngle() - 0.51 * Math.PI
     ));
   }

  /*====================
   * Getters and Setters
   *====================*/

  /**
   * Get the options object
   * @return {object} this.o - Options
   */
  getOptions() {
    return this.o
  }

  /**
   * Set the options
   * Uses a diffing function, so only specified keys that have new values will be changed
   * @param {object} o - options
   * @return {boolean} isChanged - Returns a boolean indicating whether any option has been changed
   */
  setOptions(o) {
    const _this = this;
    o = o || {};
    let isChanged = false;

    Object.keys(o).forEach(key => {
      if (_this.o.hasOwnProperty[key] && _this.o[key] !== o[key]) {
        _this.o[key] = o[key];
        isChanged = true;
      }
    });

    if (isChanged) {
      this._update();
    }

    return isChanged;
  }

  /**
   * Get the current state
   * @return {object} this.state
   */
  getState() {
    return this.state;
  }

  /**
   * Set the current state and redraw. As opposed to _setState(), does not trigger observer notification.
   * Uses a diffing function, so only state that is different will lead to an update.
   * @param {object} newState - The new state.
   * @return {boolean} isChanged - Returns a boolean indicating whether the state has been changed
   */
  setState(newState) {
    const _this = this;
    newState = newState || {};
    let isChanged = false;

    Object.keys(newState).forEach(key => {
      if (_this.state.hasOwnProperty(key) && _this.state[key] !== newState[key]) {
        _this.state[key] = newState[key];
        isChanged = true;
      }
    });

    if (isChanged === true) {
      this._update();
    }

    return isChanged;
  }

  /**
   * Set the current state redraw (private method).
   * As opposed to the public version (setState()), _setState() will call the observer callback functions,
   * so may lead to an infinate loop if an observer calls this method.
   * Uses a diffing function, so only state that is different will lead to an update.
   * @param {object} newState - The new state.
   * @return {boolean} isChanged - Returns a boolean indicating whether the state has been changed
   */
  _setState(newState) {
    const _this = this;
    newState = newState || {};

    if (this.setState(newState)) {
      this._notifyObservers();
      return true;
    }

    return false;
  }

  /* ================
   * Observer methods
   * ================*/

  /**
   * Register a new observer function that will recieve the state value every time the state is updated.
   * @param {function} newObserver - The new observer function to be notified every time the state changes.
   * @return {boolean} isChanged - Indicates whether an observer was added.
   */
  addObserver(newObserver) {
    let isChanged = false;

    if (!(this.observers.find(observer => observer === newObserver))) {
      this.observers.push(newObserver);
      isChanged = true;
    }

    return isChanged;
  }

  /**
   * Remove an observer function from being notified when the state changes.
   * @param {function} targetObserver - The observer function to be removed.
   * @return {boolean} isChanged - Indicates whether an observer has been removed
   */
  removeObserver(targetObserver) {
    const _this = this;
    let isChanged = false;

    this.observers.forEach((observer, idx) => {
      if (observer === targetObserver) {
        _this.observers.splice(idx, 1);
        isChanged = true;
      }
    });

    return isChanged;
  }

  /**
   * Notify all observers of new state (private method)
   */
  _notifyObservers() {
    const _this = this;
    this.observers.forEach(observer => observer(_this.state));
  }

  /* ==============
   * Helper Methods
   * ==============*/

   /** Get the width of the svg container */
   _getWidth() {
     return this.svg.getBoundingClientRect().width;
   }

   /** Get the height of the svg container */
   _getHeight() {
     return this.svg.getBoundingClientRect().height;
   }

   /** Calculte the stroke width for the background and active arcs */
   _calcArcStrokeWidth() {
     return this._calcDialRadius() / 5;
   }

   /** Calculate the dial radius */
   _calcDialRadius() {
     let radius = (Math.min(this._getWidth(), this._getHeight()) / 2) * 0.8;
     radius = Math.trunc(radius);
     return radius;
   }

   /** Calculate the needle angle for a given state val */
   _calcNeedleAngle() {
     const _this = this;

     return (
              // protect against divide by 0:
              (this.o.maxVal - _this.o.minVal) !== 0
                ?
                    (_this.state.val - _this.o.minVal) / (_this.o.maxVal - _this.o.minVal)
                  * (1.7 * Math.PI)
                  + (1.15 * Math.PI)
                :
                  0.5 * (1.7 * Math.PI) + (1.15 * Math.PI)
            );
   }

   /** Calculate the center of the needle, return {x, y} */
   _calcNeedleCenter() {
     const _this = this;
     return {
       x: Math.trunc(_this._getWidth() / 2),
       y: Math.trunc(_this._getHeight() / 2)
     };
   }

   /** Calculate position of end of the needle, return {x, y} */
   _calcNeedleEnd() {
     const _this = this;
     return {
       x: _this._calcNeedleCenter().x + (Math.sin(_this._calcNeedleAngle()) * _this._calcDialRadius()),
       y: _this._calcNeedleCenter().y - (Math.cos(_this._calcNeedleAngle()) * _this._calcDialRadius())
     }
   }

   /** Calculate the needle width */
   _calcNeedleWidth() {
     return this._calcDialRadius() / 5;
   }

   /** Calculate the path for an svg arc based on cx, cy, r, startAngle, endAngle */
   _calcSvgArcPath(cx, cy, r, startAngle, endAngle) {
     let x1 = cx + (r * Math.cos(startAngle));
     let y1 = cy + (r * Math.sin(startAngle));
     let x2 = cx + (r * Math.cos(endAngle));
     let y2 = cy + (r * Math.sin(endAngle));
     let largeArc = (endAngle - startAngle) < Math.PI ? 0 : 1;
     let sweep = (endAngle - startAngle) < Math.PI ? 1 : 1;

     return ["M", x1, y1, "A", r, r, 0, largeArc, sweep, x2, y2].join(" ");
   }
}

export default WidgetDial
