define(['./LiveDial',
        './LiveSlider'], function(LiveDial,
                                  LiveSlider) {
  'use strict';

  var app = {};

  app.init = function () {
    var volumeDialContainer = document.getElementById('volume-dial-container');
    var volumeSliderContainer = document.getElementById('volume-slider-container');

    var volumeDial = new LiveDial(volumeDialContainer);

    volumeSliderContainer.innerHTML = 'hello';
  };

  return app;
});
