'use strict';

let ControllerManager = function ControllerManager() {};

ControllerManager.prototype = {

  createController: function createController(o) {
    controllerObject = {};

    Object.keys(o).forEach(key => {
      controllerObject[key] = o[key]();
    });
  }
}

export default ControllerManager
