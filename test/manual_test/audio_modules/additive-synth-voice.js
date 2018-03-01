/* ============================================================================================= */
/* ENVELOPE TEST
/* ============================================================================================= */

import AudioModuleManager from "audio_modules/core/audio-module-manager";
import Graph from "ui/graph";
import Dial from "ui/dial";
import Slider from "ui/slider";
import Multislider from "ui/multislider";
import Keyboard from "ui/keyboard";
import Numberbox from "ui/numberbox";

const AMM = new AudioModuleManager(new AudioContext());

let voice = AMM.createAdditiveSynthVoice();
let outputGain = AMM.createGain();

console.log(voice.constructor.name);

voice.connect(outputGain);
outputGain.connect(AMM.destination);

outputGain.gain.value = 0;

const numOvertonesNumberbox = new Numberbox(".additive-synth-voice .num-overtones", {

});

const attackGraph = new Graph(".additive-synth-voice .attack-graph", {
  minXVal: 0, maxXVal: 2, minYVal: 0, maxYVal: 1 
});
attackGraph.setVal(voice.getAttackEnvelope());
attackGraph.addVertex({x: "min", y: 0}, {x: "max", y: 0.8});
attackGraph.addListener(env => {
    releaseGraph.setVertexVal(env[env.length - 1][1], 0);
    voice.setAttackEnvelope(env);
});

const releaseGraph = new Graph(".additive-synth-voice .release-graph", { 
  minXVal: 0, maxXVal: 2, minYVal: 0, maxYVal: 1 
});
releaseGraph.setVal(voice.getReleaseEnvelope());
releaseGraph.addVertex({x: "min", y: 0.8}, {x: "max", y: 0});
releaseGraph.addListener(env => { 
  attackGraph.setVertexVal(env[0][1], attackGraph.getNumVertices() -1);
  voice.setReleaseEnvelope(env);
});

const multislider = new Multislider(".additive-synth-voice .multislider", {
});
multislider.addListener(arr => voice.setOvertoneGains(arr));

const panDial = new Dial(".additive-synth-voice .pan-dial", {
  minVal: -1, maxVal: 1, step: 0.01
});
panDial.addListener(val => voice.setPan(val));

const keyboard = new Keyboard(".additive-synth-voice .keyboard", {
  maxPolyphony: 1
});
keyboard.addListener(note => { voice.playNote(note.pitch, note.vel) });

const audioToggle = document.querySelector(".additive-synth-voice .audio-toggle");

audioToggle.addEventListener("change", ev => {
  outputGain.gain.value = ev.target.checked ? 0.5 : 0;
});

const gainSlider = new Slider(".additive-synth-voice .input-gain");
gainSlider.setVal(voice.getGain() * 127);
gainSlider.addListener(val => { voice.setGain(val / 127) });
