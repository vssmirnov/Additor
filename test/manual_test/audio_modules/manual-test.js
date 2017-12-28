import AudioModule from "audio_modules/core/audio-module";
import StereoPannerShim from "audio_modules/stereo-panner-shim";

import Dial from "ui/dial";

const AUDIO_CTX = new AudioContext();
const DEST = AUDIO_CTX.destination;

/* ============================================================================================= */
/* STEREO PANNER SHIM TEST
/* ============================================================================================= */

(function() {

  AUDIO_CTX.createStereoPanner = function() { return new StereoPannerShim(AUDIO_CTX); };

  let stereoPanner = AUDIO_CTX.createStereoPanner();
  let oscillator = AUDIO_CTX.createOscillator();
  let gain = AUDIO_CTX.createGain();

  oscillator.connect(stereoPanner);
  stereoPanner.connect(gain);
  gain.connect(DEST);

  gain.gain.value = 0;

  oscillator.frequency.value = 220;
  oscillator.start();

  // pan dial
  var panDial = new Dial(document.getElementById("pan-dial"), {
    minVal: -1,
    maxVal: 1,
    stepInterval: 0.01
  });

  panDial.addObserver(val => {
    stereoPanner.pan.value = val;
  });

  // audio on/off toggle
  document.getElementById("stereo-panner-audio-toggle").addEventListener("change", function(ev) {
    if (ev.target.checked) {
      gain.gain.value = 0.5;
    } else {
      gain.gain.value = 0;
    }
  });

}());


