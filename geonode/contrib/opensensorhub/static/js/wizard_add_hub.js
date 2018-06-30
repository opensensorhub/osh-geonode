// Keep track of created elements
var elementCounter = 0;


window.onload = function()
{
    console.log(document.getElementById('id_keyed_field'));

    let keyedField = document.getElementById("id_keyed_field");
    keyedField.addEventListener("input", onKeyedInputReceive);
    // console.log(keyedField.innerText);

    function onKeyedInputReceive(evt){
        // console.log(this.value);
        // console.log(evt.target.parentElement.parentElement.innerHTML);
        addFormFields(evt.target.parentElement);
        // console.log(keyedField.innerText);
    }
}

function addFormFields(parentElement){
    elementCounter++;
    let elementClass = 'added-elements-' + elementCounter;

    htmlToBeTemplated(parentElement, '../osh/templates/wizards/test-1', elementClass);
    // htmlToBeTemplated(parentElement, '../osh/test/');
    includeHTML();

    // create new element
    let newLabel = document.createElement("label");
    newLabel.className = elementClass;
    newLabel.setAttribute('for', 'new-element');
    newLabel.innerHTML = 'New Element:';
    newLabel.style.gridColumn = '1/2';

    let newChild = document.createElement("input");
    newChild.className = elementClass;
    newChild.setAttribute('text', 'New Element');
    newChild.setAttribute('id', 'new-element');

    let removeButton = document.createElement('input');
    removeButton.className = elementClass;
    removeButton.setAttribute('type', 'button');
    removeButton.style.gridColumn = '3/4';
    //removeButton.style.gridRow = (elementCounter+1) + '/' + (elementCounter+2);
    removeButton.value = 'Remove';
    removeButton.onclick = removeElement;


    // append newly created elements
    parentElement.appendChild(newLabel);
    parentElement.appendChild(newChild);
    parentElement.appendChild(removeButton);
}

function removeElement(event){
    let parent = this.parentNode;
    // needs to remove siblings created with the button
    console.log(this.className + ' class elements will be removed!');
    // Convert to Array to deal with this being a live list
    let elements = Array.prototype.slice.call(document.getElementsByClassName(this.className));
    console.log(elements);
    for (var el of elements) {
        console.log(el);
        parent.removeChild(el);
    }
}

// modified from example found at w3schools
function includeHTML(){
    let z, i, elmnt, file, xhttp;
    /*loop through a collection of all HTML elements:*/
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain attribute:*/
        file = elmnt.getAttribute("include-html");
        if (file) {
            /*make an HTTP request using the attribute value as the file name:*/
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status === 200) {elmnt.innerHTML = this.responseText;}
                    if (this.status === 404) {elmnt.innerHTML = "Page not found.";}
                    /*remove the attribute, and call this function once more:*/
                    elmnt.removeAttribute("include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /*exit the function:*/
            return;
        }
    }
}

function htmlToBeTemplated(parentNode, elementURL, elementClass){
    console.log("Adding new paragraph element");
    let elem = document.createElement("p");
    elem.setAttribute('include-html', elementURL);
    //elem.innerHTML = 'test';
    elem.className = elementClass;
    parentNode.appendChild(elem);
}