define(['EnvelopeGraph'], function(EnvelopeGraph) {

  'use strict';

  var additorEnvelopeCtrl = function () {
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
    aEnv.fixedEndPointY = 100;

    var sEnv = new EnvelopeGraph(sEnvWrap, commonEnvOptions);
    sEnv.options = {
      fixedStartPointY: 100,
      fixedEndPointY: 100
    }

    var rEnv = new EnvelopeGraph(rEnvWrap, commonEnvOptions);
    rEnv.fixedStartPointY = 100;
  }

  return additorEnvelopeCtrl;
});
