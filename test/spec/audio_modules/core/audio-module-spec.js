import AudioModule from "audio_modules/core/audio-module";

describe("AudioModule", function() {
  var audioCtx;
  var audioModule;

  beforeEach(function() {
    audioCtx = new AudioContext();
    audioModule = new AudioModule(audioCtx);
  });

  describe("constructor", function() {
    it("should construct a new AudioModule object", function() {
      expect(typeof audioModule).toBe("object");
    });

    it("should have an input", function() {
      expect(audioModule.input).toBeDefined();
    });

    it("should have an output", function() {
      expect(audioModule.output).toBeDefined();
    });

    it("should have an isAudioModule property", function() {
      expect(audioModule.isAudioModule).toBeDefined();
      expect(audioModule.isAudioModule).toBe(true); 
    })
  });

  describe("getContext()", function() {
    it("should return the audioCtx", function() {
      expect(audioModule.getContext()).toEqual(audioCtx);
    });
  });
});