'use strict';

import ControllerModule from 'controller_modules/controller-module';
import Dropmenu from 'ui/dropmenu';
import Dial from 'ui/dial';
import Numberbox from 'ui/numberbox';

/**
 * Class representing a controller linking a Filter UI with an Audio Module.
 * @class
 * @implements {ControllerModule}
 */
class FilterController extends ControllerModule {
    
    /**
     * @constructor
     * @param {object} dep - Dependencies.
     * @param {object} dep["filter-audio-module"]
     * @param {object} dep["type-drop-menu-container"]
     * @param {object} dep["freq-dial-container"]
     * @param {object} dep["freq-numbox-container"]
     * @param {object} dep["q-dial-container"]
     * @param {object} dep["q-numbox-container"]
     * @param {object} dep["gain-dial-container"]
     * @param {object} dep["gain-numbox-container"]
     * @param {object} o - Options.
     */
    constructor(dep, o) {
        super();

        const _this = this;

        o = o || {};

        this.FILTER_AUDIO_MODULE = dep["filter-audio-module"];
        this.TYPE_DROP_MENU_CONTAINER = dep["type-drop-menu-container"];
        this.FREQ_DIAL_CONTAINER = dep["freq-dial-container"];
        this.FREQ_NUMBOX_CONTAINER = dep["freq-numbox-container"];
        this.Q_DIAL_CONTAINER = dep["q-dial-container"];
        this.Q_NUMBOX_CONTAINER = dep["q-numbox-container"];
        this.GAIN_DIAL_CONTAINER = dep["gain-dial-container"];
        this.GAIN_NUMBOX_CONTAINER = dep["gain-numbox-container"];
    
        /**
         * UI Elements.
         */
        this.uiElements = {

            /** 
             * Filter type menu
             */
            typeDropmenu: new Dropmenu(_this.TYPE_DROP_MENU_CONTAINER, 
                Object.assign({}, o, {
                    menuItems: ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass']
                })
            ),
            
            /**
             * Filter frequency dial
             */
            freqDial: new Dial(_this.FREQ_DIAL_CONTAINER,
                Object.assign({}, o, {
                    minVal: 0,
                    maxVal: 20000
                })
            ),
            
            /**
             * Filter frequency number box
             */
            freqNumberbox: new Numberbox(_this.FREQ_NUMBOX_CONTAINER,
                Object.assign({}, o, {
                    appendString: ' Hz',
                    minVal: 0,
                    maxVal: 20000
                })
            ),

            /**
             * Filter q dial
             */
            qDial: new Dial(_this.Q_DIAL_CONTAINER,
                Object.assign({}, o, {
                    minVal: 0,
                    maxVal: 100
                })
            ),

            /**
             * Filter Q number box
             */ 
            qNumberbox: new Numberbox(_this.Q_NUMBOX_CONTAINER,
                Object.assign({}, o, {
                    minVal: 0,
                    maxVal: 100
                })
            ),

            /**
             * Filter gain dial
             */ 
            gainDial: new Dial(_this.GAIN_DIAL_CONTAINER,
                Object.assign({}, o, {
                    minVal: 0,
                    maxVal: 100
                })
            ),

            /**
             * Filter gain numberbox
             */ 
            gainNumberbox: new Numberbox(_this.GAIN_NUMBOX_CONTAINER,
                Object.assign({}, o, {
                    minVal: 0,
                    maxVal: 100,
                    appendString: ' %'
                })
            )
        };

        /**
         * Observer functions.
         */
        this.observers = {

            typeDropmenu: function typeDropmenu(selection) {
                _this.FILTER_AUDIO_MODULE.type = _this.uiElements.typeDropmenu.getSelectedItem();
            },
        
            freqDial: function freqDial(freqDialVal) {
                _this.FILTER_AUDIO_MODULE.frequency.value = freqDialVal;
                _this.uiElements.freqNumberbox.setInternalVal(_this.FILTER_AUDIO_MODULE.frequency.value);
            },

            freqNumberbox: function freqNumberbox(freqNumboxVal) {
                _this.FILTER_AUDIO_MODULE.frequency.value = freqNumboxVal;
                _this.uiElements.freqDial.setInternalVal(_this.FILTER_AUDIO_MODULE.frequency.value);
            },
    
            qDial: function qDial(qDialVal) {
                _this.FILTER_AUDIO_MODULE.Q.value = qDialVal;
                _this.uiElements.qNumberbox.setInternalVal(_this.FILTER_AUDIO_MODULE.Q.value);
            },

            qNumberbox: function qNumberbox(qNumboxVal) {
                _this.FILTER_AUDIO_MODULE.Q.value = qNumboxVal;
                _this.uiElements.qDial.setInternalVal(_this.FILTER_AUDIO_MODULE.Q.value);
            },
        
            gainDial: function gainDail(val) {
                _this.FILTER_AUDIO_MODULE.gain.value = val / 100;
                _this.uiElements.gainNumberbox.setInternalVal(val);
            },
        
            gainNumberbox: function gainNumberbox(val) {
                _this.FILTER_AUDIO_MODULE.gain.value = val / 100;
                _this.uiElements.gainDial.setInternalVal(val);
            }
        };

        this._registerObservers();
    }

    updateUI() {     
      this.uiElements.typeDropmenu.setInternalVal(_this.uiElements.typeDropmenu.setSelectedItem(_this.FILTER_AUDIO_MODULE.type));
      this.uiElements.freqDial.setInternaVal(_this.FILTER_AUDIO_MODULE.frequency.value);
      this.uiElements.freqNumbox.setInternaVal(_this.FILTER_AUDIO_MODULE.frequency.value);
      this.uiElements.qDial.setInternaVal(_this.FILTER_AUDIO_MODULE.Q.value);
      this.uiElements.qNumbox.setInternaVal(_this.FILTER_AUDIO_MODULE.Q.value);
      this.uiElements.gainDial.setInternaVal(Math.trunc(_this.FILTER_AUDIO_MODULE.gain.value * 100));
      this.uiElements.gainNumbox.setInternaVal(Math.trunc(_this.FILTER_AUDIO_MODULE.gain.value * 100));
    }
};

export default FilterController;