/*
    Versionshantering projekt 1 (FE23)

    Generella verktygsfunktioner.
*/


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Skapa ett wrapper-element
export function createContainerElement(elementType = 'div', elementId = '', cssClass = '', parentContainer = null) {
    const containerElement = document.createElement(elementType);
    addIdentifiersToElement(containerElement, cssClass, elementId);
    if (parentContainer !== null) {
        parentContainer.appendChild(containerElement);
    }
    return containerElement;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Returnera ett nytt bild-element
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
// Skapa ett element med textinnehåll
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
        if (Array.isArray(classesToAdd)) {
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
    return (valueToCheck !== undefined) && (valueToCheck !== null) && (valueToCheck.length >= minLength) && (!isArray || Array.isArray(valueToCheck));
}