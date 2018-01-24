import ControllerModule from "controller_modules/controller-module";
import Dropmenu from "ui/Dropmenu";

/**
 * Class representing a controller linking a Polyphony UI with an Audio Module.
 * @class
 * @implements {ControllerModule}
 */
class PolyphonyController extends ControllerModule {

  /**
   * @constructor
   * @param {object} dep - Dependencies.
   * @param {object} - dep["keyboard"]
   * @param {object} - dep["overtone-multislider"]
   * @param {object} - dep["polyphony-mode-dropmenu"]
   * @param {object} - dep["voices-numbox"]
   * @param {object} - dep["overtones-numbox"]
   * @param {object} o - Options.
   */
  constructor(dep, o) {
    super();
    o = o || {};

    this.AUDIO_MODULE = dep["audio-module"];
    this.KEYBOARD = dep["keyboard"];
    this.OVERTONE_MULTISLIDER = dep["overtone-multislider"]
    this.POLYPHONY_MODE_DROPMENU_CONTAINER = dep["polyphony-mode-dropmenu"];
    this.VOICES_NUMBOX_CONTAINER = dep["voices-numbox"];
    this.OVERTONES_NUMBOX_CONTAINER = dep["overtones-numbox"];

    this.uiElements = {

      polyphonyDropmenu: new Dropmenu(POLYPHONY_MODE_DROPMENU_CONTAINER,
        Object.assign({}, o, {
          menuItems: ['polyphonic', 'monophonic']
        })
      ),

      voicesNumbox: new Numbox(VOICES_NUMBOX_CONTAINER,
        Object.assign({}, o, {
          minVal: 1,
          maxVal: 64
        })
      ),

      overtonesNumbox: new Numbox(OVERTONES_NUMBOX_CONTAINER, 
        Object.assign({}, o, {
          minVal: 1,
          maxVal: 1000
        })
      )
    };

    this.observers = {

      polyphonyDropmenu: function polyphonyDropmenu(menuSelection) {
        if (menuSelection === "monophonic") {
          _this.uiElements.voices 
          _this.AUDIO_MODULE.numberOfVoices = 1;
          _this.KEYBOARD.setOptions({ numVoices: 1});
        } else {

          _this.KEYBOARD.setOptions({ numVoices: })
        }
        
        
      },

      voicesNumbox: function voicesNumbox(val) {
        _this.AUDIO_MODULE.numberOfVoices = val;
      },

      overtonesNumbox: function overtonesNumbox(val) {
        _this.AUDIO_MODULE.numOvertones = val;
        _this
      }
    };
  } 
}

const VoicesCtrl = function VoicesCtrl(adt) {
    let voices = {};

    voices.polyModeMenu = new DropMenu({
        container: document.querySelector('#additor .synth-ctrl .poly-mode-menu'),
        menuItems: ['polyphonic', 'monophonic']
      })
      .subscribe(this, (selectionIndex) => {
        if (selectionIndex === 0) {
          adt.kbd.mode = 'polyphonic';
          adt.synth.node.numberOfV oices = 1;
        } else {
          adt.kbd.mode = 'monophonic';
          adt.synth.node.numberOfVoices = numVoices;
        }
    });

    voices.numVoicesNumbox = document.querySelector('#additor .synth-ctrl #number-of-voices');
    voices.numVoicesNumbox.value = adt.synth.node.numVoices;
    voices.numVoicesNumbox.addEventListener('blur', changeNumVoices);
    voices.numVoicesNumbox.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        changeNumVoices();
      }
    });
    function changeNumVoices () {
      adt.synth.node.numVoices = adt.voices.numVoicesNumbox.value;
    }

    voices.numOtNumbox = document.querySelector('#additor .synth-ctrl #number-of-overtones');
    voices.numOtNumbox.value = adt.synth.node.numOvertones;
    voices.numOtNumbox.addEventListener('blur', changeNumOvertones);
    voices.numOtNumbox.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        changeNumOvertones();
      }
    });
    function changeNumOvertones () {
      adt.synth.node.numOvertones = adt.voices.numOtNumbox.value;
      adt.synth.node.numBins = adt.voices.numOtNumbox.value;
    }

    return voices;
};

export default PolyphonyController;