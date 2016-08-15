define(function(require) {
  'use strict';

  /* --- require the modules --- */
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
    var additorSynth = new AdditiveSynth({
        numberOfHarmonics: 200
    });

});
