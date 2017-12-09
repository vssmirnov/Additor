'use strict';

import Keyboard from 'ui/keyboard';

/**
 * Controller linking a Keyboard UI with an Audio Module.
 * @param {object} dep
 * @param {object} dep["synth-audio-module"]
 * @param {object} dep["keyboard-container"]
 */
const KeyboardController = function KeyboardController(dep) {

    const SYNTH_AUDIO_MODULE = dep["synth-audio-module"];
    const KEYBOARD_CONTAINER = dep["keyboard-container"];

    this.keyboard = new Keyboard(KEYBOARD_CONTAINER, {
        bottomNote: 24,
        topNote: 84,
    });

    this.keyboardObserver = function(note) {
        if(note.vel === 0) {
          SYNTH_AUDIO_MODULE.releaseNote(note.pitch);
        } else {
          SYNTH_AUDIO_MODULE.playNote(note.pitch);
        }
    }
    this.keyboard.addObserver(this.keyboardObserver);

    return keyboardCtrl;
};

export default KeyboardController;