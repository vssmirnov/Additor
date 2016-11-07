'use strict';

require.config({
  baseUrl: './src',
  paths: {
    Overtone: './synth/Overtone',
    Envelope: './synth/Envelope',
    ChannelStrip: './synth/ChannelStrip',
    AdditiveSynthVoice: './synth/AdditiveSynthVoice',
    AdditiveSynth: './synth/AdditiveSynth',
    StereoFeedbackDelay: './synth/StereoFeedbackDelay',
    util: './synth/util',
    Keyboard: './widgets/Keyboard',
    EnvelopeGraph: './widgets/EnvelopeGraph',
    Dial: './widgets/Dial',
    Slider: './widgets/Slider',
    Histogram: './widgets/Histogram',
    Meter: './widgets/Meter',
    DropMenu: './widgets/DropMenu',
    Numberbox: './widgets/Numberbox',
    additorPresets: '../presets/presets',
    AudioCtrl: './controllers/AudioCtrl',
    OvertoneCtrl: './controllers/OvertoneCtrl',
    EnvelopeCtrl: './controllers/EnvelopeCtrl',
    FilterCtrl: './controllers/FilterCtrl',
    DelayCtrl: './controllers/DelayCtrl',
    VoicesCtrl: './controllers/VoicesCtrl',
    PresetsCtrl: './controllers/PresetsCtrl',
    MainOutputCtrl: './controllers/MainOutputCtrl',
    KeyboardCtrl: './controllers/KeyboardCtrl'
  }
});

require(['./app'], function(app) {

  var synthApp = new app();

});
