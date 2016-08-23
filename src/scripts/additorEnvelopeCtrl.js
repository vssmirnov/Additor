define(function(require){
  'use strict';

  var EnvelopeGraph = requrie('./EnvelopeGraph');

  var attackEnvContainer = document.getElementById('attack-env');
  var sustainEnvContainer = document.getElementById('sustain-env');
  var releaseEnvContainer = document.getElementById('release-env');

  var attackEnv = new EnvelopeGraph(attackEnvContainer, {

  });

  var sustainEnv = new EnvelopeGraph(sustainEnvContainer, {

  });

  var releaseEnv = new ReleaseEnvContainer(releaseEnvContainer, {

  });

});
