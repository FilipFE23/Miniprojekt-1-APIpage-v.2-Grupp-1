/*
    Versionshantering projekt 1 (FE23)

    Generella verktygsfunktioner.
*/


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Skapa ett wrapper/container-element
export function createContainerElement(elementType = 'div', elementId = '', cssClass = '', parentContainer = null) {
    const containerElement = document.createElement(elementType);
    addIdentifiersToElement(containerElement, cssClass, elementId);
    if (parentContainer !== null) {
        parentContainer.appendChild(containerElement);
    }
    return containerElement;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Skapa ett nytt bild-element
export function createImageElement(imageUrl, altText, noImageUrl = '', elementId = '', cssClass = '', parentContainer = null) {
    const imageElement = document.createElement("img");
    imageElement.alt = (getValueIsSet(altText) ? altText : "No image description");
    imageElement.src = (getValueIsSet(imageUrl, 5) ? imageUrl : noImageUrl);

    addIdentifiersToElement(imageElement, cssClass, elementId);

    if (parentContainer !== null) {
        parentContainer.appendChild(imageElement);
    }
    return imageElement;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Skapa ett element med textinnehåll
export function createTextElement(elementType, textContent, textNoContent = '', elementId = '', cssClass = '', parentContainer = null) {
    const textElement = document.createElement(elementType);
    textElement.innerText = (textContent.length > 0 ? textContent : textNoContent);

    addIdentifiersToElement(textElement, cssClass, elementId);

    if (parentContainer !== null) {
        parentContainer.appendChild(textElement);
    }
    return textElement;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Skapa ett element med textinnehåll och en rubriks-etikett före
export function createTextElementWithTitle(elementType, textTitle, textContent, textNoContent = '', elementId = '', cssClass = '', parentContainer = null) {
    const textElement = document.createElement(elementType);
    const titleElement = document.createElement('span');
    titleElement.innerText = textTitle;
    textElement.append(
        titleElement,
        document.createTextNode(textContent.length > 0 ? textContent : textNoContent)
    );

    addIdentifiersToElement(textElement, cssClass, elementId);

    if (parentContainer !== null) {
        parentContainer.appendChild(textElement);
    }
    return textElement;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Lägg till CSS-klasser till ett element.
export function addIdentifiersToElement(targetElement, classesToAdd = '', elementId = '') {
    if (classesToAdd.length > 0) {
        if (getValueIsSet(classesToAdd, 1, true)) {
            targetElement.classList.add(...classesToAdd);
        }
        else if (getValueIsSet(classesToAdd)) {
            targetElement.classList.add(classesToAdd);
        }
    }
    if (elementId.length > 0) {
        targetElement.id = elementId;
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Kolla om parametern innehåller ett värde av tillräcklig längd
export function getValueIsSet(valueToCheck, minLength = 1, isArray = false) {
    return (valueToCheck !== undefined) && (valueToCheck !== null) && (valueToCheck.length >= minLength) && (!isArray || (isArray && Array.isArray(valueToCheck)));
}


///////////////////////////////////////////////////////////////////////////////////
// Konvertera Unix-timestamp till tid som en textsträng
export function timestampToTime(timeStamp) {
    const dateObj = new Date(timeStamp * 1000);
    return dateObj.toLocaleTimeString('sv-SE');
}


///////////////////////////////////////////////////////////////////////////////////
// Konvertera Unix-timestamp till datum som en textsträng
export function timestampToDate(timeStamp) {
    const dateObj = new Date(timeStamp * 1000);
    return dateObj.toLocaleDateString('sv-SE');
}