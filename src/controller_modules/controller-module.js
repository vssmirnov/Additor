'use strict';

/**
 * Base class representing a Controller Module linking UI elements with Audio Modules.
 * The constructor of each implementing class should implement an object called uiElements, listing 
 * the UI elements that make up this controller, an object called observers, listing the observerer 
 * functions for each ui element, keyed by the same values as uiElements, and call the method
 * _registerObservers() to add the observers to each ui element.
 * @class
 */
class ControllerModule {

  /**
   * @constructor
   */
  constructor() {}

  /**
   * Sets options for all UI elements.
   * @param {object} newOptions 
   */
  setOptions(newOptions) {
    Object.values(this.uiElements).forEach(element => {
      element.setOptions(newOptions);
    });
  }

  /**
   * Register each observer function with UI elements of the same key.
   * This function should be called at the end of the constructor of each class implementing ControllerModule.
   */
  _registerObservers() {
    const _this = this;

    Object.entries(this.observers).forEach(([key, observerFunc]) => {
      _this.uiElements[key].addObserver(observerFunc);
    });
  }
}

export default ControllerModule;