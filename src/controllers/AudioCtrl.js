import ChannelStrip from 'audio_modules/ChannelStrip';
import StereoFeedbackDelay from 'audio_modules/StereoFeedbackDelay';
import AdditiveSynth from 'audio_modules/AdditiveSynth';

'use strict';

/**
 *  Audio controller defines the WebAudio context, audio nodes, and their connections
 */
const AudioCtrl = function AudioCtrl(adt) {

  // detect the AudioContext
  if (typeof AudioContext !== 'undefined') {
    adt.audioCtx = new AudioContext();
  } else if (typeof webkitAudioContext !== 'undefined') {
    adt.audioCtx = new webkitAudioContext();
  } else {
    alert('Error: no Web Audio API detected in this browser');
  }

  // set up the channel strip for the main output
  adt.output.node = new ChannelStrip({ audioCtx: adt.audioCtx });
  adt.output.node.connect(adt.audioCtx.destination);

  // set up the stereo feedback delay module
  adt.delay.node = new StereoFeedbackDelay({
    audioCtx: adt.audioCtx,
    maxDelayTime: 10
  });
  adt.delay.node.connect(adt.output.node.input);

  // set up the filter module
  adt.filter.node = adt.audioCtx.createBiquadFilter();
  adt.filter.node.connect(adt.delay.node.input);

  // set up the additive synth generator module
  adt.synth.node = new AdditiveSynth({
    audioCtx: adt.audioCtx,
    numVoices: 8,
    numOvertones: 40
  });
  adt.synth.node.connect(adt.filter.node);
};

export default AudioCtrl
