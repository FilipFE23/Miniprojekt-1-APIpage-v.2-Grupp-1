/*
Funktionalitet för att bygga gränssnitt här
*/

import { createContainerElement, createImageElement, createTextElement, createTextElementWithTitle } from '../modules/utilities.js';


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Callback-funktion för att visa väderprognos från sökresultat på städer
/*
Parameter weatherSearchResult som skickas till callbackfunktionen är en Array med objekt för varje plats/stad med följande properties:
    location: objekt med info om platsen vädenprognosen gäller: {
        cityName:               Namn på staden
        countryName:            Namn på landet staden ligger i
        sunrise                 Tid då solen går upp på platsen
        sunset                  Tid då solen går ner på platsen
    }
    forecasts: objekt med datum som property som innehåller en array av forecast-objekt med prognoser för den dagen {
        dateTime:               datum och tid för denna prognos som text
        date:                   datum för denna prognos som text
        time:                   klockslag för denna prognos som text
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
function buildWeatherForecastsCallback(weatherSearchResult) {
    const outputBox = document.querySelector("#homeresultsdiv");

    // väder på varje stad som matchar sökningen
    for (const weather of weatherSearchResult) {
        const resultBox = createContainerElement('article', '', 'weather-city', outputBox);
        const cityInfoBox = createContainerElement('div', '', 'weather-city-info', resultBox);
        const cityForecastsBox = createContainerElement('div', '', 'weather-city-forecasts', resultBox);

        createTextElement('h3', `${weather.location.cityName} (${weather.location.countryName})`, '', '', 'weather-city-info-name', cityInfoBox);
        createTextElementWithTitle('div', "Sunrise:", weather.location.sunrise, '', '', 'weather-city-info-sunrise', cityInfoBox);
        createTextElementWithTitle('div', "Sunset:", weather.location.sunset, '', '', 'weather-city-info-sunset', cityInfoBox);

        // varje dag det finns väderprognos för staden
        for (const forecastDay in weather.forecasts) {
            const forecastDayBox = createContainerElement('div', '', 'weather-forecasts-day', cityForecastsBox);
            createTextElement('h4', forecastDay, '', '', 'weather-forecasts-day-title', forecastDayBox)

            // Varje prognostillfälle för den dagen
            for (const forecast of weather.forecasts[forecastDay]) {
                const forecastBox = createContainerElement('div', '', 'weather-forecasts-day-time', forecastDayBox);
                createTextElement('h5', forecast.time, '', '', 'weather-forecasts-day-time-title', forecastBox);
                createTextElement('div', forecast.weatherType[0].description, '', '', 'weather-forecasts-day-time-type', forecastBox);
                createImageElement(`https://openweathermap.org/img/wn/${forecast.weatherType[0].icon}@2x.png`, forecast.weatherType[0].description, '', '', 'weather-forecasts-day-time-icon', forecastBox);
                createTextElementWithTitle('div', "Cloud coverage:", `${forecast.cloudinessPercent}%`, '-', '', 'weather-forecasts-day-time-clouds', forecastBox);
                createTextElementWithTitle('div', "Temperature:", `${forecast.temperature}°C (${forecast.temperatureFeelsLike}°C)`, '-', '', 'weather-forecasts-day-time-temp', forecastBox);

                const windWrapperBox = createContainerElement('div', '', 'weather-forecasts-day-time-wind-wrapper', forecastBox);
                createTextElementWithTitle('span', "Wind:", `${forecast.windSpeed} m/s (${forecast.windSpeedGust} m/s)`, '-', '', 'weather-forecasts-day-time-wind', windWrapperBox);
                const windDirectionArrow = createImageElement(`./images/direction-arrow.png`, `Wind direction ${forecast.windDirectionDegrees} degrees`, '', '', 'weather-forecasts-day-time-wind-dir', windWrapperBox);
                windDirectionArrow.style.transform = `rotate(${forecast.windDirectionDegrees}deg)`;

                createTextElementWithTitle('div', "Visibility range:", `${forecast.visibilityMeters}m`, '-', '', 'weather-forecasts-day-time-visibility', forecastBox);

                if (forecast.snowAmount > 0) {
                    createTextElementWithTitle('div', "Precipitation:", `${forecast.rainOrSnowChance}% (${forecast.snowAmount} mm)`, '-', '', 'weather-forecasts-day-time-snow', forecastBox);
                }
                else if (forecast.rainAmount > 0) {
                    createTextElementWithTitle('div', "Precipitation:", `${forecast.rainOrSnowChance}% (${forecast.rainAmount} mm)`, '-', '', 'weather-forecasts-day-time-rain', forecastBox);
                }
                else {
                    createTextElementWithTitle('div', "Precipitation:", `${forecast.rainOrSnowChance}%`, '-', '', 'weather-forecasts-day-time-rainsnow', forecastBox);
                }
            }
        }
    }
}


function buildCurrentWeatherCallback(weatherSearchResult) {
    const outputBox = document.querySelector("#homeresultsdiv");

    // Nuvarande väder på varje stad som matchar sökningen
    for (const weather of weatherSearchResult) {
        const resultBox = createContainerElement('article', '', 'currentweather-city', outputBox);
        const cityInfoBox = createContainerElement('div', '', 'currentweather-city-info', resultBox);
        const cityWeatherBox = createContainerElement('div', '', 'currentweather-city-weather', resultBox);
        const weatherData = weather.weather;

        createTextElement('h3', `${weather.location.cityName} (${weather.location.countryName})`, '', '', 'currentweather-city-name', cityInfoBox);
        createTextElementWithTitle('div', "Sunrise:", weather.location.sunrise, '', '', 'currentweather-city-sunrise', cityInfoBox);
        createTextElementWithTitle('div', "Sunset:", weather.location.sunset, '', '', 'currentweather-city-sunset', cityInfoBox);

        createTextElement('div', weatherData.weatherType[0].description, '', '', 'currentweather-city-weather-type', cityWeatherBox);
        createImageElement(`https://openweathermap.org/img/wn/${weatherData.weatherType[0].icon}@2x.png`, weatherData.weatherType[0].description, '', '', 'currentweather-city-weather-icon', cityWeatherBox);
        createTextElementWithTitle('div', "Cloud coverage:", `${weatherData.cloudinessPercent}%`, '-', '', 'currentweather-city-weather-clouds', cityWeatherBox);
        createTextElementWithTitle('div', "Temperature:", `${weatherData.temperature}°C (${weatherData.temperatureFeelsLike}°C)`, '-', '', 'currentweather-city-weather-temp', cityWeatherBox);

        const windWrapperBox = createContainerElement('div', '', 'currentweather-city-weather-wind-wrapper', cityWeatherBox);
        createTextElementWithTitle('span', "Wind:", `${weatherData.windSpeed} m/s (${weatherData.windSpeedGust} m/s)`, '-', '', 'currentweather-city-weather-wind', windWrapperBox);
        const windDirectionArrow = createImageElement(`./images/direction-arrow.png`, `Wind direction ${weatherData.windDirectionDegrees} degrees`, '', '', 'currentweather-city-weather-wind-dir', windWrapperBox);
        windDirectionArrow.style.transform = `rotate(${weatherData.windDirectionDegrees}deg)`;

        createTextElementWithTitle('div', "Visibility range:", `${weatherData.visibilityMeters}m`, '-', '', 'currentweather-city-weather-visibility', cityWeatherBox);

        if (weatherData.snowAmount > 0) {
            createTextElementWithTitle('div', "Precipitation:", `${weatherData.rainOrSnowChance}% (${weatherData.snowAmount} mm)`, '-', '', 'currentweather-city-weather-snow', cityWeatherBox);
        }
        else if (weatherData.rainAmount > 0) {
            createTextElementWithTitle('div', "Precipitation:", `${weatherData.rainOrSnowChance}% (${weatherData.rainAmount} mm)`, '-', '', 'currentweather-city-weather-rain', cityWeatherBox);
        }
        else {
            createTextElementWithTitle('div', "Precipitation:", `0`, '-', '', 'currentweather-city-weather-rainsnow', cityWeatherBox);
        }
    }
}



/*
pollutionData - array med objekt som innehåller: 
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

function buildCurrentPollutionCallback(pollutionData) {
    const outputBox = document.querySelector("#pollutionresultsdiv");
    console.log("Current Pollution Data", pollutionData);
}


export { buildWeatherForecastsCallback, buildCurrentWeatherCallback, buildCurrentPollutionCallback }