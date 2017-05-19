import AudioModuleUtil from './AudioModuleUtil';
import AudioSynthAudioModule from './AdditiveSynthAudioModule';
import BiquadFilterAudioModule from './BiquadFilterAudioModule';
import ChannelStripAudioModule from './ChannelStripAudioModule';
import DestinationAudioModule from './DestinationAudioModule';
import EnvelopeAudioModule from './EnvelopeAudioModule';
import StereoFeedbackDelayAudioModule from './StereoFeedbackDelayAudioModule';

'use strict';

/**
 * Singleton factory
 * @param {object} [audioCtx] - the WebAudio context
 */
let AudioModuleManager = function(audioCtx) {
  const _this = this;

  // use the audio context passed in as argument, or create a new one
  let audioCtx = (typeof audioCtx === "undefined") ? new AudioContext() : audioCtx;

  // shim the WebAudio connect and disconnect methods so that we can connect and
  // disconnect AudioModules the same way as WebAudio AudioNodes
  AudioModuleUtil.shimWebAudioConnect(audioCtx);

  return {
    /**
     * Get the audio context
     */
    getContext: function() {
      return audioContext;
    },

    /**
     * An audio patch is a collection of audio modules that form a meaningful unit
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
     *                                  and values are the module objects themselves
     */
    createAudioPatch: function(initObj) {
      initObj = initObj || {};

      // moduleMap will store the modules created keyed by the names given to them
      // keys are arbitrary strings used as names for each module
      // values are the module objects themselves
      let moduleMapObj = {};

      try {
        // try to create the modules requested in the initObj and store them in moduleMap
        if (typeof initObj.modules === "object") {
          Object.keys(initObj.modules).forEach(key => {
            let audioModuleSpecArray = audioModules[key];

            if (typeof audioModuleSpecArray === "object"
              && Array.isArray(audioModuleSpecArray)
              && typeof audioModuleSpecArray[0] === "string"
              && typeof audioModuleSpecArray[1] === "string") {

                // the first string in the specification defines the type of module
                let audioModuleType = audioModuleSpecArray[0];

                // the second argument is the name used to identify this module
                let audioModuleName = audioModuleSpecArray[1];

                // placeholder to use when creating the new module
                let newAudioModule = null;

                // use name in lowercase with whitespace removed
                switch (audioModuleType.toLowerCase().replace(/\W+/, "")) {
                  case "channelstrip":
                    newAudioModule = _this.createChannelStrip();
                    break;
                  case "destination":
                    newAudioModule = _this.createDestination()
                  case "envelope":
                    newAudioModule = _this.createBiquadFilter();
                    break;
                  case "additivesynth":
                    newAudioModule = _this.createAdditiveSynth();
                    break;
                  case "stereofeedbackdelay":
                    newAudioModule = _this.createStereoFeedbackDelay();
                    break;
                  case "biquadfilter":
                    newAudioModule = _this.createBiquadFilter();
                    break;
                  default:
                    throw ("Exception in initAudioPatch: no such module " + audioModuleType);
                    break;
                }

                moduleMapObj[audioModuleName] = newAudioModule;
            }
            else throw ("Exception in initAudioPatch: incorrect audio module specification");
          });
        } else throw ("Exception in initAudioPatch: no audio modules provided in initiation object");

        // try to connect the modules
        if (typeof initObj.connectionPaths === "object" && Arrays.isArray(initObj.connectionPaths)) {
          initObj.connectionPaths.forEach(connectionPath => {
            for (int i = 0; i < connectionPath.length - 1; i++) {
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
    createAdditiveSynth: function() {
      return new AdditiveSynthAudioModule();
    },

    /**
     * Create a Biquad Filter Audio Module
     */
    createBiquadFilter: function() {
      return new BiquadFilterAudioModule();
    },

    /**
     * Create a Channel Strip Audio Module
     */
    createChannelStrip: function() {
      return new ChannelStripAudioModule();
    },

    /**
     * Create a destination node
     */
    createDestination: function() {
      return new DestinationAudioModule();
    },

    /**
     * Create an Envelope Audio Module
     */
    createEnvelope: function() {
      return new EnvelopeAudioModule();
    },

    /**
     * Create a Stereo Feedback Delay Audio Module
     */
    createStereoFeedbackDelay: function() {
      return new StereoFeedbackDelayAudioModule();
    }
  }
};

export default AudioModuleManager
