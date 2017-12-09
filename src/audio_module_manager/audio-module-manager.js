'use strict';

import AudioModuleUtil from 'audio_modules/AudioModuleUtil';
import AdditiveSynth from 'audio_modules/AdditiveSynth';
import ChannelStrip from 'audio_modules/ChannelStrip';
import Envelope from 'audio_modules/Envelope';
import StereoFeedbackDelay from 'audio_modules/StereoFeedbackDelay';

/**
 * Utility and factory methods for managing audio modules
 * @param {AudioContext} [audioCtx] - the WebAudio context
 */
let AudioModuleManager = function(audioCtx) {

  // use the audio context passed in as argument, or create a new one
  this.audioCtx = (typeof audioCtx === "undefined") ? new AudioContext() : audioCtx;

  // shim the WebAudio connect and disconnect methods so that we can connect and
  // disconnect AudioModules the same way as WebAudio AudioNodes and use AudioNodes
  // interchangably with AudioModules
  AudioModuleUtil.shimWebAudioConnect(audioCtx);
};

AudioModuleManager.prototype = {
  /**
   * Get the audio context
   */
  getContext: function getContext() {
    return this.audioContext;
  },

  /**
   * An audio patch is a collection of connected audio modules that form a meaningful unit
   * @param {object} initObj - An object specifying the initialization parameters,
   *                            containing two properties: modules, and connectionPaths
   * @param {object} initObj.modules - An object representing the named audio modules used in this patch
   * @param {array} initObj.connectionPaths - An 2D array of strings, where each string represents the name of
   *                              an Audio Module (matching the way it is named in the 'modules' object),
   *                              and the sequence of these names represents an audio path.
   *                              For example, the following is one possibility:
   *                                [["synth1", "delay", "reverb", "output"],
   *                                ["synth2", "reverb"]]
   *                              This connection specifies two connection paths:
   *                                synth1 -> delay -> reverb -> output
   *                              And the second, where synth2 is connected to the same reverb used
   *                              in the first paths
   *                                synth2 -> reverb -> output
   *                              Note that since the reverb is already connected to the output by the
   *                              first path, it does not need to be redundantly connected in the second path
   * @return {object} moduleMapObj - an object used as a map where keys are strings used to name each module,
   *                                 and values are the module objects themselves
   */
  createAudioPatch: function createAudioPatch(initObj) {
    const _this = this;

    initObj = initObj || {};

    // moduleMap will store the modules created keyed by the names given to them
    // keys are arbitrary strings used as names for each module
    // values are the module objects themselves
    let moduleMapObj = {};

    try {
      // try to create the modules requested in the initObj and store them in moduleMapObj
      if (typeof initObj.modules !== "object") throw ("Exception in initAudioPatch: no audio modules provided in initiation object");

      Object.keys(initObj.modules).forEach(audioModuleName => {
        let audioModuleSpec = initObj.modules[audioModuleName];

        // if the audio module type is specified as a string, create the corresponding modules
        if (typeof audioModuleSpec === "string") {
          // placeholder to use when creating the new module
          let newAudioModule = null;

          // use name in lowercase with whitespace removed
          switch (audioModuleSpec.toLowerCase().replace(/\W+/g, "")) {
            case "channelstrip":
              newAudioModule = _this.createChannelStrip();
              break;
            case "destination":
              newAudioModule = _this.createDestination()
              break;
            case "envelope":
              newAudioModule = _this.createBiquadFilter();
              break;
            case "additivesynth":
              newAudioModule = _this.createAdditiveSynth();
              break;
            case "stereofeedbackdelay":
            case "delay":
              newAudioModule = _this.createStereoFeedbackDelay();
              break;
            case "biquadfilter":
            case "filter":
              newAudioModule = _this.createBiquadFilter();
              break;
            default:
              throw ("Exception in initAudioPatch: no such module " + audioModuleSpec);
              break;
          }

          moduleMapObj[audioModuleName] = newAudioModule;
        }
      });

      // try to connect the modules
      if (typeof initObj.connections === "object" && Array.isArray(initObj.connections)) {
        initObj.connections.forEach(connectionPath => {
          for (let i = 0; i < connectionPath.length - 1; i++) {
            let currentModule = moduleMapObj[connectionPath[i]];
            let nextModule = moduleMapObj[connectionPath[i + 1]];
            currentModule.connect(nextModule);
          }
        });
      }
    }
    catch (e) {
      console.log(e);
      moduleMapObj = null;
    }

    return moduleMapObj;
  },

  /**
   * Create an Additive Synth Audio Module
   */
  createAdditiveSynth: function createAdditiveSynth(o) {
    o = o || {};
    return new AdditiveSynth(this.audioCtx, o);
  },

  /**
   * Create a Biquad Filter Audio Module
   */
  createBiquadFilter: function() {
    return this.audioCtx.createBiquadFilter();
  },

  /**
   * Create a Channel Strip Audio Module
   */
  createChannelStrip: function(o) {
    o = o || {};
    return new ChannelStrip(this.audioCtx, o);
  },

  /**
   * Create a destination node
   */
  createDestination: function() {
    return this.audioCtx.destination;
  },

  /**
   * Create an Envelope Audio Module
   */
  createEnvelope: function(o) {
    o = o || {};
    return new Envelope(this.audioCtx, o);
  },

  /**
   * Create a Stereo Feedback Delay Audio Module
   */
  createStereoFeedbackDelay: function(o) {
    o = o || {};
    return new StereoFeedbackDelay(this.audioCtx, o);
  }
}

export default AudioModuleManager;