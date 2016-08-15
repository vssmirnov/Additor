define(function (require) {
    'use strict';

    // Create an Audio Context if one does not already exist
    if(!window.audioCtx) {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        window.audioCtx = new AudioContext();
    }

    /**
     * A GeneratorVoice module represents a generic audio generator module
     * @param {Object} o - options
     */
    var GeneratorVoice = function (o) {
        var o = o || {};

        // each generator node has a basic audio channel strip with gain and a panner
        // _source -> _output -> _panner -> connect(destination)
        this.output = window.audioCtx.createGain();
        this.panner = window.audioCtx.createStereoPanner();
        this.output.connect(this.panner);
    };

    /**
     * Connect the output of this voice to a specified destination
     * @param {Object} destination
     */
    GeneratorVoice.prototype.connect = function connect(destination) {
        this.panner.connect(destination);
    }

    /**
     * Get/set the pan for the individual voice
     * @param {Number} pan - -1 is left, 0 is center, 1 is right
     */
    GeneratorVoice.prototype.pan = function pan(pan) {
        if(!pan) {
            return this.panner.pan;
        } else {
            this.panner.pan.value = pan;
            return this;
        }
    }

    return GeneratorVoice;
});
