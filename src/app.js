import AudioCtrl from './controllers/AudioCtrl';
import OvertoneCtrl from './controllers/OvertoneCtrl';
import EnvelopeCtrl from './controllers/EnvelopeCtrl';
import FilterCtrl from './controllers/FilterCtrl';
import DelayCtrl from './controllers/DelayCtrl';
import VoicesCtrl from './controllers/VoicesCtrl';
import PresetsCtrl from './controllers/PresetsCtrl';
import MainOutputCtrl from './controllers/MainOutputCtrl';
import KeyboardCtrl from './controllers/KeyboardCtrl';

(function() {
  'use strict';

  var app = (function () {

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
  }());
}());
