import AudioModuleManager from './../audio_modules/AudioModuleManager';

'use strict';

/**
 * Initialize audio modules and controller for the Additor synth
 */
let initAdditor = function initAdditor(audioCtx) {
  try {
    let AudioModuleManager = new AudioModuleManager(audioCtx);

    // throw an exception if no audio context provided
    if (audioCtx === null || typeof audioCtx === "undefined") {
      throw ("Exception in initAdditor: no AudioContext provided");
    }

    // initialize an empty object to contain the audio modules and controller
    let additor = {};

    // initialize audio modules and specify the connections
    additor.audioPatch = AudioModuleManager.createAudioPatch({
      modules: {
        "destination": "destination",
        "output": "channel strip",
        "delay": "stereo feedback delay",
        "filter": "filter",
        "synth": "additive synth"
      },
      connectionPaths: [
        ["synth", "filter", "delay", "output", "destination"]
      ]
    });

    return additor;
  }
  catch (e) {
    console.log(e);
    return null;
  }
}

export default initAdditor
