
import { getWeatherForecastByCity, getCurrentWeatherByCity, getCurrentPollutionByCity, getPollutionForecastByCity } from '../modules/api.js';
import { buildWeatherForecastsCallback, buildCurrentWeatherCallback, buildCurrentPollutionCallback, buildPollutionForecastCallback } from '../modules/interface.js';

/*
    ATT GÖRA:
    [_] Hantera sökformulär för plats att visa väder
    [_] Hantera sökformulär för plats att visa föroreningar
    [_] Göm/Visa sektioner på sidan utifrån vad som väljs i menyn?
    [_] Gör klart interface.js: buildPollutionForecastCallback() så den visar resultat på sidan
*/



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

