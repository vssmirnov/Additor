/* ============================================================================================= */
/* ENVELOPE TEST
/* ============================================================================================= */

import AudioModuleManager from "audio_modules/core/audio-module-manager";
import Graph from "ui/graph";
import Dial from "ui/dial";
import Slider from "ui/slider";
import Keyboard from "ui/keyboard";

const AMM = new AudioModuleManager(new AudioContext());

let voice = AMM.createOscillatorVoice();
let gain = AMM.createGain();

console.log(voice.constructor.name);

voice.connect(gain);
gain.connect(AMM.destination);

gain.gain.value = 0;

const attackGraph = new Graph(document.querySelector(".oscillator-voice .attack-graph"), {
  minXVal: 0, maxXVal: 2, minYVal: 0, maxYVal: 1 });
attackGraph.addVertex({x: "min", y: 0}, {x: "max", y: 0});
attackGraph.addListener(env => {
  releaseGraph.setVertexVal(env[env.length - 1][1], 0);
  voice.setAttackEnvelope(env);
});

const releaseGraph = new Graph(document.querySelector(".oscillator-voice .release-graph"), {
  minXVal: 0, maxXVal: 2, minYVal: 0, maxYVal: 1 });
releaseGraph.addVertex({x: "min", y: 0}, {x: "max", y: 0});
releaseGraph.addListener(env => { 
  attackGraph.setVertexVal(env[0][1], attackGraph.getNumVertices() -1);
  voice.setReleaseEnvelope(env);
});

const keyboard = new Keyboard(document.querySelector(".oscillator-voice .keyboard"), {
  mode: "monophonic"
});
keyboard.addListener(val => {
  console.log(val);
});

const audioToggle = document.querySelector(".oscillator-voice .audio-toggle");

audioToggle.addEventListener("change", ev => {
  voice.setGain(1);
  voice.attack();
  gain.gain.value = ev.target.checked ? 0.5 : 0;
});
