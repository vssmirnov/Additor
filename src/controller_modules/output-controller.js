import ControllerModule from "controller_modules/controller-module";
import Slider from "ui/slider";
import Dial from "ui/dial";
import Numberbox from "ui/numberbox";
import Meter from "ui/meter";

/**
 * Class representing a controller linking an Output UI with an Audio Module.
 * @class
 * @implements {ControllerModule}
 */
class OutputController extends ControllerModule {

  /**
   * @constructor
   * @param {object} dep - Dependencies.
   * @param {object} dep["audio-context"];
   * @param {object} dep["output-audio-module"];
   * @param {object} dep["pan-dial-container"];
   * @param {object} dep["pan-numbox-container"];
   * @param {object} dep["volume-slider-container"];
   * @param {object} dep["volume-numbox-container"];
   * @param {object} dep["output-meter-l-container"];
   * @param {object} dep["output-meter-r-container"];
   * @param {object} o - Options.
   */
  constructor(dep, o) {
    super();

    const _this = this;

    o = o || {};

    this.AUDIO_CTX = dep["audio-context"];
    this.OUTPUT_AUDIO_MODULE = dep["output-audio-module"];
    this.PAN_DIAL_CONTAINER = dep["pan-dial-container"];
    this.PAN_NUMBOX_CONTAINER = dep["pan-numbox-container"];
    this.VOLUME_SLIDER_CONTAINER = dep["volume-slider-container"];
    this.VOLUME_NUMBOX_CONTAINER = dep["volume-numbox-container"];
    this.OUTPUT_METER_L_CONTAINER = dep["output-meter-l-container"];
    this.OUTPUT_METER_R_CONTAINER = dep["output-meter-r-container"];

    this.uiElements = {

      panDial: new Dial(_this.PAN_DIAL_CONTAINER, 
        Object.assign({}, o, {
          minVal: -100,
          maxVal: 100
        })
      ),

      volumeSlider: new Slider(_this.VOLUME_SLIDER_CONTAINER, 
        Object.assign({}, o, {
          minVal: 0,
          maxVal: 127
        })
      ),

      volumeNumbox: new Numberbox(_this.VOLUME_NUMBOX_CONTAINER, 
        Object.assign({}, o, {
          minVal: -24,
          maxVal: 7,
          appendString: ' dB'
        })
      ),

      outputMeterL: new Meter(_this.OUTPUT_METER_L_CONTAINER, _this.AUDIO_CTX),

      outputMeterR: new Meter(_this.OUTPUT_METER_R_CONTAINER, _this.AUDIO_CTX)
    };

    this.observers = {

      panDial: function panDial(val) {
        _this.OUTPUT_AUDIO_MODULE.pan = val / 100;

        if (val === 0) {
          _this.panNumbox.setOptions({ appendString: ' (C)'});
        } else if (val < 0) {
          _this.panNumbox.setOptions({ appendString: ' % L'});
          _this.panNumbox.setInternalVal(Math.abs(val));
        } else {
          _this.panNumbox.setOptions({ appendString: ' % R'});
          _this.panNumbox.setInternalVal(Math.abs(val));
        }
      },

      volumeSlider: function volumeSlider(val) {
        _this.OUTPUT_AUDIO_MODULE.outputGain = val / 100;
        _this.volumeNumbox.setInternalVal(((val / 100) * 24) - 24);
      },

      volumeNumbox: function volumeNumbox(val) {
        _this.OUTPUT_AUDIO_MODULE.outputGain = ((val + 24) / 31);
        _this.volumeSlider.setInternalVal(((val + 24) / 31) * 127);
      }
    };

    this.CHANNEL_SPLITTER = this.AUDIO_CTX.createChannelSplitter(2);
    this.OUTPUT_AUDIO_MODULE.connect(this.CHANNEL_SPLITTER);
    this.CHANNEL_SPLITTER.connect(this.uiElements.outputMeterL.input, 0);
    this.CHANNEL_SPLITTER.connect(this.uiElements.outputMeterR.input, 1);

    this._registerObservers();
  }

  updateUI() {}
}

export default OutputController;