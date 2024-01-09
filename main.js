
import { getWeatherForecastByCity, getCurrentWeatherByCity, getCurrentPollutionByCity } from '../modules/api.js';
import { buildWeatherForecastsCallback, buildCurrentWeatherCallback, buildCurrentPollutionCallback } from '../modules/interface.js';


// ETT SNABBT FUL-TEST! - demo/test av getWeatherForecastByCity(), ta bort sen... 
/*getWeatherForecastByCity(cityName) - Returnerar Promise med 5-dygnsprognos för väder i de städer vars namn matchar cityName

    ANVÄNDNINGS-EXEMPEL:  (logga temperaturen vid första prognostillfället för 10 januari i första staden vars namn matchar "Stockholm")
    -------------------
    getWeatherForecastByCity("Stockholm").then((weatherSearchResult) => {
        console.log(weatherSearchResult[0].forecasts["2024-01-10"][0].temperature);
    });

*/
const cityName = "Malmö";
document.querySelector("#homeresultsdiv").innerHTML = "";
getCurrentWeatherByCity(cityName, 1).then(buildCurrentWeatherCallback);
getWeatherForecastByCity(cityName).then(buildWeatherForecastsCallback);

document.querySelector("#pollutionresultsdiv").innerHTML = "";
getCurrentPollutionByCity("Malmö").then(buildCurrentPollutionCallback);


