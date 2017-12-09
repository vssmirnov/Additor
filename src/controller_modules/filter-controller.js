'use strict';

import Dropmenu from 'ui/dropmenu';
import Dial from 'ui/dial';
import Numberbox from 'ui/numberbox';

/**
 * Controller linking Filter UI with a Filter Audio Module.
 * @param {object} dep - Dependencies.
 * @param {object} dep["filter-audio-module"]
 * @param {object} dep["type-drop-menu-container"]
 * @param {object} dep["freq-dial-container"]
 * @param {object} dep["freq-numbox-container"]
 * @param {object} dep["q-dial-container"]
 * @param {object} dep["q-numbox-container"]
 * @param {object} dep["gain-dial-container"]
 * @param {object} dep["gain-numbox-container"]
 */
const FilterController = function FilterController(dep) {

    const FILTER_AUDIO_MODULE = dep["filter-audio-module"];
    const TYPE_DROP_MENU_CONTAINER = dep["type-drop-menu-container"];
    const FREQ_DIAL_CONTAINER = dep["freq-dial-container"];
    const FREQ_NUMBOX_CONTAINER = dep["freq-numbox-container"];
    const Q_DIAL_CONTAINER = dep["q-dial-container"];
    const Q_NUMBOX_CONTAINER = dep["q-numbox-container"];
    const GAIN_DIAL_CONTAINER = dep["gain-dial-container"];
    const GAIN_NUMBOX_CONTAINER = dep["gain-numbox-container"];

    const _this = this;

    /** 
     * Filter type menu
     */
    this.typeDropMenu = new Dropmenu(TYPE_DROP_MENU_CONTAINER, {
        menuItems: ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass']
    });
    
    /**
     * Filter frequency dial
     */
    this.freqDial = new Dial(FREQ_DIAL_CONTAINER, {
      minValue: 0,
      maxValue: 20000
    });
    
    /**
     * Filter frequency number box
     */
    this.freqNumbox = new Numberbox(FREQ_NUMBOX_CONTAINER, {
      val: FILTER_AUDIO_MODULE.frequency.value,
      appendString: ' Hz',
      minVal: 0,
      maxVal: 20000    
    });

    /**
     * Filter q dial
     */
    this.qDial = new Dial(Q_DIAL_CONTAINER, {
      value: FILTER_AUDIO_MODULE.Q.value,
      minValue: 0,
      maxValue: 100
    });

    /**
     * Filter Q number box
     */ 
    this.qNumbox = new Numberbox(Q_NUMBOX_CONTAINER, {
      value: FILTER_AUDIO_MODULE.Q.value,
      minValue: 0,
      maxValue: 100
    });

    /**
     * Filter gain dial
     */ 
    this.gainDial = new Dial(GAIN_DIAL_CONTAINER, {
      value: FILTER_AUDIO_MODULE.gain.value,
      minValue: 0,
      maxValue: 100
    });

    /**
     * Filter gain numberbox
     */ 
    this.gainNumbox = new Numberbox(GAIN_NUMBOX_CONTAINER, {
      value: FILTER_AUDIO_MODULE.gain.value,
      minValue: 0,
      maxValue: 100,
      appendString: ' %'
    });

    /* ============================================================================================
    *  OBSERVER FUNCTIONS
    */

    this.typeDropMenuObserver = function(selection) {
        FILTER_AUDIO_MODULE.type = _this.typeDropMenu.menuItems[selection];
    }
    this.typeDropMenu.addObserver(this.typeDropMenuObserver);

    this.freqDialObserver = function (freqDialVal) {
        FILTER_AUDIO_MODULE.frequency.value = freqDialVal;
        _this.freqNumbox.setInternalVal(FILTER_AUDIO_MODULE.frequency.value);
    }
    this.freqDial.addObserver(this.freqDialObserver);

    this.freqNumboxObserver = function(freqNumboxVal) {
        FILTER_AUDIO_MODULE.frequency.value = freqNumboxVal;
        _this.freqDial.setInternalVal(FILTER_AUDIO_MODULE.frequency.value);
    }
    this.freqNumbox.addObserver(this.freqNumboxObserver);

    this.qDialObserver = function (qDialVal) {
        FILTER_AUDIO_MODULE.Q.value = qDialVal;
        _this.qNumbox.setInternalVal(FILTER_AUDIO_MODULE.Q.value);
    }
    this.qDial.addObserver(this.qDialObserver);

    this.qNumboxObserver = function (qNumboxVal) {
        FILTER_AUDIO_MODULE.Q.value = qNumboxVal;
        _this.qDial.setInternalVal(FILTER_AUDIO_MODULE.Q.value);
    }
    this.qNumbox.addObserver(this.qNumboxObserver);

    this.gainDialObserver = function(val) {
        FILTER_AUDIO_MODULE.gain.value = val / 100;
        _this.gainNumbox.setInternalVal(val);
    }
    this.gainDial.addObserver(this.gainDialObserver);

    this.gainNumboxObserver = function(val) {
        FILTER_AUDIO_MODULE.gain.value = val / 100;
        _this.gainDial.setInternalVal(val);
    }
    this.addObserver(this.gainNumboxObserver);

    this.updateUI = function () {
      _this.typeDropMenu.setInternalVal(_this.typeDropMenu.menuItems.indexOf(FILTER_AUDIO_MODULE.type));
      _this.freqDial.setInternaVal(FILTER_AUDIO_MODULE.frequency.value);
      _this.freqNumbox.setInternaVal(FILTER_AUDIO_MODULE.frequency.value);
      _this.qDial.setInternaVal(FILTER_AUDIO_MODULE.Q.value);
      _this.qNumbox.setInternaVal(FILTER_AUDIO_MODULE.Q.value);
      _this.gainDial.setInternaVal(Math.trunc(FILTER_AUDIO_MODULE.gain.value * 100));
      _this.gainNumbox.setInternaVal(Math.trunc(FILTER_AUDIO_MODULE.gain.value * 100));
    }
};

export default FilterController;