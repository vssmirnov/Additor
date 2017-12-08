'use strict';

let ControllerManager = function ControllerManager() {};

ControllerManager.prototype = {

  createControllerPatch: function createControllerPatch(o) {
    let controllerObject = {};

    Object.keys(o).forEach(key => {
      controllerObject[key] = o[key];
    });
  }
}

export default ControllerManager
