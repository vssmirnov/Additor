'use strict';

/**
 * An abstract base class representing a custom Audio Module
 */
let AudioModule = function(audioCtx) {
  const _this = this;

  this.input = audioCtx.createGain();
  this.output = audioCtx.createGain();

  return {

    /**
     * Connect to another AudioNode or AudioModule
     */
    connect: function(destination, outputIndex, inputIndex) {
      // if destination has an input property, connect to it (destination is an AudioModule)
      if (typeof destination.input === "object") {
        _this.output.connect(destination.input);
      }
      // else destination is an AudioNode and can be connected to directly
      else {
        _this.output.connect(destination);
      }
    },

    /**
     * Disconnect from an AudioNode or AudioModule
     */
    disconnect: function (destination, outputIndex, inputIndex) {
      // if destination has an input property, disconnect from it (destination is an AudioModule)
      if (typeof destination.input === "object") {
        _this.output.disconnect(destination.input);
      // else destination is an AudioNode and can be disconnected from directly
      } else {
        _this.output.disconnect(destination);
      }
    }
  }
}

export default AudioModule
