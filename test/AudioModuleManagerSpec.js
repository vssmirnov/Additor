import AudioModuleManager from '../src/audio_modules/AudioModuleManager';

describe("AudioModuleManager", function() {
  var audioModuleManager;
  var audioCtx;

  beforeEach(function() {
    audioCtx = new AudioContext();
    audioModuleManager = new AudioModuleManager(audioCtx);
  });

  it("should be able to create a DestinationAudioModule", function() {
    var destinationAudioModule = audioModuleManager.createDestination();

    expect(destinationAudioModule).toBeDefined();
    expect(destinationAudioModule.input).toBeDefined();
    expect(destinationAudioModule.output).toBeDefined();
  });

  it("should be able to create an AdditiveSynthAudioModule", function() {
    var additiveSynthAudioModule = audioModuleManager.createAdditiveSynth();

    expect(additiveSynthAudioModule).toBeDefined();
  });
});
