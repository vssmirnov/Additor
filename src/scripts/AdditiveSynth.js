define(function(require){
    'use strict';

    var AdditiveSynthVoice = require('./AdditiveSynthVoice');

    var AdditiveSynth = function AdditiveSynth(o){
        o = o || {};

        // each generator node has a gain and a panner
        // audio path: source -> output -> panner -> connect(destination)
        this.output = window.audioCtx.createGain();
        this.output.gain.value = o.gain || 1;
        this.panner = window.audioCtx.createStereoPanner();
        this.output.connect(this.panner);
        this.panner.connect(o.destination || window.audioCtx.destination);

        this.numberOfVoices = o.numberOfVoices || 1;

        this.voices = [];
        this.voices[0] = {};
        for(var i = 1; i <= this.numberOfVoices; i++) {
            var newAdditiveSynthVoice = new AdditiveSynthVoice(o);
            newAdditiveSynthVoice.connect(this.output);
            this.voices.push(newAdditiveSynthVoice);
        }
    };

    /**
     * TODO: these are placeholders for tests
     */
    AdditiveSynth.prototype.playADSR = function playADSR(o) {
        this.voices[1].playADSR(o);
    };

    /**
     * TODO: these are placeholders for tests
     */
    AdditiveSynth.prototype.releaseADSR = function releaseADSR(o) {
        this.voices[1].releaseADSR(o);
    };

    return AdditiveSynth;
});
