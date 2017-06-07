import Histogram from '../widgets/Histogram';

'use strict';

/**
 * Overtone controllers
 * @param {object} dependencies
 *  Required Dependencies:
 *    Audio Modules:
 *      "synth-audio-module"
 *    DOM References:
 *      "overtone-histogram-container"
 */
const OvertoneCtrl = function OvertoneCtrl(dependencies) {
    // reference to the synth audio module
    const SYNTH_AUDIO_MODULE = dependencies["synth-audio-module"];

    // reference to the histogram DOM container
    const OVERTONE_HISTOGRAM_CONTAINER = dependencies["overtone-histogram-container"];

    let overtoneCtrl = {
      histo: {}
    };

    // create a new histogram UI element
    overtoneCtrl.histo = new Histogram({
            container: OVERTONE_HISTOGRAM_CONTAINER,
            numBins: SYNTH_AUDIO_MODULE.numOvertones,
            minValue: 0,
            maxValue: 1,
            backgroundColor: '#111',
            barColor: '#f00'
    });

    // observe the histogram for changes
    overtoneCtrl.histo.subscribe(this, (overtoneAmplitudes) => {

            // when the histogram changes, set the synth overtone amplitudes to match
            for (let voiceNum = SYNTH_AUDIO_MODULE.numVoices - 1; voiceNum >= 0; voiceNum--) {
                overtoneAmplitudes.forEach((amplitude, overtoneNum) => {
                    SYNTH_AUDIO_MODULE.setOvertoneAmplitude(voiceNum, overtoneNum, amplitude);
                });
            }
    });

    return overtoneCtrl;
};

export default OvertoneCtrl
