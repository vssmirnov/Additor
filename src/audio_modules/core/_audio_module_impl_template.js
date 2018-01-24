import AudioModule from "audio_modules/core/audio-module";
import verifyAudioContextFeatures from "audio_modules/core/verify-audio-context-features";

/**
 * Class representing an
 // TODO: WRITE DESCRIPTION
 * @class
 */
class Envelope extends AudioModule {

  /**
   * @constructor
   * @param {AudioContext} audioCtx
   * @param {object} o - Options.
   // TODO: ANNOTATE OPTIONS
   */
  constructor(audioCtx, o) {
    super(audioCtx);  
  }

  /* ============================================================================================= */
  /*  INITIALIZATION METHODS
  /* ============================================================================================= */

  /**
   * Initialize audio components and their connections.
   * @private @override
   */
  _initAudioComponents() {
    const _this = this;

    try {
      // TODO: ANNOTATE LIST OF FEATURES TO CHECK
      verifyAudioContextFeatures(_this.audioCtx, []);

      this.audioComponents = {
        // TODO: INIT AUDIO COMPONENTS
      };

      // TODO: IMPLEMENT CONNECTIONS BETWEEN COMPONENTS          
    } catch(err) {
      console.error(err);
    }
  }

  /**
   * Initialize and expose Audio Params.
   * @private @abstract
   */
  _initAudioParams() {
    // TODO: EXPOSE AUDIOPARAMS
  }

  /**
   * Initialize options.
   * @private @override
   */
  _initOptions(o) {

    this.o = {
      // TODO: IMPLEMENT DEFAULT OPTIONS
    };

    super._initOptions(o);
  }

  /* ============================================================================================= */
  /*  GETTERS AND SETTERS
  /* ============================================================================================= */ 

  // TODO: IMPLEMENT GETTERS AND SETTERS

  /* ============================================================================================= */
  /*  PUTLIC API
  /* ============================================================================================= */ 

  // TODO: IMPLEMENT PUBLIC API
}

export default Envelope;