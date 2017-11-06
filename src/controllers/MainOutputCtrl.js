import Slider from '../widgets/Slider';
import Dial from '../widgets/Dial';
import Numberbox from '../widgets/Numberbox';
import Meter from '../widgets/Meter';

'use strict';

/**
 * Main output controllers
 * @param {object} dependencies
 *  Required Dependencies
 *    Audio Modules:
 *      "output-audio-module"
 *      "audio-context"
 *    DOM References:
 *      "pan-dial-container"
 *      "pan-numbox-container"
 *      "volume-slider-container"
 *      "volume-numbox-container"
 *      "output-meter-l-container"
 *      "output-meter-r-container"
 */
let MainOutputCtrl = function MainOutputCtrl(dependencies) {

    // audio module references
    const AUDIO_CTX = dependencies["audio-context"];
    const OUTPUT_AUDIO_MODULE = dependencies["output-audio-module"];

    // DOM references
    const PAN_DIAL_CONTAINER = dependencies["pan-dial-container"];
    const PAN_NUMBOX_CONTAINER = dependencies["pan-numbox-container"];
    const VOLUME_SLIDER_CONTAINER = dependencies["volume-slider-container"];
    const VOLUME_NUMBOX_CONTAINER = dependencies["volume-numbox-container"];
    const OUTPUT_METER_L_CONTAINER = dependencies["output-meter-l-container"];
    const OUTPUT_METER_R_CONTAINER = dependencies["output-meter-r-container"];

    // placeholder for the controller object components
    let outputCtrl = {
      panDial: {},
      panNumbox: {},
      volumeSlider: {},
      volumeNumbox: {}
    }

    // pan dial
    outputCtrl.panDial = new Dial({
        container: PAN_DIAL_CONTAINER,
        value: Math.trunc(OUTPUT_AUDIO_MODULE.pan * 100),
        minValue: -100,
        maxValue: 100
      })
      .subscribe(this, (val) => {
        OUTPUT_AUDIO_MODULE.pan = val / 100;

        if (val === 0) {
          outputCtrl.panNumbox.appendString = ' (C)';
        } else if (val < 0) {
          outputCtrl.panNumbox.appendString = ' % L';
          outputCtrl.panNumbox.value = Math.abs(val);
        } else {
          outputCtrl.panNumbox.appendString = ' % R';
          outputCtrl.panNumbox.value = Math.abs(val);
        }
    });

    // pan num box
    outputCtrl.panNumbox = new Numberbox({
        container: PAN_NUMBOX_CONTAINER,
        value: Math.trunc(OUTPUT_AUDIO_MODULE.pan * 100),
        minValue: -100,
        maxValue: 100,
        appendString: ' (C)'
      })
      .subscribe(this, (val) => {
        OUTPUT_AUDIO_MODULE.pan = val / 100;
        outputCtrl.panDial.value = val;
    });

    // volume slider
    outputCtrl.volumeSlider = new Slider({
        container: VOLUME_SLIDER_CONTAINER,
        value: OUTPUT_AUDIO_MODULE.outputGain * 100,
        minValue: 0,
        maxValue: 127
      })
      .subscribe(this, (val) => {
        OUTPUT_AUDIO_MODULE.outputGain = val / 100;
        outputCtrl.volumeNumbox.value = ((val / 100) * 24) - 24;
    });

    // volume numbox
    outputCtrl.volumeNumbox = new Numberbox({
        container: VOLUME_NUMBOX_CONTAINER,
        value: OUTPUT_AUDIO_MODULE.outputGain,
        minValue: -24,
        maxValue: 7,
        appendString: ' dB'
      })
      .subscribe(this, (val) => {

    });

    // output meter
    const OUTPUT_METER_L = new Meter({
      audioCtx: AUDIO_CTX,
      container: OUTPUT_METER_L_CONTAINER
    });
    const OUTPUT_METER_R = new Meter({
      audioCtx: AUDIO_CTX,
      container: OUTPUT_METER_R_CONTAINER
    });

    const CHANNEL_SPLITTER = AUDIO_CTX.createChannelSplitter(2);
    OUTPUT_AUDIO_MODULE.connect(CHANNEL_SPLITTER);
    CHANNEL_SPLITTER.connect(OUTPUT_METER_L.input, 0);
    CHANNEL_SPLITTER.connect(OUTPUT_METER_R.input, 1);

    return outputCtrl;
};

export default MainOutputCtrl
