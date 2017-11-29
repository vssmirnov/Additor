import WidgetDial from "ui/dial";
import EnvelopeGraph from "ui/graph";
import Keyboard from "ui/keyboard";
import Multislider from "ui/multislider";

/** Dial */
let dialContainer = document.getElementById("dial");
let dialDisplay = dialContainer.nextElementSibling;
let dial = new WidgetDial(dialContainer);
dial.addObserver((state) => {
  dialDisplay.innerHTML = state;
});
dial.setVal(300);

/** Envelope Graph */
let envelopeGraphContainer = document.getElementById("envelope-graph");
let envelopeGraphDisplay = document.getElementById("envelope-graph-display");

let envelopeGraph = new EnvelopeGraph(envelopeGraphContainer);

envelopeGraph.addObserver(function(state) {
  envelopeGraphDisplay.innerHTML = state.map((xyPair) => "[" + xyPair[0] + ", " + xyPair[1] + "]");
})
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
keyboard.setVal({pitch: 38, vel: 20})

/** Multislider */
let multisliderContainer = document.getElementById("multislider");
let multislider = new Multislider(multisliderContainer, {});
multislider.setState({sliderVals: [10, 10, 20, 30, 20, 10, 10 , 20, 10, 20]})
