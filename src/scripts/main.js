define(function(require) {
  'use strict';

  /* --- require the modules --- */
    var Overtone = require('./Overtone');
    var AdditiveSynthVoice = require('./AdditiveSynthVoice');
    var AdditiveSynth = require('./AdditiveSynth');
    var LiveKeyboard = require('./LiveKeyboard');
    var LiveDial = require('./LiveDial');
    var LiveSlider = require('./LiveSlider');

  /* --- DOM Containers --- */
    var additorKbdContainer = document.getElementById('additor-kbd-container');
    var volumeDialContainer = document.getElementById('volume-dial-container');
    var volumeSliderContainer = document.getElementById('volume-slider-container');

  /* --- UI Elements --- */
    var additorKbd = new LiveKeyboard(additorKbdContainer, {
      bottomNote: 24,
      topNote: 71
    });
    var volumeDial = new LiveDial(volumeDialContainer);
    var volumeSlider = new LiveSlider(volumeSliderContainer, {
      displayName: 'Volume'
    });

  /* --- Synth --- */
    var additorVoice = new AdditiveSynthVoice();
    var playing = false;

    additorVoice.connect(additorVoice._audioCtx.destination);
    volumeSlider.subscribe(this, val => { additorVoice.gain = val / 127 });

    kbdContainer.onclick = () => {
      if(playing === false) {
        additorVoice.play();
      } else {
        additorVoice.release();
      }
      playing = !playing;
    }
});
