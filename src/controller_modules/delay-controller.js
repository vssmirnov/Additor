import ControllerModule from 'controller_modules/controller-module';
import DropMenu from 'ui/dropmenu';
import Dial from 'ui/dial';
import Numberbox from 'ui/numberbox';

/**
 * Class representing a controller linking a Delay UI with an Audio Module.
 * @class
 * @implements {ControllerModule}
 */
class DelayController extends ControllerModule {
   
    /**
     * @constructor
     * @param {object} dep - Dependencies.
     * @param {object} dep["delay-audio-module"]
     * @param {object} dep["delay-time-L-dial-container"]
     * @param {object} dep["delay-time-L-numbox-container"]
     * @param {object} dep["delay-time-R-dial-container"]
     * @param {object} dep["delay-time-R-numbox-container"]
     * @param {object} dep["feedback-L-dial-container"]
     * @param {object} dep["feedback-L-numbox-container"]
     * @param {object} dep["feedback-R-dial-container"]
     * @param {object} dep["feedback-R-numbox-container"]
     * @param {object} dep["dry-mix-L-dial-container"]
     * @param {object} dep["dry-mix-L-numbox-container"]
     * @param {object} dep["dry-mix-R-dial-container"]
     * @param {object} dep["dry-mix-R-numbox-container"]
     * @param {object} dep["wet-mix-L-dial-container"]
     * @param {object} dep["wet-mix-L-numbox-container"]
     * @param {object} dep["wet-mix-R-dial-container"]
     * @param {object} dep["wet-mix-R-numbox-container"]
     * @param {object} o - Options.
     */
    constructor(dep, o) {
      super();

      const _this = this;

      o = o || {};

      this.DELAY_AUDIO_MODULE = dep["delay-audio-module"];
      this.DELAY_TIME_L_DIAL_CONTAINER = dep["delay-time-L-dial-container"];
      this.DELAY_TIME_L_NUMBOX_CONTAINER = dep["delay-time-L-numbox-container"];
      this.DELAY_TIME_R_DIAL_CONTAINER = dep["delay-time-R-dial-container"];
      this.DELAY_TIME_R_NUMBOX_CONTAINER = dep["delay-time-R-numbox-container"];
      this.FEEDBACK_L_DIAL_CONTAINER = dep["feedback-L-dial-container"];
      this.FEEDBACK_L_NUMBOX_CONTAINER = dep["feedback-L-numbox-container"];
      this.FEEDBACK_R_DIAL_CONTAINER = dep["feedback-R-dial-container"];
      this.FEEDBACK_R_NUMBOX_CONTAINER = dep["feedback-R-numbox-container"];
      this.DRY_MIX_L_DIAL_CONTAINER = dep["dry-mix-L-dial-container"];
      this.DRY_MIX_L_NUMBOX_CONTAINER = dep["dry-mix-L-numbox-container"];
      this.DRY_MIX_R_DIAL_CONTAINER = dep["dry-mix-R-dial-container"];
      this.DRY_MIX_R_NUMBOX_CONTAINER = dep["dry-mix-R-numbox-container"];
      this.WET_MIX_L_DIAL_CONTAINER = dep["wet-mix-L-dial-container"];
      this.WET_MIX_L_NUMBOX_CONTAINER = dep["wet-mix-L-numbox-container"];
      this.WET_MIX_R_DIAL_CONTAINER = dep["wet-mix-R-dial-container"];
      this.WET_MIX_R_NUMBOX_CONTAINER = dep["wet-mix-R-numbox-container"];

      /**
       * UI Elements.
       */
      this.uiElements = {
        delayTimeLDial: new Dial(_this.DELAY_TIME_L_DIAL_CONTAINER,
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 1000
          })
        ),

        delayTimeLNumbox: new Numberbox(_this.DELAY_TIME_L_NUMBOX_CONTAINER,
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 10000,
            appendString: ' ms'
          })
        ),

        delayTimeRDial: new Dial(_this.DELAY_TIME_R_DIAL_CONTAINER, 
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 1000
          })
        ),

        delayTimeRNumbox: new Numberbox(_this.DELAY_TIME_R_NUMBOX_CONTAINER,
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 10000,
            appendString: ' ms'
          })
        ),

        feedbackLDial: new Dial(_this.FEEDBACK_L_DIAL_CONTAINER, 
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 100
          })
        ),

        feedbackLNumbox: new Numberbox(_this.FEEDBACK_L_NUMBOX_CONTAINER, 
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 100,
            appendString: ' %'
          })
        ),

        feedbackRDial: new Dial(_this.FEEDBACK_R_DIAL_CONTAINER, 
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 100
          })
        ),

        feedbackRNumbox: new Numberbox(_this.FEEDBACK_R_NUMBOX_CONTAINER, 
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 100,
            appendString: ' %'
          })
        ),

        dryMixLDial: new Dial(_this.DRY_MIX_L_DIAL_CONTAINER,
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 100
          })
        ),

        dryMixLNumbox: new Numberbox(_this.DRY_MIX_L_NUMBOX_CONTAINER,
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 100,
            appendString: ' %'
          })
        ),

        dryMixRDial: new Dial(_this.DRY_MIX_R_DIAL_CONTAINER,
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 100
          })
        ),

        dryMixRNumbox: new Numberbox(_this.DRY_MIX_R_NUMBOX_CONTAINER,
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 100,
            appendString: ' %'
          })
        ),

        wetMixLDial: new Dial(_this.WET_MIX_L_DIAL_CONTAINER,
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 100
          })
        ),

        wetMixLNumbox: new Numberbox(_this.WET_MIX_L_NUMBOX_CONTAINER,
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 100,
            appendString: ' %'
          })
        ),

        wetMixRDial: new Dial(_this.WET_MIX_R_DIAL_CONTAINER,
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 100
          })
        ),

        wetMixRNumbox: new Numberbox(_this.WET_MIX_R_NUMBOX_CONTAINER,
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 100,
            appendString: ' %'
          })
        ),
      }

      /**
       * Observer functions.
       */
      this.observers = {
        delayTimeLDial: function delayTimeLDial(val) {
          _this.DELAY_AUDIO_MODULE.delayTimeL.value = val / 100;
          _this.uiElements.delayTimeLNumbox.setInternalVal(val * 10);
        },

        delayTimeLNumbox: function delayTimeLNumbox(val) {
          _this.DELAY_AUDIO_MODULE.delayTimeL.value = val / 1000;
          _this.uiElements.delayTimeLDial.setInternalVal(val / 10);
        },

        delayTimeRDial: function delayTimeRDial(val) {
          _this.DELAY_AUDIO_MODULE.delayTimeR.value = val / 100;
          _this.uiElements.delayTimeRNumbox.setInternalVal(val * 10);
        },

        delayTimeRNumbox: function delayTimeRNumbox(val) {
          _this.DELAY_AUDIO_MODULE.delayTimeR.value = val / 1000;
          _this.uiElements.delayTimeRDial.setInternalVal(val / 10);
        },

        feedbackLDial: function feedbackLDial(val) {
          _this.DELAY_AUDIO_MODULE.feedbackL.value = val / 100;
          _this.uiElements.feedbackLNumbox.setInternalVal(val);
        },
        
        feedbackLNumbox: function feedbackLNumbox(val) {
          _this.DELAY_AUDIO_MODULE.feedbackL.value = val / 100;
          _this.uiElements.feedbackLDial.setInternalVal(val);
        },

        feedbackRDial: function feedbackRDial(val) {
          _this.DELAY_AUDIO_MODULE.feedbackR.value = val / 100;
          _this.uiElements.feedbackLNumbox.setInternalVal(val);
        },
        
        feedbackRNumbox: function feedbackRNumbox(val) {
          _this.DELAY_AUDIO_MODULE.feedbackR.value = val / 100;
          _this.uiElements.feedbackRDial.setInternalVal(val);
        },

        dryMixLDial: function dryMixLDial(val) {
          _this.DELAY_AUDIO_MODULE.dryMixL.value = val / 100;
          _this.uiElements.dryMixLNumbox.setInternalVal(val);
        },

        dryMixLNumbox: function dryMixLNumbox(val) {
          _this.DELAY_AUDIO_MODULE.dryMixL.value = val / 100;
          _this.uiElements.dryMixLDial.setInternalVal(val);
        },

        dryMixRDial: function dryMixRDial(val) {
          _this.DELAY_AUDIO_MODULE.dryMixR.value = val / 100;
          _this.uiElements.dryMixLNumbox.setInternalVal(val);
        },

        dryMixRNumbox: function dryMixLNumbox(val) {
          _this.DELAY_AUDIO_MODULE.dryMixR.value = val / 100;
          _this.uiElements.dryMixRDial.setInternalVal(val);
        },

        wetMixLDial: function wetMixLDial(val) {
          _this.DELAY_AUDIO_MODULE.wetMixL.value = val / 100;
          _this.uiElements.wetMixLNumbox.setInternalVal(val);
        },

        wetMixLNumbox: function wetMixLNumbox(val) {
          _this.DELAY_AUDIO_MODULE.wetMixL.value = val / 100;
          _this.uiElements.wetMixLDial.setInternalVal(val);
        },

        wetMixRDial: function wetMixRDial(val) {
          _this.DELAY_AUDIO_MODULE.wetMixR.value = val / 100;
          _this.uiElements.wetMixLNumbox.setInternalVal(val);
        },

        wetMixRNumbox: function wetMixLNumbox(val) {
          _this.DELAY_AUDIO_MODULE.wetMixR.value = val / 100;
          _this.uiElements.wetMixRDial.setInternalVal(val);
        }
      }

      this._registerObservers();
    }

    updateUI() {
      this.uiElements.delayTimeLDial.setInternalVal(Math.trunc(this.DELAY_AUDIO_MODULE.delayTimeL.value * 100));
      this.uiElements.delayTimeLNumbox.setInternalVal(Math.trunc(this.DELAY_AUDIO_MODULE.delayTimeL.value * 1000));
      this.uiElements.delayTimeRDial.setInternalVal(Math.trunc(this.DELAY_AUDIO_MODULE.delayTimeR.value * 100));
      this.uiElements.delayTimeRNumbox.setInternalVal(Math.trunc(this.DELAY_AUDIO_MODULE.delayTimeR.value * 1000));
      this.uiElements.feedbackLDial.setInternalVal(Math.trunc(this.DELAY_AUDIO_MODULE.feedbackL.value * 100));
      this.uiElements.feedbackLNumbox.setInternalVal(Math.trunc(this.DELAY_AUDIO_MODULE.feedbackL.value * 100));
      this.uiElements.feedbackRDial.setInternalVal(Math.trunc(this.DELAY_AUDIO_MODULE.feedbackR.value * 100));
      this.uiElements.feedbackRNumbox.setInternalVal(Math.trunc(this.DELAY_AUDIO_MODULE.feedbackR.value * 100));
      this.uiElements.dryMixLDial.setInternalVal(Math.trunc(this.DELAY_AUDIO_MODULE.dryMixL.value * 100));
      this.uiElements.dryMixLNumbox.setInternalVal(Math.trunc(this.DELAY_AUDIO_MODULE.dryMixL.value * 100));
      this.uiElements.dryMixRDial.setInternalVal(Math.trunc(this.DELAY_AUDIO_MODULE.dryMixR.value * 100));
      this.uiElements.dryMixRNumbox.setInternalVal(Math.trunc(this.DELAY_AUDIO_MODULE.dryMixR.value * 100));
      this.uiElements.wetMixLDial.setInternalVal(Math.trunc(this.DELAY_AUDIO_MODULE.wetMixL.value * 100));
      this.uiElements.wetMixLNumbox.setInternalVal(Math.trunc(this.DELAY_AUDIO_MODULE.wetMixL.value * 100));
      this.uiElements.wetMixRDial.setInternalVal(Math.trunc(this.DELAY_AUDIO_MODULE.wetMixR.value * 100));
      this.uiElements.wetMixRNumbox.setInternalVal(Math.trunc(this.DELAY_AUDIO_MODULE.wetMixR.value * 100));
    }
}

export default DelayController;