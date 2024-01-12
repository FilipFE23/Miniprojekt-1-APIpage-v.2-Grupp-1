/*
    Versionshantering projekt 1 (FE23)
    Grupp 1

    Huvudscript för sidan - event handlers för sid-element.
*/

import {
    getWeatherForecastByCity,
    getCurrentWeatherByCity,
    getCurrentPollutionByCity,
    getPollutionForecastByCity
} from './modules/api.js';

import {
    buildWeatherForecastsCallback,
    buildCurrentWeatherCallback,
    buildCurrentPollutionCallback,
    buildPollutionForecastCallback,
    showErrorMessage,
    clearErrorMessages,
    toggleDarkMode
} from './modules/interface.js';


// Ställ in darkmode standardläge beroende på besökarens systeminställning
toggleDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);


///////////////////////////////////////////////////////////////////////////////////
// Submit handler för väder-sökning                                       [stoffe]
document.querySelector("#homeform").addEventListener("submit", (event) => {
    event.preventDefault();
    const searchInput = document.querySelector("#homesearch").value.trim();

    clearErrorMessages();
    document.querySelector("#homeresultsdiv").innerHTML = "";
    document.querySelector("#homesection h2").classList.add("hide");

    if (searchInput.length > 0) {
        // Nuvarande väder
        getCurrentWeatherByCity(searchInput, 1).then(buildCurrentWeatherCallback);

        // Femdygnsprognos
        getWeatherForecastByCity(searchInput).then(buildWeatherForecastsCallback);
    }
    else {
        showErrorMessage("Please enter the name of a town or county to search for.");
    }
});


///////////////////////////////////////////////////////////////////////////////////
// Submit handler för föroreningar-sökning                         [stoffe, filip]
document.querySelector("#pullutionform").addEventListener("submit", (event) => {
    event.preventDefault();
    const searchInput = document.querySelector("#pullutionsearch").value.trim();

    clearErrorMessages();
    document.querySelector("#pollutionresultsdiv").innerHTML = "";

    if (searchInput.length > 0) {
        // Nuvarande föroreningar
        getCurrentPollutionByCity(searchInput, 1).then(buildCurrentPollutionCallback);

        // Prognos för föroreningar
        getPollutionForecastByCity(searchInput).then(buildPollutionForecastCallback);
    }
    else {
        showErrorMessage("Please enter the name of a town or county to search for.");
    }
});


///////////////////////////////////////////////////////////////////////////////////
// Navlänkar - visa vald sid-sektion                                      [stoffe]
document.querySelectorAll("#headernav a").forEach((menuLink) => {
    menuLink.addEventListener("click", (event) => {
        event.preventDefault();

        const homeSection = document.querySelector("#homesection");
        const pollutionSection = document.querySelector("#pullutionsection");
        const aboutSection = document.querySelector("#aboutsection");
        const contactSection = document.querySelector("#contactsection");

        clearErrorMessages();

        homeSection.classList.add("hide");
        pollutionSection.classList.add("hide");
        aboutSection.classList.add("hide");
        contactSection.classList.add("hide");

        switch (event.currentTarget.id) {
            case "headernavhome": homeSection.classList.remove("hide"); break;
            case "headernavpollution": pollutionSection.classList.remove("hide"); break;
            case "headernavabout": aboutSection.classList.remove("hide"); break;
            case "headernavcontact": contactSection.classList.remove("hide"); break;
        }

        // Stäng burger-menyn efter ett menyval gjorts
        document.querySelector("#menu-toggle").checked = false;
    });
});


///////////////////////////////////////////////////////////////////////////////////
// Knapp för att växla darkmode                                           [stoffe]
document.querySelector("#darkmodebutton").addEventListener("click", (event) => {
    toggleDarkMode(!document.body.classList.contains("darkmode"));
});


///////////////////////////////////////////////////////////////////////////////////
// Uppdatera ändring av Darkmode i OS                                     [stoffe]
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    toggleDarkMode(event.matches);
});


///////////////////////////////////////////////////////////////////////////////////
// Submit av kontaktformuläret                                              [kamy]
document.querySelector("#contactform").addEventListener("submit", (event) => {
    event.preventDefault();
    const contactFormMessage = document.getElementById("thankyoumsg");
    const contactForm = document.getElementById("contactform");
    contactFormMessage.innerText = "Thank you for your message, we will answer shortly.";
    contactForm.reset();
});
