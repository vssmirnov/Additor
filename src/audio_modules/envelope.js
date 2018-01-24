import AudioModule from "audio_modules/core/audio-module";
import verifyAudioContextFeatures from "audio_modules/core/verify-audio-context-features";

/**
 * Class representing an Envelope.
 * An envelope controls the evolution of the amplitude of a audio signal over time.
 * The Envelope class defines an envelope with attack and release of an arbitrary number of points
 * (as opposed to, for example, an ADSR envelope, which has 1 point each for attack, decay, and release).
 * This envelope will follow the attack path and sustain until release is triggered, at which point 
 * it will floow the specified release path.
 * Attack and release paths are specified as 2D arrays in the form
 * [ [t(0), a(0)], [t(1), a(1)], ... [t(i), a(i)] ],
 * where t(i) specifies the time, in seconds,
 * and a(i) specifies the amplitude of the envelope at the vertex i.
 * @class
 */
class Envelope extends AudioModule {

  /**
   * @constructor
   * @param {AudioContext} audioCtx
   * @param {object} o - Options.
   * @param {array} [o.attackEnvelope] - 2D array specifying the attack envelope.
   * @param {array} [o.releaseEnvelope] - 2D array specifying the release envelope.
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
      verifyAudioContextFeatures(_this.audioCtx, ["Gain"]);

      this.audioComponents = {
        envGain: _this.audioCtx.createGain()
      }

      _this.input.connect(_this.audioComponents.envGain);
      _this.audioComponents.envGain.connect(_this.output);
          
    } catch(err) {
      console.error(err);
    }
  }

  /**
   * Initialize options.
   * @private @override
   */
  _initOptions(o) {

    this.o = {
      attackEnvelope: [[0, 0], [0.05, 1], [1, 1]],
      releaseEnvelope: [[0, 1], [0.5, 1], [1, 0]]
    }

    super._initOptions(o);
  }

  /* ============================================================================================= */
  /*  GETTERS AND SETTERS
  /* ============================================================================================= */ 

  /**
   * Get the attack envelope.
   * @returns {array} - 2D array representing the attack envelope.
   */
  getAttackEnvelope() {
    return this.o.attackEnvelope;
  }

  /**
   * Set the attack envelope.
   * @param {array} newEnv - A 2D array representing the new envelope, where each value is of the
   *                         form [t, a] where t is time in seconds, and a is amplitude in the range
   *                         [0. - 1.]
   * @returns {this} - A reference to the current envelope object for chaining.
   */
  setAttackEnvelope(newEnv) {
    this.o.attackEnvelope = newEnv;
    return this;
  }

  /**
   * Get the release envelope.
   * @returns {array} - 2D array representing the release envelope.
   */
  getReleaseEnvelope() {
    return this.o.releaseEnvelope;
  }

  /**
   * Set the release envelope.
   * @param {array} newEnv - A 2D array representing the new envelope, where each value is of the
   *                         form [t, a] where t is time in seconds, and a is amplitude in the range
   *                         [0. - 1.] 
   * @returns {this} - A reference to the current envelope object for chaining.
   */
  setReleaseEnvelope(newEnv) {
    this.o.releaseEnvelope = newEnv;
    return this;
  }

  /* ============================================================================================= */
  /*  PUTLIC API
  /* ============================================================================================= */ 

  /**
   * Execute the attack envelope.
   * @returns {Promise} - Promise that returns the envelope when the envelope expires.
   */
  attack() {
    let startTime = this.audioCtx.currentTime;
    let env = this.o.attackEnvelope;
    let a0 = 0;
    let t0 = startTime;
    let a1 = env[0][1];
    let t1 = startTime + env[0][0];

    // ramp from 0 to the first value in the envelope
    this.audioComponents.envGain.gain.setValueAtTime(a0, t0);
    this.audioComponents.envGain.gain.linearRampToValueAtTime(a1, t1);

    // ramp to each subsequent value
    for (var i = 0; i < (env.length - 1); i++) {
      a0 = env[i][1];
      t0 = startTime + env[i][0];
      a1 = env[i + 1][1];
      t1 = startTime + env[i + 1][0];

      this.audioComponents.envGain.gain.setValueAtTime(a0, t0);
      this.audioComponents.envGain.gain.linearRampToValueAtTime(a1, t1);
    }

    // set the final value
    a0 = env[env.length - 1][1];
    t0 = startTime + env[env.length - 1][0];

    this.audioComponents.envGain.gain.setValueAtTime(a0, t0);

    return new Promise((resolve, reject) => {
      window.setTimeout(() => { resolve(env); }, env[env.length][0]);
    });
  }

  /**
   * Execute the release envelope.
   * @returns {Promise} - Promise that returns the envelope when the envelope expires.
   */
  release() {
    let startTime = this.audioCtx.currentTime;
    let env = this.o.releaseEnvelope;
    let a0 = 0;
    let t0 = startTime;
    let a1 = env[0][1];
    let t1 = startTime + env[0][0];

    // cancel scheduled values in case attack is still happening
    this.audioComponents.envGain.gain.cancelScheduledValues(startTime);

    // ramp to each subsequent value
    for (var i = 0; i < (env.length - 1); i++) {
      a0 = env[i][1];
      t0 = startTime + env[i][0];
      a1 = env[i + 1][1];
      t1 = startTime + env[i + 1][0];

      this.audioComponents.envGain.gain.setValueAtTime(a0, t0);
      this.audioComponents.envGain.gain.linearRampToValueAtTime(a1, t1);
    }

    // if the gain value at the end is not 0, ramp it down to 0 in 1ms
    if(env[env.length - 1][1] !== 0) {
      a0 = 0;
      t0 = startTime + env[env.length - 1][0] + 0.001;

      this.audioComponents.envGain.gain.linearRampToValueAtTime(a0, t0);
    }

    return new Promise((resolve, reject) => {
      window.setTimeout(() => { resolve(env); }, env[env.length][0]);
    });
  } 
}

export default Envelope;