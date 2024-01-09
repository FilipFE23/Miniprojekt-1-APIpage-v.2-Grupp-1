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
    outputBox.innerHTML = "";

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
            let rowCount = 0;
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


export { buildWeatherForecastsCallback }