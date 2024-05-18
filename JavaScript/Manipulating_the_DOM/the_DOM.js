"use strict" // WHOLE-SCRIPT STRICT MODE SYNTAX.

// wait for this 'DOMContentLoaded' event makes it possible for us to move the JS-scritps 
// into the <head> tag in the 'index.html' file.
// we wait for the DOM to fully load before we start manipulating it:
document.addEventListener("DOMContentLoaded", function(){
    // Asynchronous callback function.

    /*** 1 ***/
    //get_element_by_ID();
    /*** 2 ***/
    //get_elements_by_class_or_tag();
    /*** 3 ***/
    //the_query_selector();
    /*** 4 ***/
    //changing_HTML_content();
    /*** 5 ***/
    //DOM_is_tree_of_nodes();
    /*** 6 ***/
    //traversing_the_DOM();
    /*** 7 ***/
    //browser_events();
    /*** 8 ***/
    //delete_button_logic_the_bad_way();
    /*** 9 ***/
    event_bubbling_the_better_way(); // <- Working!
    /*** 10 ***/
    //interacting_with_forms();
    /*** 11 ***/
    //creating_style_and_add_elements_to_DOM();
    /*** 12 ***/
    create_element_with_submit_value_from_input_field(); // <- Working!
    /*** 13 ***/
    checkboxes_and_change_events(); // <- Working!
    /*** 14 ***/
    custom_search_filter(); // <- Working!
    /*** 15 ***/
    tabbed_content(); // <- Working!
    /*** 16 ***/
    color_swatches(); // <- Working!

});







/*** 1 ***/
function get_element_by_ID() {
    // to get the whole document object:
    console.log("The DOM OBJ:", document);

    // all IDs should be unique per document/page.
    let page_banner = document.getElementById("id_page-banner");
    console.log("The page_banner:", page_banner);
}



/*** 2 ***/
function get_elements_by_class_or_tag(){

    //*** Get Elements By Class: ***

    // many elements can have the same class.
    let all_titles = document.getElementsByClassName("c_title");
    console.log("All elements with the class 'c_title':", all_titles);
    // This is something like an array of all the elements share this class.
    // but it's not an array, it's a 'HTMLCollection' but it cam sometimes behaves similarly.

    for(let i = 0; i < all_titles.length; i++ ){
        console.log("Array index:", i, " Element:", all_titles[i]);
    }

    //*** Get Elements By Tag: ***

    let all_lis = document.getElementsByTagName("li");
    console.log("All the 'li' elements:", all_lis);
    
    // to check if something is an array:
    console.log("Is an array?", Array.isArray(all_lis)); // Prints-->[ Is an array? false ]
    // to turn the 'HTMLCollection' into an array:
    let all_lis_arr = Array.from(all_lis);
    console.log("Is an array?", Array.isArray(all_lis_arr)); // Prints-->[ Is an array? true ]

    // now we can use array functions:
    all_lis_arr.forEach(function(the_li_item){
        console.log("the_li_item:", the_li_item);
    });
}



/*** 3 ***/
function the_query_selector(){

    //*** Grabbing Single Element: ***

    // the easiest way to get elements.
    // use '#' to get element by the id:
    let wrap = document.querySelector("#id_wrapper");
    console.log("Wrap:", wrap);

    // to grab something more complicated, like the second book from the top:
    let complicated = document.querySelector("#id_book-list li:nth-child(2) .c_name");
    // #id_book-list => id | li => tag | :nth-child(2) => CSS selector | .c_name => class.
    console.log("Complicated:", complicated);

    //*** Grabbing Multiple Element: ***

    //                 Notice the --> All
    let books = document.querySelectorAll("#id_book-list li .c_name");
    console.log("All the Books:", books);

    // 'querySelectorAll' retuns a 'NodeList', it's not an array but very similar:
    // it has a 'forEach()' function, so no need to convert to array with the 'Array.from()'.
    let i = 1;
    books.forEach(function(book){
        console.log("book:", i, book);
        i++;
    });
}



/*** 4 ***/
function changing_HTML_content(){
    document.querySelectorAll("#id_book-list li .c_name").forEach(function(book){
        // get the text inside the 'span' elements:
        let text = book.textContent;
        console.log(text);
        // changing the text in the 'span' elements:
        book.textContent += "  (book title)";
    });

    const book_list = document.querySelector("#id_book-list");
    // geting the HTML as a string:
    let HTML_str = book_list.innerHTML
    console.log("HTML_str:", HTML_str);

    book_list.innerHTML = "<h2>Books and more books</h2>";
    book_list.innerHTML += "<p>This is how you add HTML!</p>";
    /*
    var n = HTML_str.search("</h2>");
        if(n !== -1){
            n += 5;
            let new_HTML_str = HTML_str.slice(0, n) 
                             + "\n\t\t <h2>Books and more books...</h2>" 
                             + HTML_str.slice(n);
            console.log("New_HTML_str:", new_HTML_str);
            book_list.innerHTML = new_HTML_str;
        }
    */
}



/*** 5 ***/
function DOM_is_tree_of_nodes(){
    // everything in the DOM is a node: 'elements', 'texts', 'attributes', 'comments'.
    const banner = document.querySelector("#id_page-banner");
    console.log("Banner -> node type is:", banner.nodeType); // Prints-->[ 1 ]
    console.log("Banner -> node name is:", banner.nodeName); // Prints-->[ DIV ]

    /* There are 12 different node types, which may have children of various node types:
     * 'nodeType' Returns:           'nodeName' Returns:     'nodeValue' returns:
     *   1  ->  Element.                element name            null
     *   2  ->  Attr.                   attribute name          attribute value
     *   3  ->  Text.                   #text                   content of node
     *   4  ->  CDATASection.           #cdata-section          content of node
     *   5  ->  EntityReference.        entity reference name   null
     *   6  ->  Entity.                 entity name             null
     *   7  ->  ProcessingInstruction.  target                  content of node
     *   8  ->  Comment.                #comment                comment text
     *   9  ->  Document.               #document               null
     *  10  ->  DocumentType.           doctype name            null
     *  11  ->  DocumentFragment.       #document fragment      null
     *  12  ->  Notation.               notation name           null
     */

    // to find out if a node has child nodes:
    console.log("Banner -> has child nodes:", banner.hasChildNodes());// -->[ true ]

    // to clone a node:                  false => clone without child nodes.
    let cloned_banner = banner.cloneNode(false);
    console.log("Cloned Banner:", cloned_banner);
    //                               true => also clone all nested child nodes.
    cloned_banner = banner.cloneNode(true);
    console.log("Cloned Banner with child nodes:", cloned_banner);
}



/*** 6 ***/
function traversing_the_DOM(){
    const book_list = document.querySelector("#id_book-list");
    // getting the parent node:
    console.log("The parent node is:", book_list.parentNode);

    // getting the child nodes:
    console.log("The child nodes are:", book_list.childNodes);
    // Note! we get all the 'linebrakes' between the nodes to! is it marked 
    //       as 'text' with the 'data: "↵     "'.

    // to not get the 'linebrakes' or other text outside elements, we can use:
    console.log("The child elements are:", book_list.children);

    // to gett the node sibling:
    console.log("Next node sibling is:", book_list.nextSibling);
    // again to not get the 'linebrakes':
    console.log("Next element sibling is:", book_list.nextElementSibling);
    console.log("Previous element sibling is:", book_list.previousElementSibling);

    // changing together - to 'querySelect'/search only part of the HTML:
    book_list.previousElementSibling.querySelector('p').innerHTML += "<br/>Too Cool";
    // first we get the previous sibling to 'book_list' which is the <header>,
    // then we search for a <p> tag inside the <header> element,
    // and finaly we add a linebrakes and a text to the inner HTML of the <p> tag.
}



/*** 7 ***/
function browser_events(){
    // to use the browser's events, we add event listeners with a callback-function 
    // to the events we are interested in.

    let h2 = document.querySelector("#id_book-list h2");
    console.log("Here is the h2 tag:", h2);

    console.log("Now you, the user, must click the h2's 'Books to Read' text!");
    h2.addEventListener("click", function(e){
        // Asynchronous callback function.
        // this callback-function is call when the user 'click' the <h2> tag.
        console.log("The Event:", e);
        console.log("And The Event Target:", e.target);
    });

    /* Here are some of the browser's HTML DOM Events:
     *   "animationend"        CSS animation has completed.
     *   "animationiteration"  CSS animation is repeated.
     *   "animationstart"      CSS animation has started.
     *   "blur"                element loses focus.
     *   "change"              content changed for <input>, <select>, <textarea>.
     *   "click"               user clicks on an element.
     *   "contextmenu"         user right-clicks on an element.
     *   "dblclick"            user double-clicks on an element.
     *   "drag"                element is being dragged.
     *   "dragend"             user has finished dragging an element.
     *   "error"               error occurs while loading an external file.
     *   "focus"               element gets focus.
     *   "input"               element gets user input.
     *   "invalid"             element is invalid.
     *   "keypress"            user presses a key.
     *   "message"             message is received through the event source.
     *   "mousedown"           user presses a mouse button over an element.
     *   "mouseenter"          pointer is moved onto an element.
     *   "mousemove"           pointer is moving while it is over an element.
     *   "mouseover"           pointer is moved onto an element, or children.
     *   "pageshow"            user navigates to a webpage.
     *   "resize"              document view is resized.
     *   "reset"               form is reset.
     *   "search"              user writes in a search field for <input="search">.
     *   "select"              user selects some text for <input>, <textarea>.
     *   "submit"              form is submitted.
     *   "touchcancel"         touch is interrupted.
     *   "touchmove"           finger is dragged across the screen.
     *   "transitionend"       CSS transition has completed.
     *   "wheel"               mouse wheel rolls up or down over an element.
     * see more at: https://www.w3schools.com/jsref/dom_obj_event.asp
     */ 

    // sometimes we need to preventing the default-event from happening,
    // like the default-event for <a> tag is to go to the webpage when clicked.
    const link = document.querySelector("#id_wrapper .c_link");
    link.addEventListener('click', function(e){
        // Asynchronous callback function.
        // this will prevent the default-event from happening:
        e.preventDefault();
        // now clicking the link doesn't do anything.
        console.log("Sorry! '", e.target.textContent,"' was prevented!");
    });
}



/*** 8 ***/
function delete_button_logic_the_bad_way(){
    // getting all the delete button:
    let btns = document.querySelectorAll("#id_book-list .c_delete");
    // adding a event listeners to the buttons:
    btns.forEach(function(btn){
        btn.addEventListener("click",function(e){
            // Asynchronous callback function.
            // When the button is clicked, we delete the <li> tag.
            
            // getting the right element we want to delete:
            const the_li = e.target.parentElement;
            // e => the event, when it happens.
            // e.target => the element we clicked (the delete button itself).
            // e.target.parentElement => the parent of the <span> is the <li> tag.

            // we can only delete element through it's parent element:
            the_li.parentNode.removeChild(the_li);
        });
    });
    //*** The Bad Way *** 
    // this way of adding event listener manually to each of the buttons is not good,
    // because when we start adding new books with the submit button on the page, 
    // this functionality is not added to the new delete buttons making them do nothing.
}



/*** 9 ***/
function event_bubbling_the_better_way(){
    // when an event happens on an element, it first activate the listener on it, 
    // then on its parent, then all the way up the DOM tree.

    const the_list = document.querySelector("#id_book-list");
    // adding a event-listener to the list and all of its child elements: 
    the_list.addEventListener("click", function(e){
        // Asynchronous callback function.
        // we only do something if it was one of the delete-buttons that was clicked:
        if(e.target.className == "c_delete"){
            // okay, the target is a delete-button.
            console.log("Delete-Button Was Clicked!");

            // getting the parent <li> tag which the button <span> tag belonged to:
            const the_li = e.target.parentElement;
            // then we use the parent of the <li> to remove/delete the <li>:
            the_li.parentElement.removeChild(the_li);
            // here 'the_li.parentElement' is the same as 'the_list'.
        }
    });
    //*** The Better Way ***
    // now when we start adding new books with the submit button on the page
    // the delete buttons will work because we moved the functionality from 
    // the <li> tags that is being delete to the parent-element.
}



/*** 10 ***/
function interacting_with_forms(){
    // easy way to get all forms on a page without using 'querySelector':
    const the_forms = document.forms;
    console.log("The Forms:", the_forms);
    // this is 'HTMLCollection', you can use 'IDs' in []:
    console.log("The Search Books Form:", the_forms["id_search-books"]);

    // grabbing the 'submit' event from the 'add-book' form:
    the_forms["id_add-book"].addEventListener("submit", function(e){
        // Asynchronous callback function.
        // preventing the default behavior:
        e.preventDefault();
        // grabbing the value the user typed in the form's <input> field:
        const the_value = the_forms["id_add-book"].querySelector("input[type='text']").value;
        //     this is just a valid CSS-selector in the query -> "input[type='text']"
        console.log("The User's Input:", the_value);
    });
}



/*** 11 ***/
function creating_style_and_add_elements_to_DOM(){
    // we are going to create <li> tag containing two <span> elements the book-name
    // and the delete-button.

    // creating the elements:
    const the_li = document.createElement("li");
    const the_book_name = document.createElement("span");
    const the_delete_button = document.createElement("span");

    // adding the child element to the <li> tag:
    the_li.appendChild(the_book_name);
    the_li.appendChild(the_delete_button);
    
    // adding some 'content' to the elements:
    the_book_name.textContent = "New Book From JS  :)"
    the_delete_button.textContent = "delete";

    // add, retrieve and remove 'classes':
    the_book_name.classList.add("c_name");
    the_book_name.classList.add("c_one_for_test");
    console.log("Get the Class:", the_book_name.className);
    the_book_name.classList.remove("c_one_for_test");

    // set, retrieve, check-for and remove 'atributes':
    const the_link = document.querySelector("#id_wrapper a");
    the_link.setAttribute("id", "id_google-link");
    console.log("Get the 'id' Atribute:", the_link.getAttribute("id"));
    console.log("Checking-for the 'href' Atribute:", the_link.hasAttribute("href"));
    the_link.removeAttribute("id");

    // adding the new elements to the page's DOM tree:
    const the_list = document.querySelector("#id_book-list ul");
    the_list.appendChild(the_li);

    // grabbing every other <li> tag:
    const lis = document.querySelectorAll("li:nth-child(odd)");
    lis.forEach(function(li){
        console.log("The li's InnerText:", li.children[0].innerText);

        // adding 'CSS-styles' to the elements:
        li.style.background = "lightgreen";
        li.style.fontSize = "medium";
    });    
}



/*** 12 ***/
function create_element_with_submit_value_from_input_field(){
    const the_list = document.querySelector("#id_book-list ul");
    const add_form = document.forms["id_add-book"];
    // the event is added to the <form> tag, not the <input> or the <button> tag:
    add_form.addEventListener("submit", function(e){
        // Asynchronous callback function.
        e.preventDefault();
        // grabbing the value from the <input> field:
        const the_value = add_form.querySelector("input[type='text']").value;
        // resetting the <input> field to a empty string:
        add_form.reset();

        const the_li = document.createElement("li");
        const the_book_name = document.createElement("span");
        const the_delete_button = document.createElement("span");

        the_book_name.setAttribute("class", "c_name");
        the_delete_button.setAttribute("class", "c_delete");

        the_book_name.textContent = the_value;
        the_delete_button.textContent = "delete";

        the_li.appendChild(the_book_name);
        the_li.appendChild(the_delete_button);
        the_list.appendChild(the_li);
    });
}



/*** 13 ***/
function checkboxes_and_change_events(){
    // making elements for the checkbox:
    const my_div = document.createElement("div");
    const my_checkbox = document.createElement("input");
    const my_label = document.createElement("label");

    // adding attributes and content to the elements:
    my_div.setAttribute("class", "c_secondary-color-bg");
    my_checkbox.setAttribute("type", "checkbox");
    my_checkbox.setAttribute("id", "id_hide");
    my_label.setAttribute("for", "id_hide");
    my_label.textContent = "Hide all books";

    // setting the CSS-styles:
    my_div.style.borderRadius = "0.8rem";
    my_checkbox.style.width = "4rem";
    my_label.style.lineHeight = "5.2rem";

    // linking the nodes:
    my_div.appendChild(my_checkbox);
    my_div.appendChild(my_label);

    // adding new nodes to the page's DOM tree, before the first child:
    const the_form = document.forms["id_add-book"];
    the_form.insertBefore(my_div, the_form.firstElementChild);

    // logic for the checkbox:
    const hide_box = document.querySelector("#id_hide");
    const the_list = document.querySelector("#id_book-list ul");
    //     we are looking for 'change' event here.
    hide_box.addEventListener("change", function(e){
        // Asynchronous callback function.
        if(hide_box.checked){
            console.log("Checkbox is Checked! Hiding the list.");
            // CSS-style:
            the_list.style.display = "none";
        }else{
            console.log("Checkbox Empty. Showing the list!");
            // CSS-style:
            the_list.style.display = "initial";
        }
    });
}



/*** 14 ***/
function custom_search_filter(){
    // grabbing the search-for-book input-form:
    const search_bar = document.forms["id_search-books"].querySelector("input");
    search_bar.addEventListener("keyup", function(e){
        // Asynchronous callback function.
        // getting the user input and turning it to lowercase:
        const user_input = e.target.value.toLowerCase();
        console.log("User Released a Keyboard Key:", user_input);
        // grabbing the books:
        const books_rawHTML = document.querySelector("#id_book-list ul");
        const books_HTMLCollection = books_rawHTML.getElementsByTagName("li");
        const books_array = Array.from(books_HTMLCollection);
        books_array.forEach(function(book){
            // grabbing the book's titles, and turning it to lowercase:
            const title = book.firstElementChild.textContent.toLowerCase();
            // compering user input to book's title:
            // 'indexOf()' retuns '-1' if the 'user_input' isn't part of the 'title'.
            if(title.indexOf(user_input) === -1){
                // 'user_input' isn't part of the book's title so we hide this book.
                book.style.display = "none";
            }else{
                // 'user_input' is part of the book's title so we'll show this book.
                book.style.display = "block";
            }
        });

    });
}



/*** 15 ***/
function tabbed_content(){
    const my_taps = document.querySelector(".c_tabs");
    const my_panels = document.querySelectorAll(".c_panel");

    my_taps.addEventListener("click", function(e){
        // Asynchronous callback function.
        // making a check to see if we clicked on of the <li> tags:
        if(e.target.tagName === "LI"){
            // retrieving the string from the <li> tag's 'data-??' attribute:
            const my_HTML_data = e.target.dataset.d_the_target;
            console.log("Retrieved data from HTML:", my_HTML_data);
            // using the string from the <li> to find/target the right panel:
            const target_panel = document.querySelector(my_HTML_data);

            // loop through and hide all panels except for the target panel:
            my_panels.forEach(function(panel){
                if(panel === target_panel){
                    // show the target panel.
                    panel.classList.add("c_active");
                }else{
                    // not the target panel so hide it.
                    panel.classList.remove("c_active");
                }
            });

            // doing the same for the taps:
            Array.from(my_taps.children).forEach(function(tap){
                if(tap === e.target){
                    // CSS-style:
                    tap.setAttribute("class", "c_prime-color-bg");
                    tap.style.color = "white";
                }else{
                    // CSS-style:
                    tap.setAttribute("class", "c_secondary-color-bg");
                    tap.style.color = "#444";
                }
            });
        }
    });
}



/*** 16 ***/
function color_swatches(){
    // all color we want to be available go into the array:
    const spans = [
        {pos: "left",  color: "#9361bf"},
        {pos: "left",  color: "#f06d06"},
        {pos: "left",  color: "#3f3f3e"},
        {pos: "right", color: "#eee"},
        {pos: "right", color: "#f7f6af"},
        {pos: "right", color: "#b9deed"}];

    spans.forEach(function(span){
        // 'destructuring' => get variables out of the object and into this scope:
        const {pos, color} = span;
        const swatche = document.createElement("span");
        if(pos === "left"){
            swatche.setAttribute("data-d_color", "d_prime");
        }else if(pos === "right"){
            swatche.setAttribute("data-d_color", "d_secondary");
        }
        swatche.style.background = color;
        document.querySelector("#id_swatches_"+ pos).appendChild(swatche);
    });

    // the logic for the color swatches:
    // in the CSS file, the ':root' contains our 'custom-properties' controlling the colors:
    const root = document.querySelector(":root");
    // the 'banner' in the parent object to all the swatches, and when a click event 
    // happens it bubbles up and we catch it in the 'banner':
    const banner = document.querySelector("#id_page-banner");
    banner.addEventListener("click", function(e){
        // check if user clicked one of the <span> tags:
        if(e.target.tagName === "SPAN"){
            if(e.target.dataset.d_color === "d_prime"){
                // changing the value of the CSS 'custom-propertie' to be the same 
                // as the 'background' value of the <span> tag we clicked on:
                root.style.setProperty("--my-theme-prime-color", e.target.style.background);
            }
            else if(e.target.dataset.d_color === "d_secondary"){
                root.style.setProperty("--my-theme-secondary-color", e.target.style.background);
            }
        }
    });
}
