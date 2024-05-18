"use strict"; // WHOLE-SCRIPT STRICT MODE SYNTAX.



//*** OBJECTS AND THE 'this' KEYWORD IN JS ***//

// creating two objects:
let emp1 = {};
emp1.firstName = "Örvar";
emp1.lastName = "Sigþórsson";
emp1.gender = "M";
emp1.designation = "Stjóri";

let emp2 = {};
emp2.firstName = "Brynja";
emp2.lastName = "Benediktsdtir";
emp2.gender = "F";
emp2.designation = "Harð Stjóri";



// constructor function, like you would do in C++:
function createEmployeeObject( firstName, lastName, gender, designation ){
    let newObject = {};
    newObject.firstName = firstName;
    newObject.lastName = lastName;
    newObject.gender = gender;
    newObject.designation = designation;
    return newObject;
}

let emp3 = createEmployeeObject("Ívar", "Sigþórsson", "M", "Handyman");



// SHORTCUT for making constructor function, the JS way:
function employeeConstructor( firstName, lastName, gender, designation ){
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.designation = designation;
}

// you have to remember to use 'new' for it to work properly:
let emp4 = new employeeConstructor("Haffi", "Jónasson", "M", "Haffmachine");





// JS object:
let bicycle = {
    "cadence": 50,
    "speed": 20,
    "gear": 4
};
console.log("JS object:",bicycle);
// Prints-->[ JS object: {cadence: 50, speed: 20, gear: 4} ]

function createBicycle( cadence, speed, gear ){
    let newBicycle = {};
    newBicycle.cadence = cadence;
    newBicycle.speed = speed;
    newBicycle.gear = gear;
    return newBicycle;
}

let bicycle1 = createBicycle( 50, 20, 4 );
let bicycle2 = createBicycle( 20, 5, 1 );



// Constructor-Functions should begin with CAPITAL letters.
function Bicycle( cadence, speed, gear, tirePressure ){
    this.cadence = cadence;
    this.speed = speed;
    this.gear = gear;
    this.tirePressure = tirePressure;
    this.inflateTires = function(){
	this.tirePressure += 3;
    }
}

// constructor. remember the 'new' keyword:
let bicycle3 = new Bicycle( 25, 10, 2, 25 );
bicycle3.inflateTires();



function Mechanic( name ){
    this.name = name;
}

let birkir = new Mechanic("Birkir");
birkir.inflateTires = bicycle3.inflateTires;
birkir.inflateTires.call( bicycle3 );



//*** FOUR WAYS TO CALL A FUNCTION IN JS: ***

function foo1(){
    console.log("Method 1.", this);
}
// Method 1: | 'this' reference -> the global object.
//           | or when 'use strict' mode -> 'this' === undefined.
foo1(); // Prints-->[ Method 1. undefined ]



let obj = {};
obj.s = "I'm obj!";
obj.foo2 = function(){
    console.log("Method 2.", this);
}
// Method 2: | 'this' reference -> the object itself, 'obj'.
obj.foo2(); // Prints-->[ Method 2. {s: "I'm obj!", foo2: ƒ} ]



function Foo3(){
    // var this = {}; //<-- not needed in a constructor-functions.
    console.log("Method 3.", this);
    // return this;
}
// Method 3: | 'this' reference -> an empty object in the scope of Foo3.
new Foo3(); // Prints-->[ Method 3. Foo3 {} ]



// Method 4: | 'this' reference -> the object passed in the 'call()' function.
console.log("Method 4:"); // Prints-->[ Method 4: ]
foo1.call( obj ); // Prints-->[ Method 1. {s: "I'm obj!", foo2: ƒ} ]
// here we are calling 'foo1()' so "Method 1. ???" will be printed, but we are
// passing 'obj' with the 'call()' function (build in the JS language) so
// now 'this' reference the 'obj' and when we print 'this' we get:
// {s: "I'm obj!", foo2: ƒ}.
