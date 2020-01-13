addElement = (parentId, elementTag, elementId, html = null, className = '', onclick = null) => {
    // Adds an element to the document
    const parent = document.getElementById(parentId);
    const newElement = document.createElement(elementTag);

    newElement.setAttribute('id', elementId);
    newElement.setAttribute('class', className);
    newElement.onclick = onclick;
    newElement.innerHTML = html;

    parent.appendChild(newElement);
}

closeOtherModals = () => {
    const modals = document.getElementsByClassName("modal");
    for (let modal of modals) {
        modal.style.display = "none";
    }
}

removeElement = (elementId) => {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

isPasswordValid = (password) => {
    const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return regex.test(password);
}

isValidElement = (element) => {
    return element.name && element.value;
};

isValidValue = (element) => {
    return (!['checkbox', 'radio'].includes(element.type) || element.checked);
};

formToJSON = (elements) => [].reduce.call(elements, (data, element) => {
    // Make sure the element has the required properties.
    if (isValidElement(element) && isValidValue(element)) {
        data[element.name] = element.value;
    }

    return data;
}, {});

const constatns = {
    defaultValueForSelect: "Choose..."
}
