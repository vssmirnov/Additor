'use strict';

import AudioModuleManager from "audio_module_manager/audio_module_manager";

/**
 * Audio Patch for the Additor synth
 * The Audio Patch defines the audio components and their connections
 */
const AdditorAudioPatch = AudioModuleManager.createAudioPatch({
  modules: {
    "synth": "Additive Synth",
    "filter": "Biquad Filter",
    "delay": "Stereo Feedback Delay",
    "output": "Channel Strip",
    "destination": "Destination"
  },
  connections: [
    ["synth", "filter", "delay", "output", "destination"]
  ]
});

export default AdditorAudioPatch;