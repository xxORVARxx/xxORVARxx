"use strict";

import one, { logMessage, PI } from '/moduleOne.js';
import two from '/moduleTwo.js';
//import two from '/classModuleTwo.js'; // <- The same but implemented using class.


console.log(PI, logMessage("Hi"));


one.print();
one.set(15000, 125000);
one.print();

two.print();
const a = two.instanceOutside("A");
console.log(a.getRand(), a.text());

const b = two.instanceOutside("B");
console.log(b.getRand(), b.text());

console.log(a.getRand(), a.text());

b.super();

console.log("B:", b);