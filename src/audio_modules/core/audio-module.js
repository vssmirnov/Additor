import AudioModuleUtil from "./util";
import shimWebAudioConnect from "./shim-web-audio-connect";
import AudioModuleOptionsMixin from "./audio-module-options-mixin";

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
    if (this.audioCtx.isWebAudioConnectShimmed !== true) {
      shimWebAudioConnect(this.audioCtx);
    }

    this.input = audioCtx.createGain();
    this.output = audioCtx.createGain();

    this.audioComponents = {};

    this._initAudioComponents();
    this._initAudioParams();
  }

  /* ============================================================================================= */
  /*  INITIALIZATION METHODS
  /* ============================================================================================= */

  /**
   * Initialize audio components and their connections.
   * @private @abstract
   */
  _initAudioComponents() {}

  /**
   * Initialize and expose Audio Params.
   * @private @abstract
   */
  _initAudioParams() {}

  /**
   * Initialize the options.
   * @private @abstract
   */
  _initOptions() {}

  /* ============================================================================================ */
  /*  PUBLIC API
  /* ============================================================================================ */
  
  /**
   * Returns the AudioContext that the Audio Module is participating in.
   * @returns {AudioContext} - the AudioContext that the Audio Module is participating in. 
   */
  getContext() {
    return this.audioCtx;
  }
  
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
    if (destination.isAudioModule === true) {
      this.output.disconnect(destination.input);
    // else destination is an AudioNode and can be disconnected from directly
    } else {
      this.output.disconnect(destination);
    }
  }
}

Object.assign(AudioModule.prototype, AudioModuleOptionsMixin);

export default AudioModule;