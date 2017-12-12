'use strict';

import ControllerModule from "controller_modules/controller-module";
import Keyboard from "ui/keyboard";

/**
 * Class representing a controller linking a Keyboard UI with an Audio Module.
 * @class
 * @implements {ControllerModule}
 */
class KeyboardController extends ControllerModule {
    
    /**
     * @constructor
     * @param {object} dep
     * @param {object} dep["synth-audio-module"]
     * @param {object} dep["keyboard-container"]
     * @param {object} o - Options.
     */
    constructor(dep, o) {
        super();

        const _this = this;

        this.SYNTH_AUDIO_MODULE = dep["synth-audio-module"];
        this.KEYBOARD_CONTAINER = dep["keyboard-container"];
    
        /**
         * UI Elements.
         */
        this.uiElements = {

            keyboard: new Keyboard(this.KEYBOARD_CONTAINER, 
                Object.assign({}, o, {
                    bottomNote: 24,
                    topNote: 84,
                })
            )
        };

        /**
         * Observer functions.
         */
        this.observers = {

            keyboard: function(note) {
                if(note.vel === 0) {
                  _this.SYNTH_AUDIO_MODULE.releaseNote(note.pitch);
                } else {
                  _this.SYNTH_AUDIO_MODULE.playNote(note.pitch);
                }
            }
        };

        this._registerObservers();
    }
}

export default KeyboardController;