/**
 * Verifies that the given audio context has the requested features and attempts to shim features that are
 * missing.
 */
function VerifyAudioContextFeatures(audioCtx, features) {

  features.forEach(feature => {

    switch(feature) {

      case "Analyser":
        if (typeof audioCtx.createAnalyser !== "function") {
          throw new Error("Required module AnalyserNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "AudioBuffer":
        if (typeof audioCtx.createBuffer !== "function") {
          throw new Error("Required module AudioBufferNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;
      
      case "AudioBufferSource":
        if (typeof audioCtx.createBufferSource !== "function") {
          throw new Error("Required module AudioBufferSourceNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "BiquadFilter":
        if (typeof audioCtx.createBiquadFilter !== "function") {
          throw new Error("Required module BiquadFilterNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "ChannelMerger":
        if (typeof audioCtx.createChannelMerger !== "function") {
          throw new Error("Required module ChannelMergerNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;
      
      case "ChannelSplitter":
        if (typeof audioCtx.createChannelSplitter !== "function") {
          throw new Error("Required module ChannelSplitterNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "Convolver":
        if (typeof audioCtx.createConvolver !== "function") {
          throw new Error("Required module ConvolverNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "Delay":
        if (typeof audioCtx.createDelay !== "function") {
          throw new Error("Required module DelayNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "DynamicsCompressor":
        if (typeof audioCtx.createDynamicsCompressor !== "function") {
          throw new Error("Required module DynamicsCompressorNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;
       
      case "Gain":
        if (typeof audioCtx.createGain !== "function") {
          throw new Error("Required module GainNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "IIRFilter":
        if (typeof audioCtx.createIIRFilter !== "function") {
          throw new Error("Required module IIRFilterNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "Oscillator":
        if (typeof audioCtx.createOscillator !== "function") {
          throw new Error("Required module OscillatorNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;
        
      case "Panner":
        if (typeof audioCtx.createPannerr !== "function") {
          throw new Error("Required module PannerNode is not available in provided Audio Context and could not be shimmed.");
        }
        break;

      case "StereoPanner":
        if (typeof audioCtx.createStereoPanner !== "function") {
          audioCtx.createStereoPanner = function createStereoPanner() { return new StereoPannerShim(audioCtx); };
        }
        break;

      default:
        console.warn("A check for AudioContext feature ", feature, "is being requested, but no matching check is implemented");
        break;
    }
  });
}

export default VerifyAudioContextFeatures;