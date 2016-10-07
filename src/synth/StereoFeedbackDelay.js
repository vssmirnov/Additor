define(['require'], function(require) {
  'use strict';

  class StereoFeedbackDelay {

    constructor (o) {
      o = o || {};

      this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

      this._input = this._audioCtx.createGain();
      this._channelSplitter = this._audioCtx.createChannelSplitter(2);
      this._dryMixL = this._audioCtx.createGain();
      this._dryMixR = this._audioCtx.createGain();
      this._wetMixL = this._audioCtx.createGain();
      this._wetMixR = this._audioCtx.createGain();
      this._delayL = this._audioCtx.createDelay();
      this._delayR = this._audioCtx.createDelay();
      this._feedbackL = this._audioCtx.createGain();
      this._feedbackR = this._audioCtx.createGain();
      this._channelMerger = this._audioCtx.createChannelMerger(2);
      this._output = this._audioCtx.createGain();

      this._connectAudioNodes();
      this._setAudioDefaults(o);

      return this;
    }

    _connectAudioNodes () {
      this._input.connect(this._channelSplitter);
      this._channelSplitter.connect(this._dryMixL, 0);
      this._channelSplitter.connect(this._dryMixR, 1);
      this._channelSplitter.connect(this._delayL, 0);
      this._channelSplitter.connect(this._delayR, 1);
      this._delayL.connect(this._feedbackL);
      this._delayR.connect(this._feedbackR);
      this._delayL.connect(this._wetMixL);
      this._delayR.connect(this._wetMixR);
      this._dryMixL.connect(this._channelMerger, 0, 0);
      this._dryMixR.connect(this._channelMerger, 0, 1);
      this._wetMixL.connect(this._channelMerger, 0, 0);
      this._wetMixR.connect(this._channelMerger, 0, 1);
      this._channelMerger.connect(this._output);

      return this;
    }

    _setAudioDefaults (o) {
      o = o || {};

      this._input.gain.value = 1;
      this._delayL.delayTime.value = o.delayTimeL || 0.5;
      this._delayR.delayTime.value = o.delayTimeR || 0.5;
      this._dryMixL.gain.value = o.dryMixL || 1;
      this._dryMixR.gain.value = o.dryMixR || 1;
      this._wetMixL.gain.value = o.wetMixL || 0.2;
      this._wetMixR.gain.value = o.wetMixR || 0.2;
      this._feedbackL.gain.value = o.feedbackL || 0.1;
      this._feedbackR.gain.value = o.feedbackR || 0.1;
      this._output.gain.value = 1;

      return this;
    }

    connect (destination) {
      this._output.connect(destination);
      return this;
    }

    /* =========================== */
    /* --- Getters and setters --- */
    /* =========================== */

    get input () {
      return this._input;
    }
  }

  return StereoFeedbackDelay;
});
