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

  /**
   * Returns the type of the waveform set for this oscillator.
   * @returns {string} - Type of waveform. One of "sine", "square", "sawtooth", "triangle", or "custom".
   */
  getWaveformType() {
    return this.audioComponents.oscillator.type;
  }

  /**
   * Set the type of waveform - one of "sine", "square", "sawtooth", "triangle", or "custom".
   * If "custom" is selected, you may also provide the real and imaginary components to create
   * the custom waveform.
   * @param {string} type - Type of waveform - one of "sine", "square", "sawtooth", "triangle", or "custom".
   * @param {Float32Array} [real] - Real part (cosine terms) of an array used to create the custom waveform.
   * @param {Float32Array} [imag] - Imaginary part (sine terms) of an array used to create the custom waveform.
   */
  setWaveformType(type, real, imag) {

    switch (type) {
      case "sine":
        this.audioComponents.oscillator.type = "sine";
        break;
      case "square":
        this.audioComponents.oscillator.type = "squre";
        break;
      case "sawtooth":
      case "saw":
        this.audioComponents.oscillator.type = "sawtooth";
        break;
      case "triangle":
        this.audioComponents.oscillator.type = "triangle";
        break;
      case "custom":
        if (typeof real === "object" && real.constructor.name === "Float32Array"
            && typeof imag === "object" && imag.constructor.name === "Float32Array") {              
              let wave = this.audioCtx.createPeriodicWave(real, imag);
              this.audioComponents.oscillator.setPeriodicWave(wave);              
        }
        break;
      default:
        break;
    }
  }

  /**
   * Set a custom waveform using arrays of real (cosine) and imaginary (sine) terms.
   * @param {Float32Array} real 
   * @param {Float32Array} imag 
   */
  setCustomWaveform(real, imag) {
    this.setWaveformType("custom", real, imag);
    return this;
  }

  /**
   * Returns the gain.
   * @returns {number} - Gain.
   */
  getGain() {
    return this.audioComponents
                .channelStrip
                .getOutputGain();
  }

  /**
   * Sets the gain.
   * @param {number} gain - Gain between 0. and 1.
   */
  setGain(gain) {
    this.audioComponents
          .channelStrip
          .setOutputGain(gain);
    return this;
  }

  /**
   * Returns the pan.
   * @returns {number} - Pan.
   */
  getPan() {
    return this.audioComponents
                .channelStrip
                .getPan();
  }
  
  /**
   * Sets the pan.
   * @param {number} pan - Pan between -1. (L) and 1. (R).
   */
  setPan(pan) {
    this.audioComponents
          .channelStrip
          .setPan(pan);
    return this;
  }

  /**
   * Returns the oscillator frequency.
   * @returns {number} - Oscillator frequency.
   */
  getFrequency() {
    return this.audioComponents
                  .oscillator
                  .frequency
                  .value;
  }

  /**
   * Sets the oscillator frequency.
   * @param {number} freq - Frequency.
   */
  setFrequency(freq) {
    this.audioComponents
          .oscillator
          .frequency
          .value = freq;
    return this;
  }

  /**
   * Get the attack envelope.
   * @returns {array} - 2D array representing the attack envelope.
   */
  getAttackEnvelope() {
    return this.audioComponents
                .envelope
                .getAttackEnvelope();
  }

  /**
   * Set the attack envelope.
   * @param {array} env - A 2D array representing the new envelope, where each value is of the
   *                         form [t, a] where t is time in seconds, and a is amplitude in the range
   *                         [0. - 1.]
   * @returns {this} - A reference to the current envelope object for chaining.
   */

  setAttackEnvelope(env) {
    this.audioComponents
          .envelope
          .setAttackEnvelope(env);
    return this;
  }

  /**
   * Get the release envelope.
   * @returns {array} - 2D array representing the release envelope.
   */
  getReleaseEnvelope() {
    return this.audioComponents
                .envelope
                .getReleaseEnvelope();
  }

  /**
   * Set the release envelope.
   * @param {array} env - A 2D array representing the new envelope, where each value is of the
   *                         form [t, a] where t is time in seconds, and a is amplitude in the range
   *                         [0. - 1.] 
   * @returns {this} - A reference to the current envelope object for chaining.
   */
  setReleaseEnvelope() {
    this.audioComponents
          .envelope
          .setReleaseEnvelope(env);
    return this;
  }

  /* ============================================================================================= */
  /*  PUTLIC API
  /* ============================================================================================= */ 

  // TODO: IMPLEMENT PUBLIC API

  attack() {}
  release() {}
}

export default Envelope;