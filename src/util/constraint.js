/**
 * Constraint object represents constraints on a value.
 * Instances of Constraint are used as leaves on a ConstraintSpec definition.
 * A ConstraintSpec useses Constraints to apply a constraint to leaves of an
 * arbitrarily nested object, whose leaves represent values that may be constrained.
 *
 * @class
 */
class Constraint {

  /**
   * @constructor
   * @param {object=} spec - Spec specifying the constraints.
   * @param {number=} spec.min - Minimum value.
   * @param {number=} spec.max - Maximum value.
   * @param {array=} spec.enum - Array of possible enumerable values.
   * @param {function=} spec.transform - A transformation function to apply to the value.
   */
  constructor(spec) {
    spec = spec || {};

    this.min = spec.min;
    this.max = spec.max;
    this.enum = spec.enum;
    this.transform = spec.transform;
  }
}

export default Constraint
