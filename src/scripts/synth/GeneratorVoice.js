(function(){
  'use strict';

  class GeneratorVoice {
    constructor (o) {
      o = o || {};

      this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

      this._pan = o.pan || 0; // -1: hard left, 1: hard right
      this._gain = o.gain || 1;

      /**
       * channelStrip = {
       *    panner: stereoPannerNode,
       *    output: gainNode
       * }
       */
      this._channelStrip = this.createChannelStrip();
      this._output = this._channelStrip.output;
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

    get channelStrip () {
      return this._channelStrip;
    }


    /* --- audio setup methods --- */

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

    connect (destination) {
      this._output.connect(destination);
      return this;
    }
  }

  /* --- Module loader and global support --- */

  // support for AMD libraries
  if (typeof define === 'function') {
    define([], function () {
      return GeneratorVoice;
    });
  }

  // support for CommonJS libraries
  else if (typeof exports !== 'undefined') {
    exports.GeneratorVoice = GeneratorVoice;
  }

  // support for window global
  else if (typeof window !== 'undefined') {
    window.GeneratorVoice = GeneratorVoice;
  }

  // support for Node.js global
  else if (typeof global !== 'undefined') {
    global.GeneratorVoice = GeneratorVoice;
  }
})();
