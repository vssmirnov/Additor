import Keyboard from '../widgets/Keyboard';

'use strict';

/**
 * Keyboard controller
 * @param {Object} topCtrl - The top-level controller that manages all widgets for this synth
 * @return {Object} keyboardCtrl - the keyboard controller
 */
const KeyboardCtrl = function KeyboardCtrl(topCtrl) {

    // create a new keyboard widget and place it in the specified container
    let kbdWidget = new Keyboard({
        container: document.querySelector('#additor .kbd-ctrl .kbd'),
        bottomNote: 12,
        topNote: 72,
        mode: 'polyphonic',
        blackKeyColor: '#242424'
    });

    // subscribe a function to handle the note-on and note-off events emitted by the keyboard widget
    kbdWidget.subscribe(this, (kbdNoteEvent) => {
        var pitch = kbdNoteEvent.pitch;
        var vel = kbdNoteEvent.velocity;

        if(vel === 0) {
          topCtrl.synth.node.releaseNote(pitch);
        } else {
          topCtrl.synth.node.playNote(pitch);
        }
    });

    return kbdWidget;
};

export default KeyboardCtrl
