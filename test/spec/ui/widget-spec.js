import Widget from "ui/core/widget";

describe("Widget", function() {
  var widget, container;

  beforeEach(function() {
    container = document.createElement("div");
    container.style.width = "1000px";
    container.style.height = "1000px";

    widget = new Widget(container);
  });

  afterEach(function() {
    container = null;
    widget = null;
  });
});