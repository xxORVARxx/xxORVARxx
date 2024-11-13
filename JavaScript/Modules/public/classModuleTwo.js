"use strict";
/*
  To inport this module add the to your main js file:
    import myClassTwo from "./ClassModuleTwo.js";
  and also add this to your index.html file:
    <script type="module" src="./ClassModuleTwo.js"></script>
*/

import one1 from '/moduleOne.js';


class ObjectTwo{
  // --- PRIVATE ---
  #t;
  #rand;
  #f_myfoo;
  constructor(text, f_myfoo) {
    this.#t = text;
    this.#rand = Math.floor(Math.random() * 100);
    this.#f_myfoo = f_myfoo;
  }

  // --- PUBLIC ---
  getRand(){
    return this.#rand;
  }
  text(_t = this.#t){
    return _t;
  }
  super(){
    console.log("From super!", this.#f_myfoo());
  }
}


class Manager {
  // --- PRIVATE ---
  #xx = {
    dataA: 0.5,
    dataB: 0.2,
  };
  #f_myfoo(){
    return this.#xx;
  }

  // --- PUBLIC ---
  print(){
    console.log("Moduls Two - print:", this.#f_myfoo());
    console.log("and from Moduls Two! - data:", one1.get());
  }
  instance(_text){
    // Using '.bind(this)' ensures that '#f_myfoo' remains tied to the 'Manager' instance’s context, even when called from 'ObjectTwo'.
    return new ObjectTwo(_text, this.#f_myfoo.bind(this));
  }
}


// Singleton export:
let modulesInstance = null;
export default modulesInstance ? modulesInstance : modulesInstance = new Manager();