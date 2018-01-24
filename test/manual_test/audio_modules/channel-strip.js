/* ============================================================================================= */
/* CHANNEL STRIP
/* ============================================================================================= */

import AudioModuleManager from "audio_modules/core/audio-module-manager";
import ChannelStrip from "audio_modules/channel-strip";
import Dial from "ui/dial";
import Slider from "ui/slider";

const AUDIO_CTX = new AudioContext();
const AMM = new AudioModuleManager(new AudioContext());

const channelStrip = AMM.createChannelStrip();
const osc = AMM.createOscillator();
const gain = AMM.createGain();

osc.connect(channelStrip);
channelStrip.connect(gain);
gain.connect(AMM.destination);

gain.gain.value = 0;
osc.frequency.value = 220;
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