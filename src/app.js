import AdditorContainers from 'dom_maps/additor-dom-map';
import AudioModuleManager from 'audio_module_manager/AudioModuleManager';
import ControllerManager from './controllers/ControllerManager';
import OvertoneController from './controllers/OvertoneCtrl';
import EnvelopeController from './controllers/EnvelopeCtrl';
import FilterController from './controllers/FilterCtrl';
import DelayController from './controllers/DelayCtrl';
import VoicesController from './controllers/VoicesCtrl';
import OutputController from './controllers/MainOutputCtrl';
import KeyboardController from './controllers/KeyboardCtrl';
import PresetManager from './controllers/PresetManager';

'use strict';

(function() {
  const AUDIO_CTX = new AudioContext();

  const AUDIO_MODULE_MANAGER = new AudioModuleManager(AUDIO_CTX);
  const CONTROLLER_MANAGER = new ControllerManager();

  /**
   * Audio Patch for the Additor synth
   * The Audio Patch defines the audio components and their connections
   */
  let additorAudioPatch = AUDIO_MODULE_MANAGER.createAudioPatch({
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

  /**
   * Controller Patch for the Additor Synth
   * The Controller Patch initializes UI widgets and defines how changes to
   * the widgets affect the AudioPatch
   */
  let additorControllerPatch = {
    "keyboardController": KeyboardController({
      // dependencies:
      "synth-audio-module": additorAudioPatch["synth"],
      "keyboard-container": AdditorContainers.keyboard["keyboard-container"]
    }),

    "filterController": FilterController({
      // dependencies:
      "filter-audio-module": additorAudioPatch["filter"],
      "type-drop-menu-container": AdditorContainers.filter["type-drop-menu-container"],
      "freq-dial-container": AdditorContainers.filter["freq-dial-container"],
      "freq-numbox-container": AdditorContainers.filter["freq-numbox-container"],
      "q-dial-container": AdditorContainers.filter["q-dial-container"],
      "q-numbox-container": AdditorContainers.filter["q-numbox-container"],
      "gain-dial-container": AdditorContainers.filter["gain-dial-container"],
      "gain-numbox-container": AdditorContainers.filter["gain-numbox-container"]
    }),

    "delayController": DelayController({
      // dependencies:
      "delay-audio-module": additorAudioPatch["delay"],
      "delay-time-L-dial-container": AdditorContainers.delay["delay-time-L-dial-container"],
      "delay-time-L-numbox-container": AdditorContainers.delay["delay-time-L-numbox-container"],
      "delay-time-R-dial-container": AdditorContainers.delay["delay-time-R-dial-container"],
      "delay-time-R-numbox-container": AdditorContainers.delay["delay-time-R-numbox-container"],
      "feedback-L-dial-container": AdditorContainers.delay["feedback-L-dial-container"],
      "feedback-L-numbox-container": AdditorContainers.delay["feedback-L-numbox-container"],
      "feedback-R-dial-container": AdditorContainers.delay["feedback-R-dial-container"],
      "feedback-R-numbox-container": AdditorContainers.delay["feedback-R-numbox-container"],
      "dry-mix-L-dial-container": AdditorContainers.delay["dry-mix-L-dial-container"],
      "dry-mix-L-numbox-container": AdditorContainers.delay["dry-mix-L-numbox-container"],
      "dry-mix-R-dial-container": AdditorContainers.delay["dry-mix-R-dial-container"],
      "dry-mix-R-numbox-container": AdditorContainers.delay["dry-mix-R-numbox-container"],
      "wet-mix-L-dial-container": AdditorContainers.delay["wet-mix-L-dial-container"],
      "wet-mix-L-numbox-container": AdditorContainers.delay["wet-mix-L-numbox-container"],
      "wet-mix-R-dial-container": AdditorContainers.delay["wet-mix-R-dial-container"],
      "wet-mix-R-numbox-container": AdditorContainers.delay["wet-mix-R-numbox-container"]
    }),

    "envelopeController": EnvelopeController({
      // Audio Module Dependencies:
      "synth-audio-module": additorAudioPatch["synth"],
      // DOM Dependencies:
      "envelope-copy-button": AdditorContainers.envelope["envelope-copy-button"],
      "envelope-paste-button": AdditorContainers.envelope["envelope-paste-button"],
      "envelope-reset-button": AdditorContainers.envelope["envelope-reset-button"],
      "envelope-attack-graph-container": AdditorContainers.envelope["envelope-attack-graph-container"],
      "envelope-sustain-graph-container": AdditorContainers.envelope["envelope-sustain-graph-container"],
      "envelope-release-graph-container": AdditorContainers.envelope["envelope-release-graph-container"],
      "envelope-select-dropmenu-container": AdditorContainers.envelope["envelope-select-dropmenu-container"],
      "envelope-attack-length-numbox-container": AdditorContainers.envelope["envelope-attack-length-numbox-container"],
      "envelope-release-length-numbox-container": AdditorContainers.envelope["envelope-release-length-numbox-container"]
    }),

    "overtoneController": OvertoneController({
      // Audio Module Dependencies:
      "synth-audio-module": additorAudioPatch["synth"],
      // DOM Dependencies:
      "overtone-histogram-container": AdditorContainers.overtones["overtone-histogram-container"]
    }),

    "outputController": OutputController({
      // Audio Module Dependencies:
      "audio-context": AUDIO_CTX,
      "output-audio-module": additorAudioPatch["output"],
      // DOM Dependencies:
      "pan-dial-container": AdditorContainers.output["pan-dial-container"],
      "pan-numbox-container": AdditorContainers.output["pan-numbox-container"],
      "volume-slider-container": AdditorContainers.output["volume-slider-container"],
      "volume-numbox-container": AdditorContainers.output["volume-numbox-container"],
      "output-meter-l-container": AdditorContainers.output["output-meter-l-container"],
      "output-meter-r-container": AdditorContainers.output["output-meter-r-container"]
    })
  }

  let presetManger = PresetManager({
    "select-preset-dropmenu-container": AdditorContainers.presets["select-preset-dropmenu-container"],
    "controllers": additorControllerPatch,
    "audio-patch": additorAudioPatch
  });
}());
