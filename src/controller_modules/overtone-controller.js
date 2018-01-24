import ControllerModule from "controller_modules/controller-module";
import Multislider from "ui/multislider";

/**
 * Class representing a controller linking an Overtone UI with an Audio Module.
 * @class
 * @implements {ControllerModule}
 */
class OvertoneController extends ControllerModule {
  
    /**
     * @constructor
     * @param {object} dep - Dependencies.
     * @param {object} dep["audio-module"]
     * @param {object} dep["multislider-container]
     * @param {object} o - Options.
     */
    constructor(dep, o) {
        super();

        const _this = this;

        o = o || {};

        this.AUDIO_MODULE = dep["audio-module"];
        this.MULTISLIDER_CONTAINER = dep["multislider-container"];

        this.uiElements = {

            multislider: new Multislider(_this.MULTISLIDER_CONTAINER,
                Object.assign({}, o, {
                    numSliders: _this.AUDIO_MODULE.numOvertones,
                    minValue: 0,
                    maxValue: 1,
                    backgroundColor: '#111',
                })
            )
        };

        this.observers = {

            multislider: function multislider(overtoneAmplitudes) {

                // when the histogram changes, set the synth overtone amplitudes to match
                for (let voiceNum = _this.AUDIO_MODULE.numVoices - 1; voiceNum >= 0; voiceNum--) {
                    overtoneAmplitudes.forEach((amplitude, overtoneNum) => {
                        _this.AUDIO_MODULE.setOvertoneAmplitude(voiceNum, overtoneNum, amplitude);
                    });
                }
            }
        };

        this._registerObservers();
    }
}

export default OvertoneController;