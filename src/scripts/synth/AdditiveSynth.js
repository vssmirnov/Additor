define(function(require){
    'use strict';

    var AdditiveSynthVoice = require('./AdditiveSynthVoice');

    class AdditiveSynth {
      constructor (o) {
          o = o || {};

          this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

          // each generator node has a gain and a panner
          // audio path: source -> output -> panner -> connect(destination)
          this._output = this._audioCtx.createGain();
          this._output.gain.value = o.gain || 1;
          this._panner = window.audioCtx.createStereoPanner();
          this._output.connect(this.panner);
          this._panner.connect(o.destination || window.audioCtx.destination);

          this._numberOfVoices = o.numberOfVoices || 1;

          this._voices = [];
          this._voices[0] = {};
          for(var i = 1; i <= this.numberOfVoices; i++) {
              var newAdditiveSynthVoice = new AdditiveSynthVoice({
                audioCtx: this._audioCtx;
              });
              newAdditiveSynthVoice.connect(this._output);
              this._voices.push(newAdditiveSynthVoice);
          }
      }

      playADSR (o) {
        this._voices[1].playADSR(o);
      }

      releaseADSR (o) {
        this._voices[1].releaseADSR(o);
      }
    }

    return AdditiveSynth;
});
