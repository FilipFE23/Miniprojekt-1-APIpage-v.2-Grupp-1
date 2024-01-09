
import { getWeatherForecastByCity, getCurrentWeatherByCity, getCurrentPollutionByCity, getPollutionForecastByCity } from '../modules/api.js';
import { buildWeatherForecastsCallback, buildCurrentWeatherCallback, buildCurrentPollutionCallback, buildPollutionForecastCallback, clearErrorMessages } from '../modules/interface.js';


// Submit handler för väder-sökning
document.querySelector("#homeform").addEventListener("submit", (event) => {
    event.preventDefault();
    const searchInput = document.querySelector("#homesearch").value.trim();

    document.querySelector("#homeresultsdiv").innerHTML = "";
    clearErrorMessages();

    // Nuvarande väder
    getCurrentWeatherByCity(searchInput, 1).then(buildCurrentWeatherCallback);
    // Femdygnsprognos
    getWeatherForecastByCity(searchInput).then(buildWeatherForecastsCallback);
});




// Submit handler för föroreningar-sökning
document.querySelector("#pullutionform").addEventListener("submit", (event) => {
    event.preventDefault();
    const searchInput = document.querySelector("#pullutionsearch").value.trim();

    document.querySelector("#pollutionresultsdiv").innerHTML = "";
    clearErrorMessages();

    // Nuvarande föroreningar
    getCurrentPollutionByCity(searchInput).then(buildCurrentPollutionCallback);
    // Prognos för föroreningar
    getPollutionForecastByCity(searchInput).then(buildPollutionForecastCallback);
});



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

