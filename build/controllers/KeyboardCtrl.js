'use strict';

/* --------------------------- */
/* --- Keyboard controller --- */
/* --------------------------- */

(function () {
    'use strict';

    define(['require', 'Keyboard'], function (require, Keyboard) {

        var KeyboardCtrl = function KeyboardCtrl(adt) {

            adt.kbd = new Keyboard({
                container: document.querySelector('#additor .kbd-ctrl .kbd'),
                bottomNote: 12,
                topNote: 72,
                mode: 'polyphonic',
                blackKeyColor: '#242424'
            }).subscribe(this, function (kbdNoteEvent) {
                var pitch = kbdNoteEvent.pitch;
                var vel = kbdNoteEvent.velocity;

                if (vel === 0) {
                    adt.synth.node.releaseNote(pitch);
                } else {
                    adt.synth.node.playNote(pitch);
                }
            });

            return adt.kbd;
        };

        return KeyboardCtrl;
    });
})();