import WidgetDial from "ui/dial";
import EnvelopeGraph from "ui/graph";
import Keyboard from "ui/keyboard";

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
envelopeGraph.setVal([[0.0, 100],[2.3, 81.2],[5.3, 65.9],[7.3, 48.5],
  [8.7, 40.1],[12.7, 36.0],[15.3, 40.5],[16.7, 46.5],[20.0, 51.9],
  [22.3, 49.9],[23.7, 48.5],[25.0, 42.5],[26.0, 37.9],[27.7, 25.9],
  [28.0, 24.5],[30.7, 20.5],[32.7, 30.0],[33.7, 43.2],[34.3, 50.5],
  [36.3, 55.9],[39.0, 64.5],[41.7, 67.9],[45.3, 69.2],[48.3, 63.9],
  [50.7, 51.9],[52.0, 38.5],[53.3, 27.2],[57.0, 17.2],[61.3, 15.9],
  [65.7, 17.9],[69.3, 25.9],[73.0, 33.9],[74.7, 39.9],[76.3, 46.5],
  [78.7, 47.9],[81.0, 43.9],[82.0, 37.9],[83.0, 30.5],[84.0, 23.9],
  [86.0, 17.9],[88.7, 13.9],[91.0, 19.2],[92.0, 28.5],[92.7, 36.5],
  [93.0, 44.5],[93.0, 56.5],[95.0, 69.2],[97.3, 81.9],[100.0, 100]]
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
