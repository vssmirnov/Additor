/* ============================================================================================= */
/* ENVELOPE TEST
/* ============================================================================================= */

import AudioModuleManager from "audio_modules/core/audio-module-manager";
import Graph from "ui/graph";

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

const attackGraph = new Graph(document.querySelector("#attack-graph"), {
  minXVal: 0,
  maxXVal: 2,
  minYVal: 0,
  maxYVal: 1,
});
attackGraph.addVertex({x: "min", y: 0}, {x: "max", y: 0});
attackGraph.addListener(env => {
  envelope.setAttackEnvelope(env);
});

const releaseGraph = new Graph(document.querySelector("#release-graph"), {
  minXVal: 0,
  maxXVal: 2,
  minYVal: 0,
  maxYVal: 1,
});
releaseGraph.addVertex({x: "min", y: 0}, {x: "max", y: 0});
releaseGraph.addListener(env => envelope.setReleaseEnvelope(env));

const attackBtn = document.querySelector("#attack-button");
const releaseBtn = document.querySelector("#release-button");
const audioToggle = document.querySelector("#audio-toggle");
const messageBox = document.querySelector(".message");



audioToggle.addEventListener("change", ev => {
  gain.gain.value = ev.target.checked ? 0.5 : 0;
});

attackBtn.addEventListener("click", ev => {
  envelope.attack().then(env => {
    messageBox.innerHTML = "Attack finished, attack env: " + env;
  });
});

releaseBtn.addEventListener("click", ev => {
  envelope.release().then(env => {
    messageBox.innerHTML = "Release finished, release env: " + env;
  });
});



