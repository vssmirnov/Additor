import ChannelStrip from './channel-strip';
import Envelope from './Envelope';
import Overtone from './Overtone';

class AdditiveSynthVoice {
  constructor (audioCtx, o) {
    o = o || {};

    this._audioCtx = audioCtx;

    this._channelStrip = new ChannelStrip(this._audioCtx);
    this._envelope = new Envelope(this._audioCtx);

    var numOvertones = o.numOvertones || o.numberOfOvertones || 20;
    this._overtones = [];
    for (var i = 0; i < numOvertones; i++) {
      this._overtones.push(new Overtone(this._audioCtx));
      this._overtones[i].connect(this._envelope.input);
      this._envelope.connect(this._channelStrip.input);
      this._overtones[i].gain = 1 / numOvertones;
    }

    this.output = this._channelStrip.output;
    this._audioModuleOutput = this.output;

    // this.frequency = o.frequency || o.freq || 440;
    // this.pan = o.pan || 0; // -1: hard left, 1: hard right
    // this.gain = o.gain || 1;
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
        this._overtones.push(new Overtone(this._audioCtx));
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
    const _this = this;

    try {
      if (this._overtones[otNum] !== undefined) {
        this._overtones[otNum].amplitude = newAmp;
      } else {
        throw ("Illegal overtone number");
      }
    } catch (e) {
      console.log(e);
    }

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

  /** Attack envelope */
  get attackEnvelope () {
    return this._envelope.attackEnvelope;
  }
  set attackEnvelope (newEnv) {
    this._envelope.attackEnvelope = newEnv;
    return this;
  }
  setAttackEnvelope (newEnv) {
    this.attackEnvelope = newEnv;
  }

  /** Release envelope */
  get releaseEnvelope () {
    return this._envelope.releaseEnvelope;
  }
  set releaseEnvelope (newEnv) {
    this._envelope.releaseEnvelope = newEnv;
    return this;
  }
  setReleaseEnvelope (newEnv) {
    this.releaseEnvelope = newEnv;
  }

  /** Set the attack envelope for an overtone
   *  @param {number} otNum - Number of overtone for which to set envelope
   *  @param {array} newEnv - 2D array representing the new envelope
   */
  setOvertoneAttackEnvelope (otNum, newEnv) {
    this._overtones[otNum].attackEnvelope = newEnv;
    return this;
  }

  /** Set the release envelope for an overtone
   *  @param {number} otNum - Number of overtone for which to set envelope
   *  @param {array} newEnv - 2D array representing the new envelope
   */
  setOvertoneReleaseEnvelope (otNum, newEnv) {
    this._overtones[otNum].releaseEnvelope = newEnv;
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
  release () {
    for (var i = this.numOvertones - 1; i >= 0; i--) {
      this._overtones[i].release();
    }
    this._envelope.release();
  }
}

export default AdditiveSynthVoice
