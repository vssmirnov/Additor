/**
 * Mixin for methods related to state management
 * @mixin
 */
let WidgetStateMixin = {

  /**
   * Get the current state
   * @public
   * @return {object} this.state
   * @override
   */
  getState: function getState() {
    return this.state;
  },

  /**
   * Set the current state and redraw.
   * As opposed to _setState(), does not trigger observer notification.
   * Uses a diffing function, so only state that is different will lead to an update.
   * Will use Widget.stateConstraints to constrain each state value to each constraints min, max, or enum
   * @public
   * @param {object} newState - The new state.
   * @return {boolean} isChanged - Returns a boolean indicating whether the state has been changed
   */
  setState: function setState(newState) {
    const _this = this;
    newState = newState || {};
    let isChanged = false;

    Object.keys(newState).forEach(key => {
      if (_this.state.hasOwnProperty(key) && _this.state[key] !== newState[key]) {
        _this.state[key] = newState[key];

        // if there is a corresponding stateConstraint for the given state property,
        // confine the new state to the constraint
        if (_this.stateConstraints.hasOwnProperty(key)) {
          if(_this.stateConstraints[key].min !== undefined) {
            _this.state[key] = Math.max(_this.stateConstraints[key].min, _this.state[key]);
          }
          if (_this.stateConstraints[key].max !== undefined) {
            _this.state[key] = Math.min(_this.stateConstraints[key].max, _this.state[key]);
          }
        }

        isChanged = true;
      }
    });

    if (isChanged === true) {
      this._update();
    }

    return isChanged;
  },

  /**
   * Set the current state redraw
   * As opposed to the public version (setState()), _setState() will call the observer callback functions,
   * so may lead to an infinate loop if an observer calls this method.
   * Uses a diffing function, so only state that is different will lead to an update.
   * @protected
   * @param {object} newState - The new state.
   * @return {boolean} isChanged - Returns a boolean indicating whether the state has been changed
   */
  _setState: function _setState(newState) {
    const _this = this;
    newState = newState || {};

    if (this.setState(newState)) {
      this._notifyObservers();
      return true;
    }

    return false;
  }
}

export default WidgetStateMixin
