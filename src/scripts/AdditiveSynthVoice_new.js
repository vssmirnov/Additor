define(function(require){
  'use strict';

  var Overtone = require('./Overtone');

  class AdditiveSynthVoice {
    constructor (o) {
      o = o || {};

      this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

      this._pan = o.pan || 0; // -1: hard left, 1: hard right
      this._gain = o.gain || 1;
      this._frequency = o.frequency || 440;

      this._channelStrip = this.createChannelStrip();
      this._output = this._channelStrip.output;

      this._numberOfOvertones = o.numberOfOvertones || 10;
      this._overtonesBank = this.createOvertones();
      this.setOvertoneFrequencies();
    }

    /* --- getters and setters --- */
    set options (o) {
      this.audioCtx = o.audioCtx || this.audioCtx;
      this.gain = o.gain || this.gain;
      this.pan = o.pan || this.pan;
    }

    get options () {
      return {}
    }

    set audioCtx (newAudioCtx) {
      this._audioCtx = newAudioCtx;
      return this;
    }

    get audioCtx () {
      return this._audioCtx;
    }

    set gain (newGain) {
      this._gain = newGain;
      this._channelStrip.output.gain.value = this._gain;
      return this;
    }

    get gain () {
      return this._gain;
    }

    set pan (newPan) {
      this._pan = newPan;
      this._channelStrip.panner.pan.value = this._pan;
      return this;
    }

    get pan () {
      return this._pan;
    }

    set frequency (newFreq) {
      this._frequency = newFreq;
      this.setOvertoneFrequencies();
      return this;
    }

    get frequency () {
      return this._frequency;
    }

    set numberOfOvertones (newNumber) {
      this._numberOfOvertones = newNumber;
      // this._overtones = this.createOvertones();
      return this;
    }

    get numberOfOvertones () {
      return this._numberOfOvertones;
    }

    get channelStrip () {
      return this._channelStrip;
    }

    /* --- audio setup --- */
    createChannelStrip () {
      var newChannelStrip = {};
      var newPanner = this._audioCtx.createStereoPanner();
      var newOutput = this._audioCtx.createGain();

      newPanner.pan.value = this._pan || 0;
      newOutput.gain.value = this._gain || 1;

      newPanner.connect(newOutput);

      newChannelStrip = {
        panner: newPanner,
        output: newOutput
      };

      return newChannelStrip;
    }

    createOvertones () {
      var newOvertonesBank = [];

      for(var i = 0; i < this._numberOfOvertones; i++) {
        var newOvertone = new Overtone({
          audioCtx: this._audioCtx,
          pan: this._pan
        });

        newOvertone.harmonicity = i + 1;
        newOvertone.connect(this.channelStrip.panner);

        newOvertonesBank.push(newOvertone);
      }

      return newOvertonesBank;
    }

    setOvertoneFrequencies () {
      var _this = this;

      this._overtonesBank.forEach(overtone => {
        overtone.frequency = overtone.harmonicity * _this.frequency;
      });
    }

    setOvertoneHarmonicities () {
    }

    setOvertoneAmplitudes () {
    }

    connect (destination) {
      this._output.connect(destination);
      return this;
    }

    /* --- playback controls --- */

    play () {
      this._overtonesBank.forEach(overtone => {
        overtone.play();
      });
    }

    release () {
      this._overtonesBank.forEach(overtone => {
        overtone.release();
      });
    }
  }

  return AdditiveSynthVoice;
});
