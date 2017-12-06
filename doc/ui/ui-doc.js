import WidgetDial from "ui/dial";
import EnvelopeGraph from "ui/graph";
import Keyboard from "ui/keyboard";
import Multislider from "ui/multislider";
import Dropmenu from "ui/dropmenu";
import Slider from "ui/slider";
import Meter from "ui/meter";

/** Dial */
let dialContainer = document.getElementById("dial");
let dialDisplay = dialContainer.nextElementSibling;
let dial = new WidgetDial(dialContainer);
dial.addObserver((state) => {
  dialDisplay.innerHTML = state;
});
dial.setVal(300);

/** Graph */
let envelopeGraphContainer = document.getElementById("graph");
let envelopeGraphDisplay = document.getElementById("graph-display");
let envelopeGraph = new EnvelopeGraph(envelopeGraphContainer);
envelopeGraph.addObserver(function(state) {
  envelopeGraphDisplay.innerHTML = state.map((xyPair) => " [" + xyPair[0] + ", " + xyPair[1] + "]");
});
envelopeGraph.setVal([[0.0, 0.0],[5.3, 65.9],[10.7, 37.3],[16.5, 26.5],[26.0, 37.9],[35.8, 17.2],
  [45.3, 69.2],[49.8, 53.9],[53.3, 27.2],[61.3, 15.9],[69.3, 25.9],[74.7, 39.9],[79.5, 47.9],
  [83.2, 33.9],[86.2, 25.9],[91.0, 19.2],[92.0, 28.5],[93.0, 44.5],[97.3, 81.9],[100.0, 0.0]]
);

/** Keyboard */
let keyboardContainer = document.getElementById("keyboard");
let keyboardDisplay = document.getElementById("keyboard-display");
keyboardContainer.style.backgroundColor = "red";
let keyboard = new Keyboard(keyboardContainer, {
  bottomNote: 36,
  topNote: 83
});
keyboard.addObserver(function(notes) {
  keyboardDisplay.innerHTML = notes.map(note => " [" + note + "]"); 
});
keyboard.setVal({pitch: 60, vel: 100});
keyboard.setVal({pitch: 64, vel: 100});
keyboard.setVal({pitch: 67, vel: 100});


/** Multislider */
let multisliderContainer = document.getElementById("multislider");
let multisliderDisplay = document.getElementById("multislider-display");
let multislider = new Multislider(multisliderContainer, {});
multislider.addObserver(function(sliderVals) {
  multisliderDisplay.innerHTML = sliderVals.map(val => " " + val);
});
multislider.setState({sliderVals: [10, 50, 97, 81, 119, 81, 26, 114, 74, 47]});

/** Slider */
let sliderContainer = document.getElementById("slider");
let sliderDisplay = document.getElementById("slider-display");
let slider = new Slider(sliderContainer, {});
slider.addObserver(function(sliderVal) {
  sliderDisplay.innerHTML = sliderVal;
});
slider.setVal(30);

/** Meter */
let meterContainer = document.getElementById("meter");
let meterDisplay = document.getElementById("meter-display");

let audioCtx = new AudioContext();

let meter = new Meter(meterContainer, audioCtx, {});

let osc = audioCtx.createOscillator();
osc.frequency.value = 220;
let lfo = audioCtx.createOscillator();
let lfo2 = audioCtx.createOscillator();
let amp = audioCtx.createGain();
let amp2 = audioCtx.createGain();

lfo.frequency.value = 0.2;
lfo2.frequency.value = 0.5;
lfo.connect(amp.gain);
lfo2.connect(amp);
amp.connect(amp2.gain);
osc.connect(amp2);
osc.start();
lfo.start();
lfo2.start();
meter.receiveAudioFrom(amp2);

/** Dropmenu */
let dropmenuContainer = document.getElementById("dropmenu");
let dropmenuDisplay = document.getElementById("dropmenu-display");
let dropmenu = new Dropmenu(dropmenuContainer, {});
dropmenu.setMenuItems(["Zero", "One", "Two", "Three", "Four", "Five"]);
dropmenu.addObserver(function(selectedItem) {
  dropmenuDisplay.innerHTML = "Current selection: " + selectedItem;
});
