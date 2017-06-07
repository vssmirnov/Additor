import AudioModuleManager from '../../../src/audio_modules/AudioModuleManager';

(function() {
  console.log("entered");

  var audioCtx = new AudioContext();
  var audioModuleManager = new AudioModuleManager(audioCtx);
  var additiveSynth = audioModuleManager.createAdditiveSynth();

  additiveSynth.connect(audioCtx.destination);
  additiveSynth.playNote("G5");

  console.log("played");
})();
