/**
 * Create an Audio Patch for the Additor synth.
 * @param {AudioModuleManager} audioModuleManager - The Audio Module Manager to use.
 * @returns {AudioPatch} - An audio patch.
 */
export default function(audioModuleManager) {
  return audioModuleManager.createAudioPatch({
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
}