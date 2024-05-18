"use strict"; // WHOLE-SCRIPT STRICT MODE SYNTAX.
// https://www.youtube.com/watch?v=KJP1E-Y-xyo
// https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/



// *** LEVEL-1: Closures: ***
/*** 1 ***/
let x1 = 1; //<- state is remembered by a global variable.
function add1(){
    x1 = x1 + 1;
    return x1;
}
console.log("%c LEVEL-1: x1:", "color: #f0f6fc;", add1());
console.log("%c LEVEL-1: x1:", "color: #f0f6fc;", add1());
x1 = 99; //<- not good!
console.log("%c LEVEL-1: x1:", "color: #f0f6fc;", add1());
console.log("%c LEVEL-1: x1:", "color: #f0f6fc;", add1());



/*** 2 ***/
function getAdd2(){
    let x2 = 1; //<- put it into a closure, now it's like a private variable.
    // state is now remembered by a 'private' variable inside a closure.
    return function(){
        x2 = x2 + 1;
        return x2;
    }
}
const add2 = getAdd2(); //<- NOTE here.
console.log("%c LEVEL-1: x2:", "color: #9ec2e6;", add2());
console.log("%c LEVEL-1: x2:", "color: #9ec2e6;", add2());
//x2 = 99; //<- good! not possible now. x2 is hidden away in the closure.
console.log("%c LEVEL-1: x2:", "color: #9ec2e6;", add2());
console.log("%c LEVEL-1: x2:", "color: #9ec2e6;", add2());



/*** 3 ***/
// the module pattern:
const add3 = (function getAdd3(){
    let x3 = 1;
    return function(){
        x3 = x3 + 1;
        return x3;
    }
})(); 
// NOTE here, gone.
console.log("%c LEVEL-1: x3:", "color: #4f94d4;", add3());
console.log("%c LEVEL-1: x3:", "color: #4f94d4;", add3());
console.log("%c LEVEL-1: x3:", "color: #4f94d4;", add3());
console.log("%c LEVEL-1: x3:", "color: #4f94d4;", add3());





// *** LEVEL-2: Cloning React's 'useState()' Hook: ***
/*** 4 ***/
function useState4(initVal4){
    let _val4 = initVal4
    const state4 = _val4; //<- will be used later.
    const setState4 = function(newVal4){
        _val4 = newVal4;
    }
    return [state4, setState4]; //<- returing an array.
}
const [s4, setState4] = useState4(1); //<- array destructuring.
console.log("%c LEVEL-2: s4:", "color: #fcf0f1;", s4);
setState4(2);
console.log("%c LEVEL-2: s4:", "color: #fcf0f1;", s4);
setState4(3);
console.log("%c LEVEL-2: s4:", "color: #fcf0f1;", s4);
// This is not wotking because 's4' is not being updated, after 
// 'setState4' is called, but '_val4' is changing.



/*** 5 ***/
function useState5(initVal5){
    let _val5 = initVal5
    const state5 = function(){ 
        return _val5; 
    }
    const setState5 = function(newVal5){
        _val5 = newVal5;
    }
    return [state5, setState5];
}
const [s5, setState5] = useState5(1); //<- array destructuring.
console.log("%c LEVEL-2: s5:", "color: #ffabaf;", s5());
setState5(2);
console.log("%c LEVEL-2: s5:", "color: #ffabaf;", s5());
setState5(3);
console.log("%c LEVEL-2: s5:", "color: #ffabaf;", s5());
// By changing 's5' to be a getter-function, like: 's5()', now the 
// updated value gets logged.



/*** 6 ***/
function useState6(initVal6){
    let _val6 = initVal6
    const state6 = () => _val6;
    const setState6 = newVal6 => { _val6 = newVal6; }
    return [state6, setState6];
}
const [s6, setState6] = useState6(1); //<- array destructuring.
console.log("%c LEVEL-2: s6:", "color: #f86368;", s6());
setState6(2);
console.log("%c LEVEL-2: s6:", "color: #f86368;", s6());
setState6(3);
console.log("%c LEVEL-2: s6:", "color: #f86368;", s6());
// Same as *** 5 *** but now with arrow-functions.
// Just a reminder, arrow-functions don't have their own 'this', 
// but inherit it from the parent scope.





// *** LEVEL-3: 'useState()' within a React-Module: ***
/*** 7 ***/
const React7 = (function(){//<- this is a function that gets immediately invoked.
    
    // same as in *** 6 ***:
    function useState7(initVal7){
        let _val7 = initVal7
        const state7 = () => _val7;
        const setState7 = newVal7 => { _val7 = newVal7; }
        return [state7, setState7];
    }

    return { useState7 }; //<- 'React7' === object containing one method: '{ useState7: () }'.
})();
const [s7, setState7] = React7.useState7(1); //<- react-module here.
// everything else is the same as in *** 6 ***:
console.log("%c LEVEL-3: s7:", "color: #fcf9e8;", s7());
setState7(2);
console.log("%c LEVEL-3: s7:", "color: #fcf9e8;", s7());
setState7(3);
console.log("%c LEVEL-3: s7:", "color: #fcf9e8;", s7());




/*** 8 ***/
const React8 = (function(){ //<- react-module.

    // this is like the state-manager part of the react-module:
    function useState8(initVal8){ 
        let _val8 = initVal8
        const state8 = () => _val8;
        const setState8 = newVal8 => { _val8 = newVal8; }
        return [state8, setState8];
    }

    // and this is the module's render-function:
    function render8(Component8){
        const c8 = Component8(); // 'c8' === object containing two methods: '{ render: (), click: () }'.
        c8.render();
        return c8;
    }

    return { useState8, render8 }; //<- 'React8' === object containing two method.
})();

function Component8(){ //<- react-component.
    const [count8, setCount8] = React8.useState8(1);
    return {
        render: () => console.log("%c LEVEL-3: Component8:", "color: #f2d675;", count8),
        click: () => setCount8(count8 + 1) //<- adding one to the value here.
    }
}
// Now the 'React8' module is capable of two things, store 
// states and render components. (two separate parts)
// The 'component8' can use the 'React8' state functionality 
// and then defines a render-function for 'React8' to use 
// when rendering the component.
// And now to use the component with the react-module:
let App8 = React8.render8(Component8); //<- returns 'c8' === '{ render: (), click: () }'
App8.click();
App8 = React8.render8(Component8);
App8.click();
App8 = React8.render8(Component8);
// but this is not working because now the getter-function 
// from *** 5 *** is being logged instead of the value, so the 
// getter-function needs to be remved again.



/*** 9 ***/
const React9 = (function(){ //<- react-module.
    let _val9;
    // this is like the state-manager part of the react-module:
    function useState9(initVal9){ 
        const state9 = _val9 || initVal9; //<- will be assigned the nearest value (from left to right).
        const setState9 = newVal9 => { _val9 = newVal9; }
        return [state9, setState9];
    }
    // and this is the module's render-function:
    function render9(Component9){
        const c9 = Component9();
        c9.render();
        return c9;
    }
    return { useState9, render9 }; //<- 'React9' === object containing two method.
})();

function Component9(){ //<- react-component.
    const [count9, setCount9] = React9.useState9(1);
    return {
        render: () => console.log("%c LEVEL-3: Component9:", "color: #dba617;", count9),
        click: () => setCount9(count9 + 1) //<- adding one to the value here.
    }
}

// to use the component with the react-module:
let App9 = React9.render9(Component9); //<- returns 'c9' === '{ render: (), click: () }'
App9.click();
App9 = React9.render9(Component9);
App9.click();
App9 = React9.render9(Component9);





// *** LEVEL-4: Multiple States Hooks: ***
/*** 10 ***/
const React10 = (function(){ //<- react-module.
    // this is like the state-manager part of the react-module:
    let _val10; //<- memory for all hooks?
    function useState10(initVal10){ 
        const state10 = _val10 || initVal10; //<- will be assigned the nearest value (from left to right).
        const setState10 = newVal10 => { _val10 = newVal10; }
        return [state10, setState10];
    }
    // and this is the module's render-function:
    function render10(Component10){
        const c10 = Component10();
        c10.render();
        return c10;
    }
    return { useState10, render10 }; //<- 'React10' === object containing two method.
})();

function Component10(){ //<- react-component.
    const [count10, setCount10] = React10.useState10(1);
    const [text10, setText10] = React10.useState10("Good.");
    return {
        render: () => console.log("%c LEVEL-4: Component10:", "color: #b8e6bf;", { count10, text10 }),
        click: () => setCount10(count10 + 1), //<- adding one to the value here.
        type: (word10) => setText10(word10) //<- changing the text to a new word here.
    }
}

// to use the component with the react-module:
let App10 = React10.render10(Component10); //<- returns 'c10' === '{ render: (), click: (), type: () }'
App10.click();
App10 = React10.render10(Component10);
App10.type("Better.");
App10 = React10.render10(Component10);
// now when using two hooks in the Component, 'count10' and
// 'text10', it starts acting in this weird way:
// At first it looks okay and logged '1' and 'Good', But then
// after 'click()' is called it logged '2' and '2' but not
// '2' and 'Good'.
// This is not working because both hooks are using the same 
// memory, the '_val10' variable. 
// The fix is to use array, one element per hook.



/*** 11 ***/
const React11 = (function(){ //<- react-module.
    let _hooks11 = []; //<- now using array for hook's memory.
    let _i11 = 0; //<- index for hooks array.
    // this is like the state-manager part of the react-module:
    function useState11(initVal11){ 
        const state11 = _hooks11[_i11] || initVal11;
        const setState11 = newVal11 => { _hooks11[_i11] = newVal11; }
        _i11++; //<- everytime 'useState11()' gets called, move to next hook element.
        return [state11, setState11];
    }
    // and this is the module's render-function:
    function render11(Component11){
        const c11 = Component11();
        c11.render();
        return c11;
    }
    return { useState11, render11 }; //<- 'React11' === object containing two method.
})();

function Component11(){ //<- react-component.
    const [count11, setCount11] = React11.useState11(1);
    const [text11, setText11] = React11.useState11("Good.");
    return {
        render: () => console.log("%c LEVEL-4: Component11:", "color: #68de7c;", { count11, text11 }),
        click: () => setCount11(count11 + 1), //<- adding one to the value here.
        type: (word11) => setText11(word11) //<- changing the text to a new word here.
    }
}

// to use the component with the react-module:
let App11 = React11.render11(Component11); //<- returns 'c11' === '{ render: (), click: () }'
App11.click();
App11 = React11.render11(Component11);
App11.type("Better.");
App11 = React11.render11(Component11);
// The problem is that the index is not being reset.
// Here is how this code is running:
// 0-1:  React11 = (f(){})();
// 0-2:  React11 = { useState11: (), render11: () }
// 1-1:  React11.render11(Component11);
// 1-2:  . Component11();
// 1-3:  . . React11.useState11(x)
// 1-4:  . . . _hooks11[ 0++ ] = x;
// 1-5:  . . React11.useState11(y)
// 1-6:  . . . _hooks11[ 1++ ] = y;
// 1-7:  . render();
// 1-8:  . . "count11==x and text11==y get logged."
// 1-9:  App11.click();
// 1-10: . setCount11(x + 1);
// 1-11: . . _hooks11[ 2 ] = x + 1; //<- NOT GOOD! index should be '0' not '2'.
// 2-1:  React11.render11(Component11)
// 2-2:  . Component11();
// 1-3:  . . React11.useState11(x)
// 1-4:  . . . _hooks11[ 2++ ] = x; //<- NOT GOOD! index should be '0' not '2'.
// 1-5:  . . React11.useState11(y)
// 1-6:  . . . _hooks11[ 3++ ] = y; //<- NOT GOOD! index should be '1' not '3'.
// 1-7:  . render(); 
// 1-8:  . . "count11==x and text11==y get logged."
// 1-9:  App11.type("str");
// 1-10: . setText11("str");
// 1-11: . . _hooks11[ 4 ] = y = "str"; //<- NOT GOOD! index should be '1' not '4'.
// And so on...
//
// Every time 'React11.useState11()' is called the index has 
// to move to the next element, and it does, all good there.
// But when 'setCount11()' and 'setText11()' get called the 
// index has to go back to the value is was when these 
// functions were created



/*** 12 ***/
const React12 = (function(){ //<- react-module.
    let _hooks12 = []; //<- now using array for hook's memory.
    let _i12 = 0; //<- index for hooks array.
    // this is like the state-manager part of the react-module:
    function useState12(initVal12){ 
        const state12 = _hooks12[_i12] || initVal12;
        const setState12 = newVal12 => { _hooks12[_i12] = newVal12; }
        _i12++; //<- everytime 'useState12()' gets called, move to next hook element.
        return [state12, setState12];
    }
    // and this is the module's render-function:
    function render12(Component12){
        _i12 = 0; //<- set index back to 0 here? NOTICE HERE!
        const c12 = Component12();
        c12.render(_i12);
        return c12;
    }
    return { useState12, render12 }; //<- 'React12' === object containing two method.
})();

function Component12(){ //<- react-component.
    const [count12, setCount12] = React12.useState12(1);
    const [text12, setText12] = React12.useState12("Good.");
    return {
        render: (_i12) => console.log("%c LEVEL-4: Component12:", "color: #00ba37;", { count12, text12, _i12 }),
        click: () => setCount12(count12 + 1), //<- adding one to the value here.
        type: (word12) => setText12(word12) //<- changing the text to a new word here.
    }
}

// to use the component with the react-module:
let App12 = React12.render12(Component12); //<- returns 'c12' === '{ render: (), click: () }'
App12.click();
App12 = React12.render12(Component12);
App12.type("Better.");
App12 = React12.render12(Component12);
// Now the problem is that the 'setCount11()' and 'setText11()'
// functions are called kind-of asynchously and each index has
// it's corresponding state but the states are not keeping 
// track of which index is belongs to.
// Here is how this code is running now:
// 0-1:  React12 = (f(){})();
// 0-2:  React12 = { useState12: (), render12: () }
// 1-1:  React12.render12(Component12);
// 1-2:  . index = 0;
// 1-3:  . Component12();
// 1-4:  . . React12.useState12(x)
// 1-5:  . . . _hooks12[ 0++ ] = x;
// 1-6:  . . React12.useState12(y)
// 1-7:  . . . _hooks12[ 1++ ] = y;
// 1-8:  . render(); 
// 1-9:  . . "count11==x and text11==y get logged."
// 1-10: App12.click();
// 1-11: . setCount12(x + 1);
// 1-12: . . _hooks12[ 2 ] = x + 1; //<- NOT GOOD! index should be '0' not '2'.
// 2-1:  React12.render12(Component12)
// 1-2:  . index = 0;
// 2-3:  . Component12();
// 1-4:  . . React12.useState12(x)
// 1-5:  . . . _hooks12[ 0++ ] = x;
// 1-6:  . . React12.useState12(y)
// 1-7:  . . . _hooks12[ 1++ ] = y;
// 1-8:  . render(); 
// 1-9:  . . "count11==x and text11==y get logged."
// 1-10:  App12.type("str");
// 1-11: . setText12("str");
// 1-12: . . _hooks12[ 2 ] = y = "str"; //<- NOT GOOD! index should be '1' not '2'.
// And so on...
//
// All states end up using the last index...
// The fix is to have the states store it's corresponding index.



/*** 13 ***/
const React13 = (function(){ //<- react-module.
    let _hooks13 = []; //<- now using array for hook's memory.
    let _i13 = 0; //<- index for hooks array.
    // this is like the state-manager part of the react-module:
    function useState13(initVal13){ 
        const state13 = _hooks13[_i13] || initVal13;
        const i13 = _i13; //<- store the index here. NOTICE HERE!
        const setState13 = newVal13 => { _hooks13[i13] = newVal13; }
        _i13++; //<- everytime 'useState13()' gets called, move to next hook element.
        return [state13, setState13];
    }
    // and this is the module's render-function:
    function render13(Component13){
        _i13 = 0; //<- set index back to 0 here.
        const c13 = Component13();
        c13.render();
        return c13;
    }
    return { useState13, render13 }; //<- 'React13' === object containing two method.
})();

function Component13(){ //<- react-component.
    const [count13, setCount13] = React13.useState13(1);
    const [text13, setText13] = React13.useState13("Good.");
    return {
        render: () => console.log("%c LEVEL-4: Component13:", "color: #008a20;", { count13, text13 }),
        click: () => setCount13(count13 + 1), //<- adding one to the value here.
        type: (word13) => setText13(word13) //<- changing the text to a new word here.
    }
}

// to use the component with the react-module:
let App13 = React13.render13(Component13); //<- returns 'c13' === '{ render: (), click: () }'
App13.click();
App13 = React13.render13(Component13);
App13.type("Better.");
App13 = React13.render13(Component13);
// now everything is working.



// *** LEVEL-5: Adding 'useEffect' Hooks: ***
/*** 14 ***/
const React14 = (function(){ //<- react-module.
    let _hooks14 = [];
    let _i14 = 0;
    // this is like the state-manager part of the react-module:
    function useState14(initVal14){ 
        const state14 = _hooks14[_i14] || initVal14;
        const i14 = _i14;
        const setState14 = newVal14 => { _hooks14[i14] = newVal14; }
        _i14++;
        return [state14, setState14];
    }
    // and this is the module's render-function:
    function render14(Component14){
        _i14 = 0;
        const c14 = Component14();
        c14.render();
        return c14;
    }

    // here is the useEffect hook:
    function useEffect14(callback14, depArray14){
        let _hasChanged14 = true; //<- now runs every render.
        // needs to detect change here...
        if(_hasChanged14){
            callback14();
        }
    }

    return { useState14, render14, useEffect14 };
})();

function Component14(){ //<- react-component.
    const [count14, setCount14] = React14.useState14(1);
    const [text14, setText14] = React14.useState14("Good.");

    React14.useEffect14(function(){
        // callback function.
        console.log("%c   useEffect-14 Ran!", "color: #c5d9ed;");
    }, []); //<- the '[]' is the dependency array.

    return {
        render: () => console.log("%c LEVEL-5: Component14:", "color: #c5d9ed;", { count14, text14 }),
        click: () => setCount14(count14 + 1),
        type: (word14) => setText14(word14)
    }
}

// to use the component with the react-module:
let App14 = React14.render14(Component14);
App14.click();
App14 = React14.render14(Component14);
App14.type("Better.");
App14 = React14.render14(Component14);
// 'useEffect' is a type of hook, when the hook calls it's
// callback function depends on the dependency array.
// The callback always runs with the first render.
// If the dependency array is empty the callback function
// runs only with the first render.
// if the 'useEffect' function is called without passing in 
// an dependency array, the callback runs every render.
// When there are states in the dependency array the callback
// runs the first render and every time one or more of the 
// states in the dependency array change.
// But how to detect the change to make this work?



/*** 15 ***/
const React15 = (function(){ //<- react-module.
    let _hooks15 = [];
    let _i15 = 0;
    // this is like the state-manager part of the react-module:
    function useState15(initVal15){ 
        const state15 = _hooks15[_i15] || initVal15;
        const i15 = _i15;
        const setState15 = newVal15 => { _hooks15[i15] = newVal15; }
        _i15++;
        return [state15, setState15];
    }
    // and this is the module's render-function:
    function render15(Component15){
        _i15 = 0;
        const c15 = Component15();
        c15.render();
        return c15;
    }

    // here is the useEffect hook:
    function useEffect15(callback15, depArray15){
        const _oldDepArray15 = _hooks15[_i15] //<- this can be undefined.
        let _hasChanged15 = true;
        if(_oldDepArray15){
            // detect change here, compare '_oldDepArray15' with 'depArray15':
            _hasChanged15 = depArray15.some((dep, i) => !Object.is(dep, _oldDepArray15[i]));
            // The 'some()' method tests whether at least one element 
            // in the array returns truein the provided function.
        }
        if(_hasChanged15){
            callback15();
        }
        _hooks15[_i15] = depArray15; //<- store to check for change in next render.
        _i15++;
    }
    // Now everything is working!
    // Be using the same '_hooks15' array as the states to 
    // store the dependency array and then compare it's 
    // values to the values from last render to see if any
    // have change.

    return { useState15, render15, useEffect15 };
})();

function Component15(){ //<- react-component.
    const [count15, setCount15] = React15.useState15(1);
    const [text15, setText15] = React15.useState15("Good.");

    React15.useEffect15(function(){
        // callback function.
        console.log("%c   useEffect-15 Ran!", "color: #72aee6;");
    }, []); //<- the '[]' is the dependency array.

    return {
        render: () => console.log("%c LEVEL-5: Component15:", "color: #72aee6;", { count15, text15 }),
        click: () => setCount15(count15 + 1),
        type: (word15) => setText15(word15)
    }
}

// to use the component with the react-module:
let App15 = React15.render15(Component15);
App15.click();
App15 = React15.render15(Component15);
App15.type("Better.");
App15 = React15.render15(Component15);



/*** 16 ***/
const React16 = (function(){ //<- react-module.
    let _hooks16 = [];
    let _i16 = 0;
    // this is like the state-manager part of the react-module:
    function useState16(initVal16){ 
        const state16 = _hooks16[_i16] || initVal16;
        const i16 = _i16;
        const setState16 = newVal16 => { _hooks16[i16] = newVal16; }
        _i16++;
        return [state16, setState16];
    }
    // and this is the module's render-function:
    function render16(Component16){
        _i16 = 0;
        const c16 = Component16();
        c16.render();
        return c16;
    }
    // here is the useEffect hook:
    function useEffect16(callback16, depArray16){
        const _oldDepArray16 = _hooks16[_i16]
        let _hasChanged16 = true;
        if(_oldDepArray16){
            _hasChanged16 = depArray16.some((dep, i) => !Object.is(dep, _oldDepArray16[i]));
        }
        if(_hasChanged16){
            callback16();
        }
        _hooks16[_i16] = depArray16;
        _i16++;
    }
    return { useState16, render16, useEffect16 };
})();

function Component16(){ //<- react-component.
    const [count16, setCount16] = React16.useState16(1);
    const [text16, setText16] = React16.useState16("Good.");
    React16.useEffect16(function(){
        // callback function.
        console.log("%c   useEffect-16 Ran! No dependency array.", "color: #f86368;");
    });
    React16.useEffect16(function(){
        // callback function.
        console.log("%c   useEffect-16 Ran! Empty dependency array.", "color: #dba617;");
    }, []);
    React16.useEffect16(function(){
        // callback function.
        console.log("%c   useEffect-16 Ran! Depending on 'text16'.", "color: #00ba37;");
    }, [text16]);
    return {
        render: () => console.log("%c LEVEL-5: Component16:", "color: #3582c4;", { count16, text16 }),
        click: () => setCount16(count16 + 1),
        type: (word16) => setText16(word16)
    }
}

// to use the component with the react-module:
console.log("\n");
let App16 = React16.render16(Component16);
App16 = React16.render16(Component16);
App16.click();
App16 = React16.render16(Component16);
App16 = React16.render16(Component16);
App16.type("Better.");
App16 = React16.render16(Component16);
App16 = React16.render16(Component16);





// *** LEVEL-6: Another example on how implementing this: ***
const MyReact = (function(){
    let hooks = []; // array of hooks.
    let currentHook = 0; // an iterator.
    return {
        useState(initialValue){
            hooks[currentHook] = hooks[currentHook] || initialValue; // type: any.
            const setStateHookIndex = currentHook; // for setState's closure!
            const setState = (newState) => { hooks[setStateHookIndex] = newState; }
            return [hooks[currentHook++], setState];
        },
        render(Component){
            const Comp = Component(); // run effects.
            Comp.render();
            currentHook = 0; // reset for next render.
            return Comp;
        },
        useEffect(callback, depArray){
            const hasNoDeps = !depArray;
            const deps = hooks[currentHook]; // type: array | undefined.
            const hasChangedDeps = deps ? !depArray.every((el, i) => el === deps[i]) : true;
            if( hasNoDeps || hasChangedDeps ){
                callback();
                hooks[currentHook] = depArray;
            }
            currentHook++; // done with this hook.
        },
    }
})();

function Counter(){
    const [count, setCount] = MyReact.useState(100);
    const [text, setText] = MyReact.useState("Good."); // 2nd state hook!
    const [URL, setURL] = useSplitURL("www.netlify.com"); // custom hook.
    MyReact.useEffect(() => {
        console.log("%c   useEffect Ran! Depending on: 'count' and 'text'.", "color: #00ba37;");
    }, [count, text]);
    return {
        click: () => setCount(count + 1),
        type: (txt) => setText(txt),
        noop: () => setCount(count),
        typeURL: (txt) => setURL(txt),
        render: () => console.log('render', { count, text }, { URL }),
    }
}

// Custom hook (please start with 'use'):
function useSplitURL(str){
    const [textURL, setTextURL] = MyReact.useState(str);
    console.log("  ", textURL);
    const masked = textURL.split('.');
    return [masked, setTextURL];
}

console.log("\n*** LEVEL-6 ***", MyReact);
let App = MyReact.render(Counter)
App.click()
App = MyReact.render(Counter)
App.type("Better.")
App = MyReact.render(Counter)
App.noop()
App = MyReact.render(Counter)
App.click()
App = MyReact.render(Counter)

App = MyReact.render(Counter);
App.typeURL('www.reactjs.org');
App = MyReact.render(Counter);





// Colors:
/*      Black:  Black:  Black:  Black:  Black:  Black:  White:  White:  White:  White:  White:  White:
        1:      5:      10:     20:     30:     40:     50:     60:     70:     80:     90:     100:  
Blue:   #f0f6fc #c5d9ed #9ec2e6 #72aee6 #4f94d4 #3582c4 #2271b1 #135e96 #0a4b78 #043959 #01263a #00131c
Gray:   #f6f7f7 #dcdcde #c3c4c7 #a7aaad #8c8f84 #787c82 #646970 #50575e #3c434a #2c3338 #1d2327 #101517
Red:    #fcf0f1 #facfd2 #ffabaf #ff8085 #f86368 #e65054 #d63638 #b32d2e #8a2424 #691c1c #451313 #240a0a
Yellow: #fcf9e8 #f5e6ab #f2d675 #f0c33c #dba617 #bd8600 #996b00 #755100 #614200 #4a3200 #362400 #211600
Green:  #edfaef #b8e6bf #68de7c #1ed14b #00ba37 #00a32a #008a20 #007017 #005c12 #00450c #003008 #001c05
*/