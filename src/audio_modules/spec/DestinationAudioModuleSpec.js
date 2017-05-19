describe("DestinationAudioModule", function() {
  let DestinationAudioModule = require('../DestinationAudioModule');

  
  let AudioContext = function() { return null; }

  let audioCtx = new AudioContext();
  let destinationAudioModule;

  beforeEach(function() {
    destinationAudioModule = new DestinationAudioModule(audioCtx);
  });

  it("should initialize a new DestinationAudioModule object", function() {
    expect(destinationAudioModule.constructor.name).toEqual("DestinationAudioModule");
  });
});
