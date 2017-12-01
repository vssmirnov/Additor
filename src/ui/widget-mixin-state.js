import Constraint from "util/constraint";
import ConstraintSpec from "util/constraint-def";

/**
 * Mixin for methods related to state management
 * @mixin
 */
let WidgetStateMixin = {

  /**
   * Get the current state.
   *
   * @public
   * @returns {object} - Copy of this.state
   */
  getState: function getState() {
    return Object.assign({}, this.state);
  },

  /**
   * Set the current state and redraw.
   *
   * @description If no new state argument is provided, will reassign old state, taking into account the stateConstraints.
   * As opposed to setState(), setInternalState() does not trigger observer notification.
   * Will use Widget.stateConstraints to constrain each state value to each constraints min, max, or enum
   *
   * @protected
   * @param {object=} newState - The new state.
   * @return {boolean} isChanged - Returns a boolean indicating whether the state has been changed
   */
  setInternalState: function setInternalState(newState) {
    const _this = this;
    let isChanged = false;

    newState = newState || this.getState();

    Object.keys(newState).forEach(key => {
      if (_this.state.hasOwnProperty(key) && _this.state[key] !== newState[key]) {
        _this.state[key] = newState[key];
        isChanged = true;
      }
    });

    _this.stateConstraints.constrain(_this.state);
    this._update();

    return isChanged;
  },

  /**
   * Set the current state and redraw.
   *
   * @description As opposed to setInternalState(), setState() will call the observer callback functions,
   * so may lead to an infinate loop if an observer calls this method.
   *
   * @protected
   * @param {object=} newState - The new state.
   * @return {boolean} isChanged - Returns a boolean indicating whether the state has been changed
   */
  setState: function setState(newState) {
    const _this = this;
    let isChanged = false;

    isChanged = this.setInternalState(newState);

    this._notifyObservers();

    return isChanged;
  }
};

export default WidgetStateMixin;
