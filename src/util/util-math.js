/**
 * Useful Math Utility functions
 */
let MathUtil = {

  /**
   * Returns the decimal precision of a number.
   * @param {number} val - The value whose precision to check.
   * @returns {number} - Number of decimal places.
   */
  getPrecision(val) {
    let decStr = (''+val).split('.')[1];
    return (decStr ? decStr.length : 0);
  },

  /**
   * Round a number to specified decimal precision.
   * Same as Number.prototype.toFixed, but does not use toString.
   * @param {nubmer} val - Value to be rounded.
   * @param {precision} val - 
   * @returns  
   */
  round: function round(val, precision) {
    let factor = Math.pow(10, precision);
    return Math.round(val * factor) / factor;
  },

  /**
   * Quantize a value (set it to the closest value matching the interval)
   * Note: result will not necessarily reflect the same number of places of
   * as the q input due to floating point arithmetic.
   * @param {number} val - Value to quantize.
   * @param {number} q - The quantization interval.
   * @param {number} precision - The decimal precision of the result.
   * @returns {number} qVal - Quantized val.
   */
  quantize: function quantize(val, q, precision) {
    let qVal;

    if (q == 0) {
      return 0;
    } else if (q < 0) {
      q = Math.abs(q);
    }

    // quantize
    qVal = ~~(val / q) * q;

    qVal = Math.abs(val - qVal) > (q / 2) ? 
            qVal > 0 ? 
              qVal + q
            : qVal - q
          : qVal;

    if (precision !== undefined) {
      qVal = MathUtil.round(qVal, precision);
    }

    return qVal;
  },

  /**
   * Alias for quantize(val, q)
   * @param {number} val - Value to quantize
   * @param {number} q - The quantization interval
   * @returns {number} qVal - Quantized val
   */
  q: function q(val, q) {
    return MathUtil.quantize(val, q);
  }
};

export default MathUtil;