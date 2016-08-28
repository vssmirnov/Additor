require.config({
  baseUrl: './scripts',
  paths: {
    additorKbdCtrl: './controllers/additorKbdCtrl',
    additorEnvelopeCtrl: './controllers/additorEnvelopeCtrl',
    LiveKeyboard: './widgets/LiveKeyboard',
    EnvelopeGraph: './widgets/EnvelopeGraph',
    AdditiveSynth: './synth/AdditiveSynth',
    AdditiveSynthVoice: './synth/AdditiveSynthVoice',
    GeneratorVoice: './synth/GeneratorVoice',
    Overtone: './synth/Overtone',
    LiveDial: './widgets/LiveDial',
    LiveSlider: './widgets/LiveSlider'
  }
})

require(['./app'], function(app) {
  'use strict';
  var appas = new app();
});
