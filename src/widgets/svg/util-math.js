/**
 * Useful Math Utility functions
 */
let MathUtil = {

  /**
   * Quantize a value (set it to the closest value matching the interval)
   * Note: result will not necessarily reflect the same number of places of
   * as the q input due to floating point arithmetic.
   * @param {number} val - Value to quantize
   * @param {number} q - The quantization interval
   * @return {number} qVal - Quantized val
   */
  quantize: function quantize(val, q) {
    let qVal;

    if (q == 0) {
      return 0;
    } else if (q < 0) {
      q = Math.abs(q);
    }

    // quantize
    qVal = ~~(val / q) * q;

    qVal = Math.abs(val - qVal) > (q / 2)
      ? qVal > 0
        ? qVal + q
        : qVal - q
      : qVal;

    return qVal;
  },

  /**
   * Alias for quantize(val, q)
   * @param {number} val - Value to quantize
   * @param {number} q - The quantization interval
   * @return {number} qVal - Quantized val
   */
  q: function q(val, q) {
    return MathUtil.quantize(val, q);
  }
}

export default MathUtil
