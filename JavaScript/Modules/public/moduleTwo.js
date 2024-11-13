"use strict";
/*
  To inport this module add the to your main js file:
    import myModuleTwo from "./moduleTwo.js";
  and also add this to your index.html file:
    <script type="module" src="./moduleTwo.js"></script>
*/

import one1 from '/moduleOne.js';


function OutsideObjTwo(_text, _f_myfoo){
  // ---PRIVATE---
  const t = _text; 
  const rand = Math.floor(Math.random() * 100);
  // ---PUBLIC---
  this.getRand = function(){
    return rand;
  }
  this.text = function(_t = t){
    return _t;
  }
  this.super = function(){
    console.log("From super!", _f_myfoo())
  }
};


function Manager(){
  // ---PRIVATE---
  const xx = {
    dataA: 0.5,
    dataB: 0.2,
  }
  function f_myfoo(){
    return xx;
  }
  // ---PUBLIC---
  this.print = function(){
    console.log("Moduls Two - print:", f_myfoo());
    console.log("and from Moduls Two! - data:", one1.get());
  }
  this.instanceInside = function(_text){
    // 'InsideObjTwo' has access to all of 'Manager's private fields and functions.
    function InsideObjTwo(){
      // ---PRIVATE---
      const t = _text; 
      const rand = Math.floor(Math.random() * 100);
      // ---PUBLIC---
      this.getRand = function(){
        return rand;
      }
      this.text = function(_t = t){
        return _t;
      }
      this.super = function(){
        console.log("From super!", f_myfoo())
      }
    };
    return new InsideObjTwo();
  }
  this.instanceOutside = function(_text){
    // 'OutsideObjTwo' can not access 'Manager's private fields or functions, unless it's passed-over with '.bind(this)'.
    return new OutsideObjTwo(_text, f_myfoo.bind(this));
  }
};


// Singleton export:
let modulesInstance = null;
export default modulesInstance ? modulesInstance : modulesInstance = new Manager();