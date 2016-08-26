define(['additorEnvelopeCtrl',
        'LiveDial',
        'LiveSlider'],
        function(additorEnvelopeCtrl,
                 LiveDial,
                 LiveSlider) {
  'use strict';

  var app = {};
  var additorEnvelopeCtrl = additorEnvelopeCtrl;

  app.init = function () {
    additorEnvelopeCtrl.init();
  };

  return app;
});
