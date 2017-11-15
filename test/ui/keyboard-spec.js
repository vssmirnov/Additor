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

  describe("getVal()", function() {
    it("should ", function() {
      kbd.setState({ activeNotes: [{pitch: 50, vel: 100}, {pitch: 60, vel: 20}]});

      let kbdVal = kbd.getVal();

      expect(kbdVal).toEqual([{pitch: 50, vel: 100}, {pitch: 60, vel: 20}]);
    });
  });
});
