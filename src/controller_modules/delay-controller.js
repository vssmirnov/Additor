import ControllerModule from 'controller_modules/controller-module';
import DropMenu from 'ui/dropmenu';
import Dial from 'ui/dial';
import Numberbox from 'ui/numberbox';

'use strict';

/**
 * Class representing a controller linking a Delay UI with an Audio Module.
 * @class
 * @implements {ControllerModule}
 */
class DelayController extends ControllerModule {
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

      this.uiElements = {
        delayTimeLDial: new Dial(_this.DELAY_TIME_L_DIAL_CONTAINER,
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 1000
          })
        ),

        delayTimeLNumbox: new Numberbox(DELAY_TIME_L_NUMBOX_CONTAINER,
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 10000,
            appendString: ' ms'
          })
        ),

        delayTimeRDial: new Dial(DELAY_TIME_R_DIAL_CONTAINER, 
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 1000
          })
        ),

        delayTimeRNumbox: new Numberbox(DELAY_TIME_R_NUMBOX_CONTAINER,
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 10000,
            appendString: ' ms'
          })
        ),

        feedbackLDial: new Dial(FEEDBACK_L_DIAL_CONTAINER, 
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 100
          })
        ),

        feedbackLNumbox: new Numberbox(FEEDBACK_L_NUMBOX_CONTAINER, 
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 100,
            appendString: ' %'
          })
        ),

        feedbackRDial: new Dial(FEEDBACK_R_DIAL_CONTAINER, 
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 100
          })
        ),

        feedbackRNumbox: new Numberbox(FEEDBACK_R_NUMBOX_CONTAINER, 
          Object.assign({}, o, {
            minVal: 0,
            maxVal: 100,
            appendString: ' %'
          })
        ),
      }

      this.observers = {
        delayTimeLDial: function delayTimeLDial(val) {
          _this.DELAY_AUDIO_MODULE.delayTimeL.value = val / 100;
          _this.delayTimeLNumbox.setInternalVal(val * 10);
        },

        delayTimeLNumbox: function delayTimeLNumbox(val) {
          _this.DELAY_AUDIO_MODULE.delayTimeL.value = val / 1000;
          _this.delayTimeLDial.setInternalVal(val / 10);
        },

        delayTimeRDial: function delayTimeRDial(val) {
          _this.DELAY_AUDIO_MODULE.delayTimeR.value = val / 100;
          _this.delayTimeRNumbox.setInternalVal(val * 10);
        },

        delayTimeRNumbox: function delayTimeRNumbox(val) {
          _this.DELAY_AUDIO_MODULE.delayTimeR.value = val / 1000;
          _this.delayTimeRDial.setInternalVal(val / 10);
        },

        feedbackLDial: function feedbackLDial(val) {
          _this.DELAY_AUDIO_MODULE.feedbackL.value = val / 100;
          _this.feedbackLNumbox.setInternalVal(val);
        },
        
        feedbackLNumbox: function feedbackLNumbox(val) {
          _this.DELAY_AUDIO_MODULE.feedbackL.value = val / 100;
          _this.feedbackLDial.setInternalVal(val);
        },

        feedbackRDial: function feedbackRDial(val) {
          _this.DELAY_AUDIO_MODULE.feedbackR.value = val / 100;
          _this.feedbackLNumbox.setInternalVal(val);
        },
        
        feedbackRNumbox: function feedbackRNumbox(val) {
          _this.DELAY_AUDIO_MODULE.feedbackR.value = val / 100;
          _this.feedbackRDial.setInternalVal(val);
        }
      }
    }

}

/**
 * Controller linking delay audio module with delay UI
 * @param {object} dependencies -
 *       Required dependencies:
 *         Audio Module:
 *          "delay-audio-module"
 *         DOM Containers:
 *          "delay-time-L-dial-container",
 *          "delay-time-L-numbox-container",
 *          "delay-time-R-dial-container",
 *          "delay-time-R-numbox-container",
 *          "feedback-L-dial-container",
 *          "feedback-L-numbox-container",
 *          "feedback-R-dial-container",
 *          "feedback-R-numbox-container",
 *          "dry-mix-L-dial-container",
 *          "dry-mix-L-numbox-container",
 *          "dry-mix-R-dial-container",
 *          "dry-mix-R-numbox-container",
 *          "wet-mix-L-dial-container",
 *          "wet-mix-L-numbox-container",
 *          "wet-mix-R-dial-container",
 *          "wet-mix-R-numbox-container",
 */
let DelayCtrl = function DelayCtrl(dependencies) {
    const DELAY_AUDIO_MODULE = dependencies["delay-audio-module"];

    // create empty placeholder objects for each element
    let delayCtrl = {
      delayTimeLDial: {},
      delayTimeLNumbox: {},
      delayTimeRDial: {},
      delayTimeRNumbox: {},
      feedbackLDial: {},
      feedbackLNumbox: {},
      feedbackRDial: {},
      feedbackRNumbox: {},
      dryMixLDial: {},
      dryMixLNumbox: {},
      dryMixRDial: {},
      dryMixRNumbox: {},
      wetMixLDial: {},
      wetMixLNumbox: {},
      wetMixRDial: {},
      wetMixRNumbox: {}
    };

    // initialize each element
    delayCtrl.delayTimeLDial = new Dial({
        container: dependencies["delay-time-L-dial-container"],
        value: Math.trunc(DELAY_AUDIO_MODULE.delayTimeL.value * 10),
        minValue: 0,
        maxValue: 1000
      })
      .subscribe(this, (val) => {
        DELAY_AUDIO_MODULE.delayTimeL.value = val / 100;
        delayCtrl.delayTimeLNumbox.value = val * 10;
    });

    delayCtrl.delayTimeLNumbox = new Numberbox({
        container: dependencies["delay-time-L-numbox-container"],
        value: DELAY_AUDIO_MODULE.delayTimeL.value,
        minValue: 0,
        maxValue: 10000,
        appendString: ' ms'
      })
      .subscribe(this, (val) => {
        DELAY_AUDIO_MODULE.delayTimeL.value = val / 1000;
        delayCtrl.delayTimeLDial.value = val / 10;
    });

    delayCtrl.delayTimeRDial = new Dial({
        container: dependencies["delay-time-R-dial-container"],
        value: DELAY_AUDIO_MODULE.delayTimeR.value,
        minValue: 0,
        maxValue: 1000
      })
      .subscribe(this, (val) => {
        DELAY_AUDIO_MODULE.delayTimeR.value = val / 100;
        delayCtrl.delayTimeRNumbox.value = val * 10;
    });

    delayCtrl.delayTimeRNumbox = new Numberbox({
        container: dependencies["delay-time-R-numbox-container"],
        value: DELAY_AUDIO_MODULE.delayTimeR.value,
        minValue: 0,
        maxValue: 10000,
        appendString: ' ms'
      })
      .subscribe(this, (val) => {
        DELAY_AUDIO_MODULE.delayTimeR.value = val / 1000;
        delayCtrl.delayTimeRDial.value = val / 10;
    });

    delayCtrl.feedbackLDial = new Dial({
        container: dependencies["feedback-L-dial-container"],
        value: Math.trunc(DELAY_AUDIO_MODULE.feedbackL.value * 100),
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (val) => {
        DELAY_AUDIO_MODULE.feedbackL.value = val / 100;
        delayCtrl.feedbackLNumbox.value = val;
    });

    delayCtrl.feedbackLNumbox = new Numberbox({
        container: dependencies["feedback-L-numbox-container"],
        value: Math.trunc(DELAY_AUDIO_MODULE.feedbackL.value * 100),
        minValue: 0,
        maxValue: 100,
        appendString: ' %'
      })
      .subscribe(this, (val) => {
        DELAY_AUDIO_MODULE.feedbackL.value = val / 100;
        delayCtrl.feedbackLDial.value = val;
    });

    delayCtrl.feedbackRDial = new Dial({
        container: dependencies["feedback-R-dial-container"],
        value: Math.trunc(DELAY_AUDIO_MODULE.feedbackL.value * 100),
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (val) => {
        DELAY_AUDIO_MODULE.feedbackR.value = val / 100;
        delayCtrl.feedbackRNumbox.value = val;
    });

    delayCtrl.feedbackRNumbox = new Numberbox({
        container: dependencies["feedback-R-numbox-container"],
        value: Math.trunc(DELAY_AUDIO_MODULE.feedbackL.value * 100),
        minValue: 0,
        maxValue: 100,
        appendString: ' %'
      })
      .subscribe(this, (val) => {
        DELAY_AUDIO_MODULE.feedbackR.value = val;
        delayCtrl.feedbackRDial.value = val;
    });

    delayCtrl.dryMixLDial = new Dial({
        container: dependencies["dry-mix-L-dial-container"],
        value: Math.trunc(DELAY_AUDIO_MODULE.dryMixL.value * 100),
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (val) => {
        DELAY_AUDIO_MODULE.dryMixL.value = val / 100;
        delayCtrl.dryMixLNumbox.value = val;
    });

    delayCtrl.dryMixLNumbox = new Numberbox({
        container: dependencies["dry-mix-L-numbox-container"],
        value: Math.trunc(DELAY_AUDIO_MODULE.dryMixL.value * 100),
        minValue: 0,
        maxValue: 100,
        appendString: ' %'
      })
      .subscribe(this, (val) => {
        DELAY_AUDIO_MODULE.dryMixL.value = val / 100;
        delayCtrl.dryMixLDial.value = val;
    });

    delayCtrl.dryMixRDial = new Dial({
        container: dependencies["dry-mix-R-dial-container"],
        value: Math.trunc(DELAY_AUDIO_MODULE.dryMixR.value * 100),
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (val) => {
        DELAY_AUDIO_MODULE.dryMixR.value = val / 100;
        delayCtrl.dryMixRNumbox.value = val;
    });

    delayCtrl.dryMixRNumbox = new Numberbox({
        container: dependencies["dry-mix-R-numbox-container"],
        value: Math.trunc(DELAY_AUDIO_MODULE.dryMixR.value * 100),
        minValue: 0,
        maxValue: 100,
        appendString: ' %'
      })
      .subscribe(this, (val) => {
        DELAY_AUDIO_MODULE.dryMixR.value = val / 100;
        delayCtrl.dryMixRDial.value = val;
    });


    delayCtrl.wetMixLDial = new Dial({
        container: dependencies["wet-mix-L-dial-container"],
        value: Math.trunc(DELAY_AUDIO_MODULE.wetMixL.value * 100),
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (val) => {
        DELAY_AUDIO_MODULE.wetMixL.value = val / 100;
        delayCtrl.wetMixLNumbox.value = val;
    });

    delayCtrl.wetMixLNumbox = new Numberbox({
        container: dependencies["wet-mix-L-numbox-container"],
        value: Math.trunc(DELAY_AUDIO_MODULE.wetMixL.value * 100),
        minValue: 0,
        maxValue: 100,
        appendString: ' %'
      })
      .subscribe(this, (val) => {
        DELAY_AUDIO_MODULE.wetMixL.value = val / 100;
        delayCtrl.wetMixLDial.value = val;
    });

    delayCtrl.wetMixRDial = new Dial({
        container: dependencies["wet-mix-R-dial-container"],
        value: Math.trunc(DELAY_AUDIO_MODULE.wetMixR.value * 100),
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (val) => {
        DELAY_AUDIO_MODULE.wetMixR.value = val / 100;
        delayCtrl.wetMixRNumbox.value = val;
    });

    delayCtrl.wetMixRNumbox = new Numberbox({
      container: dependencies["wet-mix-R-numbox-container"],
      value: Math.trunc(DELAY_AUDIO_MODULE.wetMixR.value * 100),
      minValue: 0,
      maxValue: 100,
      appendString: ' %'
      })
      .subscribe(this, (val) => {
        DELAY_AUDIO_MODULE.wetMixR.value = val / 100;
        delayCtrl.wetMixRDial.value = val;
    });

    delayCtrl.updateUI = function () {
      delayCtrl.delayTimeLDial.value = Math.trunc(DELAY_AUDIO_MODULE.delayTimeL.value * 100);
      delayCtrl.delayTimeLNumbox.value = Math.trunc(DELAY_AUDIO_MODULE.delayTimeL.value * 1000);
      delayCtrl.delayTimeRDial.value = Math.trunc(DELAY_AUDIO_MODULE.delayTimeR.value * 100);
      delayCtrl.delayTimeRNumbox.value = Math.trunc(DELAY_AUDIO_MODULE.delayTimeR.value * 1000);
      delayCtrl.feedbackLDial.value = Math.trunc(DELAY_AUDIO_MODULE.feedbackL.value * 100);
      delayCtrl.feedbackLNumbox.value = Math.trunc(DELAY_AUDIO_MODULE.feedbackL.value * 100);
      delayCtrl.feedbackRDial.value = Math.trunc(DELAY_AUDIO_MODULE.feedbackR.value * 100);
      delayCtrl.feedbackRNumbox.value = Math.trunc(DELAY_AUDIO_MODULE.feedbackR.value * 100);
      delayCtrl.dryMixLDial.value = Math.trunc(DELAY_AUDIO_MODULE.dryMixL.value * 100);
      delayCtrl.dryMixLNumbox.value = Math.trunc(DELAY_AUDIO_MODULE.dryMixL.value * 100);
      delayCtrl.dryMixRDial.value = Math.trunc(DELAY_AUDIO_MODULE.dryMixR.value * 100);
      delayCtrl.dryMixRNumbox.value = Math.trunc(DELAY_AUDIO_MODULE.dryMixR.value * 100);
      delayCtrl.wetMixLDial.value = Math.trunc(DELAY_AUDIO_MODULE.wetMixL.value * 100);
      delayCtrl.wetMixLNumbox.value = Math.trunc(DELAY_AUDIO_MODULE.wetMixL.value * 100);
      delayCtrl.wetMixRDial.value = Math.trunc(DELAY_AUDIO_MODULE.wetMixR.value * 100);
      delayCtrl.wetMixRNumbox.value = Math.trunc(DELAY_AUDIO_MODULE.wetMixR.value * 100);
    }

    return delayCtrl;
};

export default DelayCtrl
