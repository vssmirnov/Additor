(function(){
  'use strict';

  /* ==================== */
  /* --- Dependencies --- */
  /* ==================== */

  var ChannelStrip, Envelope;

  if(typeof require === 'function') {
    ChannelStrip = require('./ChannelStrip');
    Envelope = require('./Envelope');
  } else if (typeof window !== 'undefined') {
    ChannelStrip = window.ChannelStrip;
    Envelope = window.Envelope;
  } else if (typeof global !== 'undefined') {
    ChannelStrip = global.ChannelStrip;
    Envelope = global.Envelope;
  }

  /* ======================== */
  /* --- Class definition --- */
  /* ======================== */

  class Overtone {
    constructor (o) {
      o = o || {};

      this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

      this._oscillator = this._audioCtx.createOscillator();
      this._envelope = new Envelope({ audioCtx: this._audioCtx });
      this._channelStrip = new ChannelStrip({ audioCtx: this._audioCtx });

      this._oscillator.connect(this._envelope.input);
      this._envelope.connect(this._channelStrip.input);

      this._oscillator.start();

      this.output = this._channelStrip.output;

      this.frequency = o.frequency || 440;
      this.pan = o.pan || 0;
      this.amplitude = o.amplitude || 1;
    }

    /* =========================== */
    /* --- Getters and setters --- */
    /* =========================== */

    get options () {
      return {
        audioCtx: audioCtx,
        frequency: this.frequency,
        pan: this.pan,
        amplitude: this.amplitude,
        attackEnvelope: this.attackEnvelope,
        releaseEnvelope: this.releaseEnvelope
      }
    }
    set options (o) {
      o = o || {};

      if (o.frequency) this.frequency = o.frequency;
      if (o.pan) this.pan = o.pan;
      if (o.amplitude) this.amplitude = o.amplitude;
      if (o.attackEnvelope) this.attackEnvelope = o.attackEnvelope;
      if (o.releaseEnvelope) this.releaseEnvelope = o.releaseEnvelope;

      return this;
    }
    setOptions (o) {
      o = o || {};
      this.options = o;
    }

    get audioCtx () {
      return this._audioCtx;
    }

    /** Oscillator frequency */
    get frequency () {
      return this._oscillator.frequency;
    }
    set frequency (newFreq) {
      var curTime = this._audioCtx.currentTime;
      console.log('curTime: ' + curTime);
      this._oscillator.frequency.value = newFreq;
      return this;
    }

    /** Pan */
    get pan () {
      return this._channelStrip.pan;
    }
    set pan (newPan) {
      this._channelStrip.pan = newPan;
      return this;
    }

    /** Overtone amplitude */
    get amplitude () {
      return this._channelStrip.inputGain;
    }
    set amplitude (newAmp) {
      this._channelStrip.inputGain = newAmp;
      return this;
    }

    /** Overtone output gain (used for balancing volume when several overtones are used in a voice) */
    get gain () {
      return this._channelStrip.outputGain;
    }
    set gain (newGain) {
      this._channelStrip.outputGain = newGain;
      return this;
    }

    /** Attack envelope */
    get attackEnvelope () {
      return this._envelope.attackEnvelope;
    }
    set attackEnvelope (newEnv) {
      this._envelope.attackEnvelope = newEnv;
      return this;
    }

    /** Release envelope */
    get releaseEnvelope () {
      return this._envelope.releaseEnvelope;
    }
    set releaseEnvelope (newEnv) {
      this._envelope.releaseEnvelope = newEnv;
      return this;
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

    /* ========================= */
    /* --- Envelope controls --- */
    /* ========================= */

    /** Execute the attack envelope */
    attack () {
      console.log('Overtone attack');
      this._envelope.attack();
    }

    /** Execute the release envelope */
    release () {
      console.log('Overtone release');
      this._envelope.release();
    }
  }

  /* ======================================== */
  /* --- Module loader and global support --- */
  /* ======================================== */

  // support for AMD libraries
  if (typeof define === 'function') {
    define([], function () {
      return Overtone;
    });
  }

  // support for CommonJS libraries
  else if (typeof exports !== 'undefined') {
    exports.Overtone = Overtone;
  }

  // support for window global
  else if (typeof window !== 'undefined') {
    window.Overtone = Overtone;
  }

  // support for Node.js global
  else if (typeof global !== 'undefined') {
    global.Overtone = Overtone;
  }
})();
