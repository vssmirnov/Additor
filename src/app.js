define(['require',
        'Overtone',
        'Envelope',
        'ChannelStrip',
        'AdditiveSynthVoice',
        'AdditiveSynth',
        'util',
        'LiveKeyboard',
        'EnvelopeGraph',
        'LiveDial',
        'LiveSlider',
        'Histogram',
        'LiveMeter'],
function(require,
          Overtone,
          Envelope,
          ChannelStrip,
          AdditiveSynthVoice,
          AdditiveSynth,
          util,
          LiveKeyboard,
          EnvelopeGraph,
          LiveDial,
          LiveSlider,
          Histogram,
          LiveMeter) {
  'use strict';

  var app = function () {
    var audioCtx = new AudioContext();

    var additorKbdWrap = document.querySelector('#additor > .kbd');
    var additorOvertoneHistoWrap = document.querySelector('#additor > .otHisto');
    var additorMainVolumeSliderWrap = document.querySelector('#additor > .outputCtrl > .volumeCtrl .slider');
    var additorMainOutputMeterWrap = document.querySelector('#additor > .outputCtrl > .volumeCtrl .meter');
    var additorMainOutputPanDialWrap = document.querySelector('#additor > .outputCtrl > .panCtrl .dial');
    var additorMainOutputPanValueDisplay = document.querySelector('#additor > .outputCtrl > .panCtrl .valueDisplay');

    var outputChannelStrip = new ChannelStrip({
      audioCtx: audioCtx
    });
    outputChannelStrip.connect(audioCtx.destination);

    var additorSynth = new AdditiveSynth({
      audioCtx: audioCtx,
      numVoices: 8,
      numOvertones: 30
    });
    additorSynth.connect(outputChannelStrip.input);

    var additorKbd = new LiveKeyboard({
      container: additorKbdWrap,
      bottomNote: 12,
      topNote: 72,
      mode: 'polyphonic'
    });

    var additorOvertoneHisto = new Histogram({
      container: additorOvertoneHistoWrap,
      numBins: additorSynth.numOvertones,
      minValue: 0,
      maxValue: 1,
      backgroundColor: '#111',
      barColor: '#f00'
    });

    /* --- Pan dial --- */
    var additorMainOutputPanDial = new LiveDial({
      container: additorMainOutputPanDialWrap,
      minValue: -100,
      maxValue: 100
    });

    /* --- Volume slider --- */
    var additorMainVolumeSlider = new LiveSlider({
      container: additorMainVolumeSliderWrap,
      minValue: 0,
      maxValue: 127
    });

    var additorMainOutputMeter = new LiveMeter({
      audioCtx: audioCtx,
      container: additorMainOutputMeterWrap
    });
    additorMainOutputMeter.connectTo(outputChannelStrip.output);

    /* === Initial values ======================================= */

    additorMainOutputPanValueDisplay.value = outputChannelStrip.pan;


    /* ========================================================== */

    // change the pan
    additorMainOutputPanDial.subscribe(this, (pan) => {
      outputChannelStrip.pan = pan / 100;
      additorMainOutputPanValueDisplay.value = outputChannelStrip.pan;
    });

    // change the main volume
    additorMainVolumeSlider.subscribe(this, (volume) => {
      outputChannelStrip.outputGain = volume / 100;
    });

    // change overtone amplitudes based on the histogram
    additorOvertoneHisto.subscribe(this, (overtoneAmplitudes) => {
      for(var voiceNum = additorSynth.numVoices - 1; voiceNum >= 0; voiceNum--) {
        overtoneAmplitudes.forEach((amplitude, overtoneNum) => {
          additorSynth.setOvertoneAmplitude(voiceNum, overtoneNum, amplitude);
        });
      }
    });

    additorKbd.subscribe(this, (kbdNoteEvent) => {
      var pitch = kbdNoteEvent.pitch;
      var vel = kbdNoteEvent.velocity;

      if(vel === 0) {
        additorSynth.releaseNote(pitch);
      } else {
        additorSynth.playNote(pitch);
      }
    });
  }

  return app;
});
