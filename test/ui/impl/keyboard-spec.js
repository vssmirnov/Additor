import Keyboard from "ui/impl/keyboard";

describe("Keyboard UI Widget", function() {
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
    expect(kbd._getKeyboardWidth()).toEqual(container.getBoundingClientRect().height);
  });
});
