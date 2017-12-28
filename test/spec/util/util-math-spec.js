import MathUtil from "util/util-math";

describe("Math Util", function() {

  /**
   * MathUtil.getPrecision()
   */
  describe("getPrecision() method", function() {
  
    it("should return 5 for 10.12345", function() {
      let val = MathUtil.getPrecision(10.12345);
      expect(val).toEqual(5);
    });

    it("should return 0 for 10", function() {
      let val = MathUtil.getPrecision(10);
      expect(val).toEqual(0);
    });
  });

  /**
   * MathUtil.round()
   */
  describe("round() method", function() {

    it("should round 10.1231 to 10.12 using precision value 2", function() {
      let val = MathUtil.round(10.1231, 2);
      expect(val).toEqual(10.12);
    });

    it("should round -10.1247 to -10.125 using precision value 3", function() {
      let val = MathUtil.round(-10.1247, 3);
      expect(val).toEqual(-10.125);
    });

    it("should round 10.1234 to 10 using a precision value 0", function() {
      let val = MathUtil.round(10.1234, 0);
      expect(val).toEqual(10);
    });

    it("should round 10.1234 to 10 using a precision value -1", function() {
      let val = MathUtil.round(10.1234, -1);
      expect(val).toEqual(10);
    });
  });

  /**
   * MathUtil.quantize()
   */
  describe("quantize() method", function() {

    it("should round 10.1234 to 10.2 using quanize value 0.2 and precision 1", function() {
      let val = MathUtil.quantize(10.1234, 0.2, 1);
      expect(val).toEqual(10.2);
    });

    it("should round 11.1234 to 12.0 using quanize value 0.3 and precision 1", function() {
      let val = MathUtil.quantize(11.1234, 2, 1);
      expect(val).toEqual(12.0);
    });

    it("should round 20.42314 to 20.4 using a precision value 1", function() {
      let val = MathUtil.quantize(20.42314, 0.1, 1);
      expect(val).toEqual(20.4);
    });


  });
});