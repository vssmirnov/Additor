/* ============================================================================================= */
/* ENVELOPE TEST
/* ============================================================================================= */

import AudioModuleManager from "audio_modules/core/audio-module-manager";
import AudioModule from "audio_modules/core/audio-module";
import StereoPannerShim from "audio_modules/stereo-panner-shim";
import ChannelStrip from "audio_modules/channel-strip";
import Dial from "ui/dial";
import Slider from "ui/slider";

const AMM = new AudioModuleManager(new AudioContext());

let osc = AMM.createOscillator();
let envelope = AMM.createEnvelope();
let gain = AMM.createGain();

osc.connect(envelope);
envelope.connect(gain);
gain.connect(AMM.destination);

osc.frequency.value = 220;
gain.gain.value = 0;
osc.start();

const attackBtn = document.querySelector("#attack-button");
const releaseBtn = document.querySelector("#release-button");
const audioToggle = document.querySelector("#audio-toggle");

audioToggle.addEventListener("change", ev => {
  gain.gain.value = ev.target.checked ? 0.5 : 0;
});

attackBtn.addEventListener("click", ev => {
  envelope.attack();
});

releaseBtn.addEventListener("click", ev => {
  envelope.release();
});



