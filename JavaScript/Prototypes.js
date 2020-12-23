"use strict"; // WHOLE-SCRIPT STRICT MODE SYNTAX.

// https://www.pirple.com/



// Creating En Empty Function:
function foo() {}

// All Functions Have A Object Calld 'prototype':
console.log("1. foo's Prototype: ", foo.prototype );

// Creating En Object With The Empty Function:
let newFooObj = new foo();

// Empty Object:
console.log("2. My newFooObj: ", newFooObj );

// But Now The Opject Has A Property Called '__proto__':
console.log("3. ", newFooObj.__proto__ );
// This '__proto__' Is A Reference To 'prototype' Of The 'foo' Function.

foo.prototype.test = "This is the prototype object of 'foo'.";
console.log("4. foo.prototype.test: ", foo.prototype.test );

console.log("5. ", newFooObj.__proto__.test );

if( foo.prototype === newFooObj.__proto__ ) { // -> TRUE
    console.log("6. Same Object.");
}

// To Get The Constructor Function: (foo())
console.log("7. Constructor Function: ", newFooObj.__proto__.constructor );

let b = newFooObj.__proto__.constructor();



//  +----------------+        +-----------------+    Global Object
//  |    Function    |        |    Prototype    |          ^
//  |                |        |                 |          |
//  |                |<-------|constructor      |          |
//  |       prototype|------->|        prototype|----------+
//  +----------------+        +-----------------+
//                                   ^
//                                   |
//                                   |
//     +------------------+          |
//     |    new Object    |          |
//     |                  |          |
//     |         __proto__|----------+
//     |                  |
//     +------------------+



// The Buldin Global 'Object' Function:
// To Create An Object In JS You Do:
let opjA = {};
// Or:
let objB = new Object();
// These Are Exactly The Same.

// To See They Were Both Created Using The Same Function:
if( opjA.__proto__ === objB.__proto__ ) {
    console.log("8. Same Constructor Function.");
}

if( opjA.__proto__.__proto__ === Object.prototype ) {
    console.log("9. The Global 'Object'.");
}



// Inheritance In JavaScript;

// Constructor-Function To Create 'Employee' Objects:
function Employee( name ) {
    this.name = name;
}

// Seting A Function On The Employee's Prototype, To Be Shared By All Employees:
Employee.prototype.getName = function() {
    return this.name;
}

// Creating Instance Of Employee:
let emp1 = new Employee( "Haffi" );
console.log("10. ", emp1.getName() );

// Constructor-Function To Create 'Manager' Objects:
function Manager( name, dept ) {
    this.name = name;
    this.dept = name;
}

// Seting A Function On The Manager's Prototype, To Be Shared By All Managers:
Manager.prototype.getDept = function() {
    return this.dept;
}

// Constructor-Function To Create 'Manager' Objects:
let mgr1 = new Manager( "Örvar", "Big Ds" );

// mgr1 Is Inheriting From Global Object:
if( mgr1.__proto__.__proto__ === Object.prototype ) {
    console.log("11. True");
}

// To Make Manager Inherits From Employee Instead:
mgr1.__proto__.__proto__ = Employee.prototype;

// Now Managers Cam Use The Employees Functions:
console.log("12. ", mgr1.getName() );


Employee.prototype.getSalary = function() {
    return 100;
}
console.log("13. ", emp1.getSalary() );
console.log("14. ", mgr1.getSalary() );



//                                                        +--------------------+
//                                                        | Object's Prototype |
//                                                        |                    |
//                                                        |                    |
//                                                        +--------------------+
//                                                                       ^  ^
//                                                                       |  .
//                                                                       |  .
//          +----------------------+       +----------------------+      |  .
//          | Employee Constructor |       | Employee's Prototype |      |  .
//          |                      |       |                      |      |  .
//          |                      |<------|constructor           |      |  .
//          |             prototype|------>|             __proto__|------+  .
//          +----------------------+       +----------------------+         .
//                                             ^              ^             .
//               +--------------+              |              |             .
//               |     emp1     |              |              |             .
//               |              |              |              |             .
//               |     __proto__|--------------+              |             .
//               +--------------+                             |             .
//                                                            |             .
//                                                            |             .
//                                                            |             .
//                                                            |             .
// +---------------------+       +---------------------+      |             .
// | Manager Constructor |       | Manager's Prototype |      |             .
// |                     |       |                     |      |             .
// |                     |<------|constructor          |      |             .
// |            prototype|------>|            __proto__|------+ - - - - - - -
// +---------------------+       +---------------------+
//                                     ^
//       +--------------+              |
//       |     mgr1     |              |
//       |              |              |
//       |     __proto__|--------------+
//       +--------------+  
