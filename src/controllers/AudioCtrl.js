/* ------------------------ */
/* --- Audio controller --- */
/* ------------------------ */

(function() {
    'use strict';

    define(['require', 'ChannelStrip', 'StereoFeedbackDelay', 'AdditiveSynth'], function(require, ChannelStrip, StereoFeedbackDelay, AdditiveSynth) {

        const AudioCtrl = function AudioCtrl(adt) {

          if (typeof AudioContext !== 'undefined') {
            adt.audioCtx = new AudioContext();
          } else if (typeof webkitAudioContext !== 'undefined') {
            adt.audioCtx = new webkitAudioContext();
          } else {
            alert('Error: no Web Audio API detected in this browser');
          }

          adt.output.node = new ChannelStrip({ audioCtx: adt.audioCtx });
          adt.output.node.connect(adt.audioCtx.destination);

          adt.delay.node = new StereoFeedbackDelay({
            audioCtx: adt.audioCtx,
            maxDelayTime: 10
          });
          adt.delay.node.connect(adt.output.node.input);

          adt.filter.node = adt.audioCtx.createBiquadFilter();
          adt.filter.node.connect(adt.delay.node.input);

          adt.synth.node = new AdditiveSynth({
            audioCtx: adt.audioCtx,
            numVoices: 8,
            numOvertones: 40
          });
          adt.synth.node.connect(adt.filter.node);
        };


        return AudioCtrl;
    });
})();
