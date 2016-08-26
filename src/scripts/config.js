require.config({
  baseUrl: './scripts',
  paths: {
    additorEnvelopeCtrl: './controllers/additorEnvelopeCtrl',
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
  app.init();
});
