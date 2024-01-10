/*
    Versionshantering projekt 1 (FE23)
    Grupp 1

    Funktionalitet för att bygga gränssnitt och presentera sökresultat.
*/

import { createContainerElement, createImageElement, createTextElement, createTextElementWithTitle, getValueIsSet } from '../modules/utilities.js';



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
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Callback-funktion för att visa väderprognos från sökresultat på städer
function buildWeatherForecastsCallback(weatherSearchResult) {
    const outputBox = document.querySelector("#homeresultsdiv");

    if (getValueIsSet(weatherSearchResult, 1, true)) {
        // väder på varje stad som matchar sökningen
        let cityCount = 0;
        for (const weather of weatherSearchResult) {
            cityCount++;
            const resultBox = createContainerElement('article', '', 'weather-city', outputBox);
            const cityInfoBox = createContainerElement('div', '', 'weather-city-info', resultBox);
            const cityForecastsBox = createContainerElement('div', '', 'weather-city-forecasts', resultBox);
            cityInfoBox.addEventListener("click", (event) => { cityForecastsBox.classList.toggle("hide"); });
            if (cityCount > 1) {
                cityForecastsBox.classList.add("hide");
            }

            createTextElement('h3', `${weather.location.cityName} (${weather.location.countryName})`, '', '', 'weather-city-info-name', cityInfoBox);
            createTextElementWithTitle('div', "Sunrise:", weather.location.sunrise, '', '', 'weather-city-info-sunrise', cityInfoBox);
            createTextElementWithTitle('div', "Sunset:", weather.location.sunset, '', '', 'weather-city-info-sunset', cityInfoBox);

            // varje dag det finns väderprognos för staden
            let dayCount = 0;
            for (const forecastDay in weather.forecasts) {
                dayCount++;
                const forecastDayBox = createContainerElement('div', '', 'weather-forecasts-day', cityForecastsBox);
                const forecastsHeader = createTextElement('h4', weather.forecasts[forecastDay][0].longDate, '', '', 'weather-forecasts-day-title', forecastDayBox);
                const forecastsWrapperBox = createContainerElement('div', `weather-forecasts-${weather.location.cityId}-day-${forecastDay}`, 'weather-forecasts-day-times-wrapper', forecastDayBox);
                forecastsHeader.addEventListener("click", (event) => { forecastsWrapperBox.classList.toggle("hide"); });
                if (dayCount > 1) {
                    forecastsWrapperBox.classList.add("hide");
                }
                // Varje prognostillfälle för den dagen
                for (const forecast of weather.forecasts[forecastDay]) {
                    const forecastBox = createContainerElement('div', '', 'weather-forecasts-day-time', forecastsWrapperBox);
                    createTextElement('h5', forecast.timeHour, '', '', 'weather-forecasts-day-time-title', forecastBox);
                    createTextElement('div', forecast.weatherType[0].description, '', '', 'weather-forecasts-day-time-type', forecastBox);
                    createImageElement(`https://openweathermap.org/img/wn/${forecast.weatherType[0].icon}@2x.png`, forecast.weatherType[0].description, '', '', 'weather-forecasts-day-time-icon', forecastBox);

                    const tempWrapperBox = createContainerElement('div', '', 'weather-forecasts-day-time-temp-wrapper', forecastBox);
                    createTextElementWithTitle('div', "Temperature:", `${forecast.temperature}°C`, '-', '', 'weather-forecasts-day-time-temp', tempWrapperBox);
                    createTextElementWithTitle('div', "Feels like:", `${forecast.temperatureFeelsLike}°C`, '-', '', 'weather-forecasts-day-time-temp-feels', tempWrapperBox);

                    const windWrapperBox = createContainerElement('div', '', 'weather-forecasts-day-time-wind-wrapper', forecastBox);
                    createTextElementWithTitle('span', "Wind:", `${forecast.windSpeed} m/s`, '-', '', 'weather-forecasts-day-time-wind', windWrapperBox);
                    createTextElementWithTitle('span', "Wind gust:", `${forecast.windSpeedGust} m/s`, '-', '', 'weather-forecasts-day-time-wind-gust', windWrapperBox);
                    const windDirectionArrow = createImageElement(`./images/direction-arrow.png`, `Wind direction ${forecast.windDirectionDegrees} degrees`, '', '', 'weather-forecasts-day-time-wind-dir', windWrapperBox);
                    windDirectionArrow.style.transform = `rotate(${forecast.windDirectionDegrees}deg)`;

                    createTextElementWithTitle('div', "Cloud coverage:", `${forecast.cloudinessPercent}%`, '-', '', 'weather-forecasts-day-time-clouds', forecastBox);

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
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Callback-funktion för att visa nuvarande väder från sökresultat på städer
function buildCurrentWeatherCallback(weatherSearchResult) {
    const outputBox = document.querySelector("#homeresultsdiv");

    if (getValueIsSet(weatherSearchResult, 1, true)) {
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

            const tempWrapperBox = createContainerElement('div', '', 'currentweather-city-weather-temp-wrapper', cityWeatherBox);
            createTextElementWithTitle('div', "Temperature:", `${weatherData.temperature}°C`, '-', '', 'currentweather-city-weather-temp', tempWrapperBox);
            createTextElementWithTitle('div', "Feels like:", `${weatherData.temperatureFeelsLike}°C`, '-', '', 'currentweather-city-weather-temp-feels', tempWrapperBox);

            const windWrapperBox = createContainerElement('div', '', 'currentweather-city-weather-wind-wrapper', cityWeatherBox);
            createTextElementWithTitle('span', "Wind:", `${weatherData.windSpeed} m/s`, '-', '', 'currentweather-city-weather-wind', windWrapperBox);
            createTextElementWithTitle('span', "Wind gust:", `${weatherData.windSpeedGust} m/s`, '-', '', 'currentweather-city-weather-wind-gust', windWrapperBox);
            const windDirectionArrow = createImageElement(`./images/direction-arrow.png`, `Wind direction ${weatherData.windDirectionDegrees} degrees`, '', '', 'currentweather-city-weather-wind-dir', windWrapperBox);
            windDirectionArrow.style.transform = `rotate(${weatherData.windDirectionDegrees}deg)`;

            createTextElementWithTitle('div', "Cloud coverage:", `${weatherData.cloudinessPercent}%`, '-', '', 'currentweather-city-weather-clouds', cityWeatherBox);
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
}



/*
pollutionData - array med (stad)objekt som innehåller: 
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
    const outputBox = document.querySelector("#currentpollutionresultsdiv");

    if (getValueIsSet(pollutionData, 1, true)) {
        const cityForecastsBox = createContainerElement('article', '', 'current-pollution-forecast-city', outputBox);
        createTextElement('h3', `Current pollution in ${pollutionData[0].location.cityName} (${pollutionData[0].location.state !== undefined ? pollutionData[0].location.state + "," : ""} ${pollutionData[0].location.countryName})`, '', '', 'current-pollution-forecast-city-name', cityForecastsBox);

        const forecastBox = createContainerElement('div', '', 'current-pollution-forecast-item', cityForecastsBox);
        const forecastDataBox = createContainerElement('div', '', 'current-pollution-forecast-data', forecastBox);
        const pollutantsBox = createContainerElement('div', '', 'current-pollution-forecast-pollutants', forecastBox);

        createTextElement('div', `${pollutionData[0].date} ${pollutionData[0].time}`, '', '', 'current-pollution-forecast-datetime', forecastDataBox);
        createTextElement('div', `${pollutionData[0].qualityIndex}`, '0', '', 'current-pollution-forecast-quality-index', forecastDataBox);
        createTextElementWithTitle('div', "Carbon monoxide:", `${pollutionData[0].pollutants.co} μg/m3`, '-', '', 'current-pollution-forecast-pollutants-type', pollutantsBox);
        createTextElementWithTitle('div', "Nitrogen monoxide:", `${pollutionData[0].pollutants.no} μg/m3`, '-', '', 'current-pollution-forecast-pollutants-type', pollutantsBox);
        createTextElementWithTitle('div', "Nitrogen dioxide:", `${pollutionData[0].pollutants.no2} μg/m3`, '-', '', 'current-pollution-forecast-pollutants-type', pollutantsBox);
        createTextElementWithTitle('div', "Ozone:", `${pollutionData[0].pollutants.o3} μg/m3`, '-', '', 'current-pollution-forecast-pollutants-type', pollutantsBox);
        createTextElementWithTitle('div', "Sulphur dioxide:", `${pollutionData[0].pollutants.so2} μg/m3`, '-', '', 'current-pollution-forecast-pollutants-type', pollutantsBox);
        createTextElementWithTitle('div', "Fine particles matter:", `${pollutionData[0].pollutants.pm2_5} μg/m3`, '-', '', 'current-pollution-forecast-pollutants-type', pollutantsBox);
        createTextElementWithTitle('div', "Coarse particulate matter:", `${pollutionData[0].pollutants.pm10} μg/m3`, '-', '', 'current-pollution-forecast-pollutants-type', pollutantsBox);
        createTextElementWithTitle('div', "Ammonia:", `${pollutionData[0].pollutants.nh3} μg/m3`, '-', '', 'current-pollution-forecast-pollutants-type', pollutantsBox);
    }
    console.log("Current Pollution Data", pollutionData);
}


/*
pollutionData - array med (stad)objekt som innehåller: 
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
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Callback-funktion för att visa prognos över föroreningar från sökresultat på städer
function buildPollutionForecastCallback(pollutionCities) {
    const outputBox = document.querySelector("#pollutionresultsdiv");

    if (getValueIsSet(pollutionCities, 1, true)) {
        // Varje stad med sökresultat
        let cityCount = 0;
        for (const cityPollutionData of pollutionCities) {
            cityCount++;
            // console.log("PollutionData", cityPollutionData);
            const cityForecastsBox = createContainerElement('article', '', 'pollution-forecast-city', outputBox);

            const cityName = createTextElement('h3', `${cityPollutionData.location.cityName} (${cityPollutionData.location.state !== undefined ? cityPollutionData.location.state + "," : ""} ${cityPollutionData.location.countryName})`, '', '', 'pollution-forecast-city-name', cityForecastsBox);
            const cityForecastsWrapper = createContainerElement('article', '', 'pollution-forecast-city-wrapper', cityForecastsBox);
            cityName.addEventListener("click", (event) => {
                cityForecastsWrapper.classList.toggle("hide");
            });
            if (cityCount > 1) {
                cityForecastsWrapper.classList.add("hide");
            }

            let forecastCount = 0;
            for (const pollutionData of cityPollutionData.pollution) {
                forecastCount++;
                const forecastBox = createContainerElement('div', '', 'pollution-forecast-item', cityForecastsWrapper);
                const forecastDataBox = createContainerElement('div', '', 'pollution-forecast-data', forecastBox);
                const pollutantsBox = createContainerElement('div', '', 'pollution-forecast-pollutants', forecastBox);

                const forecastHeader = createTextElement('div', `${pollutionData.date} ${pollutionData.time}`, '', '', 'pollution-forecast-datetime', forecastDataBox);
                forecastHeader.addEventListener("click", (event) => {
                    pollutantsBox.classList.toggle("hide");
                });
                if (forecastCount > 1) {
                    pollutantsBox.classList.add("hide");
                }


                createTextElement('div', `${pollutionData.qualityIndex}`, '0', '', ['pollution-forecast-quality-index', `pollution-forecast-quality-index-${pollutionData.qualityIndex}`], forecastDataBox);
                createTextElementWithTitle('div', "Carbon monoxide:", `${pollutionData.pollutants.co} μg/m3`, '-', '', 'pollution-forecast-pollutants-type', pollutantsBox);
                createTextElementWithTitle('div', "Nitrogen monoxide:", `${pollutionData.pollutants.no} μg/m3`, '-', '', 'pollution-forecast-pollutants-type', pollutantsBox);
                createTextElementWithTitle('div', "Nitrogen dioxide:", `${pollutionData.pollutants.no2} μg/m3`, '-', '', 'pollution-forecast-pollutants-type', pollutantsBox);
                createTextElementWithTitle('div', "Ozone:", `${pollutionData.pollutants.o3} μg/m3`, '-', '', 'pollution-forecast-pollutants-type', pollutantsBox);
                createTextElementWithTitle('div', "Sulphur dioxide:", `${pollutionData.pollutants.so2} μg/m3`, '-', '', 'pollution-forecast-pollutants-type', pollutantsBox);
                createTextElementWithTitle('div', "Fine particles matter:", `${pollutionData.pollutants.pm2_5} μg/m3`, '-', '', 'pollution-forecast-pollutants-type', pollutantsBox);
                createTextElementWithTitle('div', "Coarse particulate matter:", `${pollutionData.pollutants.pm10} μg/m3`, '-', '', 'pollution-forecast-pollutants-type', pollutantsBox);
                createTextElementWithTitle('div', "Ammonia:", `${pollutionData.pollutants.nh3} μg/m3`, '-', '', 'pollution-forecast-pollutants-type', pollutantsBox);
            }
        }
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Visa felmeddelande överst på sidan
function showErrorMessage(errorText) {
    const errorBox = document.querySelector("#errorsection");

    if (errorText.length > 0) {
        const errorMessage = document.createElement("div");
        errorMessage.innerText = errorText;
        errorBox.appendChild(errorMessage);
        errorBox.classList.remove("hide");
    }
    // TODO: Visa på sidan istället...
    // alert(errorText);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Rensa ev. felmeddelanden
function clearErrorMessages() {
    document.querySelector("#errorsection").innerHTML = "";
    document.querySelector("#errorsection").classList.add("hide");
}

export { buildWeatherForecastsCallback, buildCurrentWeatherCallback, buildCurrentPollutionCallback, buildPollutionForecastCallback, showErrorMessage, clearErrorMessages }