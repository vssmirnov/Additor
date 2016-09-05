require.config({
  baseUrl: './src',
  paths: {
    // synth components
    Overtone: './synth/Overtone',
    Envelope: './synth/Envelope',
    ChannelStrip: './synth/ChannelStrip',
    AdditiveSynthVoice: './synth/AdditiveSynthVoice',
    AdditiveSynth: './synth/AdditiveSynth',
    util: './synth/util',
    LiveKeyboard: './widgets/LiveKeyboard',
    EnvelopeGraph: './widgets/EnvelopeGraph',
    LiveDial: './widgets/LiveDial',
    LiveSlider: './widgets/LiveSlider'
  }
});

require(['./app'], function(app) {
  'use strict';
  var synthApp = new app();
});
