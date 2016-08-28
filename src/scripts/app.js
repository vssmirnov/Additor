define(['AdditiveSynth',
        'additorKbdCtrl',
        'additorEnvelopeCtrl',
        'LiveDial',
        'LiveSlider'],
        function(AdditiveSynth,
                 additorKbdCtrl,
                 additorEnvelopeCtrl,
                 LiveDial,
                 LiveSlider) {
  'use strict';

  var app = function () {
    var additorSynth = new AdditiveSynth();
    var additorKbdCtrl = new additorKbdCtrl();
    var additorEnvelopeCtrl = new additorEnvelopeCtrl();
  }

  return app;
});
