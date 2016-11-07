/* --------------------------- */
/* --- Overtone controller --- */
/* --------------------------- */

(function() {
    'use strict';

    define(['require', 'Histogram'], function(require, Histogram) {

        const OvertoneCtrl = function OvertoneCtrl(adt) {

            // create a new histogram UI element
            adt.ot.histo = new Histogram({
                    container: document.querySelector('#additor .ot-ctrl .otHisto'),
                    numBins: adt.synth.node.numOvertones,
                    minValue: 0,
                    maxValue: 1,
                    backgroundColor: '#111',
                    barColor: '#f00'
            });

            // observe the histogram for changes
            adt.ot.histo.subscribe(this, (overtoneAmplitudes) => {

                    // when the histogram changes, set the synth overtone amplitudes to match
                    for (let voiceNum = adt.synth.node.numVoices - 1; voiceNum >= 0; voiceNum--) {
                        overtoneAmplitudes.forEach((amplitude, overtoneNum) => {
                            adt.synth.node.setOvertoneAmplitude(voiceNum, overtoneNum, amplitude);
                        });
                    }
            });

            return adt.ot;
        };

        return OvertoneCtrl;
    });
})();
