// Keep track of created elements
var elementCounter = 0;
var formElement;
var formTemplates = new Map();
formTemplates.set('chart', 'templates/wizards/chart');
formTemplates.set('video', 'templates/wizard/video');
formTemplates.set('locationmarker', 'templates/wizards/locationmarker');
formTemplates.set('text', 'templates/wizards/text');
formTemplates.set('map', 'templates/wizards/map');

window.onload = function () {
    formElement = document.getElementById('view-form');
    // console.log(document.getElementById('id_keyed_field'));
    //
    // let keyedField = document.getElementById("id_keyed_field");
    // keyedField.addEventListener("input", onKeyedInputReceive);
    // // console.log(keyedField.innerText);
    //
    // function onKeyedInputReceive(evt){
    //     // console.log(this.value);
    //     // console.log(evt.target.parentElement.parentElement.innerHTML);
    //     addFormFields(evt.target.parentElement);
    //     // console.log(keyedField.innerText);
    // }
};

function addFormFields(parentElement, templateURL) {
    elementCounter++;
    let elementClass = 'added-elements-' + elementCounter;

    htmlToBeTemplated(parentElement, templateURL, elementClass);
    // htmlToBeTemplated(parentElement, '../osh/test/');
    includeHTML();

    // create from element
    // let newLabel = document.createElement("label");
    // newLabel.className = elementClass;
    // newLabel.setAttribute('for', 'new-element');
    // newLabel.setAttribute('data-indexNum', elementCounter);
    // newLabel.innerHTML = 'New Element:';
    // newLabel.style.gridColumn = '1/2';
    //
    // let newChild = document.createElement("input");
    // newChild.className = elementClass;
    // newChild.setAttribute('text', 'New Element');
    // newChild.setAttribute('id', 'new-element');
    // newChild.setAttribute('data-indexNum', elementCounter);

    // Remove button element
    let removeButton = document.createElement('input');
    removeButton.className = elementClass + ' remove-btn';
    removeButton.setAttribute('type', 'button');
    removeButton.setAttribute('data-indexNum', elementCounter);
    removeButton.style.gridColumn = '3/4';
    //removeButton.style.gridRow = (elementCounter+1) + '/' + (elementCounter+2);
    removeButton.value = 'Remove';
    removeButton.onclick = removeElement;


    // append newly created elements
    // parentElement.insertAdjacentElement('beforebegin', newLabel);
    // parentElement.insertAdjacentElement('beforebegin', newChild);
    parentElement.insertAdjacentElement('beforebegin', removeButton);

    // TODO: Remove after testing
    getElementsByDataIndexNumber(1);
}

function removeElement(event) {
    let parent = this.parentNode;
    // needs to remove siblings created with the button
    console.log('Elements with an indexnum of ' + this.dataset.indexnum + ' will be removed!');
    // Convert to Array to deal with this being a live list
    // let elements = Array.prototype.slice.call(document.getElementsByClassName(this.className));
    let elements = getElementsByDataIndexNumber(this.dataset.indexnum);
    // console.log(elements);
    for (var el of elements) {
        console.log(el);
        parent.removeChild(el);
    }
}

// modified from example found at w3schools
function includeHTML() {
    let elemCollection, elmnt, targetHTML, xhttp;
    /*loop through a collection of all HTML elements:*/
    elemCollection = document.getElementsByTagName("*");
    for (let i = 0; i < elemCollection.length; i++) {
        elmnt = elemCollection[i];
        /*search for elements with a certain attribute:*/
        targetHTML = elmnt.getAttribute("include-html");
        if (targetHTML) {
            /*make an HTTP request using the attribute value as the file name:*/
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        elmnt.innerHTML = this.responseText;
                    }
                    if (this.status === 404) {
                        elmnt.innerHTML = "HTML Template Page Not Found!";
                    }
                    /*remove the attribute, and call this function once more:*/
                    elmnt.removeAttribute("include-html");
                    includeHTML();
                }
            };
            xhttp.open("GET", targetHTML, true);
            xhttp.send();
            /*exit the function:*/
            return;
        }
    }
}

function htmlToBeTemplated(parentNode, elementURL, elementClass) {
    console.log("Adding new paragraph element");
    let elem = document.createElement("p");
    elem.setAttribute('include-html', elementURL);
    elem.setAttribute('data-indexnum', elementCounter);
    //elem.innerHTML = 'test';
    elem.className = elementClass;
    // parentNode.appendChild(elem);
    parentNode.insertAdjacentElement('beforebegin', elem);
}

function addViewFormFields(event) {
    // add to add-view-div
    let targetParent = document.getElementById("view-add-label");
    //console.log(targetParent);
    let selector = document.getElementById('viewSelector');
    let selectedView = selector.options[selector.selectedIndex].value;
    console.log(selectedView);
    // Switch on the type of view we're adding to get the correct form fields

    if (formTemplates.has(selectedView)) {
        addFormFields(targetParent, formTemplates.get(selectedView));
    }
}

function getElementsByDataIndexNumber(indexNumber) {
    let elements = [];
    let elemCollection = Array.prototype.slice.call(formElement.getElementsByTagName('*'));
    // console.log(elemCollection);
    for (let i in elemCollection) {
        let elem = elemCollection[i];
        if (elem.getAttribute('data-indexnum') !== null) {
            // console.log(elem.getAttribute('data-indexnum'));
            if (elem.getAttribute('data-indexnum') === indexNumber.toString()) {
                elements.push(elem);
            }
        }
    }
    // console.log(elements);
    return elements
}