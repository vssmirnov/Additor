require.config({
  baseUrl: './scripts',
  paths: {
    // synth components
    Overtone: './synth/Overtone',
    Envelope: './synth/Envelope',
    ChannelStrip: './synth/ChannelStrip',
    AdditiveSynthVoice: './synth/AdditiveSynthVoice',
    AdditiveSynth: './synth/AdditiveSynth',
    util: './synth/util',

    // widgets
    LiveKeyboard: './widgets/LiveKeyboard',
    EnvelopeGraph: './widgets/EnvelopeGraph',
    LiveDial: './widgets/LiveDial',
    LiveSlider: './widgets/LiveSlider',

    // controllers
    additorKbdCtrl: './controllers/additorKbdCtrl',
    additorEnvelopeCtrl: './controllers/additorEnvelopeCtrl'
  }
});

require(['./app'], function(app) {
  'use strict';
  var appas = new app();
});
