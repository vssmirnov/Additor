/**
 * Verifies that the given audio context has the requested features and attempts to shim features that are
 * missing.
 */
function VerifyAudioContextFeatures(audioCtx, features) {

  features.forEach(feature => {

    switch(feature) {
      case "StereoPanner":
        if (typeof audioCtx.createStereoPanner !== 'function') {
          audioCtx.createStereoPanner = function createStereoPanner() { return new StereoPannerShim(audioCtx); };
        }
        break;

      default:
        break;
    }
  });
}

export default VerifyAudioContextFeatures;