import DropMenu from '../widgets/DropMenu';
import Dial from '../widgets/Dial';
import Numberbox from '../widgets/Numberbox';

'use strict';

const FilterCtrl = function FilterCtrl(dependencies) {
    const FILTER_AUDIO_MODULE = dependencies["filter-audio-module"];

    // create empty placeholder objects for each element
    let filterCtrl = {
      typeDropMenu: {},
      freqDial: {},
      freqNumbox: {},
      qDial: {},
      qNumbox: {},
      gainDial: {},
      gainNumbox: {}
    };

    // filter type menu
    filterCtrl.typeDropMenu = new DropMenu({
        container: dependencies["type-drop-menu-container"],
        menuItems: ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass']
      })
      .subscribe(this, (selection) => {
        FILTER_AUDIO_MODULE.type = filterCtrl.typeDropMenu.menuItems[selection];
    });

    // filter frequency dial
    filterCtrl.freqDial = new Dial({
      container: dependencies["freq-dial-container"],
      minValue: 0,
      maxValue: 20000
      })
      .subscribe(this, (freqDialVal) => {
        FILTER_AUDIO_MODULE.frequency.value = freqDialVal;
        filterCtrl.freqNumbox.value = FILTER_AUDIO_MODULE.frequency.value;
    });

    // filter frequency number box
    filterCtrl.freqNumbox = new Numberbox({
        container: dependencies["freq-numbox-container"],
        value: FILTER_AUDIO_MODULE.frequency.value,
        appendString: ' Hz',
        minValue: 0,
        maxValue: 20000
      })
      .subscribe(this, (freqNumboxVal) => {
        FILTER_AUDIO_MODULE.frequency.value = freqNumboxVal;
        filterCtrl.freqDial.value = FILTER_AUDIO_MODULE.frequency.value;
    });

    // filter Q dial
    filterCtrl.qDial = new Dial({
        container: dependencies["q-dial-container"],
        value: FILTER_AUDIO_MODULE.Q.value,
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (qDialVal) => {
        FILTER_AUDIO_MODULE.Q.value = qDialVal;
        filterCtrl.qNumbox.value = FILTER_AUDIO_MODULE.Q.value;
    });

    // filter Q number box
    filterCtrl.qNumbox = new Numberbox({
        container: dependencies["q-numbox-container"],
        value: FILTER_AUDIO_MODULE.Q.value,
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (qNumboxVal) => {
        FILTER_AUDIO_MODULE.Q.value = qNumboxVal;
        filterCtrl.qDial.value = FILTER_AUDIO_MODULE.Q.value;
    });

    // filter gain dial
    filterCtrl.gainDial = new Dial({
        container: dependencies["gain-dial-container"],
        value: FILTER_AUDIO_MODULE.gain.value,
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (val) => {
        FILTER_AUDIO_MODULE.gain.value = val / 100;
        filterCtrl.gainNumbox.value = val;
    });

    // filter gain numberbox
    filterCtrl.gainNumbox = new Numberbox({
        container: dependencies["gain-numbox-container"],
        value: FILTER_AUDIO_MODULE.gain.value,
        minValue: 0,
        maxValue: 100,
        appendString: ' %'
      })
      .subscribe(this, (val) => {
        FILTER_AUDIO_MODULE.gain.value = val / 100;
        filterCtrl.gainDial.value = val;
    });

    filterCtrl.updateUI = function () {
      filterCtrl.typeDropMenu.value = filterCtrl.typeDropMenu.menuItems.indexOf(FILTER_AUDIO_MODULE.type);
      filterCtrl.freqDial.value = FILTER_AUDIO_MODULE.frequency.value;
      filterCtrl.freqNumbox.value = FILTER_AUDIO_MODULE.frequency.value;
      filterCtrl.qDial.value = FILTER_AUDIO_MODULE.Q.value;
      filterCtrl.qNumbox.value = FILTER_AUDIO_MODULE.Q.value;
      filterCtrl.gainDial.value = Math.trunc(FILTER_AUDIO_MODULE.gain.value * 100);
      filterCtrl.gainNumbox.value = Math.trunc(FILTER_AUDIO_MODULE.gain.value * 100);
    }

    return filterCtrl;
};


export default FilterCtrl
