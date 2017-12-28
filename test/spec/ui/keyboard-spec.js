import Keyboard from "ui/keyboard";

describe("Keyboard", function() {
  var container;
  var kbd;

  beforeEach(function() {
    container = document.createElement("div");
    container.style.width = "1000px";
    container.style.height = "1000px";

    kbd = new Keyboard(container);
  });

  afterEach(function() {
    container = null;
    kbd = null;
  });
  
});
