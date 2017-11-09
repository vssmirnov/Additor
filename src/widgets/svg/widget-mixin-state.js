import Constraint from "./constraint";
import ConstraintSpec from "./constraint-spec";

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
   * If no new state argument is provided, will reassign old state, taking into account the stateConstraints.
   * As opposed to _setState(), does not trigger observer notification.
   * Will use Widget.stateConstraints to constrain each state value to each constraints min, max, or enum
   * @protected
   * @param {object=} newState - The new state.
   * @return {boolean} isChanged - Returns a boolean indicating whether the state has been changed
   */
  setState: function _setState_(newState) {
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
   * Set the current state.
   * As opposed to setState(), _setState() will call the observer callback functions,
   * so may lead to an infinate loop if an observer calls this method.
   * @protected
   * @param {object=} newState - The new state.
   * @return {boolean} isChanged - Returns a boolean indicating whether the state has been changed
   */
  _setState: function _setState(newState) {
    const _this = this;
    let isChanged = false;

    isChanged = this.setState(newState);

    this._notifyObservers();

    return isChanged;
  },

  /**
   * Set the current state in a format specific to each widget.
   * Same as setVal(), but will not cause an observer callback trigger.
   * @abstract @public
   */
   setInternalVal: function setInternalVal(newVal) {
     throw new Error("Abstract method setInternalVal() must be implemented by subclass");
   },

   /**
    * Set the current state in a format specific to each widget.
    * Same as setInternalVal(), but will cause an observer callback trigger.
    * @abstract @public
    */
    setVal: function setVal(newVal) {
      throw new Error("Abstract method setVal() must be implemented by subclass");
    }
}

export default WidgetStateMixin
