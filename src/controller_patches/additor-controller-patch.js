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
    "outputController": new OutputController({
      "audio-context": AUDIO_PATCH.getAudioCtx(),
      "output-audio-module": AUDIO_PATCH.modules["output"],
      ...AdditorDOMMap.output
    }),

    "keyboardController": new KeyboardController({
      "synth-audio-module": AUDIO_PATCH.modules["synth"],
      ...AdditorDOMMap.keyboard
    }),

    "filterController": new FilterController({
      "filter-audio-module": AUDIO_PATCH.modules["filter"],
      ...AdditorDOMMap.filter
    }),

    "delayController": new DelayController({
      "delay-audio-module": AUDIO_PATCH.modules["delay"],
      ...AdditorDOMMap.delay
    }),

    "overtoneController": new OvertoneController({
      "audio-module": AUDIO_PATCH.modules["synth"],
      ...AdditorDOMMap.overtones
    }),

    "envelopeController": EnvelopeController({
      "synth-audio-module": AUDIO_PATCH.modules["synth"],
      ...AdditorDOMMap.envelope
    })
  };
};