/* ------------------------------ */
/* --- Main output controller --- */
/* ------------------------------ */

import Slider from '../widgets/Slider';
import Dial from '../widgets/Dial';
import Numberbox from '../widgets/Numberbox';
import Meter from '../widgets/Meter';

'use strict';

const MainOutputCtrl = function MainOutputCtrl(adt) {

    // pan dial
    adt.output.panDial = new Dial({
        container: document.querySelector('#additor .main-output-ctrl .pan-ctrl .dial'),
        value: Math.trunc(adt.output.node.pan * 100),
        minValue: -100,
        maxValue: 100
      })
      .subscribe(this, (val) => {
        adt.output.node.pan = val / 100;

        if (val === 0) {
          adt.output.panNumbox.appendString = ' (C)';
        } else if (val < 0) {
          adt.output.panNumbox.appendString = ' % L';
          adt.output.panNumbox.value = Math.abs(val);
        } else {
          adt.output.panNumbox.appendString = ' % R';
          adt.output.panNumbox.value = Math.abs(val);
        }
    });

    // pan num box
    adt.output.panNumbox = new Numberbox({
        container: document.querySelector('#additor .main-output-ctrl .pan-ctrl .numbox'),
        value: Math.trunc(adt.output.node.pan * 100),
        minValue: -100,
        maxValue: 100,
        appendString: ' (C)'
      })
      .subscribe(this, (val) => {
        adt.output.node.pan = val / 100;
        adt.output.panDial.value = val;
    });

    // volume slider
    adt.output.volumeSlider = new Slider({
        container: document.querySelector('#additor .main-output-ctrl .volume-ctrl .slider'),
        value: adt.output.node.outputGain * 100,
        minValue: 0,
        maxValue: 127
      })
      .subscribe(this, (val) => {
        adt.output.node.outputGain = val / 100;
        adt.output.volumeNumbox.value = ((val / 100) * 24) - 24;
    });

    // volume numbox
    adt.output.volumeNumbox = new Numberbox({
        container: document.querySelector('#additor .main-output-ctrl .volume-ctrl .numbox'),
        value: adt.output.node.outputGain,
        minValue: -24,
        maxValue: 7,
        appendString: ' dB'
      })
      .subscribe(this, (val) => {

    });

    // output meter
    adt.output.meterL = new Meter({
      audioCtx: adt.audioCtx,
      container: document.querySelector('#additor .main-output-ctrl .volume-ctrl .meter:nth-child(1)')
    });
    adt.output.meterR = new Meter({
      audioCtx: adt.audioCtx,
      container: document.querySelector('#additor .main-output-ctrl .volume-ctrl .meter:nth-child(2)')
    });
    adt.output.splitter = adt.audioCtx.createChannelSplitter(2);
    adt.output.node.connect(adt.output.splitter);
    adt.output.splitter.connect(adt.output.meterL.input, 0);
    adt.output.splitter.connect(adt.output.meterR.input, 1);

    return adt.output;
};

export default MainOutputCtrl
