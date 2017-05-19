import AudioModule from './AudioModule';

'use strict';

/**
 * DestinationAudioModule represents an AudioContext destination
 */
class DestinationAudioModule extends AudioModule {
  constructor (audioCtx) {
    super(audioCtx);
    this.input.connect(this.output);
    this.output.connect(audioCtx.destination);
  }
}

export default DestinationAudioModule
