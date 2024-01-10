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
    clearErrorMessages
} from '../modules/interface.js';


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
    });
});


///////////////////////////////////////////////////////////////////////////////////
// Knapp för att växla darkmode
document.querySelector("#darkmodebutton").addEventListener("click", (event) => {
    const darkMode = document.body.classList.contains("darkmode");
    if (darkMode) {
        document.body.classList.remove("darkmode");
    }
    else {
        document.body.classList.add("darkmode");
    }
    event.target.innerText = (darkMode ? "Darkmode" : "Lightmode");
});


///////////////////////////////////////////////////////////////////////////////////
// Submit av kontaktformuläret
document.querySelector("#contactform").addEventListener("submit", (event) => {
    event.preventDefault();
    // ATT GÖRA: Fake-submit av formulär, rensa innehåll och visa "tack"-meddelande för användaren.
});
