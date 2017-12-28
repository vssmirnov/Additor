/**
 * Shim the WebAudio connect and disconnect methods to allow WebAudio nodes to connect to Audio Modules.
 * @param {AudioContext} audioCtx - The Audio Context to shim.
 */
function shimWebAudioConnect(audioCtx) {
  let audioNodePrototype = Object.getPrototypeOf(Object.getPrototypeOf(audioCtx.createGain()));

  // keep a reference to the original connect and disconnect methods as webAudioConnect and webAudioDisconnect
  audioNodePrototype.webAudioConnect = audioNodePrototype.connect;
  audioNodePrototype.webAudioDisconnect = audioNodePrototype.disconnect;

  // if the destination object has an 'input' property, it is an Audio Module - connect to 'input'
  // else it is an AudioNode - connect directly
  audioNodePrototype.connect = function (destination, outputIndex, inputIndex) {
    if (typeof destination._audioModuleInput === "object") {
      this.webAudioConnect(destination._audioModuleInput, outputIndex, inputIndex);
    } else {
      this.webAudioConnect(destination, outputIndex, inputIndex);
    }
  };

  audioNodePrototype.disconnect = function (destination, outputIndex, inputIndex) {
    if (typeof destination._audioModuleInput === "object") {
      this.webAudioDisconnect(destination._audioModuleInput, outputIndex, inputIndex);
    } else {
      this.webAudioDisconnect(destination, outputIndex, inputIndex);
    }
  };
}

export default shimWebAudioConnect;