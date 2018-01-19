import ConstraintSpec from "../constraint-spec"
import Constraint from "../constraint";

let cSpec = new ConstraintSpec({
  a: [new Constraint({ min: 5, max: 10})],
  b: {
    A: new Constraint({ min: 1, max: 2}),
    B: [{
      AA: new Constraint({ min: 2, max: 12}),
      BB: [new Constraint({ min: 0, max: 100})]
    }]
  }
});

let target = {
  a: [0, 1, 12, 3, 4, 7, 10, 1, 2],
  b: {
    A: 10,
    B: [
      {
        AA: 1,
        BB: [-2, 12, 13, 14, 2, 11, 8, 12, 100]
      },
      {
        AA: 3,
        BB: [-11, 2, 3, 4, 123]
      },
      {
        AA: 12,
        BB: [2, 3, -18]
      }
    ]
  }
};

cSpec.constrain(target);
console.log(target);
