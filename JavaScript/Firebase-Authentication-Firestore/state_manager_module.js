"use strict" // WHOLE-SCRIPT STRICT MODE SYNTAX.

/*
to inport this module add the to your main js file:
    import state_manager from "./state_manager_module.js";
and add this to your index.html file:
    <script type="module" src="./state_manager_module.js"></script>

how to use:

    // some callback functions you want to be called when you update your dataset:
    function fb_one(core_str, data_obj){
        console.log(`one - This is callbakk on changeses in core: '${core_str}'!`, data_obj);
    }
    function fb_two(core, data){
        console.log(`two - This is callbakk on changeses in core: '${core}'!`, data);
    }

    // create new cores to hold your data:
    state_manager.add_core("dataset_one");
    state_manager.add_core("dataset_two");

    // add some data to the cores:
    state_manager.set("dataset_one", {one:"hello", two:"world"});
    state_manager.set("dataset_two", {x:10, y:20, z:0.5, id:"Ys9Jzzg8D1Z4"});

    // to subscribe and get notified when a core changes:
    state_manager.subscribe(["dataset_one"], fb_one, "Some message!");
    // the same callback function can lisen to many cores:
    state_manager.subscribe(["dataset_one", "dataset_two"], fb_two, "Some message two!");

    // to change a core data and notified all the subscribers:
    state_manager.set("dataset_one", {one:"Hello", two:"World", three:"!"});
    // to change a core data without emiting notification to the subscribers:
    state_manager.set("dataset_two", {type:"qube"}, false);

    // to manually emit to all subscribers:
    state_manager.emit("dataset_two");

    // to delete data from a core: (can also not emit notification)
    state_manager.delete("dataset_two", ["id", "x"]);

    // to unsubscribe for when you no longer need to get notified about core changes:
    state_manager.unsubscribe(["dataset_one"], "fb_one");
    state_manager.unsubscribe(["dataset_one", "dataset_two"], "fb_two");
    state_manager.set("dataset_one", {is_anybody_there: false});

    // you can also deleat cores:
    state_manager.delete_core("dataset_one");
    // and to check if core exists:
    console.log(state_manager.has_core("dataset_one"));
*/



let state_manager_instance = null;

export default (function(){

    function Manager(){
        // ---PRIVATE---
        const mf_is_string = function(s){
            return Object.prototype.toString.call(s) === "[object String]";
        }

        const mf_get_core = function(core){
            if( ! mf_is_string(core)){
                return null;
            }
            if(m_cores.hasOwnProperty(core)){
                return m_cores[core];
            }
            console.warn(`State-Manager: can't get core '${core}'. core does not exist!`);
            return null;
        }

        const mf_emit = function(core){
            const c = m_cores[core];
            c.changed = false;
            c.subscribers.forEach(function(callback){
                console.log(callback.message);
                callback(core, c.data);
            });
        }

        const m_cores = {};

        // ---PUBLIC---
        this.add_core = function(core, values_obj = {}){
            if( ! mf_is_string(core)){
                console.warn(`State-Manager: can't add core, not a string: '${core}'!`);
                return;
            }
            if(m_cores.hasOwnProperty(core)){
                console.warn(`State-Manager: can't add core '${core}'. core already exists!`);
                return;
            }
            m_cores[core] = {changed: true, subscribers: [], data: values_obj};
        }

        this.get_core = function(core){
            const c = mf_get_core(core);
            if( ! c){
                return null; 
            }
            return c.data;
        }

        this.has_core = function(core){
            return m_cores.hasOwnProperty(core);
        }

        this.delete_core = function(core){
            if(mf_is_string(core) && m_cores.hasOwnProperty(core)){
                delete m_cores[core];
                return;
            }
            console.warn(`State-Manager: can't delete core '${core}'. core does not exist!`);
        }
        
        this.get = function(core, prop){
            const c = mf_get_core(core);
            if(c){
                return c.data[prop]; 
            }
            return null;
        }
        
        this.set = function(core, values_obj, emit = true){
            if(Array.isArray(core) || typeof values_obj !== 'object'){
                console.warn(`State-Manager: can't set values, not an object: '${values_obj}'!`);
                return;
            }
            const c = mf_get_core(core);
            if( ! c){
                return;
            }
            for(let prop in values_obj){
                c.changed = true;
                c.data[prop] = values_obj[prop];
            }
            if(emit){
                mf_emit(core);
            }
        }

        this.keep = function(core, values_arr, emit = true){
            if(! Array.isArray(values_arr)){
                console.warn(`State-Manager: can't keep, not an array: '${values_arr}'!`);
                return;
            }
            const c = mf_get_core(core);
            if( ! c){
                return;
            }
            for(let prop in c.data){
                if( ! c.data.hasOwnProperty(prop)) {
                    continue;
                }
                else if(values_arr.includes(prop)){
                    continue;
                }
                c.changed = true;
                delete c.data[prop];
            }
            if(emit){
                mf_emit(core);
            }
        }

        this.delete = function(core, values_arr, emit = true){
            if(! Array.isArray(values_arr)){
                console.warn(`State-Manager: can't delete, not an array: '${values_arr}'!`);
                return;
            }
            const c = mf_get_core(core);
            if( ! c){
                return
            }
            for(let value of values_arr){
                c.changed = true;
                delete c.data[value];
            }
            if(emit){
                mf_emit(core);
            }
        }

        this.emit = function(core, unconditional = false){
            if(mf_get_core(core)){
                if(unconditional){
                    c.changed = true;
                }
                mf_emit(core);
            }
        }

        this.subscribe = function(cores_arr, callback, message){
            if( ! Array.isArray(cores_arr)){
                console.warn(`State-Manager: can't subscribe, not an array: '${cores_arr}'!`);
                return;
            }
            for(let core of cores_arr){
                const c = mf_get_core(core);
                if( ! c){
                    continue;
                }
                else if(c.subscribers.includes(callback)){
                    continue;
                }
                callback.message = message;
                c.subscribers.push(callback);
            }
        }

        this.unsubscribe = function(cores_arr, callback){
            if( ! Array.isArray(cores_arr)){
                console.warn(`State-Manager: can't unsubscribe, not an array: '${cores_arr}'!`);
                return;
            }
            for(let core of cores_arr){
                const c = mf_get_core(core);
                if( ! c){
                    continue;
                }
                else if(c.subscribers.includes(callback)){
                    c.subscribers.splice(c.subscribers.indexOf(callback), 1);
                }
            };
        }
    };

    return state_manager_instance ? state_manager_instance : state_manager_instance = new Manager();
})(); 
// calling the function to 'export' this module as the object returned be the function,
// otherwise this module would be a function.

// https://betterprogramming.pub/pure-javascript-pattern-for-state-management-75fedf0916f6