import AudioModule from './AudioModule';

/**
 * BiquadFilterAudioModule wraps the BiquadFilter AudioNode
 */
class BiquadFilterAudioModule extends AudioModule {
  constructor(audioCtx) {
    super(audioCtx);
  }
}

export default BiquadFilterAudioModule
