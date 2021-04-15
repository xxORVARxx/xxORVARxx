"use strict" // WHOLE-SCRIPT STRICT MODE SYNTAX.

// wait for this 'DOMContentLoaded' event makes it possible for us to move the JavaScritp
// files into <head> tag in 'index.html' file, but with 'firebase' we dont do this.
// we wait for the DOM to fully load before we start manipulating it:
document.addEventListener("DOMContentLoaded", function(){
    // Asynchronous callback function.

    /***  Global-Data: ***/
    let g_user_fs_data = {};
    var unsubscribe_listener = null;

    /*** 1 ***/
    signup_create_user_with_email();

    /*** 2 ***/
    login_user_with_email();

    /*** 3 ***/
    logout_user();
    
    // this 'onAuthStateChanged' event heppens every time user logs-in, -out or signes-up,
    // if user is logged-in we get the 'credentials' but if user is logged-out we get 'null'.
    fb_auth.onAuthStateChanged(function(user){
        // Asynchronous callback function.
        
        /*** 4 ***/
        auth_state_conditional_DOMContent(user);

        // https://medium.com/@naveenkarippai/learning-how-references-work-in-javascript-a066a4e15600
        // - there are NO pointers in JS! and references are NOT pointers.
        // - references can only point at it's values and can NOT point at other variables or references.
        // - references are pointers to value, stored in a variables.
        // - reassign a variable will create a NEW reference!
        // primitive types: (Number, String, Boolean, undefined, null, Symbol):
        //  - are assigned-by-value.
        //  - are unchangeable / immutable / 'const'.
        // compound types: (Object, Array):
        //  - are assigned-by-reference.
        //  - changeable / mutable
        // reassignment of variables containing references, will creates a new reference and the old is lost!
        // there are two ways to copy/clone compound types: shallow-copy and deep-copy.
        // - shallow-copy is a bit-wise copy of an object.
        //   If any of the fields of the object are references to other objects, just the reference 
        //   addresses are copied i.e., only the memory address is copied.
        //   the 'Object.assign()' method is a sort of shallow-copy but it will invoke getters and setters.
        // - deep-copy is when an object is copied along with all the objects to which it refers.

        /*** 5 ***/
        get_data_from_firestore_and_update_user_bio(user, function(fs_data){
            // Asynchronous callback function.

            // if user is logged out remove all data from 'g_user_fs_data':
            for(let key in g_user_fs_data){
                delete g_user_fs_data[key];
            }
            // shallow-copying from 'fs_data' to 'g_user_fs_data': 
            // because reassign a variable containing a references, will just creates a new reference!
            for(let key in fs_data){
                g_user_fs_data[key] = fs_data[key];
            }
            // now other functions using 'g_user_fs_data' will have the updated value.

            /*** 6 ***/
            display_welcomebanner_for_first_time_users(user, fs_data);

        });
        if(user){
            // user is signed in.
            /*** 7 ***/
            add_new_books_to_firestore_database(user, g_user_fs_data);    

            /*** 8 ***/
            handling_DOMs_delete_and_edit_buttons(user);

            // getting data from firestore (the books), using a realtime-listener,
            // this means that every time the data changes on the firestore-database
            // the callback-function is executed and we will reload the content with
            // the newest snapshot of the database:
            unsubscribe_listener = fb_store.collection("fs_books").onSnapshot(function(snapshot){
                // Asynchronous callback function.

                /*** 9 ***/
                display_content_from_firestore(user, snapshot.docs);

            }, function(err){
                // handle errors here.
                console.log("NOTE! if you are getting errors like this: \n", 
                            '"FirebaseError: Missing or insufficient permissions. ..." \n',
                            "check if your Cloud-Firestore security-rules are working!");
                console.error(err);
            });

        }
        else{
            // user NOT signed in.
            if(unsubscribe_listener){
                // stop listening to changes on the firestore-database:
                unsubscribe_listener();
                unsubscribe_listener = null;
            }

            /*** 10 ***/
            display_content_for_unauthorized_users();

        }
    });

});







/*** 1 ***/
function signup_create_user_with_email(){

    function f_error_reset(signup_form){
        signup_form.querySelector(".c_error_text").innerHTML = "";
    }

    function f_get_form_data(signup_form){
        const email = signup_form["id_signup-email"].value;
        const password_1 = signup_form["id_signup-password"].value;
        const password_2 = signup_form["id_signup-password-again"].value;
        const nickname = signup_form["id_signup-nickname"].value;
        if(password_1 !== password_2){
            throw new Error("You need to input the same password twice");
        }
        if(nickname.length > 30 || nickname.length < 4){
            throw new Error("Your nickname must be between 4 and 30 characters long");
        }
        return { 
            email: email,
            password: password_1,
            nickname: nickname
        };
    }
    
    function f_save_user_info(the_credential, signup_obj){
        // data to save to firebase-firestore database:
        const private_info = {
            fs_nickname: signup_obj.nickname,
            fs_email: signup_obj.email,
            fs_first_time: true
        };
        // if the collection does not exist, firestore will create it for us.
        // make the user's firestore data have the same 'uid' as the user's auth 'uid',
        // then way we know which data goes with which user:
        return fb_store.collection("fs_users").doc(the_credential.user.uid).set(private_info);
        // returning a 'promise'.
    }

    const signup_form = document.querySelector("#id_signup-form");
    signup_form.addEventListener("submit", async function signup_event(e){
        // Asynchronous function in another thread.
        // keeping page from refreshing and clearing error-text if any:
        e.preventDefault();
        f_error_reset(signup_form);

        try{
            const signup_obj = f_get_form_data(signup_form);

            // using email and password from form to register new user with firebase-auth:
            const the_credential = await fb_auth.createUserWithEmailAndPassword(signup_obj.email, signup_obj.password);

            // saving some info about user to firebase-firestore database and linking the 
            // database it to the user be having the database and user share the same uid.
            await f_save_user_info(the_credential, signup_obj);
        }
        catch(err){
            // handle errors here.
            signup_form.querySelector(".c_error_text").innerHTML = err.message;
            console.error(err);
            return;
        }

        console.log("You have successfully signed up!");
        // clearing form and error-text if any:
        signup_form.reset();
        f_error_reset(signup_form);
    });
}
   


/*** 2 ***/
function login_user_with_email(){

    function f_error_reset(login_form){
        login_form.querySelector(".c_error_text").innerHTML = "";
    }

    async function f_update_user_info(the_credential){
        const obj = {
            fs_first_time: false
        };
        return fb_store.collection("fs_users").doc(the_credential.user.uid).update(obj);
    }

    const login_form = document.querySelector("#id_login-form");
    login_form.addEventListener("submit", async function(e){
        // Asynchronous function in another thread.
        e.preventDefault();
        f_error_reset(login_form);
        const email = login_form["id_login-email"].value;
        const password = login_form["id_login-password"].value;
        try{
            // using email and password from form to login user with firebase-auth:
            const the_credential = await fb_auth.signInWithEmailAndPassword(email, password);

            // not a first-time user anymore:
            await f_update_user_info(the_credential);
        } 
        catch(err){
            // handle errors here.
            login_form.querySelector(".c_error_text").innerHTML = err.message;
            console.error(err);
            return;
        }

        console.log("You have successfully logged in!");
        // clearing form and error-text if any:
        login_form.reset();
        f_error_reset(login_form);
    });
}



/*** 3 ***/
function logout_user(){

    function f_error_reset(logout_form){
        logout_form.querySelector(".c_error_text").innerHTML = "";
    }

    const logout_form = document.querySelector("#id_logout-form");
    logout_form.addEventListener("submit", async function(e){
        // Asynchronous callback function in another thread.
        e.preventDefault();
        f_error_reset(logout_form);

        try{
            // logout user:
            await fb_auth.signOut();
        }
        catch(err){
            // handle errors here.
            logout_form.querySelector(".c_error_text").innerHTML = err.message;
            console.error(err);
            return;
        }

        console.log("You have successfully logged out!");
        f_error_reset(logout_form);
    });
}



/*** 4 ***/
function auth_state_conditional_DOMContent(user){
    const logged_out_links = document.querySelectorAll(".c_auth-logged-out");
    const logged_in_links = document.querySelectorAll(".c_auth-logged-in");

    let hide_in = "none";
    let hide_out = "block";
    if(user){
        hide_in = "block";
        hide_out = "none";
    }

    logged_in_links.forEach( link => link.style.display = hide_in );
    logged_out_links.forEach( link => link.style.display = hide_out );
}



/*** 5 ***/
async function get_data_from_firestore_and_update_user_bio(user, f_welcome_banner){
    // Asynchronous function.
    const nickname = document.querySelector("#id_nickname");
    const email = document.querySelector("#id_email");
    let data = null;
    if(user){
        try{
            // seting-up the document we want to get. It's in the collection: 'fs_users' 
            // and has the same document-ID as the user's 'uid':
            const fb_doc = fb_store.collection("fs_users").doc(user.uid);
            // now we will fetch the data from the 'document' on the firestore database:
            const fb_data = await fb_doc.get();
            // to extracted the data from the 'DocumentSnapshot' use '.get("my_field")' or:
            data = fb_data.data();

            nickname.innerHTML = `Books for ${data.fs_nickname}!`;
            email.innerHTML = data.fs_email;

        }
        catch(err){
            // handle errors here.
            console.error(err);
            return;
        }
    }
    else{
        nickname.innerHTML = "Books for you";
        email.innerHTML = "";
    }
    // calling the calback-function:
    f_welcome_banner(data);
}



/*** 6 ***/
async function display_welcomebanner_for_first_time_users(user, fs_data){
    // Asynchronous callback function.
    const h2_header = document.querySelector("main h2");
    const welcomebanner = document.querySelector("#id_welcomebanner");
    if(user && fs_data && fs_data.fs_first_time){
        h2_header.style.display = "none";
        welcomebanner.style.display = "block";
    }
    else{
        h2_header.style.display = "block";
        welcomebanner.style.display = "none";
    }
}



/*** 7 ***/
function add_new_books_to_firestore_database(user, g_user_fs_data){

    function f_error_reset(){
        add_form.querySelector(".c_error_text").innerHTML = "";
    }

    function f_on_success(){
        console.log("Book successfully added to the firestore-database!");
        const text = add_form.querySelector(".c_successful_text");
        text.innerHTML = "Book Successfully Added.";
        window.setTimeout(() => text.innerHTML = "", 2500);
    }

    const add_form = document.forms["id_add-book-form"];
    add_form.addEventListener("submit", async function(e){
        // Asynchronous callback function.
        e.preventDefault();
        try{
            // check if the 'g_user_fs_data' object is empty:
            if(g_user_fs_data && Object.keys(g_user_fs_data).length === 0 && g_user_fs_data.constructor === Object){
                throw new Error("Error: Missing user's data, can't add the new book!");
            }
            // creating the object to be uploaded to firestore:
            let obj = { 
                fs_title: add_form["id_book-name"].value,
                fs_rating: parseInt(add_form["id_slider"].value),
                fs_owner_nick: g_user_fs_data.fs_nickname,
                fs_owner_id: user.uid,
                fs_create_time: new firebase.firestore.Timestamp.fromDate(new Date())
            };
            // uploading the data to firestore-database:
            // if the collection does not exist, firestore will create it for us.
            const book_ref = await fb_store.collection("fs_books").add(obj);
        }
        catch(err){
            // handle errors here.
            console.log("NOTE! if you are getting errors like this: \n", 
                        '"FirebaseError: Missing or insufficient permissions. ..." \n',
                        "check if your Cloud-Firestore security-rules are working!");

            add_form.querySelector(".c_error_text").innerHTML = err.message;
            console.error(err);
            return;
        }
        // clearing form and error-text if any:
        f_error_reset();
        add_form.reset();
        add_form.querySelector("#id_value").innerHTML = "5";
        // book successfully added to firestore-database:
        f_on_success();
    });
}



/*** 8 ***/
function handling_DOMs_delete_and_edit_buttons(user){
    const book_list = document.querySelector("#id_book-list ul");
    book_list.addEventListener("click", async function(e){
        // Asynchronous callback function in another thread.
        if(e.target.className !== "c_button"){
            return;
        }
        const li_tag = e.target.parentElement;
        const book_id = li_tag.dataset.d_book_id;
        try{
            // seting-up the document we want to work with. It's in the 
            // 'fs_books' collection and we have the ID of the document (book_id):
            const fb_doc = fb_store.collection("fs_books").doc(book_id);
            if(e.target.getAttribute("name") == "n_delete_button"){
                // now we'll delete this document from the collection on the firestore database:
                await fb_doc.delete();
                console.log("Book successfully deleted from the firestore-database!");
            }
            else if(e.target.getAttribute("name")  == "n_edit_button"){
    
            }
        }
        catch(err){
            // handle errors here.
            console.error(err);
            return;
        }
    });
}



/*** 9 ***/
function display_content_from_firestore(user, doc_array){

    function f_create_span(the_content, classes_array, the_name = null){
        const span = document.createElement("span");
        span.textContent = the_content;
        classes_array.forEach(the_class => span.classList.add(the_class));
        if(the_name){
            span.setAttribute("name", the_name);
        }
        return span;
    }

    function f_create_content(doc_data, book_id){
        const li = document.createElement("li");
        li.setAttribute("data-d_book_id", book_id);
        li.appendChild(f_create_span(doc_data.fs_title, ["c_name", "c_prime_text"]));
        li.appendChild(f_create_span(`${doc_data.fs_rating}/10`, ["c_rating"]));
        if(user.uid === doc_data.fs_owner_id){
            li.appendChild(f_create_span("delete", ["c_button"], "n_delete_button"));
            li.appendChild(f_create_span("edit", ["c_button"], "n_edit_button"));           
        }
        li.appendChild(document.createElement("br"));
        li.appendChild(f_create_span(`Added by "${doc_data.fs_owner_nick}"`, ["c_author"]));
        return li;
    }

    const h2_header = document.querySelector("main h2");
    const h2_banner = document.querySelector("#id_welcomebanner h2");
    const book_list = document.querySelector("#id_book-list ul");
    book_list.innerHTML = "";
    if(doc_array == null){
        console.log("No books from database!");
    }
    else if(doc_array.length > 0){
        h2_header.innerHTML = `There are ${doc_array.length} books in the database!`;
        h2_banner.innerHTML = h2_header.innerHTML;

        doc_array.forEach(function(doc){
            // getting the data as an object from the 'docs' from the 'snapshots' from the database:
            const doc_data = doc.data();
            // work the data and add it to the DOM:
            book_list.appendChild(f_create_content(doc_data, doc.id));
        });
    }
    else{
        h2_header.innerHTML = "Be the first to add books to the database!";
        h2_banner.innerHTML = h2_header.innerHTML;
    }
}



/*** 10 ***/
function display_content_for_unauthorized_users(){
    const h2_header = document.querySelector("main h2");
    const ul_list = document.querySelector("#id_book-list ul");

    h2_header.innerHTML = "Login to view people's favorite books and add your to the database!";
    ul_list.innerHTML = "";
}