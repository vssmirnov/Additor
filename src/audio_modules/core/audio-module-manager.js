import AudioPatch from './audio-patch';
import AudioModuleUtil from 'audio_modules/core/util';
import AdditiveSynth from 'audio_modules/AdditiveSynth';
import ChannelStrip from 'audio_modules/channel-strip';
import Envelope from 'audio_modules/Envelope';
import StereoFeedbackDelay from 'audio_modules/StereoFeedbackDelay';

/**
 * Class representing an Audio Module Manager.
 * Audio Module Managers facilitate creating and managing Audio Patches.
 * @class
 */
class AudioModuleManager {
  
  /**
   * @constructor
   * @param {AudioContext} [audioCtx] - The Audio Context to use. If this argument is not provided,
   *                                    a new Audio Context will be created and associated with this
   *                                    Audio Module Manager.
   */
  constructor(audioCtx) {
    this.AUDIO_CTX = (typeof audioCtx === "undefined") ? new AudioContext() : audioCtx;

    // Shim the WebAudio connect and disconnect methods so that we can connect and
    // disconnect AudioModules the same way as WebAudio AudioNodes and use AudioNodes
    // interchangably with AudioModules
    AudioModuleUtil.shimWebAudioConnect(this.AUDIO_CTX);
  }

  /**
   * Return the Audio Context associated with this Module Manager.
   * @returns {AudioContext} - The Audio Context associated with this Module Manager.
   */
  getContext() {
    return this.AUDIO_CTX;
  }

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
  createAudioPatch(initObj) {
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

    return new AudioPatch(moduleMapObj, _this.AUDIO_CTX, _this);
  }

  /**
   * Create an Additive Synth Audio Module
   */
  createAdditiveSynth(o) {
    o = o || {};
    return new AdditiveSynth(this.AUDIO_CTX, o);
  }

  /**
   * Create a Biquad Filter Audio Module
   */
  createBiquadFilter() {
    return this.AUDIO_CTX.createBiquadFilter();
  }

  /**
   * Create a Channel Strip Audio Module
   */
  createChannelStrip(o) {
    o = o || {};
    return new ChannelStrip(this.AUDIO_CTX, o);
  }

  /**
   * Create a destination node
   */
  createDestination() {
    return this.AUDIO_CTX.destination;
  }

  /**
   * Create an Envelope Audio Module
   */
  createEnvelope(o) {
    o = o || {};
    return new Envelope(this.AUDIO_CTX, o);
  }

  /**
   * Create a Stereo Feedback Delay Audio Module
   */
  createStereoFeedbackDelay(o) {
    o = o || {};
    return new StereoFeedbackDelay(this.AUDIO_CTX, o);
  }
}

export default AudioModuleManager;