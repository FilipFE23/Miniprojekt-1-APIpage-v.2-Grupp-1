/*
    Versionshantering projekt 1 (FE23)
    Grupp 1

    Huvudscript för sidan - event handlers för sid-element.
*/

import { getWeatherForecastByCity, getCurrentWeatherByCity, getCurrentPollutionByCity, getPollutionForecastByCity } from '../modules/api.js';
import {
    buildWeatherForecastsCallback,
    buildCurrentWeatherCallback,
    buildCurrentPollutionCallback,
    buildPollutionForecastCallback,
    showErrorMessage,
    clearErrorMessages,
    toggleDarkMode
} from '../modules/interface.js';

// Ställ in darkmode standardläge beroende på besökarens OS-setting
toggleDarkMode(!window.matchMedia('(prefers-color-scheme: dark)').matches);


///////////////////////////////////////////////////////////////////////////////////
// Submit handler för väder-sökning
document.querySelector("#homeform").addEventListener("submit", (event) => {
    event.preventDefault();
    const searchInput = document.querySelector("#homesearch").value.trim();
    clearErrorMessages();

    if (searchInput.length > 0) {
        document.querySelector("#homeresultsdiv").innerHTML = "";

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
// Submit handler för föroreningar-sökning
document.querySelector("#pullutionform").addEventListener("submit", (event) => {
    event.preventDefault();
    const searchInput = document.querySelector("#pullutionsearch").value.trim();
    clearErrorMessages();

    if (searchInput.length > 0) {
        document.querySelector("#pollutionresultsdiv").innerHTML = "";
        document.querySelector("#currentpollutionresultsdiv").innerHTML = "";

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
// Navlänkar - visa vald sid-sektion
document.querySelectorAll("#headernav a").forEach((menuLink) => {
    menuLink.addEventListener("click", (event) => {
        event.preventDefault();

        const homeSection = document.querySelector("#homesection");
        const pollutionSection = document.querySelector("#pullutionsection");
        const aboutSection = document.querySelector("#aboutsection");
        const contactSection = document.querySelector("#contactsection");

        clearErrorMessages();

        if (event.currentTarget.id == "headernavhome") {
            // Visa Home
            homeSection.classList.remove("hide");
            pollutionSection.classList.add("hide");
            aboutSection.classList.add("hide");
            contactSection.classList.add("hide");
        }
        else if (event.currentTarget.id == "headernavpollution") {
            // Visa air pollution
            homeSection.classList.add("hide");
            pollutionSection.classList.remove("hide");
            aboutSection.classList.add("hide");
            contactSection.classList.add("hide");
        }
        else if (event.currentTarget.id == "headernavabout") {
            // Visa about
            homeSection.classList.add("hide");
            pollutionSection.classList.add("hide");
            aboutSection.classList.remove("hide");
            contactSection.classList.add("hide");
        }
        else if (event.currentTarget.id == "headernavcontact") {
            // Visa contact
            homeSection.classList.add("hide");
            pollutionSection.classList.add("hide");
            aboutSection.classList.add("hide");
            contactSection.classList.remove("hide");
        }

        // Stäng burger-menyn efter ett menyval gjorts
        document.querySelector("#menu-toggle").checked = false;
    });
});


///////////////////////////////////////////////////////////////////////////////////
// Knapp för att växla darkmode
document.querySelector("#darkmodebutton").addEventListener("click", (event) => {
    toggleDarkMode(document.body.classList.contains("darkmode"));
});


///////////////////////////////////////////////////////////////////////////////////
// Uppdatera ändring av Darkmode i OS
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    toggleDarkMode(!event.matches);
});


///////////////////////////////////////////////////////////////////////////////////
// Submit av kontaktformuläret
document.querySelector("#contactform").addEventListener("submit", (event) => {
    event.preventDefault();
    const contactFormMessage = document.getElementById("thankyoumsg");
    const contactForm = document.getElementById("contactform");
    contactFormMessage.innerText = "Thank you for your message, we will answer shortly.";
    contactForm.reset();
});
