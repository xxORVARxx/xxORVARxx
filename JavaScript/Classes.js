"use strict"; // WHOLE-SCRIPT STRICT MODE SYNTAX.



// *** STATIC: ***

// the keyword 'static' is used in classes:
class cStorage{
    static static_method(){ console.log("Class static_method."); }
    some_method(){ console.log("Class some_method."); }
}

// static in classes is equivalent to this:
function Storage(){ /* ... */ }
Storage.static_method = function static_method(){ console.log("Object static_method."); };
Storage.prototype.some_method = function some_method(){ console.log("Object some_method.") };
// and when we create new object

// calling the static methods:
cStorage.static_method();
Storage.static_method();

// constructing new instances of the class/object:
var cstor = new cStorage();
var stor = new Storage();

// calling the normal methods:
cstor.some_method();
stor.some_method();


/*
Operator 'new' do this things:

1 - Create new object and set this object 'prototype' 
    (real prototype, not just property with name prototype) 
    to property with name prototype of Storage 'Storage.prototype'. 
    Equivalent is 'var obj = Object.create(Storage.prototype);'.

2 - Call Storage() and bind created object as this inside function. 
    Equivalent is 'Storage.call(obj)'.
    
3 - When function have executed and done some staff with 'obj' we 
    can assign 'obj' to 'stor'. Equivalent is 'stor = obj'.

So we have new object which have 'someMethod' in prototype and haven't access to 'staticMethod'.

https://bvaughn.github.io/babel-repl/
*/



