import Keyboard from '../widgets/Keyboard';

'use strict';

/**
 * Keyboard controller
 * @param {object} dependencies
 *  Required Dependencies:
 *    Audio Modules:
 *      "synth-audio-module"
 *    DOM References:
 *      "keyboard-container"
 */
const KeyboardCtrl = function KeyboardCtrl(dependencies) {
    // reference to the synth audio module
    const SYNTH_AUDIO_MODULE = dependencies["synth-audio-module"];

    // reference to the DOM keyboard container
    const KEYBOARD_CONTAINER = dependencies["keyboard-container"];

    // create a new keyboard widget and place it in the specified container
    let keyboardCtrl = new Keyboard({
        container: KEYBOARD_CONTAINER,
        bottomNote: 24,
        topNote: 84,
        mode: 'polyphonic',
        blackKeyColor: '#242424'
    });

    // subscribe a function to handle the note-on and note-off events emitted by the keyboard widget
    keyboardCtrl.subscribe(this, (kbdNoteEvent) => {
        let pitch = kbdNoteEvent.pitch;
        let vel = kbdNoteEvent.velocity;

        if(vel === 0) {
          SYNTH_AUDIO_MODULE.releaseNote(pitch);
        } else {
          SYNTH_AUDIO_MODULE.playNote(pitch);
        }
    });

    return keyboardCtrl;
};

export default KeyboardCtrl
