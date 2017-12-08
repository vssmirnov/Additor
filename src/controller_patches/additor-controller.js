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
    "synth-audio-module": AdditorAudioPatch["synth"],
    ...AdditorDOMMap.keyboard
  }),

  "filterController": FilterController({
    "filter-audio-module": AdditorAudioPatch["filter"],
    ...AdditorDOMMap.filter
  }),

  "delayController": DelayController({
    "delay-audio-module": AdditorAudioPatch["delay"],
    ...AdditorDOMMap.delay
  }),

  "envelopeController": EnvelopeController({
    "synth-audio-module": AdditorAudioPatch["synth"],
    ...AdditorDOMMap.envelope
  }),

  "overtoneController": OvertoneController({
    "synth-audio-module": AdditorAudioPatch["synth"],
    ...AdditorDOMMap.overtones
  }),

  "outputController": OutputController({
    "audio-context": AUDIO_CTX,
    "output-audio-module": AdditorAudioPatch["output"],
    ...AdditorDOMMap.output
  })
}

  export default AdditorController;