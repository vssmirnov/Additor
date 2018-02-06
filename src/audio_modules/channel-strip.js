import AudioModule from "audio_modules/core/audio-module";
import verifyAudioContextFeatures from "audio_modules/core/verify-audio-context-features";

/**
 * Class representing a Channel Strip.
 * A Channel Strip is a processing component similar to a channel strip found on a mixing board.
 * It facilitates control over input gain, output gain, and pan of a signal.
 * @class
 */
class ChannelStrip extends AudioModule {

  /**
   * @constructor
   * @param {AudioContext} audioCtx 
   */
  constructor(audioCtx, o) {
    super(audioCtx);
  }

  /* ============================================================================================= */
  /*  INITIALIZATION METHODS
  /* ============================================================================================= */
  
  /**
   * Initialize audio components and their connections.
   * @private @override
   */
  _initAudioComponents() {
    const _this = this;

    try {
      verifyAudioContextFeatures(_this.audioCtx, ["Gain", "StereoPanner"]);

      this.audioComponents = {
        inputGain: _this.input,
        panner: _this.audioCtx.createStereoPanner(),
        outputGain: _this.output
      };

      this.audioComponents.inputGain.connect(this.audioComponents.panner);
      this.audioComponents.panner.connect(this.audioComponents.outputGain);
    
    } catch(err) {
      console.error(err);
    }
  }

  /**
   * Initialize and expose Audio Params.
   * @private @override
   */
  _initAudioParams() {
    this.inputGain = this.audioComponents.inputGain.gain;
    this.outputGain = this.audioComponents.outputGain.gain;
    this.pan = this.audioComponents.panner.pan;
  }
  
  /* ============================================================================================= */
  /*  GETTERS AND SETTERS
  /* ============================================================================================= */ 
  
  /**
   * Get input gain value.
   * @returns {number} - Input gain value.
   */
  getInputGain() {
    return this.audioComponents.inputGain.gain.value;
  }

  /**
   * Set input gain value.
   * @param {number} newVal - The new input gain value.
   */
  setInputGain(newVal) {
    this.audioComponents.inputGain.gain.value = newVal;
  }

  /**
   * Get pan value.
   * @returns {number} - Pan value.
   */
  getPan() {
    return this.audioComponents.panner.pan.value;
  }

  /**
   * Set pan value.
   * @param {number} newVal - The new pan value.
   */
  setPan(newVal) {
    this.audioComponents.panner.pan.value = newVal;
  }

  /**
   * Get output gain value.
   * @returns {number} - Output gain value.
   */
  getOutputGain() {
    return this.audioComponents.outputGain.gain.value;
  }

  /**
   * Set output gain value.
   * @param {number} newVal - The new output gain value.
   */
  setOutputGain(newVal) {
    this.audioComponents.outputGain.gain.value = newVal;
  }
}

export default ChannelStrip;