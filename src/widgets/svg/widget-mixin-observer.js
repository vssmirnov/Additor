/**
 * Mixin for methods related to observer callback support
 * @mixin
 */
let WidgetObserverMixin = {

  /**
   * Register a new observer function that will recieve the state value every time the state is updated.
   * @public
   * @param {function} newObserver - The new observer function to be notified every time the state changes.
   * @return {boolean} isChanged - Indicates whether an observer was added.
   */
  addObserver: function addObserver(newObserver) {
    let isChanged = false;

    if (!(this.observers.find(observer => observer === newObserver))) {
      this.observers.push(newObserver);
      isChanged = true;
    }

    return isChanged;
  },

  /**
   * Remove an observer function from being notified when the state changes.
   * @public
   * @param {function} targetObserver - The observer function to be removed.
   * @return {boolean} isChanged - Indicates whether an observer has been removed
   */
  removeObserver: function removeObserver(targetObserver) {
    const _this = this;
    let isChanged = false;

    this.observers.forEach((observer, idx) => {
      if (observer === targetObserver) {
        _this.observers.splice(idx, 1);
        isChanged = true;
      }
    });

    return isChanged;
  },

  /**
   * Notify all observers of new state
   * @protected
   */
  _notifyObservers() {
    const _this = this;
    this.observers.forEach(observer => observer(_this.getPublicState()));
  }
}

export default WidgetObserverMixin
