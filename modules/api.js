/*
    Versionshantering projekt 1 (FE23)
    Grupp 1

    Funktionalitet för att hämta ut väderdata från API. 
*/

import {
    timestampToTime,
    timestampToDate,
    timestampToLongDate,
    timestampToHour
} from '../modules/utilities.js';

import { showErrorMessage } from '../modules/interface.js';


const API_KEY = "5261d802270baa988556276b1069665e";



/**********************************************************************************
 * FÖRORENINGAR - NUVARANDE
 **********************************************************************************/

/////////////////////////////////////////////////////////////////////////////////////////////
// Returnera promise för hämtning av nuvarande föroreningar för en angiven stad.    [stoffe]
async function getCurrentPollutionByCity(cityName, maxResults = 5) {
    const requestURL = new URL('https://api.openweathermap.org/geo/1.0/direct');
    requestURL.searchParams.append("q", cityName);
    requestURL.searchParams.append("limit", maxResults);
    requestURL.searchParams.append("appid", API_KEY);
    return fetchJSON(requestURL, getCurrentPollutionByCoords);
}


/////////////////////////////////////////////////////////////////////////////////////////////
// Bygg array med nuvarande föroreningar-info för platser med angivna koordinater   [stoffe]
async function getCurrentPollutionByCoords(cityCoordsList) {
    try {
        if (Array.isArray(cityCoordsList) && (cityCoordsList.length > 0)) {
            const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
            const cityPollution = [];

            for (const cityCoords of cityCoordsList) {
                const requestURL = new URL("https://api.openweathermap.org/data/2.5/air_pollution");
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


/////////////////////////////////////////////////////////////////////////////////////////////
// Sammanställ info om föroreningar på en plats                                     [stoffe]
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

/////////////////////////////////////////////////////////////////////////////////////////////
// Returnera promise för hämtning av prognos för föroreningar för en angiven stad.  [stoffe]
async function getPollutionForecastByCity(cityName, maxResults = 5) {
    const requestURL = new URL('https://api.openweathermap.org/geo/1.0/direct');
    requestURL.searchParams.append("q", cityName);
    requestURL.searchParams.append("limit", maxResults);
    requestURL.searchParams.append("appid", API_KEY);
    return fetchJSON(requestURL, getPollutionForecastByCoords);
}

/////////////////////////////////////////////////////////////////////////////////////////////
// Bygg array med prognos för föroreningar för platser med angivna koordinater      [stoffe]
async function getPollutionForecastByCoords(cityCoordsList) {
    try {
        if (Array.isArray(cityCoordsList) && (cityCoordsList.length > 0)) {
            const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
            const cityPollution = [];

            for (const cityCoords of cityCoordsList) {
                const requestURL = new URL("https://api.openweathermap.org/data/2.5/air_pollution/forecast");
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

/////////////////////////////////////////////////////////////////////////////////////////////
// Sammanställ prognoser om föroreningar på en plats                                [stoffe]
async function getPollutionForecast(pollutionData) {
    const pollutionResults = {};
    for (const pollution of pollutionData.list) {
        const forecastDay = timestampToDate(pollution.dt);
        if ((pollutionResults[forecastDay] === undefined) || !Array.isArray(pollutionResults[forecastDay])) {
            pollutionResults[forecastDay] = [];
        }

        const pollutionResult = {
            date: timestampToDate(pollution.dt),
            longDate: timestampToLongDate(pollution.dt),
            time: timestampToTime(pollution.dt),
            timeHour: timestampToHour(pollution.dt),
            qualityIndex: (pollution.main.aqi !== undefined ? pollution.main.aqi : 0),
            pollutants: pollution.components,
        };
        pollutionResults[forecastDay].push(pollutionResult);
    }

    return pollutionResults;
}

/**********************************************************************************
 * VÄDER - NUVARANDE
 **********************************************************************************/

/////////////////////////////////////////////////////////////////////////////////////////////
// Returnera promise för hämtning av nuvarande väder för en angiven stad.           [stoffe]
async function getCurrentWeatherByCity(cityName, maxResults = 5) {
    const requestURL = new URL('https://api.openweathermap.org/geo/1.0/direct');
    requestURL.searchParams.append("q", cityName);
    requestURL.searchParams.append("limit", maxResults);
    requestURL.searchParams.append("appid", API_KEY);
    return fetchJSON(requestURL, getCurrentWeatherByCoords);
}


/////////////////////////////////////////////////////////////////////////////////////////////
// Bygg array med nuvarande väder-info för platser med angivna koordinater          [stoffe]
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


/////////////////////////////////////////////////////////////////////////////////////////////
// Sammanställ väder-info om nuvarande väder på sökt plats                          [stoffe]
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
            humidityPercent: (weatherData.main.humidity !== undefined ? weatherData.main.humidity : 0),
            pressure: (weatherData.main.pressure !== undefined ? weatherData.main.pressure : weatherData.main.pressure),
            visibilityMeters: (weatherData.visibility !== undefined ? weatherData.visibility : 0),
            windSpeed: (weatherData.wind.speed !== undefined ? weatherData.wind.speed : 0),
            windSpeedGust: (weatherData.wind.gust !== undefined ? weatherData.wind.gust : 0),
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

/////////////////////////////////////////////////////////////////////////////////////////////
// Returnera promise för hämtning av väderinformation för en angiven stad.          [stoffe]
async function getWeatherForecastByCity(cityName, maxResults = 5) {
    const requestURL = new URL('https://api.openweathermap.org/geo/1.0/direct');
    requestURL.searchParams.append("q", cityName);
    requestURL.searchParams.append("limit", maxResults);
    requestURL.searchParams.append("appid", API_KEY);
    return fetchJSON(requestURL, getWeatherForecastsByCoords);
}


/////////////////////////////////////////////////////////////////////////////////////////////
// Bygg array med väderdata för platser med angivna koordinater                     [stoffe]
async function getWeatherForecastsByCoords(cityCoordsList) {
    try {
        if (Array.isArray(cityCoordsList) && (cityCoordsList.length > 0)) {
            const cityForecasts = [];
            for (const cityCoords of cityCoordsList) {
                const requestURL = new URL("https://api.openweathermap.org/data/2.5/forecast");
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


/////////////////////////////////////////////////////////////////////////////////////////////
// Bygg väderprognos för angiven plats                                              [stoffe]
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
                humidityPercent: (forecastTime.main.humidity !== undefined ? forecastTime.main.humidity : 0),
                pressure: (forecastTime.main.pressure !== undefined ? forecastTime.main.pressure : 0),
                visibilityMeters: (forecastTime.visibility !== undefined ? forecastTime.visibility : 0),
                windSpeed: (forecastTime.wind.speed !== undefined ? forecastTime.wind.speed : 0),
                windSpeedGust: (forecastTime.wind.gust !== undefined ? forecastTime.wind.gust : 0),
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


/////////////////////////////////////////////////////////////////////////////////////////////
// Hämta information från API                                                       [stoffe]
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


/////////////////////////////////////////////////////////////////////////////////////////////
// Felhantering                                                                     [stoffe]
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