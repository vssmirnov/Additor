/* ---------------------------- */
/* --- Filter UI controller --- */
/* ---------------------------- */

import DropMenu from '../widgets/DropMenu';
import Dial from '../widgets/Dial';
import Numberbox from '../widgets/Numberbox';

'use strict';

const FilterCtrl = function FilterCtrl(adt) {

    // filter type menu
    adt.filter.typeDropMenu = new DropMenu({
        container: document.querySelector('#additor .filter-ctrl .type-ctrl .dropMenu'),
        menuItems: ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass']
      })
      .subscribe(this, (selection) => {
        adt.filter.node.type = adt.filter.typeDropMenu.menuItems[selection];
    });

    // filter frequency dial
    adt.filter.freqDial = new Dial({
      container: document.querySelector('#additor .filter-ctrl .freq-ctrl .dial'),
      minValue: 0,
      maxValue: 20000
      })
      .subscribe(this, (freqDialVal) => {
        adt.filter.node.frequency.value = freqDialVal;
        adt.filter.freqNumbox.value = adt.filter.node.frequency.value;
    });

    // filter frequency number box
    adt.filter.freqNumbox = new Numberbox({
        container: document.querySelector('#additor .filter-ctrl .freq-ctrl .numbox'),
        value: adt.filter.node.frequency.value,
        appendString: ' Hz',
        minValue: 0,
        maxValue: 20000
      })
      .subscribe(this, (freqNumboxVal) => {
        adt.filter.node.frequency.value = freqNumboxVal;
        adt.filter.freqDial.value = adt.filter.node.frequency.value;
    });

    // filter Q dial
    adt.filter.qDial = new Dial({
        container: document.querySelector('#additor .filter-ctrl .q-ctrl .dial'),
        value: adt.filter.node.Q.value,
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (qDialVal) => {
        adt.filter.node.Q.value = qDialVal;
        adt.filter.qNumbox.value = adt.filter.node.Q.value;
    });

    // filter Q number box
    adt.filter.qNumbox = new Numberbox({
        container: document.querySelector('#additor .filter-ctrl .q-ctrl .numbox'),
        value: adt.filter.node.Q.value,
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (qNumboxVal) => {
        adt.filter.node.Q.value = qNumboxVal;
        adt.filter.qDial.value = adt.filter.node.Q.value;
    });

    // filter gain dial
    adt.filter.gainDial = new Dial({
        container: document.querySelector('#additor .filter-ctrl .gain-ctrl .dial'),
        value: adt.filter.node.gain.value,
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (val) => {
        adt.filter.node.gain.value = val / 100;
        adt.filter.gainNumbox.value = val;
    });

    // filter gain numberbox
    adt.filter.gainNumbox = new Numberbox({
        container: document.querySelector('#additor .filter-ctrl .gain-ctrl .numbox'),
        value: adt.filter.node.gain.value,
        minValue: 0,
        maxValue: 100,
        appendString: ' %'
      })
      .subscribe(this, (val) => {
        adt.filter.node.gain.value = val / 100;
        adt.filter.gainDial.value = val;
    });

    adt.filter.updateUI = function () {
      adt.filter.typeDropMenu.value = adt.filter.typeDropMenu.menuItems.indexOf(adt.filter.node.type);
      adt.filter.freqDial.value = adt.filter.node.frequency.value;
      adt.filter.freqNumbox.value = adt.filter.node.frequency.value;
      adt.filter.qDial.value = adt.filter.node.Q.value;
      adt.filter.qNumbox.value = adt.filter.node.Q.value;
      adt.filter.gainDial.value = Math.trunc(adt.filter.node.gain.value * 100);
      adt.filter.gainNumbox.value = Math.trunc(adt.filter.node.gain.value * 100);
    }

    return adt.filter;
};


export default FilterCtrl
