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
    // create new element
    let newLabel = document.createElement("label");
    newLabel.setAttribute('for', 'new-element');
    newLabel.setAttribute('grid-row', '2/3');
    let newText = document.createTextNode('new-element');
    newLabel.appendChild(newText);

    let newChild = document.createElement("input");
    newChild.setAttribute('text', 'New Element');
    newChild.setAttribute('id', 'new-element');
    newLabel.setAttribute('grid-row', '2/3');

    parentElement.appendChild(newLabel);
    parentElement.appendChild(newChild);
    console.log("New Element Added!");

    let removeButton = document.createElement('input');
    removeButton.setAttribute('type', 'button');
    removeButton.setAttribute('grid-column-start', '3');
    removeButton.setAttribute('grid-row', '2/3');
    removeButton.onclick = removeElement;
    parentElement.appendChild(removeButton)

}

function removeElement(event){
    console.log(this.value);
    this.parentElement.remove();
}