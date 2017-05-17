import initAudioModules from './initAudioModules'
import initController from './initController'
//TODO: import audio modules

'use strict';

/**
 * Initialize audio modules and controller for the Additor synth
 */
let initAdditor = function initAdditor(audioCtx) {
  try {
    // throw an exception if no audio context provided
    if (audioCtx === null || typeof audioCtx === "undefined") {
      throw ("Exception in initAdditor: no AudioContext provided");
    }

    // initialize an empty object to contain the audio modules and controller
    let additor = {};

    // initialize audio modules and specify the connections
    additor.audioModules = initAudioModules({
      modules: {
        destination: new DestinationAudioModule(audioCtx, "destination"),
        output: new ChannelStripAudioModule(audioCtx, "output"),
        delay: new StereoFeedbackDelayAudioModule(audioCtx, "delay"),
        filter: new FilterAudioModule(audioCtx, "filter"),
        synth: new AdditiveSynth(audioCtx, "synth")
      },
      connections: [
        ["synth", "filter", "delay", "output", "destination"]
      ]
    });

    // TODO: implement
    // initialize the controller that glues widgets and audio modules
    additor.ctrl = initController({
    });

    return additor;
  }
  catch (e) {
    console.log(e);
    return null;
  }
}

export default initAdditor
