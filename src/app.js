define(['Overtone',
        'Envelope',
        'ChannelStrip',
        'AdditiveSynthVoice',
        'AdditiveSynth',
        'Util',
        'LiveKeyboard',
        'EnvelopeGraph',
        'LiveDial',
        'LiveSlider'],
function(Overtone,
          Envelope,
          ChannelStrip,
          AdditiveSynthVoice,
          AdditiveSynth,
          Util,
          LiveKeyboard,
          EnvelopeGraph,
          LiveDial,
          LiveSlider) {
  'use strict';

  var app = function () {
    var audioCtx = new AudioContext();

    var additorKbdWrap = document.getElementById('additorKbdWrap');

    var additorKbd = new LiveKeyboard({
      container: additorKbdWrap,
      bottomNote: 12,
      topNote: 72,
      mode: 'polyphonic'
    });

    var additorSynth = new AdditiveSynth({
      audioCtx: audioCtx
    });

    var additorEnvelopeCtrl = new additorEnvelopeCtrl();



  }

  return app;
});
