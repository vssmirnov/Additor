import ChannelStrip from './ChannelStrip';
import Envelope from './Envelope';

'use strict';

class Overtone {
  constructor (audioCtx, o) {
    o = o || {};

    this._audioCtx = audioCtx;

    this._oscillator = this._audioCtx.createOscillator();
    this._envelope = new Envelope(this._audioCtx);
    this._channelStrip = new ChannelStrip(this._audioCtx);

    this._oscillator.connect(this._envelope.input);
    this._envelope.connect(this._channelStrip.input);

    this._oscillator.start();

    this.output = this._channelStrip.output;

    // this.frequency = o.frequency || 440;
    // this.pan = o.pan || 1;
    // this.amplitude = o.amplitude || 1;
  }

  /* =========================== */
  /* --- Getters and setters --- */
  /* =========================== */

  /** Oscillator frequency */
  get frequency () {
    return this._oscillator.frequency;
  }
  set frequency (newFreq) {
    var curTime = this._audioCtx.currentTime;
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
   * Connect to another AudioNode or AudioModule
   */
  connect (destination) {
    // if destination has an input property, connect to it (destination is an AudioModule)
    if (typeof destination.input === "object") {
      this.output.connect(destination.input);
    }
    // else destination is an AudioNode and can be connected to directly
    else {
      this.output.connect(destination);
    }
  }

  /**
   * Disconnect from an AudioNode or AudioModule
   */
  disconnect (destination) {
    // if destination has an input property, disconnect from it (destination is an AudioModule)
    if (typeof destination.input === "object") {
      this.output.disconnect(destination.input);
    // else destination is an AudioNode and can be disconnected from directly
    } else {
      this.output.disconnect(destination);
    }
  }

  /* ========================= */
  /* --- Envelope controls --- */
  /* ========================= */

  /** Execute the attack envelope */
  attack () {
    this._envelope.attack();
  }

  /** Execute the release envelope */
  release () {
    this._envelope.release();
  }
}

export default Overtone
