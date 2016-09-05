(function(){
  'use strict';

  /* ==================== */
  /* --- Dependencies --- */
  /* ==================== */

  var Overtone, Envelope, ChannelStrip;

  if(typeof require === 'function') {
    ChannelStrip = require('./ChannelStrip');
    Envelope = require('./Envelope');
    Overtone = require('./Overtone');
  } else if (typeof window !== 'undefined') {
    ChannelStrip = window.ChannelStrip;
    Envelope = window.Envelope;
    Overtone = window.Overtone;
  } else if (typeof global !== 'undefined') {
    ChannelStrip = global.ChannelStrip;
    Envelope = global.Envelope;
    Overtone = global.Overtone;
  }

  /* ======================== */
  /* --- Class definition --- */
  /* ======================== */

  class AdditiveSynthVoice {
    constructor (o) {
      o = o || {};

      this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

      this._channelStrip = new ChannelStrip({ audioCtx: this._audioCtx });
      this._envelope = new Envelope({ audioCtx: this._audioCtx });

      var numOvertones = o.numOvertones || o.numberOfOvertones || 20;
      this._overtones = [];
      for (var i = 0; i < numOvertones; i++) {
        this._overtones.push(new Overtone({ audioCtx: this._audioCtx }));
        this._overtones[i].connect(this._envelope.input);
        this._envelope.connect(this._channelStrip.input);
        this._overtones[i].gain = 1 / numOvertones;
      }

      this.output = this._channelStrip.output;

      this.frequency = o.frequency || o.freq || 440;
      this.pan = o.pan || 0; // -1: hard left, 1: hard right
      this.gain = o.gain || 1;
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

    /* =========================== */
    /* --- Getters and setters --- */
    /* =========================== */

    /** Options */
    get options () {
      return {
        numOvertones: this.numOvertones,
        frequency: this.frequency,
        gain: this.gain,
        pan: this.pan
      }
    }
    set options (o) {
      o = o || {};

      if (o.numOvertones) this.numOvertones = o.numOvertones;
      if (o.frequency) this.frequency = o.frequency;
      if (o.gain) this.gain = o.gain;
      if (o.pan) this.pan = o.pan;

      return this;
    }
    setOptions (o) {
      o = o || {};
      this.options = o;
    }

    /** Number of overtones (including the fundamental) */
    get numOvertones () {
      return this._overtones.length;
    }
    set numOvertones (newNumOvertones) {
      if (newNumOvertones > this.numOvertones) {
        var fundFreq = this.frequency;
        for (var i = this.numOvertones; i < newNumOvertones && (i + 1) * fundFreq < this._audioCtx.sampleRate / 2; i++) {
          this._overtones.push(new Overtone({ audioCtx: this._audioCtx}));
          this._overtones[i].frequency = (i + 1) * fundFreq;
          this._overtones[i].gain = 1 / newNumOvertones;
        }
      } else if (newNumOvertones < this.numOvertones) {
        for (var i = this.numOvertones; i > this.newNumOvertones; i--) {
          this._overtones.pop();
          this._overtones[i].gain = 1 / newNumOvertones;
        }
      }
      return this;
    }
    setNumOvertones (newNumOvertones) {
      this.numOvertones = newNumOvertones;
    }

    /** Fundamental frequency */
    get frequency () {
      return this._overtones[0].frequency;
    }
    set frequency (newFreq) {
      var freqCeil = this._audioCtx.sampleRate / 2;
      var numOvertones = this.numOvertones;

      for (var i = this.numOvertones - 1; i >= 0; i--) {
        if ( (i + 1) * newFreq < freqCeil ) {
          this._overtones[i].frequency = (i + 1) * newFreq;
          this._overtones[i].gain = 1 / numOvertones;
        } else {
          this._overtones[i].gain = 0;
        }
      }
      return this;
    }
    setFrequency (newFreq) {
      this.frequency = newFreq;
    }

    /** Gain */
    get gain () {
      return this._channelStrip.outputGain;
    }
    set gain (newGain) {
      this._channelStrip.outputGain = newGain;
      return this;
    }
    setGain (newGain) {
      this.gain = newGain;
    }

    /** Pan */
    get pan () {
      return this._channelStrip.pan;
    }
    set pan (newPan) {
      this._channelStrip.pan = newPan;
      return this;
    }
    setPan (newPan) {
      this.pan = newPan;
    }

    /** Get overtone amplitude
     * @param {number} otNum - Overtone number (0 for the fundamental).
     */
    getOvertoneAmplitude (otNum) {
      return this._overtones[otNum].amplitude;
    }
    /** Set overtone amplitude
     * @param {number} otNum - Overtone number (0 for the fundamental).
     * @param {number} newAmp - New amplitude (useful range: 0.0 - 1.0).
     */
    setOvertoneAmplitude (otNum, newAmp) {
      this._overtones[otNum].amplitude = newAmp;
      return this;
    }

    /** Set overtone amplitudes by a formula function
     * @param {function} func - The function specifying the amplitude of each overtone number n.
     */
    setOvertoneAmplitudesByFormula (func) {
      for (var n = this.numOvertones - 1; n >= 0; n--) {
        this.setOvertoneAmplitude(n, func(n + 1));
      }
      return this;
    }

    /* ========================= */
    /* --- Envelope controls --- */
    /* ========================= */

    /**
     * Execute the attack envelope.
     * Individual envelopes are executed for each overtone, and the envelope for this voice is executed.
     */
    attack (o) {
      if (o) this.options = o;

      for (var i = this.numOvertones - 1; i >= 0; i--) {
        this._overtones[i].attack();
      }
      this._envelope.attack();
    }

    /**
     * Execute the release envelope
     * Individual envelopes are executed for each overtone, and the envelope for this voice is executed.
     */
    release (o) {
      if (o) this.options = o;

      for (var i = this.numOvertones - 1; i >= 0; i--) {
        this._overtones[i].release();
      }
      this._envelope.release();
    }
  }

  /* ======================================== */
  /* --- Module loader and global support --- */
  /* ======================================== */

  // support for AMD libraries
  if (typeof define === 'function') {
    define([], function () {
      return AdditiveSynthVoice;
    });
  }

  // support for CommonJS libraries
  else if (typeof exports !== 'undefined') {
    exports.AdditiveSynthVoice = AdditiveSynthVoice;
  }

  // support for window global
  else if (typeof window !== 'undefined') {
    window.AdditiveSynthVoice = AdditiveSynthVoice;
  }

  // support for Node.js global
  else if (typeof global !== 'undefined') {
    global.AdditiveSynthVoice = AdditiveSynthVoice;
  }
})();
