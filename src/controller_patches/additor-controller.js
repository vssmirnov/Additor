'use strict';

import KeyboardController from "controller_modules/keyboard-controller";
import FilterController from "controller_modules/filter-controller";
import DelayController from "controller_modules/delay-controller";
import EnvelopeController from "controller_modules/envelope-controller";
import OvertoneController from "controller_modules/overtone-controller";
import OutputController from "controller_modules/output-controller";
import AdditorDOMMap from "dom_maps/additor-dom-map";
import AdditorAudioPatch from "audio_patches/additor-audio-patch";

/**
 * Controller Patch for the Additor Synth
 * The Controller Patch initializes UI widgets and defines how changes to
 * the widgets affect the AudioPatch
 */
const AdditorController = {
  "keyboardController": KeyboardController({
    // dependencies:
    "synth-audio-module": AdditorAudioPatch["synth"],
    "keyboard-container": AdditorDOMMap.keyboard["keyboard-container"]
  }),

  "filterController": FilterController({
    // dependencies:
    "filter-audio-module": AdditorAudioPatch["filter"],
    "type-drop-menu-container": AdditorDOMMap.filter["type-drop-menu-container"],
    "freq-dial-container": AdditorDOMMap.filter["freq-dial-container"],
    "freq-numbox-container": AdditorDOMMap.filter["freq-numbox-container"],
    "q-dial-container": AdditorDOMMap.filter["q-dial-container"],
    "q-numbox-container": AdditorDOMMap.filter["q-numbox-container"],
    "gain-dial-container": AdditorDOMMap.filter["gain-dial-container"],
    "gain-numbox-container": AdditorDOMMap.filter["gain-numbox-container"]
  }),

  "delayController": DelayController({
    // dependencies:
    "delay-audio-module": AdditorAudioPatch["delay"],
    "delay-time-L-dial-container": AdditorDOMMap.delay["delay-time-L-dial-container"],
    "delay-time-L-numbox-container": AdditorDOMMap.delay["delay-time-L-numbox-container"],
    "delay-time-R-dial-container": AdditorDOMMap.delay["delay-time-R-dial-container"],
    "delay-time-R-numbox-container": AdditorDOMMap.delay["delay-time-R-numbox-container"],
    "feedback-L-dial-container": AdditorDOMMap.delay["feedback-L-dial-container"],
    "feedback-L-numbox-container": AdditorDOMMap.delay["feedback-L-numbox-container"],
    "feedback-R-dial-container": AdditorDOMMap.delay["feedback-R-dial-container"],
    "feedback-R-numbox-container": AdditorDOMMap.delay["feedback-R-numbox-container"],
    "dry-mix-L-dial-container": AdditorDOMMap.delay["dry-mix-L-dial-container"],
    "dry-mix-L-numbox-container": AdditorDOMMap.delay["dry-mix-L-numbox-container"],
    "dry-mix-R-dial-container": AdditorDOMMap.delay["dry-mix-R-dial-container"],
    "dry-mix-R-numbox-container": AdditorDOMMap.delay["dry-mix-R-numbox-container"],
    "wet-mix-L-dial-container": AdditorDOMMap.delay["wet-mix-L-dial-container"],
    "wet-mix-L-numbox-container": AdditorDOMMap.delay["wet-mix-L-numbox-container"],
    "wet-mix-R-dial-container": AdditorDOMMap.delay["wet-mix-R-dial-container"],
    "wet-mix-R-numbox-container": AdditorDOMMap.delay["wet-mix-R-numbox-container"]
  }),

  "envelopeController": EnvelopeController({
    // Audio Module Dependencies:
    "synth-audio-module": AdditorAudioPatch["synth"],
    // DOM Dependencies:
    "envelope-copy-button": AdditorDOMMap.envelope["envelope-copy-button"],
    "envelope-paste-button": AdditorDOMMap.envelope["envelope-paste-button"],
    "envelope-reset-button": AdditorDOMMap.envelope["envelope-reset-button"],
    "envelope-attack-graph-container": AdditorDOMMap.envelope["envelope-attack-graph-container"],
    "envelope-sustain-graph-container": AdditorDOMMap.envelope["envelope-sustain-graph-container"],
    "envelope-release-graph-container": AdditorDOMMap.envelope["envelope-release-graph-container"],
    "envelope-select-dropmenu-container": AdditorDOMMap.envelope["envelope-select-dropmenu-container"],
    "envelope-attack-length-numbox-container": AdditorDOMMap.envelope["envelope-attack-length-numbox-container"],
    "envelope-release-length-numbox-container": AdditorDOMMap.envelope["envelope-release-length-numbox-container"]
  }),

  "overtoneController": OvertoneController({
    // Audio Module Dependencies:
    "synth-audio-module": AdditorAudioPatch["synth"],
    // DOM Dependencies:
    "overtone-histogram-container": AdditorDOMMap.overtones["overtone-histogram-container"]
  }),

  "outputController": OutputController({
    // Audio Module Dependencies:
    "audio-context": AUDIO_CTX,
    "output-audio-module": AdditorAudioPatch["output"],
    // DOM Dependencies:
    "pan-dial-container": AdditorDOMMap.output["pan-dial-container"],
    "pan-numbox-container": AdditorDOMMap.output["pan-numbox-container"],
    "volume-slider-container": AdditorDOMMap.output["volume-slider-container"],
    "volume-numbox-container": AdditorDOMMap.output["volume-numbox-container"],
    "output-meter-l-container": AdditorDOMMap.output["output-meter-l-container"],
    "output-meter-r-container": AdditorDOMMap.output["output-meter-r-container"]
  })
}

  export default AdditorController;