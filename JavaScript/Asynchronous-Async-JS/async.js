"use strict" // WHOLE-SCRIPT STRICT MODE SYNTAX.

/*** HTTP response status codes ***
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 *  100-199 -> Informational responses.
 *  200–299 -> Successful responses.
 *  300–399 -> Redirects.
 *  400–499 -> Client errors.
 *  500–599 -> Server errors.
 */

/*** *** Asynchronous/Async JavaScript *** ***
 * https://www.youtube.com/watch?v=ZcQyJ-gxke0&list=PL4cUxeGkcC9jx2TTZk3IGWKSbtugYdrlu
 * 
 * Using JSONPlaceholder as fake online REST API for testing:
 *   https://jsonplaceholder.typicode.com/
 * Here is a endpoint to use for testing:
 *   https://jsonplaceholder.typicode.com/todos/1
 */


/*** 1 ***/
//asynchronous_old_http_request();
/*** 2 ***/
//asynchronous_old_http_request_with_callback();
/*** 3 ***/
//asynchronous_old_http_request_with_callback_and_parse_my_JSON();
/*** 4 ***/
//callback_hell_multiple_http_request();
/*** 5 ***/
//basic_promise_example();
/*** 6 ***/
//using_promises();
/*** 7 ***/
//chaining_promises();
/*** 8 ***/
//the_fetch_API_request();
/*** 9 ***/
//basic_promise_example_with_async_and_await();
/*** 10 ***/
//wait_until_all_promises_have_completed();
/*** 11 ***/
//async_and_await_for_readability();
/*** 12 ***/
//async_and_await_returning_data();
/*** 13 ***/
async_and_await_throwing_errors();


/*** 1 ***/
function asynchronous_old_http_request(){
    // old way of doing a Http request to a server: (build in the JS language)
    const request_obj = new XMLHttpRequest();

    // To keep track on the request after is is sent:
    request_obj.addEventListener("readystatechange", () => {
        // Asynchronous function.
        // logging the different readyStates:
        console.log(request_obj, "State:" + request_obj.readyState);
        /*** the XMLHttpRequest.readyState property: ***
         * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
         *  '0' ->  UNSENT            client has been created. open() not called yet.
         *  '1' ->  OPENED            open() has been called.
         *  '2' ->  HEADERS_RECEIVED  send() has been called, and headers and status are available.
         *  '3' ->  LOADING           downloading; responseText holds partial data.
         *  '4' ->  DONE              The operation is complete.
         */ 

        // printing the data when the 'readystatechange' is '4' and everything is ready:
        if(request_obj.readyState === 4){
            // printing the data only if the HTTP request has been successfully:
            if(request_obj.status === 200){
                // success:
                console.log(request_obj.responseText);
            } else{
                // error:
                console.log("Could not fetch the data.");
            }
        }
    });

    // Seting op the request:
    request_obj.open("GET", "https://jsonplaceholder.typicode.com/todos/");
    // Sending the request:
    request_obj.send();
}



/*** 2 ***/
function asynchronous_old_http_request_with_callback(){
    // putting everything inside a function and passing a callback function:
    const getTodos = (my_callback) => {
        const request_obj = new XMLHttpRequest();

        request_obj.addEventListener("readystatechange", () => {
            // Asynchronous function.
            if(request_obj.readyState === 4 && request_obj.status === 200){
                // success:
                my_callback(undefined, request_obj.responseText);
            } else if(request_obj.readyState === 4){
                // error:
                my_callback("Could not fetch the data.", undefined);
            }
        });

        request_obj.open("GET", "https://jsonplaceholder.typicode.com/todos/");
        request_obj.send();
    };

    console.log("Now 1");
    console.log("Now 2");

    getTodos((error, data) => {
        // Asynchronous callback function.
        console.log("The Asynchronous Callback Function!!");
        if(error){
            console.log(error);
        } else{
            console.log(data);
        }
    });

    console.log("Now 3");
    console.log("Now 4");
}



/*** 3 ***/
function asynchronous_old_http_request_with_callback_and_parse_my_JSON(){
    const getTodos = (my_callback) => {
        const request_obj = new XMLHttpRequest();
        request_obj.addEventListener("readystatechange", () => {
            if(request_obj.readyState === 4 && request_obj.status === 200){
                // success:
                // Turing the JSON data into JS objects:
                const my_data = JSON.parse(request_obj.responseText);
                my_callback(undefined, my_data);

            } else if(request_obj.readyState === 4){
                // error:
                my_callback("Could not fetch the data.", undefined);
            }
        });

        // Geting JSON from my local file:
        request_obj.open("GET", "/my_todo_JSON_data/orvar.json");
        request_obj.send();
    };

    getTodos((error, data) => {
        // Asynchronous callback function.
        console.log("The Asynchronous Callback Function!!");
        if(error){
            console.log(error);
        } else{
            console.log(data);
        }
    });
}



/*** 4 ***/
function callback_hell_multiple_http_request(){
    // get ToDos from multiple source:
    const getTodos = (resource, my_callback) => {
        const request_obj = new XMLHttpRequest();
        request_obj.addEventListener("readystatechange", () => {
            if(request_obj.readyState === 4 && request_obj.status === 200){
                // success:
                const my_data = JSON.parse(request_obj.responseText);
                my_callback(undefined, my_data);

            } else if(request_obj.readyState === 4){
                // error:
                my_callback("Could not fetch the data.", undefined);
            }
        });

        request_obj.open("GET", resource);
        request_obj.send();
    };

    // geting the data in order, wait for one to finish before getting the next.
    getTodos("/my_todo_JSON_data/haffi.json", (error, data) => {
        // Asynchronous callback function.
        console.log("The Asynchronous Callback Function!!");
        console.log(data);
        getTodos("/my_todo_JSON_data/ivar.json", (error, data) => {
            console.log("The Asynchronous Callback Function!!");
            console.log(data);
            getTodos("/my_todo_JSON_data/orvar.json", (error, data) => {
                // This is callback hell!
                console.log("The Asynchronous Callback Function!!");
                console.log(data);
            });
        });
    });
}



/*** 5 ***/
function basic_promise_example(){
    const getSomeData = (is_okay) => {
        // returning a promise here, 
        // that will call the 'then()' function when the data is ready
        // and we have called the 'resolve' or 'reject' function:
        return new Promise((resolve, reject) => {
            // fetch some data...
            if(is_okay){
                resolve("Some Good Data.");
            }else{
                reject("We have Some Error!!!");
            }
        });
    };

    getSomeData(true).then((data) => {
        console.log(data);
    }, (error) => {
        console.log(error);
    });

    getSomeData(false).then(data => {
        console.log(data);
    }).catch(error => {
        console.log(error);
    });
}



/*** 6 ***/
function using_promises(){
    const getTodos = (my_resource) => {

        // returning a promise here:
        return new Promise((resolve, reject) => {
            const request_obj = new XMLHttpRequest();
            request_obj.addEventListener("readystatechange", () => {
                if(request_obj.readyState === 4 && request_obj.status === 200){
                    // success:
                    const my_data = JSON.parse(request_obj.responseText);
                    // Asynchronous callback function:
                    resolve(my_data);
                } else if(request_obj.readyState === 4){
                    // error:
                    // Asynchronous callback function:
                    reject("ERROR! Could not fetch the data.");
                }
            });

            request_obj.open("GET", my_resource);
            request_obj.send();
        });
    }


    getTodos("/my_todo_JSON_data/haffi.json").then(data => {
        // Asynchronous callback function:
        console.log("Promise Resolved: ", data);
    }).catch(error => {
        console.log("Promise Rejected: ", error);
    });
}



/*** 7 ***/
function chaining_promises(){
    const getTodos = (my_resource) => {
        // returning a promise here:
        return new Promise((resolve, reject) => {
            const request_obj = new XMLHttpRequest();

            request_obj.addEventListener("readystatechange", () => {
                if(request_obj.readyState === 4 && request_obj.status === 200){
                    // success:
                    const my_data = JSON.parse(request_obj.responseText);
                    // Asynchronous callback function:
                    resolve(my_data);
                } else if(request_obj.readyState === 4){
                    // error:
                    // Asynchronous callback function:
                    reject("ERROR! Could not fetch the data.");
                }
            });

            request_obj.open("GET", my_resource);
            request_obj.send();
        });
    }

    getTodos("/my_todo_JSON_data/haffi.json").then(data => {
        // the first Asynchronous callback function:
        console.log("First Promise Resolved: ", data);
        // returning the second promise here:
        return getTodos("/my_todo_JSON_data/ivar.json");
    }).then(data => {
        // the second Asynchronous callback function:
        console.log("Second Promise Resolved: ", data);
        // returning the third promise here:
        return getTodos("/my_todo_JSON_data/orvar.json");
    }).then(data => {
        // the third Asynchronous callback function:
        console.log("Third Promise Resolved: ", data);
    }).catch(error => {
        // catching exceptions/errors from any of the three promises above:
        console.log("Promise Rejected: ", error);
    });
}



/*** 8 ***/
function the_fetch_API_request(){
    // switching out the old 'XMLHttpRequest()' for the newer 'fetch API'.
    // the 'fetch()' function returns a promise:
    fetch("/my_todo_JSON_data/orvar.json").then((response) => {
        // the 'fetch' will say the promise is 'resolved' but 
        // not 'rejected' even when the 'status' is not 200.
        console.log("Promise Resolved: ", response);
        // to find the JSON data in the 'response' object that 
        // the 'fetch' function returns we use the 'json()' method 
        // that the 'response' object inherit.

        // the 'json()' method returns a promise that we can use to get the data:
        return response.json();
    }).then((my_json_data) => {
        // callback function from the 'response.json()' method.
        console.log(my_json_data);
    }).catch((error) => {
        // catching exceptions/errors from of the promises above:
        console.log("Promise Rejected: ", error);
    });
}



/*** 9 ***/
// notice the 'async' keyword here:
async function basic_promise_example_with_async_and_await(){
    // the 'setTimeout()' function doesn't return a Promise so we wrap it in a promise:
    function f_wait_for(delay){
        return new Promise(function (resolve){
            setTimeout(resolve, delay);
        });
    };

    console.log("Start...");
    await f_wait_for(2000);
    console.log("...Done!");

    // and the old way would be like this:
    console.log("Start, old way...");
    f_wait_for(2000).then(function(){
        console.log("...Done, old way!");
    });
}



/*** 10 ***/
// notice the 'async' keyword here:
async function wait_until_all_promises_have_completed(){
    // this is the array we will 'map' through:
    const wait_arr = [1000, 4000, 2000, 3000, 3100, 1100];
    // this is the callback-function we use when 'map'ing the array:
    async function on_wait(wait, i, arr){
        await function(){
            return new Promise(function(resolve){
                setTimeout(resolve, wait);
            });
        }();
        console.log(`Index: ${i} | Waited ${wait / 1000} sec.`);
    }

    console.log("Start...");
    await Promise.all(wait_arr.map(on_wait));
    console.log("...Done!  Finished all of the promises asynchronously!");
}



/*** 11 ***/
// https://www.youtube.com/watch?v=CWjNefiE47Y&list=PL4cUxeGkcC9jx2TTZk3IGWKSbtugYdrlu&index=10
function async_and_await_for_readability(){
    // to make a function an Asynchronous function we use the 'async' keyword:
    const getTodos = async () => {
        // an 'async' function always automatically returns a promise so
        // the 'getTodos' variable here above is a promise.

        // we can instead of using the 'then()' callback function we can use 
        // the 'await' keyword. This vill make the JS-code stop here and wait
        // for the results from the 'fetch' function.
        const the_response = await fetch("/my_todo_JSON_data/ivar.json");
        // remember we are in an Asynchronous function here, not the main thread.

        // and now when we have waited for the response, we can use it:
        console.log("The Response Status: ", the_response.status);

        // to get the JSON data we use the 'json()' method that returns a promise
        // and we can use the 'await' again:
        const the_data = await the_response.json();
        console.log("The JSON Data: ", the_data);
    }

    // calling the Asynchronous function above:
    getTodos();
}



/*** 12 ***/
function async_and_await_returning_data(){
    const getTodos = async () => {
        // Asynchronous function in another thread.
        const the_response = await fetch("/my_todo_JSON_data/ivar.json");
        const the_data = await the_response.json();
        return the_data;
    }

    console.log("Now 1");
    console.log("Now 2");

    getTodos().then(json_data => { 
        console.log("Promise Resolved: ", json_data); 
    });

    console.log("Now 3");
    console.log("Now 4");
}



/*** 13 ***/
function async_and_await_throwing_errors(){
    const getTodos = async (my_resource) => {
        // Asynchronous function in another thread.

        const the_response = await fetch(my_resource);
        if(the_response.status !== 200){
            throw new Error("ERROR! Could not fetch the data. (status not 200)");
        }
        return await the_response.json();
    }

    getTodos("/my_todo_JSON_data/haffi.json")
        .then(json_data => { console.log("Promise Resolved: ", json_data); })
        .catch(error =>{ console.log("Promise Rejected: ", error.message); });
}
