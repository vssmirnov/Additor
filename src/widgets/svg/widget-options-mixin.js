/**
 * Mixin for methods related to options
 * @mixin
 */
let WidgetOptionsMixin = {

  /**
   * Get the options object
   * @public
   * @return {object} this.o - Options
   */
  getOptions: function getOptions() {
    return this.o
  },

  /**
   * Set the options
   * Uses a diffing function, so only specified keys that have new values will be changed
   * @public
   * @param {object} o - options
   * @return {boolean} isChanged - Returns a boolean indicating whether any option has been changed
   */
  setOptions: function setOptions(o) {
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
}

export default WidgetOptionsMixin
