define(function(require) {
  'use strict';

  /* --- require the modules --- */
    var Overtone = require('./Overtone');
    var AdditiveSynthVoice = require('./AdditiveSynthVoice_new');
    var AdditiveSynth = require('./AdditiveSynth');
    var LiveKeyboard = require('./LiveKeyboard');
    var LiveDial = require('./LiveDial');
    var LiveSlider = require('./LiveSlider');

  /* --- DOM Containers --- */
    var kbdContainer = document.getElementById('additor-kbd-container');
    var volumeDialContainer = document.getElementById('volume-dial-container');
    var sliderContainer = document.getElementById('slider-container');

  /* --- UI Elements --- */
    var additorKbd = new LiveKeyboard(kbdContainer);
    var volumeDial = new LiveDial(volumeDialContainer);
    var slider = new LiveSlider(sliderContainer);

  /* --- Synth --- */
    var additorVoice = new AdditiveSynthVoice();
    var playing = false;

    additorVoice.connect(additorVoice._audioCtx.destination);
    additorVoice.gain = 0.1;
    
    document.onclick = () => {
      if(playing === false) {
        additorVoice.play();
      } else {
        additorVoice.release();
      }
      playing = !playing;
    }
});
