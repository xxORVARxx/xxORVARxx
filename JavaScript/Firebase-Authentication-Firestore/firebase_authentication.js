"use strict" // WHOLE-SCRIPT STRICT MODE SYNTAX.

import state_manager from "./state_manager_module.js";



// wait for this 'DOMContentLoaded' event makes it possible for us to move the JavaScritp
// files into <head> tag in 'index.html' file, but with 'firebase' we dont do this.
// we wait for the DOM to fully load before we start manipulating it:
document.addEventListener("DOMContentLoaded", function(){
    // Asynchronous callback function.



    /***  Global-Data: ***/
    state_manager.add_core("user_credential");
    state_manager.add_core("user_fs_data");
    state_manager.add_core("books_fs_data");
    state_manager.add_core("DOM_state", {
        user_fs_data_loaded: false, 
        books_fs_data_loaded: false, 
        open_edit: false
    });
    var unsubscribe_listener = null;



    /*** 1 ***/
    signup_create_user_with_email();

    /*** 2 ***/
    login_user_with_email();

    /*** 3 ***/
    logout_user();

    /*** 4 ***/
    display_content_for_unauthorized_users();

    /*** 5 ***/
    auth_state_conditional_DOMContent();

    /*** 6 ***/
    get_data_from_firestore_and_update_user_bio();

    /*** 7 ***/
    display_welcomebanner_for_first_time_users();
        
    /*** 8 ***/
    add_new_books_to_firestore_database();

    /*** 9 ***/
    display_content_from_firestore();

    /*** 10 ***/
    handling_DOMs_events_and_state(function(li_tag, event){
        // Callback function.
        switch(event){
            case "editing":

                //*** 10.1 ***
                on_event_editing(li_tag);

                break;
            case "edit":

                //*** 10.2 ***
                on_event_open_edit(li_tag);

                break;
            case "delete":

                //*** 10.3 ***
                on_event_delete(li_tag);

                break;
            case "alphabetical":
            case "rating":
            case "author":

                //*** 10.4 ***
                on_event_filter(li_tag, event);

                break;
            default:

                break;
        }
    });
 


    // this 'onAuthStateChanged' event heppens every time user logs-in, -out or signes-up,
    // if user is logged-in we get the 'credentials' but if user is logged-out we get 'null'.
    fb_auth.onAuthStateChanged(function(user){
        // Asynchronous callback function.
        if(user){
            // user is signed in.
            state_manager.set("user_credential", {uid: user.uid});

            // getting data from firestore (the books), using a realtime-listener,
            // this means that every time the data changes on the firestore-database
            // the callback-function is executed and we will reload the content with
            // the newest snapshot of the database:
            unsubscribe_listener = fb_store.collection("fs_books").onSnapshot(async function(snapshot){
                // Asynchronous callback function in another thread.

                // remove all the old 'books_data' from the state-manager:
                state_manager.keep("books_fs_data", [], false);
                // take all of the firestore's documents and put it's data into an array:
                if(snapshot.docs && snapshot.docs.length > 0){
                    const books_arr = [];
                    for(let doc of snapshot.docs){
                        const data = doc.data();
                        data["fs_uid"] = doc.id;
                        books_arr.push(data);
                    }
                    // save the 'books_arr' from firestore-database to the state-manager:
                    state_manager.set("books_fs_data", {array: books_arr}, false);
                }
                else{
                    console.log("No books from database!");
                }
                // emit the updated data to all it's subscribers:
                state_manager.emit("books_fs_data");
                console.log("Updated book's data from Firestore.");


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
            // removing all 'user_data' from the state-manager:
            state_manager.keep("user_credential", []);

            // stop listening to changes on the firestore-database:
            if(unsubscribe_listener){
                unsubscribe_listener();
                unsubscribe_listener = null;
            }
        }
    });
});





/*** 1 ***/
function signup_create_user_with_email(){

    function f_error_reset(signup_form){
        signup_form.querySelector(".c_error-text").innerHTML = "";
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
            fs_first_time: true,
            fs_DOM_state_editing: "",
            fs_DOM_state_filter: "time" 
        };
        // if the collection does not exist, firestore will create it for us.
        // make the user's firestore data have the same 'uid' as the user's auth 'uid',
        // then way we know which data goes with which user:
        return fb_store.collection("fs_users").doc(the_credential.user.uid).set(private_info);
        // returning a 'promise'.
    }

    const signup_form = document.querySelector("#id_signup-form");
    signup_form.addEventListener("submit", async function signup_event(e){
        // Asynchronous callback function in another thread.
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
            signup_form.querySelector(".c_error-text").innerHTML = err.message;
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
        login_form.querySelector(".c_error-text").innerHTML = "";
    }

    async function f_update_user_info(the_credential){
        const obj = {
            fs_first_time: false
        };
        return fb_store.collection("fs_users").doc(the_credential.user.uid).update(obj);
    }

    const login_form = document.querySelector("#id_login-form");
    login_form.addEventListener("submit", async function(e){
        // Asynchronous callback function in another thread.
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
            login_form.querySelector(".c_error-text").innerHTML = err.message;
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
        logout_form.querySelector(".c_error-text").innerHTML = "";
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
            logout_form.querySelector(".c_error-text").innerHTML = err.message;
            console.error(err);
            return;
        }
        console.log("You have successfully logged out!");
        f_error_reset(logout_form);
    });
}



/*** 4 ***/
function display_content_for_unauthorized_users(){

    async function f_display_content(core_str, data_obj){
        // Asynchronous callback function in another thread.
        if(state_manager.get("user_credential", "uid")){
            return;
        }
        const h2_header = document.querySelector("main h2");
        const ul_list = document.querySelector("#id_book-list ul");
        h2_header.innerHTML = "Login to view people's favorite books and add your to the database!";
        ul_list.innerHTML = "";
    }

    //f_display_content();
    state_manager.subscribe(
            ["user_credential"], 
            f_display_content, 
            "StateManager | Invoke: 'display_content_for_unauthorized_users()'."
        );
}



/*** 5 ***/
function auth_state_conditional_DOMContent(){

    async function f_change_DOMContent(core_str, data_obj){
        // Asynchronous callback function in another thread.
        const logged_out_links = document.querySelectorAll(".c_auth-logged-out");
        const logged_in_links = document.querySelectorAll(".c_auth-logged-in");
        let hide_in = "none";
        let hide_out = "block";
        if(state_manager.get("user_credential", "uid")){
            hide_in = "block";
            hide_out = "none";
        }
        logged_in_links.forEach( link => link.style.display = hide_in );
        logged_out_links.forEach( link => link.style.display = hide_out );
    }

    state_manager.subscribe(
            ["user_credential"], 
            f_change_DOMContent, 
            "StateManager | Invoke: 'auth_state_conditional_DOMContent()'."
        );
}



/*** 6 ***/
function get_data_from_firestore_and_update_user_bio(){
    
    async function f_get_data_from_firestore(core_str, data_obj){
        // Asynchronous callback function in another thread.
        const user_uid = state_manager.get("user_credential", "uid");
        let data = {};
        if(user_uid){
            try{
                // seting-up the document we want to get. It's in the collection: 'fs_users' 
                // and has the same document-ID as the user's 'uid':
                const fb_doc = fb_store.collection("fs_users").doc(user_uid);
                // now we will fetch the data from the 'document' on the firestore database:
                const fb_data = await fb_doc.get();
                // to extracted the data from the 'DocumentSnapshot' use '.get("my_field")' or:
                data = fb_data.data();
            }
            catch(err){
                // handle errors here.
                console.error(err);
                return;
            }
        }
        state_manager.keep("user_fs_data", [], false);
        state_manager.set("user_fs_data", data);
        // user data is loaded:
        state_manager.set("DOM_state", {user_fs_data_loaded: true});
    }

    async function f_update_user_bio(core_str, data_obj){
        // Asynchronous callback function in another thread.
        const nickname = document.querySelector("#id_nickname");
        const email = document.querySelector("#id_email");
        if(state_manager.get("user_credential", "uid")){
            nickname.innerHTML = `Books for ${data_obj.fs_nickname}!`;
            email.innerHTML = data_obj.fs_email;
        }
        else{
            nickname.innerHTML = "Books for you";
            email.innerHTML = "";
        }
    }

    state_manager.subscribe(
            ["user_credential"], 
            f_get_data_from_firestore, 
            "StateManager | Invoke: 'f_get_data_from_firestore()'."
        );
    state_manager.subscribe(
            ["user_fs_data"], 
            f_update_user_bio, 
            "StateManager | Invoke: 'f_update_user_bio()'."
        );
}



/*** 7 ***/
function display_welcomebanner_for_first_time_users(){

    async function f_display_welcomebanner(core_str, data_obj){
        // Asynchronous callback function.
        const h2_header = document.querySelector("main h2");
        const welcomebanner = document.querySelector("#id_welcomebanner");
        if(data_obj.fs_first_time){
            h2_header.style.display = "none";
            welcomebanner.style.display = "block";
        }
        else{
            h2_header.style.display = "block";
            welcomebanner.style.display = "none";
        }
    }

    state_manager.subscribe(
            ["user_fs_data"], 
            f_display_welcomebanner, 
            "StateManager | Invoke: 'display_welcomebanner_for_first_time_users()'."
        );
}



/*** 8 ***/
function add_new_books_to_firestore_database(){

    function f_error_reset(){
        add_form.querySelector(".c_error-text").innerHTML = "";
    }

    function f_on_success(){
        console.log("Book successfully added to the firestore-database!");
        const text = add_form.querySelector(".c_successful-text");
        text.innerHTML = "Book Successfully Added.";
        window.setTimeout(() => text.innerHTML = "", 2500);
    }

    const add_form = document.forms["id_add-book-form"];
    add_form.addEventListener("submit", async function(e){
        // Asynchronous callback function.
        e.preventDefault();
        const user_data = state_manager.get_core("user_fs_data");
        try{
            // check if the 'user_data' object is empty:
            if(user_data && Object.keys(user_data).length === 0 && user_data.constructor === Object){
                throw new Error("Error: Missing user's data, can't add the new book!");
            }
            // creating the object to be uploaded to firestore:
            let obj = { 
                fs_title: add_form["id_book-name"].value,
                fs_rating: parseInt(add_form.querySelector(".c_slider").value),
                fs_owner_nick: user_data.fs_nickname,
                fs_owner_id: state_manager.get("user_credential", "uid"),
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

            add_form.querySelector(".c_error-text").innerHTML = err.message;
            console.error(err);
            return;
        }
        // clearing form and error-text if any:
        f_error_reset();
        add_form.reset();
        add_form.querySelector(".c_slider-value").innerHTML = "5";
        // book successfully added to firestore-database:
        f_on_success();
    });
}



/*** 9 ***/
function display_content_from_firestore(){

    async function f_display_books(core_str, data_obj){
        
        function f_create_span(the_content, classes_array, clickable = null){
            const span = document.createElement("span");
            span.textContent = the_content;
            classes_array.forEach(the_class => span.classList.add(the_class));
            if(clickable){
                span.setAttribute("clickable", clickable);
            }
            return span;
        }
    
        function f_create_content(book){
            const li = document.createElement("li");
            li.setAttribute("data-d_book_id", book.fs_uid);
            li.appendChild(f_create_span(book.fs_title, ["c_name", "c_prime-text"], "alphabetical"));
            li.appendChild(f_create_span(`${book.fs_rating}/10`, ["c_rating"], "rating"));
            if(user_uid === book.fs_owner_id){
                li.appendChild(f_create_span("delete", ["c_button"], "delete"));
                li.appendChild(f_create_span("edit", ["c_button"], "edit"));           
            }
            li.appendChild(document.createElement("br"));
            li.appendChild(f_create_span(`Added by "${book.fs_owner_nick}"`, ["c_author"], "author"));
            return li;
        }
    
        const h2_header = document.querySelector("main h2");
        const h2_banner = document.querySelector("#id_welcomebanner h2");
        const book_list = document.querySelector("#id_book-list ul");
        const user_uid = state_manager.get("user_credential", "uid");
        book_list.innerHTML = "";
        if(data_obj.array == null){
            console.log("No books from database!");
        }
        else if(data_obj.array.length > 0){
            h2_header.innerHTML = `There are ${data_obj.array.length} books in the database!`;
            h2_banner.innerHTML = h2_header.innerHTML;
    
            data_obj.array.forEach(function(book){
                // work the data and add it to the DOM:
                const li = f_create_content(book);
                book_list.appendChild(li);
                book["li_tag"] = li;
            });
            // the book are loaded:
            state_manager.set("DOM_state", {books_fs_data_loaded: true});
        }
        else{
            h2_header.innerHTML = "Be the first to add books to the database!";
            h2_banner.innerHTML = h2_header.innerHTML;
        }
    }

    state_manager.subscribe(
            ["books_fs_data"], 
            f_display_books, 
            "StateManager | Invoke: 'display_content_from_firestore()'."
        );
}



/*** 10 ***/
function handling_DOMs_events_and_state(f_callback){

    function f_DOMs_state(core_str, data_obj){
        if(state_manager.get("DOM_state", "user_fs_data_loaded") 
        && state_manager.get("DOM_state", "books_fs_data_loaded")){
            const editing = state_manager.get("user_fs_data", "fs_DOM_state_editing")
            if(Boolean(editing)){
                const books = state_manager.get_core("books_fs_data");
                const book = books.array.find(function(book){
                    return book.li_tag.dataset.d_book_id === editing;
                })
                if(book){
                    f_callback(book.li_tag, "edit");
                }
            }
        }
    }

    function f_DOMs_event(e){
        e.preventDefault();
        const is_editing = state_manager.get("user_fs_data", "fs_DOM_state_editing")
        const event_button = e.target.getAttribute("clickable");
        const event = is_editing ? "editing" : event_button;
        if(event){
            f_callback(e.target.parentElement, event);
        }
    }

    state_manager.subscribe(
            ["DOM_state"], 
            f_DOMs_state,
            "StateManager | Invoke: 'handling_DOMs_events_and_state()'."
        );
    const book_list = document.querySelector("#id_book-list ul");
    book_list.addEventListener("click", f_DOMs_event);
}

/*** 10.1 ***/
async function on_event_editing(li_tag){
    // the 'edit-modal' is showing -> user can edit the book.
    console.log("Closed the edit-form");
}

/*** 10.2 ***/
async function on_event_open_edit(li_tag){
    // user clicked the 'edit' button -> now opening the 'edit-modal'.

    function f_hide_tags(){
        const tags = li_tag.children;
        for(let i = 0; i < tags.length; i++){
            tags[i].style.display = "none";
        }
    }

    function f_copy_the_edit_form(){

        function f_slider(slider, reference_value, starting_value){
            const input =  slider.querySelector("input");
            const option = slider.querySelector("datalist option");
            const span =   slider.querySelector("span");
            input.value = starting_value;
            option.innerHTML = reference_value;
            span.innerHTML = `${starting_value}/10`;
            input.oninput = function(){
                span.innerHTML = `${this.value}/10`;
            }
        }

        // get the template of the form and make a copy of it:
        const template = document.querySelector("#id_edit-book-template");
        const edit_form = template.content.firstElementChild.cloneNode(true);
        // give the new copy of the edit form an id and some styles:
        edit_form.setAttribute("id", "id_edit-book-form-copy");
        edit_form.style.width = "95%";
        // overwride the placeholder-value with the name of the book being edited:
        edit_form.querySelector("#id_edit-name").value = li_tag.querySelector(".c_name").innerText;
        // create the slider and set it to start at the 'rating' of the book being edited:
        const rating = parseInt(li_tag.querySelector(".c_rating").innerText);
        f_slider(edit_form.querySelector(".c_input-range"), rating, rating);
        // move the copy into the book-list where the book being edited was:
        li_tag.appendChild(edit_form);
    }

    f_hide_tags();
    f_copy_the_edit_form();
    const book_id = li_tag.dataset.d_book_id;
    try{
        const user_uid = state_manager.get("user_credential", "uid");
        // seting-up the document we want to get. It's in the collection: 'fs_users' 
        // and has the same document-ID as the user's 'uid':
        const fb_doc = fb_store.collection("fs_users").doc(user_uid);
        // now we will update the document's fild with the 'merge' option:
        await fb_doc.set({ fs_DOM_state_editing: book_id }, { merge: true });
        state_manager.set("user_fs_data", {fs_DOM_state_editing: book_id});
        console.log(`Open edit-form for book with id: ${book_id}`);
    }
    catch(err){
        // handle errors here.
        console.error(err);
        return;
    }
}

/*** 10.3 ***/
async function on_event_delete(li_tag){
    // user clicked the 'delete' button -> now removing book from firestore database.
    const book_id = li_tag.dataset.d_book_id;
    try{
        // seting-up the document we want to work with. It's in the 
        // 'fs_books' collection and we have the ID of the document (book_id):
        const fb_doc = fb_store.collection("fs_books").doc(book_id);
        // now we'll delete this document from the collection on the firestore database:
        await fb_doc.delete();
        console.log("Book successfully deleted from the firestore-database!");
    }
    catch(err){
        // handle errors here.
        console.error(err);
        return;
    }
}

/*** 10.4 ***/
async function on_event_filter(li_tag, filter){
    // user clicked the 'filter' button -> now rearrangements the books-list.
    const book_id = li_tag.dataset.d_book_id;
    try{
        const user_uid = state_manager.get("user_credential", "uid");
        // seting-up the document we want to get. It's in the collection: 'fs_users' 
        // and has the same document-ID as the user's 'uid':
        const fb_doc = fb_store.collection("fs_users").doc(user_uid);
        // now we will update the document's fild with the 'merge' option:
        await fb_doc.set({ fs_DOM_state_filter: filter }, { merge: true });
        state_manager.set("user_fs_data", {fs_DOM_state_filter: filter});
        console.log(`Filter is set to '${filter}'`);
    }
    catch(err){
        // handle errors here.
        console.error(err);
        return;
    }
}



//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!






/*** 8 ***/
function xxx_handling_DOMs_events_and_state(f_callback){
    const book_list = document.querySelector("#id_book-list ul");
    book_list.addEventListener("click", function(e){
        // Asynchronous callback function.
        e.preventDefault();
        const button = e.target.getAttribute("clickable");
        if(button){
            f_callback(e, button);
        }
    });
    state_manager.subscribe(
        ["user_fs_data"], 
        function(){
            // Asynchronous callback function.
            const editing = state_manager.get("user_fs_data", "fs_DOM_state_editing");
            if(editing){
                f_callback(null, "edit");
            }
        }, 
        "StateManager | Invoke: 'display_welcomebanner_for_first_time_users()'."
    );
}

/*** 8.1 ***/
async function xxon_event_editing(e){
    // the 'edit-modal' is showing -> user can edit the book.

    function f_on_save(){
        console.log("Save the edit");
    }

    const edit_form = document.querySelector("#id_edit-book-form-copy");
    const button = e.target.getAttribute("clickable");
    // check if the mouse-click was within the 'edit-modal' itself:
    if(edit_form.contains(e.target) && button !== "cancel"){
        if(button === "save"){
            // user clicked the 'save' button -> save changes before closing the 'edit-modal':
            f_on_save();
        }
        else{
            // user is working on editing the book, take no action.
            return;
        }
    }
    // closing the 'edit-modal':
    edit_form.remove();
    const li_tag = edit_form.parentElement;
    const span_tags = li_tag.children;
    for(let i = 0; i < span_tags.length; i++){
        span_tags[i].style.display = "";
    }
    try{
        const user_uid = state_manager.get("user_credential", "uid");
        // seting-up the document we want to get. It's in the collection: 'fs_users' 
        // and has the same document-ID as the user's 'uid':
        const fb_doc = fb_store.collection("fs_users").doc(user_uid);
        // now we will update the document's fild with the 'merge' option:
        await fb_doc.set({ fs_DOM_state_edit: false }, { merge: true });
        state_manager.set("user_fs_data", {fs_DOM_state_edit: false});
        console.log("Closed the edit-form");
    }
    catch(err){
        // handle errors here.
        console.error(err);
        return;
    }
}

/*** 8.2 ***/
async function xxon_event_edit(e){
    // user clicked the 'edit' button -> now opening the 'edit-modal'.

    function f_copy_the_edit_form(li_tag){

        function f_slider(slider, reference_value, starting_value){
            const input =  slider.querySelector("input");
            const option = slider.querySelector("datalist option");
            const span =   slider.querySelector("span");
            input.value = starting_value;
            option.innerHTML = reference_value;
            span.innerHTML = `${starting_value}/10`;
            input.oninput = function(){
                span.innerHTML = `${this.value}/10`;
            }
        }

        // get the template of the form and make a copy of it:
        const template = document.querySelector('#id_edit-book-template');
        const edit_form = template.content.firstElementChild.cloneNode(true);
        // give the new copy of the edit form an id and some styles:
        edit_form.setAttribute("id", "id_edit-book-form-copy");
        edit_form.style.width = "95%";
        // overwride the placeholder-value with the name of the book being edited:
        edit_form.querySelector("#id_edit-name").value = li_tag.querySelector(".c_name").innerText;
        // create the slider and set it to start at the 'rating' of the book being edited:
        const rating = parseInt(li_tag.querySelector(".c_rating").innerText);
        f_slider(edit_form.querySelector(".c_input-range"), rating, rating);
        // move the copy into the book-list where the book being edited was:
        li_tag.appendChild(edit_form);
    }

    /*
    // VIRKAR EKKI HÉRNA ÞVÍ USER-DATA ER EKKI LOADAÐ NÚNA!!!!
    const li_tag = document.querySelector(`#id_book-list ul li[data-d_book_id="${g_user_fs_data.fs_DOM_state_edit}"]`);
    */
    //const li_tag = e.target.parentElement; // MÁ EKKI NOTA 'e' !!!

    let li_tag = null;
    if(e){
        li_tag = e.target.parentElement;
    }
    else{
        const book_id = state_manager.get("user_fs_data", "fs_DOM_state_edit");
        li_tag = document.querySelector(`[data-d_book_id="${book_id}"]`);
        console.log(book_id, li_tag, `#id_book-list ul [data-d_book_id="${book_id}"]`);
    }

    const span_tags = li_tag.children;
    const book_id = li_tag.dataset.d_book_id;
    for(let i = 0; i < span_tags.length; i++){
        span_tags[i].style.display = "none";
    }
    f_copy_the_edit_form(li_tag);
    try{
        const user_uid = state_manager.get("user_credential", "uid");
        // seting-up the document we want to get. It's in the collection: 'fs_users' 
        // and has the same document-ID as the user's 'uid':
        const fb_doc = fb_store.collection("fs_users").doc(user_uid);
        // now we will update the document's fild with the 'merge' option:
        await fb_doc.set({ fs_DOM_state_edit: book_id }, { merge: true });
        state_manager.set("user_fs_data", {fs_DOM_state_edit: book_id});
        console.log(`Open edit-form for book with id: ${book_id}`);
    }
    catch(err){
        // handle errors here.
        console.error(err);
        return;
    }
}

/*** 8.3 ***/
async function xxon_event_delete(e){
    // user clicked the 'delete' button -> now removing book from firestore database.
    const li_tag = e.target.parentElement;
    const book_id = li_tag.dataset.d_book_id;
    try{
        // seting-up the document we want to work with. It's in the 
        // 'fs_books' collection and we have the ID of the document (book_id):
        const fb_doc = fb_store.collection("fs_books").doc(book_id);
        // now we'll delete this document from the collection on the firestore database:
        await fb_doc.delete();
        console.log("Book successfully deleted from the firestore-database!");
    }
    catch(err){
        // handle errors here.
        console.error(err);
        return;
    }
}

/*** 8.4 ***/
async function xxon_event_filter(e, filter){
    // user clicked the 'filter' button -> now rearrangements the books-list.
    const li_tag = e.target.parentElement;
    const book_id = li_tag.dataset.d_book_id;
    try{
        const user_uid = state_manager.get("user_credential", "uid");
        // seting-up the document we want to get. It's in the collection: 'fs_users' 
        // and has the same document-ID as the user's 'uid':
        const fb_doc = fb_store.collection("fs_users").doc(user_uid);
        // now we will update the document's fild with the 'merge' option:
        await fb_doc.set({ fs_DOM_state_filter: filter }, { merge: true });
        state_manager.set("user_fs_data", {fs_DOM_state_filter: filter});
        console.log(`Filter is set to '${filter}'`);
    }
    catch(err){
        // handle errors here.
        console.error(err);
        return;
    }
}