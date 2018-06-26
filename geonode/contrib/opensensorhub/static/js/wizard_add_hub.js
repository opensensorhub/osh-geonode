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

    // create new element
    let newLabel = document.createElement("label");
    newLabel.className = elementClass;
    newLabel.setAttribute('for', 'new-element');
    newLabel.style.gridColumn = '1/2';
    let newText = document.createTextNode('new-element');


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
    newLabel.appendChild(newText);
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