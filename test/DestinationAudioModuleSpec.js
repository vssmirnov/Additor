import DestinationAudioModule from '../src/audio_modules/DestinationAudioModule';

describe("DestinationAudioModule", function() {
  var audioCtx = new AudioContext();
  var destinationAudioModule;

  beforeEach(function() {
    destinationAudioModule = new DestinationAudioModule(audioCtx);
  });

  it("should initialize a new DestinationAudioModule object", function() {
    expect(destinationAudioModule.constructor.name).toEqual("DestinationAudioModule");
  });
});
