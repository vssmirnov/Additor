describe('ChannelStrip', function () {
  var AudioUnit = ChannelStrip;

  describe('#audioCtx', function () {
    it('should inherit it\'s Audio Context from the supplied options', function () {
      var newAudioCtx = new AudioContext();
      var audioUnit = new AudioUnit({
        audioCtx: newAudioCtx
      });
      expect(audioUnit._audioCtx).toEqual(newAudioCtx);
    });

    it('should fall back to window.audioCtx if no Audio Context supplied in options', function () {
      window.audioCtx = new AudioContext();
      var audioUnit = new AudioUnit();
      expect(audioUnit._audioCtx).toEqual(window.audioCtx);
    });

    it('should create a new Audio Context if none is supplied', function () {
      var audioUnit = new AudioUnit();
      expect(audioUnit._audioCtx.constructor.name).toEqual('AudioContext');
    });

    it('should return the _audioCtx when the audioCtx getter is used', function () {
      var newAudioCtx = new AudioContext();
      var audioUnit = new AudioUnit({
        audioCtx: newAudioCtx
      });
      expect(audioUnit.audioCtx).toEqual(audioUnit._audioCtx);
    });

    it('should throw if attempting to set to a new audioCtx, but providing the wrong type of argument', function () {
      var newAudioCtx = {};
      var audioUnit = new AudioUnit();

      function setWrongAudioContext() {
        audioUnit.audioCtx = newAudioCtx;
      }

      expect(setWrongAudioContext()).toThrow;
    });
  });

});
