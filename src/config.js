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
    LiveKeyboard: './widgets/LiveKeyboard_refactor',
    EnvelopeGraph: './widgets/EnvelopeGraph',
    LiveDial: './widgets/LiveDial',
    LiveSlider: './widgets/LiveSlider',
    Histogram: './widgets/Histogram',
    LiveMeter: './widgets/LiveMeter'
  }
});

require(['./app'], function(app) {
  'use strict';
  var synthApp = new app();
});
