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

      _this.audioComponents.envGain.gain.value = 0;
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
      attackEnvelope: [[0.1, 1], [1, 1]],
      releaseEnvelope: [[0.5, 1], [1, 0]]
    }

    super._initOptions(o);

    this._normalizeAttackEnvelope();
    this._normalizeReleaseEnvelope();
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
    this._normalizeAttackEnvelope();
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
    this._normalizeReleaseEnvelope();
    return this;
  }

  /* ============================================================================================= */
  /*  PUBLIC API
  /* ============================================================================================= */ 

  /**
   * Execute the attack envelope.
   * @returns {Promise} - Promise that returns the envelope when the envelope expires.
   */
  attack() {
    const _this = this;
    const envGain = this.audioComponents.envGain;
    const env = this.o.attackEnvelope;
    
    let a, t;

    // cancel scheduled values in case another change is occuring
    envGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
    envGain.gain.setValueAtTime(envGain.gain.value, this.audioCtx.currentTime);

    const startTime = this.audioCtx.currentTime;

    // ramp to each subsequent value
    for (var i = 0; i < env.length; i++) {
      a = env[i][1];
      t = startTime + env[i][0];                                       
      
      if (t > this.audioCtx.currentTime) {
        envGain.gain.linearRampToValueAtTime(a, t);
      }
    }

    return new Promise((resolve, reject) => {
      window.setTimeout(() => { 
        resolve(env); 
      }, env[env.length -1][0] * 1000);
    });
  }

  /**
   * Execute the release envelope.
   * @returns {Promise} - Promise that returns the envelope when the envelope expires.
   */
  release() {
    const _this = this;
    const envGain = this.audioComponents.envGain;
    const env = this.o.releaseEnvelope;
    
    let a, t;

    // cancel scheduled values in case another change is occuring
    envGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
    envGain.gain.setValueAtTime(envGain.gain.value, this.audioCtx.currentTime);

    const startTime = this.audioCtx.currentTime;

    // ramp to each subsequent value
    for (var i = 0; i < env.length; i++) {
      a = env[i][1];
      t = startTime + env[i][0];                                       
      
      if (t > this.audioCtx.currentTime) {
        envGain.gain.linearRampToValueAtTime(a, t);
      }
    }

    return new Promise((resolve, reject) => {
      window.setTimeout(() => { 
        resolve(env); 
      }, env[env.length -1][0] * 1000);
    });
  }
  
  /* ============================================================================================= */
  /* INTERNAL FUNCTIONALITY AND HELPER METHODS
  /* ============================================================================================= */ 

  /**
   * Normalizes the attack envelope.
   * Envelope points must be strictly positive (non-zero) and <= 1.
   * @private
   */
  _normalizeAttackEnvelope() {
    this.o.attackEnvelope.forEach(point => {
      point[1] = (point[1] <= 0) ? 0.0001 : 
                  (point[1] > 1) ? 1 :
                  point[1];
    });
  }

  /**
   * Normalizes the release envelope.
   * Envelope points must be strictly positive (non-zero) and <= 1.
   * @private
   */
  _normalizeReleaseEnvelope() {
    this.o.releaseEnvelope.forEach(point => {
      point[1] = (point[1] <= 0) ? 0.0001 : 
                  (point[1] > 1) ? 1 :
                  point[1];
    });
  }
}

export default Envelope;