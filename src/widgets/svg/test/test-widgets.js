import WidgetDial from "../widget-impl-dial";


/** Dial */
let dialContainer = document.getElementById("dial");
let dialDisplay = dialContainer.nextElementSibling;
let dial = new WidgetDial(dialContainer);

dial.addObserver((state) => {
  dialDisplay.innerHTML = state.val;
});

dial.setOptions({
  minVal: 20
})
