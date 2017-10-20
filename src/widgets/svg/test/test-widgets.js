import WidgetDial from "../widget-impl-dial";
import EnvelopeGraph from "../widget-impl-envelopegraph";

import ConstraintSpec from "../constraint-spec"
import Constraint from "../constraint";

/** Dial */
let dialContainer = document.getElementById("dial");
let dialDisplay = dialContainer.nextElementSibling;
let dial = new WidgetDial(dialContainer);
dial.addObserver((state) => {
  dialDisplay.innerHTML = state;
});
dial._setState({val: 300});

/** Envelope Graph */
let envelopeGraphContainer = document.getElementById("envelope-graph");
let envelopeGraphDisplay = envelopeGraphContainer.nextElementSibling;
let envelopeGraph = new EnvelopeGraph(envelopeGraphContainer, {
  hasFixedStartPoint: true,
  hasFixedEndPoint: true
});
envelopeGraph.addObserver(function(state) {
  envelopeGraphDisplay.innerHTML = state.map((xyPair) => "[" + xyPair[0] + ", " + xyPair[1] + "]");
})
envelopeGraph._setVal([[0.0, 0.0],[8.7, 40.1],[23.3, 38.1],[35.0, 73.5],
  [43.7, 24.1],[54.3, 16.8],[59.7, 16.8],[68.3, 18.8],[70.7, 35.5],
  [75.7, 18.8],[83.0, 37.5],[86.7, 20.1],[92.0, 28.8],[100.0, 14.8]]
);



//envelopeGraph.addVertex(2, 20);
//envelopeGraph.addVertex(25, 200);
