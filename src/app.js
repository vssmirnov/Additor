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
        'LiveSlider'],
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
          LiveSlider) {
  'use strict';

  var app = function () {
    var audioCtx = new AudioContext();

    var additorKbdWrap = document.getElementById('additorKbdWrap');

    var additorSynth = new AdditiveSynth({
      audioCtx: audioCtx
    });
    additorSynth.connect(audioCtx.destination);

    var additorKbd = new LiveKeyboard({
      container: additorKbdWrap,
      bottomNote: 12,
      topNote: 72,
      mode: 'polyphonic'
    });

    var activeNotes = [];

    additorKbd.subscribe(this, processNotes(kbdActiveNotes));

    function processNotes(kbdActiveNotes) {
      if(activeNotes.length < kbdActiveNotes.length) {
          
      }
    }
  }

  return app;
});
