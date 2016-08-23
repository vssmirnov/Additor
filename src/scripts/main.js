require.config({
  baseUrl: './scripts/app',
  paths: {
    LiveDial: './widgets/LiveDial',
    LiveSlider: './widgets/LiveSlider'
  }
})

require(['./app'], function(app) {
  'use strict';
  app.init();
});
