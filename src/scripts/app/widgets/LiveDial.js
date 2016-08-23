(function(){
  'use strict';

  class LiveDial {
    constructor (container, o) {
      o = o || {};

      this.observers = [];

      // value
      this._value = o.value || 0;
      this._minValue = o.minValue || 0;
      this._maxValue = o.maxValue || 127;

      // display options
      this._displayName = o.displayName || '';
      this._hasDisplayName = o.hasDisplayName || true;
      this._hasValueDisplay = o.hasValueDisplay || true;
      this._needleColor = o.needleColor || '#000';
      this._activeColor = o.activeColor || '#f40';
      this._fontFamily = o.fontFamily || 'Arial';

      // set up the canvas
      this.container = container || document.body;
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.container.offsetWidth;
      this.canvas.height = this.container.offsetHeight;
      this.canvas.style.position = 'relative';
      this.container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');

      this.init();
    }

    init () {
      this.drawUI();
      this.assignListeners();
    }

    /* --- OBSERVER METHODS --- */
    subscribe (context, func) {
      this.observers.push({
        func: func,
        context: context
      });
      return this;
    }

    unsubscribe (context, func) {
      this.observers = this.observers.filter(observer => {
        return observer.func !== func || observer.context !== context;
      });
      return this;
    }

    notify () {
      var _this = this;
      this.observers.forEach(observer => {
        observer.func.call(observer.context, _this._value);
      });
    }

    /* --- GETTERS AND SETTERS --- */
    set value (newValue) {
      this._value = Math.max(Math.min(newValue, this._maxValue), this._minValue);
      this.drawUI();
      this.notify();
      return this;
    }

    get value () {
      return this._value;
    }

    setValue (newValue) {
      this.value = newValue;
    }

    getValue () {
      return this._value;
    }

    /* --- UI DRAWING --- */
    drawUI () {
      this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);

      var cX = this.canvas.width / 2;
      var cY = this.canvas.height / 2;

      var dialRadius = Math.min(cX, cY) * 0.6;

      // calculate the needle angle
      var needleAngle = (this._value / this._maxValue) * 1.7*Math.PI + (1.15 * Math.PI);
      var needleEndX = cX + (Math.sin(needleAngle) * dialRadius);
      var needleEndY = cY - (Math.cos(needleAngle) * dialRadius);

      // draw the background circle
      this.ctx.beginPath();
      this.ctx.arc(cX, cY, dialRadius, 0.65*Math.PI, 2.35*Math.PI);
      this.ctx.lineWidth = dialRadius / 5;
      this.ctx.strokeStyle = this._needleColor;
      this.ctx.stroke();

      // draw the active circle
      this.ctx.beginPath();
      this.ctx.arc(cX, cY, dialRadius, 0.64*Math.PI, needleAngle - 0.51*Math.PI);
      this.ctx.lineWidth = dialRadius / 5;
      this.ctx.strokeStyle = this._activeColor;
      this.ctx.stroke();

      // draw the needle
      this.ctx.beginPath();
      this.ctx.moveTo(cX, cY);
      this.ctx.lineTo(needleEndX, needleEndY);
      this.ctx.lineCap = 'round';
      this.ctx.lineWidth = dialRadius / 5;
      this.ctx.strokeStyle = this._needleColor;
      this.ctx.stroke();

      // draw the number display
      if(this._hasValueDisplay) {
        this.ctx.font = Math.max(dialRadius*0.4, 11) + 'px ' + this._fontFamily;
        this.ctx.fillStyle = this._needleColor;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this._value, cX, cY+(dialRadius * 1.4));
      }

      // draw the number display name
      if(this._hasDisplayName) {
        this.ctx.font = Math.max(dialRadius*0.5, 11) + 'px ' + this._fontFamily;
        this.ctx.fillStyle = this._needleColor;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this._displayName, cX, cY-(dialRadius * 1.2));
      }
    }

    /* --- UI INTERACTION --- */
    assignListeners () {
      var _this = this;

      var turnStartVal, turnDelta, newVal;

      this.container.addEventListener('mousedown', beginTurningListener);

      function beginTurningListener(e) {
        turnStartVal = e.clientY;

        document.addEventListener('mousemove', continueTurningListener);


      }

      function continueTurningListener (e) {
        turnDelta = Math.trunc((turnStartVal - e.clientY) * 0.1);

        if((_this._value + turnDelta > _this._maxValue) || (_this._value + turnDelta < _this._minValue)) {
            turnStartVal = e.clientY;
        } else {
          _this.setValue(_this._value + turnDelta);
        }

        document.addEventListener('mouseup', endTurningListener);
      }

      function endTurningListener (e) {
        document.removeEventListener('mousemove', continueTurningListener);
        document.removeEventListener('mouseup', endTurningListener);
      }
    }
  }

  /* --- Module loader and global support --- */

  // support for AMD libraries
  if (typeof define === 'function') {
    define([], function () {
      return LiveDial;
    });
  }

  // support for CommonJS libraries
  else if (typeof exports !== 'undefined') {
    exports.LiveDial = LiveDial;
  }

  // support for window global
  else if (typeof window !== 'undefined') {
    window.LiveDial = LiveDial;
  }

  // support for Node.js global
  else if (typeof global !== 'undefined') {
    global.LiveDial = LiveDial;
  }
})();
