(function() {
  'use strict';

  define(['require', 'AudioCtrl', 'OvertoneCtrl', 'EnvelopeCtrl', 'FilterCtrl', 'DelayCtrl', 'VoicesCtrl', 'PresetsCtrl', 'MainOutputCtrl', 'KeyboardCtrl'],
    function(require, AudioCtrl, OvertoneCtrl, EnvelopeCtrl, FilterCtrl, DelayCtrl, VoicesCtrl, PresetsCtrl, MainOutputCtrl, KeyboardCtrl) {

      var app = function () {

        /**
         * adt (additor) is the object whose properties define the controller components
         */
        const adt = {
          synth: {},
          ot: {},
          env: {},
          filter: {},
          delay: {},
          output: {},
          voices: {},
          kbd: {},
          presets: {}
        };

        /**
         * Initialize the controllers
         */
        (function initControllers() {
          AudioCtrl(adt);
          OvertoneCtrl(adt);
          EnvelopeCtrl(adt);
          FilterCtrl(adt);
          DelayCtrl(adt);
          MainOutputCtrl(adt);
          VoicesCtrl(adt);
          KeyboardCtrl(adt);
          PresetsCtrl(adt);
        }());
      }

    return app;
  });
}());
