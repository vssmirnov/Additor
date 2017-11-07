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
});
envelopeGraph.addObserver(function(state) {
  envelopeGraphDisplay.innerHTML = state.map((xyPair) => "[" + xyPair[0] + ", " + xyPair[1] + "]");
})
envelopeGraph._setVal([[8.7, 40.1],[23.3, 38.1],[35.0, 73.5],
  [43.7, 24.1],[54.3, 16.8],[59.7, 16.8],[68.3, 18.8],[70.7, 35.5],
  [75.7, 18.8],[83.0, 37.5],[86.7, 20.1],[92.0, 28.8]]
);

var clicky = document.createElement("button");
var counter = 0;

clicky.innerHTML = "CLICK";
document.body.appendChild(clicky);

clicky.addEventListener("click", function() {

  switch (counter) {
    case 0:
      envelopeGraph.setOptions({
        hasFixedStartPoint: true
      });
      break;

    case 1:
      envelopeGraph.setOptions({
        hasFixedEndPoint: true
      });
      break;

    case 2:
      envelopeGraph.setOptions({
        fixedStartPointY: 120
      });
      break;

    case 3:
      envelopeGraph.setOptions({
        fixedEndPointY: 120
      });
      break;

    case 4:
      envelopeGraph.setOptions({
        hasFixedStartPoint: false
      });
      break;

    case 5:
      envelopeGraph.setOptions({
        hasFixedEndPoint: false
      });
      break;

    default:
      break;
  }

  counter = (counter + 1) % 6;
});

//envelopeGraph.addVertex(2, 20);
//envelopeGraph.addVertex(25, 200);
