import AudioModuleUtil from "./util";

'use strict';

/**
 * Base class representing an Audio Module.
 * An AudioModule wraps a set of AudioNodes to provide a higher-order component that can itself be
 * used as an AudioNode.
 * @abstract @class
 */
class AudioModule {

  /**
   * @constructor
   * @param {AudioContext} - The Audio Context that the module participates in.
   * @param {number} numInputs - Number of inputs.
   * @param {number} numOutputs - Number of outputs.
   */
  constructor(audioCtx, numInputs, numOutputs) {
    this.audioCtx = audioCtx;

    // marker boolean to distinguish current object from an AudioNode
    this.isAudioModule = true;

    // shim the connect method for the Audio Context so that AudioNodes can connect to AudioModules
    if (typeof this.audioCtx.webAudioConnect !== "function") {
      AudioModuleUtil.shimWebAudioConnect(this.audioCtx);
    }

    this._input = audioCtx.createGain();
    this._output = audioCtx.createGain();
  }

  /* ==============================================================================================
  *   GETTERS AND SETTERS
  *  ============================================================================================*/

  /**
   * Returns the AudioContext that the Audio Module is participating in.
   * @returns {AudioContext} - the AudioContext that the Audio Module is participating in. 
   */
  get context() {
    return this.audioCtx;
  }

  /**
   * Returns the AudioContext that the Audio Module is participating in.
   * @returns {AudioContext} - the AudioContext that the Audio Module is participating in. 
   */
  getContext() {
    return this.audioCtx;
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
    if (destination.isAudioModule === true) {
      this._output.connect(destination._input);
    }
    // else destination is an AudioNode and can be connected to directly
    else {
      this._output.connect(destination);
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
    if (destination.isAudioModule === true) {
      this._output.disconnect(destination._audioModuleInput);
    // else destination is an AudioNode and can be disconnected from directly
    } else {
      this._output.disconnect(destination);
    }
  }
}

export default AudioModule;