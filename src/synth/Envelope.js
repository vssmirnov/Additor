define(['require'], function(require) {
  'use strict';

  class Envelope {

    /**
     * Envelope
     * <p>
     * Envelope values are specified as 2D arrays in the form
     * <b>[ [t(0), a(0)], [t(1), a(1)], ... [t(i), a(i)] ]</b>,
     * where <b>t(i)</b> specifies the time interval, in seconds,
     * between envelope vertexes <b>i</b> and <b>i-1</b>, and
     * <b>a(i)</b> specifies the amplitude of the envelope at the vertex <b>i</b>.
     * </p>
     * @param {object} o - Options
     * @param {AudioContext} o.audioCtx - The audio context to be used.
     * @param {array} o.attackEnvelope - 2D array specifying the attack envelope
     * @param {array} o.releaseEnvelope - 2D array specifying the release envelope
     */
    constructor (o) {
      o = o || {};

      this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

      this._envGain = this._audioCtx.createGain();
      this._envGain.gain.value = 0;

      this.input = this._envGain;
      this.output = this._envGain;

      this._aEnv = o.aEnv || o.attackEnv || o.attackEnvelope || o.aEnvelope || [[0.05, 1], [1, 1]];
      this._rEnv = o.rEnv || o.releaseEnv || o.releaseEnvelope || o.rEnvelope || [[0, 1], [0.1, 0]];
    }

    /* =================== */
    /* --- Audio setup --- */
    /* =================== */

    /**
     * Connect this node to a destination
     * @param {AudioNode} destination - The destination to connect to
     */
    connect (destination) {
      this.output.connect(destination);
      return this;
    }

    /* ============================= */
    /* --- Get/set the envelopes --- */
    /* ============================= */

    /** The attack envelope */
    get attackEnvelope () {
      return this._aEnv;
    }
    set attackEnvelope (newEnv) {
      this._aEnv = newEnv;
      return this;
    }

    /** The release envelope */
    get releaseEnvelope () {
      return this._rEnv;
    }
    set releaseEnvelope (newEnv) {
      this._rEvn = newEnv;
      return this;
    }

    /* ========================== */
    /* --- Envelope execution --- */
    /* ========================== */

    /** Execute the attack envelope */
    attack () {
      var startTime = this._audioCtx.currentTime;
      var curTime = startTime;
      var env = this._aEnv;
      var envLength = env.length;

      // ramp from 0 to the first value in the envelope
      this._envGain.gain.setValueAtTime(0, curTime);
      this._envGain.gain.linearRampToValueAtTime(env[0][1], curTime + env[0][0]);
      curTime += env[0][0];

      // ramp to each subsequent value
      for (var i = 0; i < (envLength - 1); i++) {
        this._envGain.gain.setValueAtTime(env[i][1], curTime);
        this._envGain.gain.linearRampToValueAtTime(env[i+1][1], curTime + env[i+1][0]);
        curTime += env[i+1][0];
      }

      // set the final value
      this._envGain.gain.setValueAtTime(env[envLength-1][1], curTime);
    }

    /** Execute the release envelope */
    release () {
      var startTime = this._audioCtx.currentTime;
      var curTime = startTime;
      var env = this._rEnv;
      var envLength = env.length;

      // cancel scheduled values in case attack is still happening
      this._envGain.gain.cancelScheduledValues(curTime);

      // ramp to each subsequent value
      for (var i = 0; i < envLength; i++) {
        this._envGain.gain.linearRampToValueAtTime(env[i][1], curTime + env[i][0]);
        this._envGain.gain.setValueAtTime(env[i][1], curTime + env[i][0]);
        curTime += env[i][0];
      }

      // if the gain value at the end is not 0, ramp it down to 0 in 1ms
      if(env[envLength-1][1] !== 0) {
        this._envGain.gain.linearRampToValueAtTime(0, curTime + 0.001);
      }
    }
  }

  return Envelope;
});
