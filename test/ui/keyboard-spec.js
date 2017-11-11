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

  describe("method setOptions()", function() {

    it("should be defined", function() {
      expect(kbd.setOptions).toBeDefined();
    });

    describe("options", function() {
      
      describe(".orientation", function() {
  
        it("should be initialized to 'horizontal'", function() {
          expect(kbd.o.orientation).toEqual("horizontal");
        });
  
        it("should be able to be set to 'vertical'", function() {
          kbd.setOptions({ orientation: "vertical" });
          expect(kbd.o.orientation).toEqual("vertical");
        });
  
        it("should be able to be set to 'horizontal-mirrored'", function() {
          kbd.setOptions({ orientation: "horizontal-mirrored" });
          expect(kbd.o.orientation).toEqual("horizontal-mirrored");
        });
  
        it("should be able to be set to 'vertical-mirrored'", function() {
          kbd.setOptions({ orientation: "vertical-mirrored" });
          expect(kbd.o.orientation).toEqual("horizontal-mirrored");
        });
      });
    });
  });
});
