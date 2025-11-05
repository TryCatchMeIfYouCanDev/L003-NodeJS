import {sum, multipleSum} from "./mathematics"; // import single methods
import * as math from "./mathematics"; // import all with alias math
import mult from "./mathematics"; // access to the default export. Therefore must be unic
import op, {multiplication} from "./mathematics"; // default plus individual
import myPath from "./ex-paths"; // import path custom library
import myFs from "./ex-fs"; // import file System custom library

console.log(sum(3,5)); // direct method call
console.log(multipleSum(1,2,3,4,5,6,7,8,9,10));
math.multipleSum(4,5,6,7,8,9); // from the math alias

console.log(mult(3,15)); // from default export
console.log(op(3,17)); // from default export

console.log(multiplication(15,37)); // individual import

console.log("=".repeat(20));
myPath(); // call the default method

console.log("=".repeat(20));
myFs();
