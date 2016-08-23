define(function(require){
  'use strict';

  class Overtone {
    constructor (o) {
      o = o || {};

      this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

      this._frequency = o.frequency || 440;
      this._pan = o.pan || 0; // -1: hard left, 1: hard right
      this._amplitude = o.amplitude || 1;

      this._envelope = o.envelope
                       || [[0.05, 1],
                           [1, 1]];
      this._releaseEnvelope = o.releaseEnvelope
                              || [[0, 1],
                                  [0.1, 0]];
     /**
      * overtoneNode = {
      *    oscillator: oscillatorNode,
      *    amplitude: gainNode,
      *    panner: stereoPannerNode,
      *    output: gainNode
      * }
      */
      this._overtoneNode = this.createOvertoneNode();
      this._output = this._overtoneNode.output;
    }

    /* --- getters and setters --- */
    set options (o) {
      this.audioCtx = o.audioCtx || this.audioCtx;
      this.frequency = o.frequency || this.frequency;
      this.pan = o.pan || this.pan;
      this.amplitude = o.amplitude || this.amplitude;
      this.envelope = o.envelope || this.envelope;
      this.releaseEnvelope = o.releaseEnvelope || this.releaseEnvelope;
    }

    get options () {
      return {
        frequency: this.frequency,
        pan: this.pan,
        amplitude: this.amplitude,
        envelope: this.envelope,
        releaseEnvelope: this.releaseEnvelope
      }
    }

    set audioCtx (newAudioCtx) {
      this._audioCtx = newAudioCtx;
      return this;
    }

    get audioCtx () {
      return this._audioCtx;
    }

    set frequency (newFreq) {
      this._overtoneNode.oscillator.frequency.value = newFreq;
      this._frequency = newFreq;
    }

    get frequency () {
      return this._frequency;
    }

    set pan (newPan) {
      this._pan = newPan;
      this._overtoneNode.panner.pan.value = newPan;
      return this;
    }

    get pan () {
      return this._pan;
    }

    set amplitude (newAmp) {
      this._amplitude = newAmp;
      this._overtoneNode.amplitude.gain.value = this._amplitude;
      return this;
    }

    get amplitude () {
      return this._amplitude;
    }

    set envelope (newEnv) {
      this._envelope = newEnv;
      return this;
    }

    get envelope () {
      return this._envelope;
    }

    set releaseEnvelope (newEnv) {
      this._releaseEnvelope = newEnv;
      return this;
    }

    get releaseEnvelope () {
      return this._releaseEnvelope;
    }


    /* --- audio setup methods --- */
    createOvertoneNode () {
      // create a new oscillator, gain, and panner
      var newOscillator = this._audioCtx.createOscillator();
      var newAmplitude = this._audioCtx.createGain();
      var newPanner = this._audioCtx.createStereoPanner();
      var newGain = this._audioCtx.createGain();

      // connect oscillator --> harmonicGain --> gain --> panner --> this.output
      newOscillator.connect(newAmplitude);
      newAmplitude.connect(newPanner);
      newPanner.connect(newGain);

      newAmplitude.gain.value = this._amplitude;
      newPanner.pan.value = this._pan;
      newGain.gain.value = 0;

      newOscillator.start();

      var overtoneNode = {
          oscillator: newOscillator,
          amplitude: newAmplitude,
          panner: newPanner,
          output: newGain
      };

      return overtoneNode;
    }

    connect (destination) {
      this._output.connect(destination);
    }


    /* --- playback control methods --- */
    play () {
      var envelope = this.envelope;
      var startTime = this.audioCtx.currentTime;
      var envelopeLength = envelope.length;

      this._overtoneNode.output.gain.setValueAtTime(1, startTime);

      this._overtoneNode
          .output
          .gain
          .setValueAtTime(0, startTime);

      this._overtoneNode
          .output
          .gain
          .linearRampToValueAtTime(envelope[0][1],
                                   startTime + envelope[0][0]);

      for (var i = 0; i < envelopeLength; i++) {
        this._overtoneNode
            .output
            .gain
            .setValueAtTime(envelope[i][1],
                            startTime + envelope[i][0]);
        if (i < envelopeLength - 1) {
            this._overtoneNode
                .output
                .gain
                .linearRampToValueAtTime(envelope[i + 1][1],
                                         startTime + envelope[i + 1][0]);
        }
      }
    }

    release () {
      var envelope = this.releaseEnvelope;
      var startTime = this.audioCtx.currentTime;
      var envelopeLength = envelope.length;

      for (var i = 0; i < envelopeLength; i++) {
        this._overtoneNode
            .output
            .gain
            .setValueAtTime(envelope[i][1],
                            startTime + envelope[i][0]);
        if (i < envelopeLength - 1) {
            this._overtoneNode
                .output
                .gain
                .linearRampToValueAtTime(envelope[i + 1][1],
                                         startTime + envelope[i + 1][0]);
        }
      }
    }

    generateADSR (a, d, s, r) {
      a = a || 0;
      d = d || 0;
      s = s || 1;
      r = r || 0;

      this.envelope = [[a, 1], [d + a, s]];
      this.releaseEnvelope = [[0, s], [r, 0]];
    }
  }

  return Overtone;
});
