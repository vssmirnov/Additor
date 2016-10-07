define(['require'], function(require) {
  'use strict';

  class StereoFeedbackDelay {

    /**
     * Stereo delay with feedback
     * @param {object} [o] - Options
     * @param {number} [o.delayTimeL]
     * @param {number} [o.delayTimeR]
     * @param {number} [o.feedbackL]
     * @param {number} [o.feedbackR]
     * @param {number} [o.crossfeedL]
     * @param {number} [o.crossfeedR]
     * @param {number} [o.dryMixL]
     * @param {number} [o.dryMixR]
     * @param {number} [o.wetMixL]
     * @param {number} [o.wetMixR]
     */
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
      this._crossfeedL = this._audioCtx.createGain();
      this._crossfeedR = this._audioCtx.createGain();
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
      this._feedbackL.connect(this._delayL);
      this._feedbackR.connect(this._delayR);
      this._delayL.connect(this._crossfeedR);
      this._delayR.connect(this._crossfeedL);
      this._crossfeedL.connect(this._delayL);
      this._crossfeedR.connect(this._delayR);
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
      this._crossfeedL.gain.value = o.crossfeedL || 0;
      this._crossfeedR.gain.value = o.crossfeedR || 0;
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

    /** Delay time left */
    get delayTimeL () {
      return this._delayL.delayTime;
    }
    set delayTimeL (time) {
      this._delayL.delayTime.value = time;
      return this;
    }

    /** Delay time right */
    get delayTimeR () {
      return this._delayR.delayTime;
    }
    set delayTimeR (time) {
      this._delayR.delayTime.value = time;
      return this;
    }

    /** Feedback L */
    get feedbackL () {
      return this._feedbackL.gain;
    }
    set feedbackL (gain) {
      this._feedbackL.gain.value = gain;
      return this;
    }

    /** Feedback R */
    get feedbackR () {
      return this._feedbackR.gain;
    }
    set feedbackR (gain) {
      this._feedbackR.gain.value = gain;
      return this;
    }

    /** Cross-feed L */
    get crossfeedL () {
      return this._crossfeedL.gain;
    }
    set crossfeedL (gain) {
      this._crossfeedL.gain.value = gain;
      return this;
    }

    /** Cross-feed R */
    get crossfeedR () {
      return this._crossfeedR.gain;
    }
    set crossfeedR (gain) {
      this._crossfeedR.gain.value = gain;
      return this;
    }

    /** Dry mix L */
    get dryMixL () {
      return this._dryMixL.gain;
    }
    set dryMixL (gain) {
      this._dryMixL.gain.value = gain;
      return this;
    }

    /** Dry mix R */
    get dryMixR () {
      return this._dryMixR.gain;
    }
    set dryMixR (gain) {
      this._dryMixR.gain.value = gain;
      return this;
    }

    /** Wet mix L */
    get wetMixL () {
      return this._wetMixL.gain;
    }
    set wetMixL (gain) {
      this._wetMixL.gain.value = gain;
      return this;
    }

    /** Wet mix R */
    get wetMixR () {
      return this._wetMixR.gain;
    }
    set wetMixR (gain) {
      this._wetMixR.gain.value = gain;
      return this;
    }
  }

  return StereoFeedbackDelay;
});
