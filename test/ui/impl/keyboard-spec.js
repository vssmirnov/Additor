import Keyboard from "ui/impl/keyboard";

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

  describe("public API", function() {
    
    describe("method setOptions()", function() {
      it("should be defined", function() {
        expect(kbd.setOptions).toBeDefined();
      });
    });

    describe("method getVal()", function() {
      it("should be defined", function() {
        expect(kbd.getVal).toBeDefined();
      });
    });
  });

  /**
   * Set keyboard options
   */
  describe("options", function() {

    describe("orientation", function() {

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



  it("should create a new keyboard object", function() {
    expect(kbd).toBeDefined();
  });

  it("should have width equal to container width", function() {
    expect(kbd._getWidth()).toEqual(container.getBoundingClientRect().width);
  });

  it("should have keyboard width equal to container width in horizontal", function() {
    kbd.setOptions({ orientation: "horizontal" });
    expect(kbd._getKeyboardWidth()).toEqual(container.getBoundingClientRect().width);
  });

  it("should have keyboard width equal to container height in vertical", function() {
    kbd.setOptions({ orientation: "vertical" });
    expect(kbd._getKeyboardWidth()).toEqual(kbd._getHeight());
  });
});
