/*
    Versionshantering projekt 1 (FE23)

    Funktionalitet för att hämta ut väderdata från API. 
*/

import { timestampToTime, timestampToDate, timestampToLongDate, timestampToHour } from '../modules/utilities.js';
import { showErrorMessage } from '../modules/interface.js';


const API_KEY = "5261d802270baa988556276b1069665e";



/**********************************************************************************
 * FÖRORENINGAR - NUVARANDE
 **********************************************************************************/
/*
CURRENT POLLUTION RESULT: 
{
    location = {
        cityName:       Name of city (in English),
        country:        country code,
        countryName:    Name of country (in English)
        state:          Name of state, if applicable (in English)
    }
    qualityIndex : [1, 2, 3, 4, 5] 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
    pollutants = {
        "co":       concentration of CO (Carbon monoxide), μg/m3
        "no":       concentration of NO (Nitrogen monoxide), μg/m3
        "no2":      concentration of NO2 (Nitrogen dioxide), μg/m3
        "o3":       concentration of O3 (Ozone), μg/m3
        "so2":      concentration of SO2 (Sulphur dioxide), μg/m3
        "pm2_5":     concentration of PM2.5 (Fine particles matter), μg/m3
        "pm10":     concentration of PM10 (Coarse particulate matter), μg/m3
        "nh3":      concentration of NH3 (Ammonia), μg/m3
      }
}
*/

///////////////////////////////////////////////////////////////////////////////////
// Returnera promise för hämtning av nuvarande föroreningar för en angiven stad.
async function getCurrentPollutionByCity(cityName, maxResults = 5) {
    const requestURL = new URL('http://api.openweathermap.org/geo/1.0/direct');
    requestURL.searchParams.append("q", cityName);
    requestURL.searchParams.append("limit", maxResults);
    requestURL.searchParams.append("appid", API_KEY);
    return fetchJSON(requestURL, getCurrentPollutionByCoords);
}


///////////////////////////////////////////////////////////////////////////////////
// Bygg array med nuvarande föroreningar-info för platser med angivna koordinater
async function getCurrentPollutionByCoords(cityCoordsList) {
    try {
        if (Array.isArray(cityCoordsList) && (cityCoordsList.length > 0)) {
            const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
            const cityPollution = [];

            for (const cityCoords of cityCoordsList) {
                const requestURL = new URL("http://api.openweathermap.org/data/2.5/air_pollution");
                requestURL.searchParams.append("lat", cityCoords.lat);
                requestURL.searchParams.append("lon", cityCoords.lon);
                requestURL.searchParams.append("appid", API_KEY);

                const pollution = await fetchJSON(requestURL, getCurrentPollution);
                pollution.location = {
                    cityName: cityCoords.name,
                    country: cityCoords.country,
                    countryName: countryNames.of(cityCoords.country),
                    state: cityCoords.state,
                }
                cityPollution.push(pollution);
            }
            return cityPollution;
        }
        else {
            throw new APIFetchError("No city matches your search. Try something else?", 1);
        }
    }
    catch (error) {
        errorHandlerAPI(error);
    }
}


///////////////////////////////////////////////////////////////////////////////////
// Sammanställ info om föroreningar på en plats
async function getCurrentPollution(pollutionData) {
    const pollution = pollutionData.list[0];
    const pollutionResult = {
        date: timestampToDate(pollution.dt),
        longDate: timestampToLongDate(pollution.dt),
        time: timestampToTime(pollution.dt),
        timeHour: timestampToHour(pollution.dt),
        qualityIndex: (pollution.main.aqi !== undefined ? pollution.main.aqi : 0),
        pollutants: pollution.components,
    };
    return pollutionResult;
}


/**********************************************************************************
 * FÖRORENINGAR - PROGNOS
 **********************************************************************************/
/*
POLLUTION FORECAST RESULT: 
{
    location = {
        cityName:       Name of city (in English),
        country:        country code,
        countryName:    Name of country (in English)
        state:          Name of state, if applicable (in English)
    }
    pollution = {       Array med prognos-objekt som innehåller följande
        {
            date:           Datum för prognosen
            time:           Tidpunkt för prognosen
            qualityIndex : [1, 2, 3, 4, 5] 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
            pollutants = {
                "co":       concentration of CO (Carbon monoxide), μg/m3
                "no":       concentration of NO (Nitrogen monoxide), μg/m3
                "no2":      concentration of NO2 (Nitrogen dioxide), μg/m3
                "o3":       concentration of O3 (Ozone), μg/m3
                "so2":      concentration of SO2 (Sulphur dioxide), μg/m3
                "pm2_5":     concentration of PM2.5 (Fine particles matter), μg/m3
                "pm10":     concentration of PM10 (Coarse particulate matter), μg/m3
                "nh3":      concentration of NH3 (Ammonia), μg/m3
            }
        }
    }
}
*/


///////////////////////////////////////////////////////////////////////////////////
// Returnera promise för hämtning av prognos för föroreningar för en angiven stad.
async function getPollutionForecastByCity(cityName, maxResults = 5) {
    const requestURL = new URL('http://api.openweathermap.org/geo/1.0/direct');
    requestURL.searchParams.append("q", cityName);
    requestURL.searchParams.append("limit", maxResults);
    requestURL.searchParams.append("appid", API_KEY);
    return fetchJSON(requestURL, getPollutionForecastByCoords);
}

///////////////////////////////////////////////////////////////////////////////////
// Bygg array med prognos för föroreningar för platser med angivna koordinater
async function getPollutionForecastByCoords(cityCoordsList) {
    try {
        if (Array.isArray(cityCoordsList) && (cityCoordsList.length > 0)) {
            const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
            const cityPollution = [];

            for (const cityCoords of cityCoordsList) {
                const requestURL = new URL("http://api.openweathermap.org/data/2.5/air_pollution/forecast");
                requestURL.searchParams.append("lat", cityCoords.lat);
                requestURL.searchParams.append("lon", cityCoords.lon);
                requestURL.searchParams.append("appid", API_KEY);

                const pollutionResult = {};
                pollutionResult.location = {
                    cityName: cityCoords.name,
                    country: cityCoords.country,
                    countryName: countryNames.of(cityCoords.country),
                    state: cityCoords.state,
                }
                pollutionResult.pollution = await fetchJSON(requestURL, getPollutionForecast);
                cityPollution.push(pollutionResult);
            }
            return cityPollution;
        }
        else {
            throw new APIFetchError("No city matches your search. Try something else?", 1);
        }
    }
    catch (error) {
        errorHandlerAPI(error);
    }
}

///////////////////////////////////////////////////////////////////////////////////
// Sammanställ prognoser om föroreningar på en plats
async function getPollutionForecast(pollutionData) {
    const pollutionResults = [];
    for (const pollution of pollutionData.list) {
        const pollutionResult = {
            date: timestampToDate(pollution.dt),
            longDate: timestampToLongDate(pollution.dt),
            time: timestampToTime(pollution.dt),
            timeHour: timestampToHour(pollution.dt),
            qualityIndex: (pollution.main.aqi !== undefined ? pollution.main.aqi : 0),
            pollutants: pollution.components,
        };
        pollutionResults.push(pollutionResult);
    }
    return pollutionResults;
}


/**********************************************************************************
 * VÄDER - NUVARANDE
 **********************************************************************************/


///////////////////////////////////////////////////////////////////////////////////
// Returnera promise för hämtning av nuvarande väder för en angiven stad.
async function getCurrentWeatherByCity(cityName, maxResults = 5) {
    const requestURL = new URL('http://api.openweathermap.org/geo/1.0/direct');
    requestURL.searchParams.append("q", cityName);
    requestURL.searchParams.append("limit", maxResults);
    requestURL.searchParams.append("appid", API_KEY);
    return fetchJSON(requestURL, getCurrentWeatherByCoords);
}


///////////////////////////////////////////////////////////////////////////////////
// Bygg array med nuvarande väder-info för platser med angivna koordinater
async function getCurrentWeatherByCoords(cityCoordsList) {
    try {
        if (Array.isArray(cityCoordsList) && (cityCoordsList.length > 0)) {
            const cityWeather = [];
            for (const cityCoords of cityCoordsList) {
                const requestURL = new URL("https://api.openweathermap.org/data/2.5/weather");
                requestURL.searchParams.append("units", "metric");
                requestURL.searchParams.append("lat", cityCoords.lat);
                requestURL.searchParams.append("lon", cityCoords.lon);
                requestURL.searchParams.append("appid", API_KEY);

                const weather = await fetchJSON(requestURL, getCurrentWeather);
                cityWeather.push(weather);
            }
            return cityWeather;
        }
        else {
            throw new APIFetchError("No city matches your search. Try something else?", 1);
        }
    }
    catch (error) {
        errorHandlerAPI(error);
    }
}


///////////////////////////////////////////////////////////////////////////////////
// Sammanställ väder-info om nuvarande väder på sökt plats
async function getCurrentWeather(weatherData) {
    let weatherResult = {};
    if (weatherData.cod == 200) {
        const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });

        // Info om platsen
        weatherResult.location = {
            cityName: weatherData.name,
            cityId: weatherData.id,
            countryName: countryNames.of(weatherData.sys.country),
            sunrise: timestampToTime(weatherData.sys.sunrise),
            sunset: timestampToTime(weatherData.sys.sunset),
        };

        // Väder-info
        weatherResult.weather = {
            date: timestampToDate(weatherData.dt),
            longDate: timestampToLongDate(weatherData.dt),
            time: timestampToTime(weatherData.dt),
            timeHour: timestampToHour(weatherData.dt),
            cloudinessPercent: (weatherData.clouds.all !== undefined ? weatherData.clouds.all : 0),
            temperature: Math.round(weatherData.main.temp),
            temperatureFeelsLike: Math.round(weatherData.main.feels_like),
            humidityPercent: weatherData.main.humidity,
            pressure: weatherData.main.pressure,
            visibilityMeters: weatherData.visibility,
            windSpeed: weatherData.wind.speed,
            windSpeedGust: weatherData.wind.gust,
            windDirectionDegrees: weatherData.wind.deg, // Nord = 0, Öst = 90, Syd = 180, Väst 270
            snowAmount: (weatherData.snow !== undefined ? weatherData.snow['1h'] : 0),
            rainAmount: (weatherData.rain !== undefined ? weatherData.rain['1h'] : 0),
            weatherType: weatherData.weather,
        }
    }
    return weatherResult;
}


/**********************************************************************************
 * VÄDER - FEMDYGNSPROGNOS
 **********************************************************************************/
/*
    getWeatherForecastByCity(cityName)
    Returnerar Promise med 5-dygnsprognos för väder i de städer vars namn matchar cityName
 
 
    ANVÄNDNINGS-EXEMPEL:  (logga temperaturen vid första prognostillfället för 10 januari i första staden vars namn matchar "Stockholm")
    -------------------
    getWeatherForecastByCity("Stockholm").then((weatherSearchResult) => {
        console.log(weatherSearchResult[0].forecasts["2024-01-10"][0].temperature);
    });
 
 
Parameter weatherSearchResult som skickas till callbackfunktionen ovan - Array med objekt för varje plats/stad med följande properties:
    location: objekt med info om platsen vädenprognosen gäller: {
        cityName:               Namn på staden
        countryName:            Namn på landet staden ligger i
        sunrise                 Tid då solen går upp på platsen
        sunset                  Tid då solen går ner på platsen
    }
    forecasts: objekt med datum som property som innehåller en array av forecast-objekt med prognoser för den dagen {
        dateTime:               datum och tid för denna prognos som text
        date:                   datum för denna prognos som text
        longDate:               datum i längre format typ "Onsdag 10 januari"
        time:                   klockslag för denna prognos som text
        timeHour:               enbart timmen i klockslaget
        timeOfDay:              Tid på dygnet (Day/Night)
        cloudinessPercent:      molnighet i procent [0-100]
        temperature:            temperatur i celsius
        temperatureFeelsLike:    upplevd temperatur pga blåst i celsius
        humidityPercent         luftfuktighet i procent [0-100]
        pressure:               atmosfäriskt lufttryck (hPa)
        visibilityMeters:       sikt i meter [0-10000]
        windSpeed:              vindhastighet i meter per sekund
        windSpeedGust:          vindhastighet i vindbyar i meter per sekund
        windDirectionDegrees:   vindriktning i grader (Nord = 0, Öst = 90, Syd = 180, Väst 270)
        rainOrSnowChance:       chans för nederbörd i procent [0-100]
        snowAmount:             snömängd i mm
        rainAmount:             regnmängd i mm
        weatherType:            Objekt: main = vädertyp (t.ex "Clouds"), description = kort beskrivning (t.ex "overcast clouds"), icon = ID för väder-ikon från API utan filändelse och sökväg (t.ex "02n")
                                För betydelse av ID, se https://openweathermap.org/weather-conditions
    }
*/

///////////////////////////////////////////////////////////////////////////////////
// Returnera promise för hämtning av väderinformation för en angiven stad.
async function getWeatherForecastByCity(cityName, maxResults = 5) {
    const requestURL = new URL('http://api.openweathermap.org/geo/1.0/direct');
    requestURL.searchParams.append("q", cityName);
    requestURL.searchParams.append("limit", maxResults);
    requestURL.searchParams.append("appid", API_KEY);
    return fetchJSON(requestURL, getWeatherForecastsByCoords);
}


///////////////////////////////////////////////////////////////////////////////////
// Bygg array med väderdata för platser med angivna koordinater
async function getWeatherForecastsByCoords(cityCoordsList) {
    try {
        if (Array.isArray(cityCoordsList) && (cityCoordsList.length > 0)) {
            const cityForecasts = [];
            for (const cityCoords of cityCoordsList) {
                const requestURL = new URL("http://api.openweathermap.org/data/2.5/forecast");
                requestURL.searchParams.append("units", "metric");
                requestURL.searchParams.append("lat", cityCoords.lat);
                requestURL.searchParams.append("lon", cityCoords.lon);
                requestURL.searchParams.append("appid", API_KEY);

                const forecast = await fetchJSON(requestURL, getWeatherForecasts);
                cityForecasts.push(forecast);
            }
            return cityForecasts;
        }
        else {
            throw new APIFetchError("No city matches your search. Try something else?", 1);
        }
    }
    catch (error) {
        errorHandlerAPI(error);
    }
}


///////////////////////////////////////////////////////////////////////////////////
// Bygg väderprognos för angiven plats
async function getWeatherForecasts(weatherForecast) {
    let forecastResult = {};

    if (weatherForecast.cnt > 0) {
        const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });

        // Info om platsen
        forecastResult.location = {
            cityName: weatherForecast.city.name,
            cityId: weatherForecast.city.id,
            countryName: countryNames.of(weatherForecast.city.country),
            sunrise: timestampToTime(weatherForecast.city.sunrise),
            sunset: timestampToTime(weatherForecast.city.sunset),
        };

        // Prognoser
        forecastResult.forecasts = [];
        for (const forecastTime of weatherForecast.list) {
            const forecastDay = timestampToDate(forecastTime.dt);

            if ((forecastResult.forecasts[forecastDay] === undefined) || !Array.isArray(forecastResult.forecasts[forecastDay])) {
                forecastResult.forecasts[forecastDay] = [];
            }

            const forecastData = {
                dateTime: forecastTime.dt_txt,
                date: timestampToDate(forecastTime.dt),
                longDate: timestampToLongDate(forecastTime.dt),
                time: timestampToTime(forecastTime.dt),
                timeHour: timestampToHour(forecastTime.dt),
                timeOfDay: (forecastTime.sys.pod == "n" ? "night" : "day"),
                cloudinessPercent: (forecastTime.clouds.all !== undefined ? forecastTime.clouds.all : 0),
                temperature: Math.round(forecastTime.main.temp),
                temperatureFeelsLike: Math.round(forecastTime.main.feels_like),
                humidityPercent: forecastTime.main.humidity,
                pressure: forecastTime.main.pressure,
                visibilityMeters: forecastTime.visibility,
                windSpeed: forecastTime.wind.speed,
                windSpeedGust: forecastTime.wind.gust,
                windDirectionDegrees: forecastTime.wind.deg, // Nord = 0, Öst = 90, Syd = 180, Väst 270
                rainOrSnowChance: (forecastTime.pop * 100).toFixed(1),
                snowAmount: (forecastTime.snow !== undefined ? forecastTime.snow['3h'] : 0),
                rainAmount: (forecastTime.rain !== undefined ? forecastTime.rain['3h'] : 0),
                weatherType: forecastTime.weather,
            }
            forecastResult.forecasts[forecastDay].push(forecastData);
        }

    }
    return forecastResult;
}


/**********************************************************************************
 * ALLMÄNT
 **********************************************************************************/


///////////////////////////////////////////////////////////////////////////////////
// Hämta information från API
async function fetchJSON(url, callbackFunc) {
    try {
        const response = await fetch(url);
        if (!response.ok)
            throw new APIFetchError(response.statusText, response.status);

        const result = await response.json();
        if (typeof callbackFunc == "function") {
            return callbackFunc(result);
        }
        return result;
    }
    catch (error) {
        errorHandlerAPI(error);
    }
}


///////////////////////////////////////////////////////////////////////////////////
// Felhantering
function errorHandlerAPI(error) {
    if (error instanceof APIFetchError) {
        if (error.statusCode == 1) {
            showErrorMessage(error.message);
        }
        else {
            showErrorMessage(`${error.message} (${error.statusCode})`);
            console.error("API Response Error:", error.statusCode, error.message);
        }
    }
    else {
        showErrorMessage(`An error occurred. Try again later?`);
        console.error("General error:", error);
    }
}


class APIFetchError extends Error {
    statusCode = 0;
    constructor(message, errorCode) {
        super(message);
        this.statusCode = errorCode;
    }
}


export { getWeatherForecastByCity, getCurrentWeatherByCity, getCurrentPollutionByCity, getPollutionForecastByCity }