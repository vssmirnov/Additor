'use strict';

require.config({
  baseUrl: './src',
  paths: {
    // synth components
    Overtone: './synth/Overtone',
    Envelope: './synth/Envelope',
    ChannelStrip: './synth/ChannelStrip',
    AdditiveSynthVoice: './synth/AdditiveSynthVoice',
    AdditiveSynth: './synth/AdditiveSynth',
    StereoFeedbackDelay: './synth/StereoFeedbackDelay',
    util: './synth/util',
    LiveKeyboard: './widgets/Keyboard',
    EnvelopeGraph: './widgets/EnvelopeGraph',
    LiveDial: './widgets/Dial',
    LiveSlider: './widgets/Slider',
    Histogram: './widgets/Histogram',
    LiveMeter: './widgets/Meter',
    LiveDropMenu: './widgets/DropMenu',
    DragNumberbox: './widgets/Numberbox',
    additorPresets: '../presets/presets'
  }
});

require(['./app'], function(app) {

  var synthApp = new app();

});
