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
export default function(AUDIO_PATCH) {
  return {
    "keyboardController": new KeyboardController({
      "synth-audio-module": AUDIO_PATCH["synth"],
      ...AdditorDOMMap.keyboard
    }),

    "filterController": new FilterController({
      "filter-audio-module": AUDIO_PATCH["filter"],
      ...AdditorDOMMap.filter
    }),

    "delayController": new DelayController({
      "delay-audio-module": AUDIO_PATCH["delay"],
      ...AdditorDOMMap.delay
    }),

    "envelopeController": EnvelopeController({
      "synth-audio-module": AUDIO_PATCH["synth"],
      ...AdditorDOMMap.envelope
    }),

    "overtoneController": OvertoneController({
      "synth-audio-module": AUDIO_PATCH["synth"],
      ...AdditorDOMMap.overtones
    }),

    "outputController": OutputController({
      "output-audio-module": AUDIO_PATCH["output"],
      ...AdditorDOMMap.output
    })
  };
};