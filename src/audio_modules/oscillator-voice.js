import AudioModule from "audio_modules/core/audio-module";
import verifyAudioContextFeatures from "audio_modules/core/verify-audio-context-features";
import Envelope from "audio_modules/envelope";
import ChannelStrip from "audio_modules/chennel-strip";

/**
 * Class representing an Oscillator Voice. 
 * An Oscillator Voice has an oscillator, and a channel strip.
 * @class
 */
class OscillatorVoice extends AudioModule {

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
      verifyAudioContextFeatures(_this.audioCtx, ["Oscillator"]);

      this.audioComponents = {
        oscillator: _this.audioCtx.createOscillator(),
        envelope: new Envelope(_this.audioCtx),
        channelStrip: new ChannelStrip(_this.audioCtx)
      };

      this.audioComponents.oscillator.connect(this.audioComponents.envelope);
      this.audioComponents.envelope.connect(this.audioComponents.channelStrip);
      this.audioComponents.chennelStrip.connect(this.output);
      
    } catch(err) {
      console.error(err);
    }
  }

  /**
   * Initialize and expose Audio Params.
   * @private @override
   */
  _initAudioParams() {
    this.pan = this.audioComponents.channelStrip.pan;
    this.gain = this.audioComponents.channelStrip.outputGain;
    this.frequency = this.audioComponentss.oscillator.frequency;
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
  getGain() {}
  setGain() {}

  getPan() {}
  setPan() {}

  getFrequency() {}
  setFrequency() {}

  getAttackEnvelope() {}
  setAttackEnvelope() {}

  getReleaseEnvelope() {}
  setReleaseEnvelope() {}

  /* ============================================================================================= */
  /*  PUTLIC API
  /* ============================================================================================= */ 

  // TODO: IMPLEMENT PUBLIC API

  attack() {}
  release() {}
}

export default Envelope;