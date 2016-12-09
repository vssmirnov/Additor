/* --------------------------- */
/* --- Keyboard controller --- */
/* --------------------------- */

import Keyboard from '../widgets/Keyboard';

'use strict';

const KeyboardCtrl = function KeyboardCtrl(adt) {

    adt.kbd = new Keyboard({
        container: document.querySelector('#additor .kbd-ctrl .kbd'),
        bottomNote: 12,
        topNote: 72,
        mode: 'polyphonic',
        blackKeyColor: '#242424'
      })
      .subscribe(this, (kbdNoteEvent) => {
        var pitch = kbdNoteEvent.pitch;
        var vel = kbdNoteEvent.velocity;

        if(vel === 0) {
          adt.synth.node.releaseNote(pitch);
        } else {
          adt.synth.node.playNote(pitch);
        }
    });

    return adt.kbd;
};

export default KeyboardCtrl
