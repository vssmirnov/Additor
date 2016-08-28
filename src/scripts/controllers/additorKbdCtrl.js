define(['LiveKeyboard'], function(LiveKeyboard) {

  'use strict';

  var additorKbdCtrl = function () {
    var kbdWrap = document.getElementById('kbd-wrap');

    this.kbd = new LiveKeyboard(kbdWrap, {
      mode: 'polyphonic',
      bottomNote: 24,
      topNote: 96,
      whiteKeyColor: '#cfcfcf'
    });
  }

  return additorKbdCtrl;
});
