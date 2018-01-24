import AudioModuleManager from "audio_modules/core/audio-module-manager";
import AudioModule from "audio_modules/core/audio-module";
import StereoPannerShim from "audio_modules/stereo-panner-shim";
import ChannelStrip from "audio_modules/channel-strip";

import Dial from "ui/dial";
import Slider from "ui/slider";

const AUDIO_CTX = new AudioContext();
const DEST = AUDIO_CTX.destination;

// get a different frequency for each test so that you can listen to several tests together
function getOscFreq(testNum) {
  return 55 * (testNum + 3);
}

/* ============================================================================================= */
/* STEREO PANNER SHIM TEST
/* ============================================================================================= */

(function() {

  AUDIO_CTX.createStereoPanner = function() {
    console.log("Creating stereo panner..."); 
    return new StereoPannerShim(AUDIO_CTX); 
  };

  let stereoPanner = AUDIO_CTX.createStereoPanner();
  let oscillator = AUDIO_CTX.createOscillator();
  let gain = AUDIO_CTX.createGain();

  oscillator.connect(stereoPanner);
  stereoPanner.connect(gain);
  gain.connect(DEST);

  gain.gain.value = 0;

  oscillator.frequency.value = getOscFreq(1);
  oscillator.start();

  // pan dial
  var panDial = new Dial(document.getElementById("pan-dial"), {
    minVal: -1,
    maxVal: 1,
    step: 0.01
  });

  panDial.addObserver(val => {
    stereoPanner.pan.value = val;
  });

  // audio on/off toggle
  document.getElementById("stereo-panner-audio-toggle").addEventListener("change", function(ev) {
    gain.gain.value = ev.target.checked ? 0.5 : 0;
  });

})();

/* ============================================================================================= */
/* CHANNEL STRIP TEST
/* ============================================================================================= */

(function() {
  
  let channelStrip = new ChannelStrip(AUDIO_CTX);
  let osc = AUDIO_CTX.createOscillator();
  let gain = AUDIO_CTX.createGain();

  osc.connect(channelStrip);
  channelStrip.connect(gain);
  gain.connect(DEST);

  gain.gain.value = 0;
  osc.frequency.value = getOscFreq(2);
  osc.start();

  document.querySelector(".channel-strip .audio-toggle").addEventListener("change", ev => {
    gain.gain.value = ev.target.checked ? 0.5 : 0;
  });

  // input gain slider
  let inputGainSlider = new Slider(document.querySelector(".channel-strip .input-gain-slider"), {
    minVal: 0,
    maxVal: 1,
    step: 0.01
  });
  inputGainSlider.addObserver(gain => { channelStrip.setInputGain(gain); });

  // pan dial;
  let panDial = new Dial(document.querySelector(".channel-strip .pan-dial"), {
    minVal: -1,
    maxVal: 1,
    step: 0.01
  });
  panDial.addObserver(pan => { channelStrip.setPan(pan); });

  // output gain slider
  let outputGainSlider = new Slider(document.querySelector(".channel-strip .output-gain-slider"), {
    minVal: 0,
    maxVal: 1,
    step: 0.01
  });
  outputGainSlider.addObserver(gain => { channelStrip.setOutputGain(gain); });
})();

/* ============================================================================================= */
/* ENVELOPE TEST
/* ============================================================================================= */

(function() {
  
  let channelStrip = new ChannelStrip(AUDIO_CTX);
  let osc = AUDIO_CTX.createOscillator();
  let gain = AUDIO_CTX.createGain();

  osc.connect(channelStrip);
  channelStrip.connect(gain);
  gain.connect(DEST);

  gain.gain.value = 0;
  osc.frequency.value = getOscFreq(2);
  osc.start();

  document.querySelector(".channel-strip .audio-toggle").addEventListener("change", ev => {
    gain.gain.value = ev.target.checked ? 0.5 : 0;
  });

  // input gain slider
  let inputGainSlider = new Slider(document.querySelector(".channel-strip .input-gain-slider"), {
    minVal: 0,
    maxVal: 1,
    step: 0.01
  });
  inputGainSlider.addObserver(gain => { channelStrip.setInputGain(gain); });

  // pan dial;
  let panDial = new Dial(document.querySelector(".channel-strip .pan-dial"), {
    minVal: -1,
    maxVal: 1,
    step: 0.01
  });
  panDial.addObserver(pan => { channelStrip.setPan(pan); });

  // output gain slider
  let outputGainSlider = new Slider(document.querySelector(".channel-strip .output-gain-slider"), {
    minVal: 0,
    maxVal: 1,
    step: 0.01
  });
  outputGainSlider.addObserver(gain => { channelStrip.setOutputGain(gain); });
})();
