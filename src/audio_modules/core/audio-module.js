import AudioModuleUtil from "./util";

'use strict';

/**
 * Abstract base class representing an Audio Module.
 * An AudioModule wraps a set of AudioNodes to provide a higher-order component that can itself be
 * used as an AudioNode.
 * @abstract @class
 */

class AudioModule {

  /**
   * @constructor
   */
  constructor(audioCtx) {
    if (typeof audioCtx.webAudioConnect !== "function") {
      AudioModuleUtil.shimWebAudioConnect(audioCtx);
    }

    this._audioModuleInput = audioCtx.createGain();
    this._audioModuleOutput = audioCtx.createGain();

    // useful aliases
    this.input = this._audioModuleInput;
    this.output = this._audioModuleOutput;
  }

  /*===============================================================================================
  *  PUBLIC API
  * =============================================================================================*/

  /**
   * Connect to another AudioNode or AudioModule
   * @public
   * @param {AudioNode | AudioModule} destination - AudioNode or AudioModule to connect to.
   * @param {number} outputIndex - Channel of the output to connect.
   * @param {number} outputIndex - Channel of the destintation to connect to. 
   */
  connect(destination, outputIndex, inputIndex) {
    // if destination has an input property, connect to it (destination is an AudioModule)
    if (typeof destination._audioModuleInput === "object") {
      this.output.connect(destination.input);
    }
    // else destination is an AudioNode and can be connected to directly
    else {
      this.output.connect(destination);
    }
  }

  /**
   * Disconnect from an AudioNode or AudioModule
   * @param {AudioNode | AudioModule} destination - AudioNode or AudioModule to disconnect from.
   * @param {number} outputIndex - Channel of the output to disconnect.
   * @param {number} outputIndex - Channel of the destintation to disconnect from. 
   */
  disconnect(destination, outputIndex, inputIndex) {
    // if destination has an input property, disconnect from it (destination is an AudioModule)
    if (typeof destination._audioModuleInput === "object") {
      this.output.disconnect(destination._audioModuleInput);
    // else destination is an AudioNode and can be disconnected from directly
    } else {
      this.output.disconnect(destination);
    }
  }
}

export default AudioModule;