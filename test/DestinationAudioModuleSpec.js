import AudioModule from '../src/audio_modules/AudioModule';
import DestinationAudioModule from '../src/audio_modules/DestinationAudioModule';

describe("DestinationAudioModule", function() {
  var audioCtx = new AudioContext();
  var destinationAudioModule;

  beforeEach(function() {
    destinationAudioModule = new DestinationAudioModule(audioCtx);
  });

  it("should initialize a new DestinationAudioModule object", function() {
    expect(destinationAudioModule).toBeDefined();
  });

  it("should have and input property", function() {
    expect(destinationAudioModule.input).toBeDefined();
  });

  it("should have an output property", function() {
    expect(destinationAudioModule.output).toBeDefined();
  });

  it("should have it's input property constructor to be GainNode", function() {
    expect(destinationAudioModule.input.constructor.name).toEqual("GainNode");
  });

  it("should have it's output property constructor to be GainNode", function() {
    expect(destinationAudioModule.output.constructor.name).toEqual("GainNode");
  });
});
