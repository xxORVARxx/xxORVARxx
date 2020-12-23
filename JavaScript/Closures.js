"use strict"; // WHOLE-SCRIPT STRICT MODE SYNTAX.



//*** SCOPES AND CLOSURES: ***

// global variable-name: BAD
let name = "Örvar";

// global function-name: BAD
function foo() {
    // local variable: GOOD
    let name = "Örvar";
}

// global variable-name but no function-name: BAD
let bar = function() {
    // local variable: GOOD
    let name = "Örvar";
};

// local function 'IIFE': GOOD
(function () {
    // local variable: GOOD
    let name = "Örvar";
}) (); // <- executing the function.



//*** HOISTING: ***

// The role of the 'Compiler' and 'Interpreter'.
// First: Compiler put all variables into scopes.
// Second: Interpreter give variables value based on logic.

function outer() {
    var b = 10;
    function inner() {
	var c = b; //<-- using 'let' instead of 'var' will give error here.
	console.log("'C' is:", c); // <- 'c' is 'undefined'! not 10 or 20.
	var b = 20;
	// First: The compiler finds 'b' in the 'inner' scope.
	// Second: The interpreter knows of 'b' in 'inner' scope,
	//         so the interpreter can't use 'b' in 'outer' scope,
	//         but the interpreter doesn't have the value 20 yet.
	//         therefore 'c' is 'console.log' as 'undefined'.
    }
    inner();
}
outer();// Prints-->[ 'C' is: undefined ]



//*** CLOSURES IN DETAIL: ***

let a = 1;

function outer2() {
    let b = 5;
    let inner = function() {
	a++;
	b++;
	console.log("'A':", a, "'B':", b);
    };
    return inner;
}

let innerFn = outer2();
innerFn(); // Prints-->[ 'A': 2 'B': 6 ]
// 'b' is not garbage collected because 'inner' still
// exists as the 'innerFn' holds a reference to it.
let innerFn2 = outer2();
innerFn2(); // Prints-->[ 'A': 3 'B': 6 ]
// 'outer2' is call a second time and new instance of 'b' is
// created and 'innerFn2' is holding a reference to it.



//*** CLOSURES IN CALLBACKS: ***

let s = "1 sec delay done.";
console.log("Before...");

// the callback function:
let fn = function() {
    console.log(s); // 'fn' holding a reference to 's'.
};

// setTimeout( callback, ms ) is a build in function.
window.setTimeout(fn, 1000); // Prints-->[ 1 sec delay done. ]
console.log("...After");



//*** THE MODULE PATTERN: ***

function createPerson() {
    // Private:
    let firstName = "Örvar";
    let lastName = "Sigþórsson";
    
    let returnObj = {
	// Public:
	"getFirstName": function() {
	    return firstName;
	},
	"getLastName": function() {
	    return lastName;
	},
	"setFirstName": function(name) {
	    firstName = name;
	},
	"setLastName": function(name) {
	    lastName = name;
	}
    };
    return returnObj;
}

let person = createPerson();
person.setFirstName("Örvar Frændi");
console.log("Public: " + person.getFirstName());//-->[ Public: Örvar Frændi ]
console.log("Private: " + person.firstName);//-->[ Private: undefined ]



// *** CALLBACK IN DETAIL: ***

// V1 - Virkar ekki, prentar '10' tíu-sinnum eftir einna sec.
let i1;
let print1 = function() {
    console.log("V1:", i1);
};
for(i1 = 0; i1 < 10; i1++) {
    setTimeout(print1, 1000);
}



// V2 - Virkar ekki, sama og V1.
let i2;
let print2 = function() {
    console.log("V2:", i2);
};
for(i2 = 0; i2 < 10; i2++) {
    (function() {
	window.setTimeout(print2, 1000);
    })();
}



// V3 - Virkar, prentar '0' til '9' eftir einna sec.
let i3;
for(i3 = 0; i3 < 10; i3++) {
    (function() {
	let currentValue = i3;
	window.setTimeout( function() {
	    console.log("V3:", currentValue);
	}, 1000);
    })();
}



// V4 - Virkar, sama og V3.
let i4;
for(i4 = 0; i4 < 10; i4++) {
    (function(currentValue) {
	window.setTimeout( function() {
	    console.log("V4:", currentValue);
	}, 1000);
    })(i4);
}



// V5 - Virkar, prentar eina tölu á sekúndu fresti frá '0' uppí '9'.
let i5 = 0;
print_5 = function(){
    if(i5 === 9) {
       console.log("Recursion return:", i5);
	   return;
    }
    console.log("Recursion:", i5);
    i5++;
    window.setTimeout(print_5, 1000);
}
print_5();
