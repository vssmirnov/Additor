import Constraint from "./constraint";

/**
 * ConstraintSpec is used to apply a constraining function to a state object of arbitrary nestedness,
 * whose leaves are values that need to be constrained (i.e. to min or max values).
 * In order for ConstraintSpec to work properly, it's constructor must be given an object that
 * exactly mirrors the nested structure of the object to be constrained, with the leaves
 * containing instances of the Constraint class. Additional requirements (i.e. how to deal with nested arrays)
 * are outlined below.
 * TODO: expand explanation
 *
 * @class
 */
class ConstraintSpec {

  /**
   * @constructor
   * @param {object} specDefObj - The constraint spec definition object, which defines the nesting
   *                              structure of the objects that need to be constrained. The leaves
   *                              of this specDef object must be objects of type Constraint, which
   *                              act as the constraint definitions for each leaf.
   */
  constructor(specDefObj) {
    this.constraintMap = [[]];
    this._parseMap(specDefObj, this.constraintMap[0], this.constraintMap);
  }

  /**
   * Check a constraint map for constraint specs and apply them to obj.
   * Note: will not mutate the original object. New value is returned.
   * @public
   * @param {object} targetObj - The state object to check
   * @return {number | string | object | array} val - The constrained value.
   */
  constrain(targetObj) {
    const _this = this;
    _this.constraintMap.forEach(keyBranch => {
      _this._constrainBranch(targetObj, keyBranch);
    });
  }

  /**
   * Apply a constraint.
   * @private
   * @param {object} target - The target object to constrain
   * @param {Constraint} constraint - The constraint object to use.
   * @param {symbol} key - The key to use to access the constraint.
   * @return {number | string | object | array} val - The constrained value.
   */
  _applyConstraint(target, constraint, key) {
    if (constraint.min !== undefined) {
      target[key] = Math.max(target[key], constraint.min);
    }
    if (constraint.max !== undefined) {
      target[key] = Math.min(target[key], constraint.max);
    }
    if (constraint.enum !== undefined && constraint.enum instanceof Array) {
      target[key] = (constraint.enum.find(target[key]) !== undefined) ? target[key] : constraint.enum[0];
    }
    if (constraint.transform !== undefined && typeof constraint.transform === "function") {
      target[key] = constraint.transform(target[key]);
    }

    return target;
  }

  /**
   * Parse a constraint map
   * @private
   * @param {object} c - The map object currently being examined.
   *                     At the top level, this would be the whole map.
   *                     At the terminal level, this would be an instance of Constraint object.
   * @param {array} keyBranch - An array of keys that will specify how to get to each Constraint.
   *                            The last element in this array will be the constraint itself.
   * @param {array} cMap - An mutable array of key branches.
   */
  _parseMap(c, keyBranch, cMap) {
    const _this = this;

    if (c instanceof Array) {
      /* if c is an array, add "_arr_" to the current map, and examine the first element.
       * all elements in an array are required to have identical structure, so examining
       * the first one is enough.
       */
      keyBranch.push("_arr_");
      _this._parseMap(c[0], keyBranch, cMap);
    } else if (c instanceof Object && !(c instanceof Constraint)) {
      // keep a copy of the parent branch to create new branches from
      let parentBranch = keyBranch.map(x=>x);

      // create new branch for each key after the first key using the parentBranch clone
      Object.keys(c).forEach((key, keyIdx) => {
        if (keyIdx === 0) {
          keyBranch.push(key);
          _this._parseMap(c[key], keyBranch, cMap)
        } else {
          let newKeyBranch = parentBranch.map(x=>x);
          cMap.push(newKeyBranch);
          newKeyBranch.push(key);
          _this._parseMap(c[key], newKeyBranch, cMap);
        }
      });
    } else if (c instanceof Constraint) {

      // this will be the last element in the branch - the Constraint object itself
      keyBranch.push(c);
    }
  }

  /**
   * Apply constraints to one branch of the constraint map.
   * @private
   * @param {object} targetObj - The state object to apply the constraint to
   * @param {object} defObj - The constraint definition object to use.
   * @param {array} keyBranch - An array of keys representing a path to a constraint object.
   */
  _constrainBranch(targetObj, keyBranch) {
    const _this = this;

    let curKey;
    let constraint = keyBranch[keyBranch.length - 1];
    let arrFlag = false;

    /* Drill into targetObj and defObj following keyBranch keys
     * We go to length - 2, because the next-to-last element might be an
     * array, and the last element is the Constraint object itself.
     */
    for (let i = 0; i < keyBranch.length - 2 && !arrFlag; ++i) {
      curKey = keyBranch[i];

      // if we encounter an array, drill into each corresponding arry element in targetObj
      if (curKey === "_arr_") {
        arrFlag = true;

        let keyBranchSlice = keyBranch.slice(i + 1, keyBranch.length);

        for (let j = 0; j < targetObj.length; ++j) {
          _this._constrainBranch(targetObj[j], keyBranchSlice);
        }
      } else {
        targetObj = targetObj[curKey];
      }
    }

    // if arrFlag is set, we've encountered an array somewhere other than on the leaves
    // in this case we don't need to operate on it
    if (!arrFlag) {
      // Apply the constraints
      curKey = keyBranch[keyBranch.length - 2];

      if (curKey === "_arr_") {
        for (let i = 0; i < targetObj.length; ++i) {
          _this._applyConstraint(targetObj, constraint, i);
        }
      } else {
        _this._applyConstraint(targetObj, constraint, curKey);
      }
    }
  }
}

export default ConstraintSpec
