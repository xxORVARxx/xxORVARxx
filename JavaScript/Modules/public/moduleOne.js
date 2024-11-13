"use strict";
/*
  To inport this module add the to your main js file:
    import myModuleOne from "./moduleOne.js";
  and also add this to your index.html file:
    <script type="module" src="./moduleOne.js"></script>
*/



// Export variables or classes:
export const PI = 3.1415;

// Export a function:
export function logMessage(message){
  console.log("Logged:", message);
}



function Manager(){
  // ---PRIVATE---
  const xx = {
    dataA: 50,
    dataB: 200,
  }
  function f_myfoo(){
    return xx.dataA;
  }
  function f_myboo(){
    return xx.dataB;
  }

  // ---PUBLIC---
  this.print = function(){
    console.log("Moduls One - print:", f_myfoo(), "and", f_myboo());
  }
  this.set = function(a, b){
    xx.dataA = a;
    xx.dataB = b;
  }
  this.get = function(){
    return { a: xx.dataA, b: xx.dataB, };
  }

  // Define a public variable:
  this.myVariable = 5.56;
  // Define a public constant variable:
  Object.defineProperty(this, 
    "myConstVariable", 
    { value: 18.32, writable: false, enumerable: true, configurable: true }
  );
};


// Singleton export:
let modulesInstance = null;
export default modulesInstance ? modulesInstance : modulesInstance = new Manager();
// When using "default export", the instance can be imported with any name.