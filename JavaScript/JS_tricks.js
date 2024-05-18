"use strict"; // WHOLE-SCRIPT STRICT MODE SYNTAX.



// debugging with 'console.log', use objects to get variables names:
const foo = {name: "Örvar",  age: 31, ner: true};
const bar = {name: "Ívar",   age: 28, ner: true};
const baz = {name: "Kasper", age: 20, ner: false};
// bad way:
console.log("Bad way:", foo, bar, baz);
// good way:
console.log("Good way:", {foo, bar, baz});

// log simuler data as table:
console.table([foo, bar, baz]);

// use css stiles to make console log stand out:
console.log("%c My Cool Log!", "color: green; font-weight: bold;");

// console timing:
console.time("looper_time");
let i = 0;
while(i  < 1000000){ i++ }
console.timeEnd("looper_time");

// stack trace log:
const delete_some = () => console.trace("bye, bye database!");
delete_some();
delete_some();



// destructuring:
const turtle = {
    animal: "turtle",
    name: "Blob",
    age: 80,
    legs: 4,
    type: "amphibious",
    meal: 10,
    diet: "berries",
    special: "shell"
};
// bad way:
function feed1(animal){
    return `Feed ${animal.name} ${animal.meal} kilos of ${animal.diet}.`
}
feed1(turtle);

// good way:
function feed2({name, meal, diet}){
    return `Feed ${name} ${meal} kilos of ${diet}.`
}
feed2(turtle);



// template literals:
function parse_age(strarr, age){
    const age_str = age > 75 ? "old" : "young";
    return `${strarr[0]}${age_str} at ${age} years${strarr[1]}`
}
const text = parse_age`This turtle is ${turtle.age}. :)`;



// spread syntax:
const warrior1 = {name: "Abrafo"};
const warrior2 = {name: "Gideon"};
const stats = {hp: 40, attack: 60, defense: 45};
// bad way:
warrior1["hp"] = stats.hp;
warrior1["attack"] = stats.attack;
warrior1["defense"] = stats.defense;
// good way:
const warrior_lv5 = {...warrior2, ...stats, hp: 45};

// arrays:
const warriors = ["Alfonsia", "Aloisia", "Bathilda",];
// push:
warriors = [...warriors, "Brunhilde", "Humbert", "Lothar",];
// shift:
warriors = ["Brunhilde", "Humbert", "Lothar", ...warriors,];



// loops:
const orders = [500, 30, 99, 15, 223];
// bad way:
let total = 0;
let with_tax = [];
let high_value = [];
for(let i = 0; i < orders.length; i++){
    // reduce:
    total += orders[i];
    // map:
    with_tax.push(orders[i] * 1,245);
    // filter:
    if(orders[i] > 100){
        high_value.push(orders[i])
    }
}
// good way:
total = orders.reduce(function(acc, curr){ return acc + curr; });
with_tax = orders.map(function(v){ return v * 1.245; });
high_value = orders.filter(function(v){ return v > 100; });
// same:
total = orders.reduce((acc, curr) => acc + curr );
with_tax = orders.map(v => v * 1.245 );
high_value = orders.filter(v => v > 100 );