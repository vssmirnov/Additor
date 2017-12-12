'use strict';

import AudioModuleManager from "audio_module_manager";
import AdditorAudioPatch from "audio_patches/additor-audio-patch";
import AdditorControllerPatch from "controller_patches/additor-controller-patch";

(function() {
  const AUDIO_CTX = new AudioContext();
  const AUDIO_MODULE_MANAGER = new AudioModuleManager(AUDIO_CTX);

  const ADDITOR_AUDIO_PATCH = new AdditorAudioPatch(AUDIO_MODULE_MANAGER);
  const ADDITOR_CONTROLLER_PATCH = new AdditorControllerPatch(ADDITOR_AUDIO_PATCH);

  let presetManger = PresetManager({
    "select-preset-dropmenu-container": AdditorContainers.presets["select-preset-dropmenu-container"],
    "controllers": additorControllerPatch,
    "audio-patch": additorAudioPatch
  });
}());
