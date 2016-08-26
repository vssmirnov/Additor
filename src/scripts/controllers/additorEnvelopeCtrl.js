define(['EnvelopeGraph'], function(EnvelopeGraph) {

  'use strict';

  var additorEnvelopeCtrl = {};
  additorEnvelopeCtrl.init = function () {
    var aEnvWrap = document.getElementById('aenv-wrap');
    var sEnvWrap = document.getElementById('senv-wrap');
    var rEnvWrap = document.getElementById('renv-wrap');

    var commonEnvOptions = {
      hasFixedStartPoint: true,
      hasFixedEndPoint: true,
      backgroundColor: '#222',
      vertexColor: '#f00',
      lineColor: '#0f0'
    }

    var aEnv = new EnvelopeGraph(aEnvWrap, commonEnvOptions);
    var sEnv = new EnvelopeGraph(sEnvWrap, commonEnvOptions);
    var rEnv = new EnvelopeGraph(rEnvWrap, commonEnvOptions);

    console.log(aEnv + ' ' + sEnv + ' ' + rEnv);
  }

  return additorEnvelopeCtrl;
});
