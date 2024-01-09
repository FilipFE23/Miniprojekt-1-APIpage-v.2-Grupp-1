
import { getWeatherForecastByCity, getCurrentWeatherByCity, getCurrentPollutionByCity, getPollutionForecastByCity } from '../modules/api.js';
import { buildWeatherForecastsCallback, buildCurrentWeatherCallback, buildCurrentPollutionCallback, buildPollutionForecastCallback } from '../modules/interface.js';


// ETT SNABBT FUL-TEST! - demo/test av getWeatherForecastByCity(), använd detta i event-handlers för sökformulär sen istället. 
/*getWeatherForecastByCity(cityName) - Returnerar Promise med 5-dygnsprognos för väder i de städer vars namn matchar cityName

    ANVÄNDNINGS-EXEMPEL:  (logga temperaturen vid första prognostillfället för 10 januari i första staden vars namn matchar "Stockholm")
    -------------------
    getWeatherForecastByCity("Stockholm").then((weatherSearchResult) => {
        console.log(weatherSearchResult[0].forecasts["2024-01-10"][0].temperature);
    });

*/
const cityName = "Malmö";
document.querySelector("#homeresultsdiv").innerHTML = "";
// Nuvarande väder
getCurrentWeatherByCity(cityName, 1).then(buildCurrentWeatherCallback);
// Femdygnsprognos
getWeatherForecastByCity(cityName).then(buildWeatherForecastsCallback);

document.querySelector("#pollutionresultsdiv").innerHTML = "";
// Nuvarande föroreningar
getCurrentPollutionByCity("Malmö").then(buildCurrentPollutionCallback);
// Prognos för föroreningar
getPollutionForecastByCity("Malmö").then(buildPollutionForecastCallback);


/*
// TODO: Submit handler för väder-sökning, behöver få FORM i html-filen först
document.querySelector("#homesection form").addEventListener("submit", (event) => {
    event.preventDefault();
    const searchInput = document.querySelector("#homesearch");
    
    document.querySelector("#homeresultsdiv").innerHTML = "";

    // Nuvarande väder
    getCurrentWeatherByCity(searchInput, 1).then(buildCurrentWeatherCallback);
    // Femdygnsprognos
    getWeatherForecastByCity(searchInput).then(buildWeatherForecastsCallback);
});
*/


/*
// TODO: Submit handler för föroreningar-sökning, behöver få FORM i html-filen först
document.querySelector("#pullutionsection form").addEventListener("submit", (event) => {
    event.preventDefault();
    const searchInput = document.querySelector("#pullutionsearch");
    
    document.querySelector("#pollutionresultsdiv").innerHTML = "";

    // Nuvarande föroreningar
    getCurrentPollutionByCity(searchInput).then(buildCurrentPollutionCallback);
    // Prognos för föroreningar
    getPollutionForecastByCity(searchInput).then(buildPollutionForecastCallback);
});
*/


// TODO: Navlänkar - visa rätt sektion
document.querySelectorAll("body > header > nav > a").forEach((menuLink) => {
    menuLink.addEventListener("click", (event) => {
        event.preventDefault();

        const homeSection = document.querySelector("#homesection");
        const pollutionSection = document.querySelector("#pullutionsection");
        const aboutSection = document.querySelector("#aboutsection");
        const contactSection = document.querySelector("#contactsection");

        if (event.currentTarget.id == "TODO: HOME-LÄNKENS ID HÄR") {
            // Visa Home
            homeSection.classList.remove("hide");
            pollutionSection.classList.add("hide");
            aboutSection.classList.add("hide");
            contactSection.classList.add("hide");
        }
        else if (event.currentTarget.id == "TODO: POLLUTION-LÄNKENS ID HÄR") {
            // Visa air pollution
            homeSection.classList.add("hide");
            pollutionSection.classList.remove("hide");
            aboutSection.classList.add("hide");
            contactSection.classList.add("hide");
        }
        else if (event.currentTarget.id == "TODO: ABOUT-LÄNKENS ID HÄR") {
            // Visa about
            homeSection.classList.add("hide");
            pollutionSection.classList.add("hide");
            aboutSection.classList.remove("hide");
            contactSection.classList.add("hide");
        }
        else if (event.currentTarget.id == "TODO: CONTACT-LÄNKENS ID HÄR") {
            // Visa contact
            homeSection.classList.add("hide");
            pollutionSection.classList.add("hide");
            aboutSection.classList.add("hide");
            contactSection.classList.remove("hide");
        }
    });
});