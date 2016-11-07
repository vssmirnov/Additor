/* --------------------------- */
/* --- Overtone controller --- */
/* --------------------------- */

(function() {
    'use strict';

    define(['require', 'DropMenu'], function(require, DropMenu) {

        const VoicesCtrl = function VoicesCtrl(adt) {
            let voices = {};

            voices.polyModeMenu = new DropMenu({
                container: document.querySelector('#additor .synth-ctrl .poly-mode-menu'),
                menuItems: ['polyphonic', 'monophonic']
              })
              .subscribe(this, (selectionIndex) => {
                if (selectionIndex === 0) {
                  adt.kbd.mode = 'polyphonic';
                  adt.synth.node.numberOfVoices = 1;
                } else {
                  adt.kbd.mode = 'monophonic';
                  adt.synth.node.numberOfVoices = numVoices;
                }
            });

            voices.numVoicesNumbox = document.querySelector('#additor .synth-ctrl #number-of-voices');
            voices.numVoicesNumbox.value = adt.synth.node.numVoices;
            voices.numVoicesNumbox.addEventListener('blur', changeNumVoices);
            voices.numVoicesNumbox.addEventListener('keyup', (e) => {
              if (e.key === 'Enter') {
                changeNumVoices();
              }
            });
            function changeNumVoices () {
              adt.synth.node.numVoices = adt.voices.numVoicesNumbox.value;
            }

            voices.numOtNumbox = document.querySelector('#additor .synth-ctrl #number-of-overtones');
            voices.numOtNumbox.value = adt.synth.node.numOvertones;
            voices.numOtNumbox.addEventListener('blur', changeNumOvertones);
            voices.numOtNumbox.addEventListener('keyup', (e) => {
              if (e.key === 'Enter') {
                changeNumOvertones();
              }
            });
            function changeNumOvertones () {
              adt.synth.node.numOvertones = adt.voices.numOtNumbox.value;
              adt.synth.node.numBins = adt.voices.numOtNumbox.value;
            }

            return voices;
        };

        return VoicesCtrl;
    });
})();
