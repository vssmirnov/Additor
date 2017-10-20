import WidgetDial from "../widget-impl-dial";
import EnvelopeGraph from "../widget-impl-envelopegraph";

import ConstraintSpec from "../constraint-spec"
import Constraint from "../constraint";

// TODO: should addObserver() be called addCallback() ?

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
  envelopeGraphDisplay.innerHTML = state;
})

//envelopeGraph.addVertex(2, 20);
//envelopeGraph.addVertex(25, 200);
