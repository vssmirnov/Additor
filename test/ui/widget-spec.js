import Widget from "ui/widget";

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

  describe(" ", function() { 
  });

  describe("_initOptions()", function() {
     
  });

  describe("_initStateConstraints()", function() { 
  });

  describe("_initState()", function() { 
  });

  describe("_initSvgEls()", function() {   
  });

  describe("_initHandlers()", function() {    
  });

  describe("_update()", function() {    
  });

  describe("getOptions()", function() {
    it("should be defined", function() {
      expect(widget.getOptions).toBeDefined();
    });
  });

  describe("setOptions()", function() {
    it("should be defined", function() {
      expect(widget.setOptions).toBeDefined();
    });
  });
});