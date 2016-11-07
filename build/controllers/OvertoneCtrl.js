'use strict';

/* --------------------------- */
/* --- Overtone controller --- */
/* --------------------------- */

(function () {
    'use strict';

    define(['require', 'Histogram'], function (require, Histogram) {

        var OvertoneCtrl = function OvertoneCtrl(adt) {

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
            adt.ot.histo.subscribe(this, function (overtoneAmplitudes) {
                var _loop = function _loop(voiceNum) {
                    overtoneAmplitudes.forEach(function (amplitude, overtoneNum) {
                        adt.synth.node.setOvertoneAmplitude(voiceNum, overtoneNum, amplitude);
                    });
                };

                // when the histogram changes, set the synth overtone amplitudes to match
                for (var voiceNum = adt.synth.node.numVoices - 1; voiceNum >= 0; voiceNum--) {
                    _loop(voiceNum);
                }
            });

            return adt.ot;
        };

        return OvertoneCtrl;
    });
})();