import AudioModule from "audio_modules/core/audio-module";
import verifyAudioContextFeatures from "audio_modules/core/verify-audio-context-features";
import OscillatorVoice from "audio_modules/oscillator-voice";

/**
 * Class representing an Additive Synth Voice
 // TODO: WRITE DESCRIPTION
 * @class
 */
class AdditiveSynthVoice extends AudioModule {

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
        overtones: (function() {
          let ot = [];

          for (let i = 0; i < _this.o.numOvertones; i++) {
            ot.push(new OscillatorVoice());
          }

          return ot;
        }()),
        envelope: new Envelope(_this.audioCtx),
        channelStrip: new ChannelStrip(_this.audioCtx)
      };

      _this.audioComponents.overtones.forEach(ot => {
        ot.connect(_this.audioComponents.envelope);
      });
      _this.audioComponents.envelope.connect(_this.audioComponents.channelStrip);
      _this.audioComponents.channelStrip.connect(_this.output);       
    } catch(err) {
      console.error(err);
    }
  }

  /**
   * Initialize and expose Audio Params.
   * @private @abstract
   */
  _initAudioParams() {
    this.pan = this.audioComponents.channelStrip.pan;
    this.gain = this.audioComponents.channelStrip.outputGain;
    this.frequency = this.audioComponents.oscillator.frequency;
  }

  /**
   * Initialize options.
   * @private @override
   */
  _initOptions(o) {

    this.o = {
      numOvertones: 10,
      glide: 0
    };

    super._initOptions(o);
  }

  /* ============================================================================================= */
  /*  GETTERS AND SETTERS
  /* ============================================================================================= */ 

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
    let freq = this.audioComponents.overtones[0].getFrequency()
    return freq;
  }

  /**
   * Sets the oscillator frequency.
   * @param {number} freq - Frequency.
   * @param {number} [glide] - Glide time in ms.
   */
  setFrequency(freq, glide) {
    let overtones = this.audioComponents.overtones;

    glide = (glide === undefined) ? this.o.glide : glide;

    overtones.forEach((ot, otIdx) => {
      ot.setFrequency(freq * (otIdx + 1))
    });

    return this;
  }

  /**
   * Get either the main attack envelope, or the attack envelope for
   * one of the overtones.
   * @param {number} [otIdx] - Index of the overtone whose attack envelope to return.
   * @returns {array} - 2D array representing the attack envelope.
   */
  getAttackEnvelope(otIdx) {
    let env = [];

    if (typeof otIdx === "number") {
      env = this.audioComponents.overtones[otIdx].getAttackEnvelope();
    } else {
      env = this.audioComponents.envelope.getAttackEnvelope();
    }

    return env;
  }

  /**
   * Set either the main attack envelope, or the attack envelope for
   * one of the overtones.
   * @param {array} env - A 2D array representing the new envelope, where each value is of the
   *                         form [t, a] where t is time in seconds, and a is amplitude in the range
   *                         [0. - 1.]
   * @param {number} otIdx - Index of the overtone whose attack envelope to set.
   * @returns {this} - A reference to the current object for chaining.
   */
  setAttackEnvelope(env, otIdx) {
    let taget = {};

    if (typeof otIdx === "number") {
      target = this.audioComponents.overtones[otIdx];
    } else {
      target = this.audioComponents.envelope;
    }

    target.setAttackEnvelope(env);

    return this;
  }

  /**
   * Get either the main release envelope, or the release envelope for
   * one of the overtones.
   * @param {number} [otIdx] - Index of the overtone whose release envelope to return.
   * @returns {array} - 2D array representing the release envelope.
   */
  getReleaseEnvelope(otIdx) {
    let env = [];

    if (typeof otIdx === "number") {
      env = this.audioComponents.overtones[otIdx].getReleaseEnvelope();
    } else {
      env = this.audioComponents.envelope.getReleaseEnvelope();
    }

    return env;
  }

  /**
   * Set either the main release envelope, or the release envelope for
   * one of the overtones.
   * @param {array} env - A 2D array representing the new envelope, where each value is of the
   *                         form [t, a] where t is time in seconds, and a is amplitude in the range
   *                         [0. - 1.]
   * @param {number} otIdx - Index of the overtone whose release envelope to set.
   * @returns {this} - A reference to the current object for chaining.
   */
  setReleaseEnvelope(env) {
    let taget = {};
    
    if (typeof otIdx === "number") {
      target = this.audioComponents.overtones[otIdx];
    } else {
      target = this.audioComponents.envelope;
    }

    target.setReleaseEnvelope(env);

    return this;
  }

  /* ============================================================================================= */
  /*  PUTLIC API
  /* ============================================================================================= */ 

  // TODO: IMPLEMENT PUBLIC API
}

export default AdditiveSynthVoice;