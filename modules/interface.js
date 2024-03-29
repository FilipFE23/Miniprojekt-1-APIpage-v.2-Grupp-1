/*
    Versionshantering projekt 1 (FE23)
    Grupp 1

    Funktionalitet för att bygga gränssnitt och presentera sökresultat.
*/

import {
    createContainerElement,
    createImageElement,
    createTextElement,
    createTextElementWithTitle,
    getValueIsSet
} from '../modules/utilities.js';



//////////////////////////////////////////////////////////////////////////////////////////////////////
// Callback-funktion för att visa väderprognos från sökresultat på städer                    [stoffe]
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
                    createTextElementWithTitle('span', "Wind:", `${forecast.windSpeed.toFixed(1)} m/s`, '-', '', 'weather-forecasts-day-time-wind', windWrapperBox);
                    createTextElementWithTitle('span', "Wind gust:", `${forecast.windSpeedGust.toFixed(1)} m/s`, '-', '', 'weather-forecasts-day-time-wind-gust', windWrapperBox);
                    const windDirectionArrow = createImageElement(`./images/direction-arrow.png`, `Wind direction ${forecast.windDirectionDegrees} degrees`, '', '', 'weather-forecasts-day-time-wind-dir', windWrapperBox);
                    windDirectionArrow.style.transform = `rotate(${forecast.windDirectionDegrees}deg)`;

                    createTextElementWithTitle('div', "Cloud coverage:", `${forecast.cloudinessPercent}%`, '-', '', 'weather-forecasts-day-time-clouds', forecastBox);

                    createTextElementWithTitle('div', "Visibility range:", `${forecast.visibilityMeters}m`, '-', '', 'weather-forecasts-day-time-visibility', forecastBox);

                    if (forecast.snowAmount > 0) {
                        createTextElementWithTitle('div', "Snow:", `${Math.round(forecast.rainOrSnowChance)}% (${forecast.snowAmount} mm)`, '-', '', 'weather-forecasts-day-time-snow', forecastBox);
                    }
                    else if (forecast.rainAmount > 0) {
                        createTextElementWithTitle('div', "Rain:", `${Math.round(forecast.rainOrSnowChance)}% (${forecast.rainAmount} mm)`, '-', '', 'weather-forecasts-day-time-rain', forecastBox);
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
// Callback-funktion för att visa nuvarande väder från sökresultat på städer                 [stoffe]
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
            createTextElementWithTitle('span', "Wind:", `${weatherData.windSpeed.toFixed(1)} m/s`, '-', '', 'currentweather-city-weather-wind', windWrapperBox);
            createTextElementWithTitle('span', "Wind gust:", `${weatherData.windSpeedGust.toFixed(1)} m/s`, '-', '', 'currentweather-city-weather-wind-gust', windWrapperBox);
            const windDirectionArrow = createImageElement(`./images/direction-arrow.png`, `Wind direction ${weatherData.windDirectionDegrees} degrees`, '', '', 'currentweather-city-weather-wind-dir', windWrapperBox);
            windDirectionArrow.style.transform = `rotate(${weatherData.windDirectionDegrees}deg)`;

            createTextElementWithTitle('div', "Cloud coverage:", `${weatherData.cloudinessPercent}%`, '-', '', 'currentweather-city-weather-clouds', cityWeatherBox);
            createTextElementWithTitle('div', "Visibility range:", `${weatherData.visibilityMeters}m`, '-', '', 'currentweather-city-weather-visibility', cityWeatherBox);
            createTextElementWithTitle('div', "Humidity:", `${weatherData.humidityPercent}%`, '-', '', 'currentweather-city-weather-humidity', cityWeatherBox);
            createTextElementWithTitle('div', "Air pressure:", `${weatherData.pressure} hPa`, '-', '', 'currentweather-city-weather-pressure', cityWeatherBox);

            if (weatherData.snowAmount > 0) {
                createTextElementWithTitle('div', "Snow:", `${weatherData.snowAmount} mm`, '-', '', 'currentweather-city-weather-snow', cityWeatherBox);
            }
            else if (weatherData.rainAmount > 0) {
                createTextElementWithTitle('div', "Rain:", `${weatherData.rainAmount} mm`, '-', '', 'currentweather-city-weather-rain', cityWeatherBox);
            }
            else {
                createTextElementWithTitle('div', "Precipitation:", `None`, '-', '', 'currentweather-city-weather-rainsnow', cityWeatherBox);
            }
        }
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Callback-funktion för att visa nuvarande luftföroreningar från sökresultat på städer       [filip]
function buildCurrentPollutionCallback(pollutionData) {
    const outputBox = document.querySelector("#pollutionresultsdiv");

    if (getValueIsSet(pollutionData, 1, true)) {
        const cityForecastsBox = createContainerElement('article', '', 'current-pollution-forecast-city', outputBox);
        createTextElement('h3', `${pollutionData[0].location.cityName} (${pollutionData[0].location.state !== undefined ? pollutionData[0].location.state + ", " : ""}${pollutionData[0].location.countryName})`, '', '', 'current-pollution-forecast-city-name', cityForecastsBox);
        createTextElement('h4', `Current pollution`, '', '', 'current-pollution-forecast-city-name', cityForecastsBox);

        const forecastBox = createContainerElement('div', '', 'current-pollution-forecast-item', cityForecastsBox);
        const forecastDataBox = createContainerElement('div', '', 'current-pollution-forecast-data', forecastBox);
        const pollutantsBox = createContainerElement('div', '', 'current-pollution-forecast-pollutants', forecastBox);

        createTextElement('div', `${pollutionData[0].date}`, '', '', 'current-pollution-forecast-date', forecastDataBox);
        createTextElement('div', `${pollutionData[0].time}`, '', '', 'current-pollution-forecast-time', forecastDataBox);
        const qualityIndexWrapper = createContainerElement('div', '', 'current-pollution-forecast-quality-wrapper', forecastDataBox);
        createTextElement('span', "Air quality:", '', '', 'current-pollution-forecast-quality-label', qualityIndexWrapper);
        const qualityIndexElement = createTextElement('div', `${pollutionData[0].qualityIndex}`, '-', '', ['current-pollution-forecast-quality-index', `pollution-forecast-quality-index-${pollutionData[0].qualityIndex}`], qualityIndexWrapper);
        createTextElementWithTitle('div', "Carbon monoxide:", `${pollutionData[0].pollutants.co} μg/m3`, '-', '', 'current-pollution-forecast-pollutants-type', pollutantsBox);
        createTextElementWithTitle('div', "Nitrogen monoxide:", `${pollutionData[0].pollutants.no} μg/m3`, '-', '', 'current-pollution-forecast-pollutants-type', pollutantsBox);
        createTextElementWithTitle('div', "Nitrogen dioxide:", `${pollutionData[0].pollutants.no2} μg/m3`, '-', '', 'current-pollution-forecast-pollutants-type', pollutantsBox);
        createTextElementWithTitle('div', "Ozone:", `${pollutionData[0].pollutants.o3} μg/m3`, '-', '', 'current-pollution-forecast-pollutants-type', pollutantsBox);
        createTextElementWithTitle('div', "Sulphur dioxide:", `${pollutionData[0].pollutants.so2} μg/m3`, '-', '', 'current-pollution-forecast-pollutants-type', pollutantsBox);
        createTextElementWithTitle('div', "Fine particles:", `${pollutionData[0].pollutants.pm2_5} μg/m3`, '-', '', 'current-pollution-forecast-pollutants-type', pollutantsBox);
        createTextElementWithTitle('div', "Coarse particles:", `${pollutionData[0].pollutants.pm10} μg/m3`, '-', '', 'current-pollution-forecast-pollutants-type', pollutantsBox);
        createTextElementWithTitle('div', "Ammonia:", `${pollutionData[0].pollutants.nh3} μg/m3`, '-', '', 'current-pollution-forecast-pollutants-type', pollutantsBox);

        qualityIndexElement.setAttribute("title", getAirQualityIndexLabel(pollutionData[0].qualityIndex));
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Callback-funktion för att visa prognos över luftföroreningar från sökresultat på städer   [stoffe]
function buildPollutionForecastCallback(pollutionCities) {
    const outputBox = document.querySelector("#pollutionresultsdiv");

    if (getValueIsSet(pollutionCities, 1, true)) {
        // Varje stad med sökresultat
        let cityCount = 0;
        for (const cityPollutionData of pollutionCities) {
            cityCount++;
            const cityForecastsBox = createContainerElement('article', '', 'pollution-forecast-city', outputBox);
            const cityName = createTextElement('h3', `${cityPollutionData.location.cityName} (${cityPollutionData.location.state !== undefined ? cityPollutionData.location.state + ", " : ""}${cityPollutionData.location.countryName})`, '', '', 'pollution-forecast-city-name', cityForecastsBox);
            const cityForecastsWrapper = createContainerElement('article', '', 'pollution-forecast-city-wrapper', cityForecastsBox);

            cityName.addEventListener("click", (event) => {
                cityForecastsWrapper.classList.toggle("hide");
            });
            if (cityCount > 1) {
                cityForecastsWrapper.classList.add("hide");
            }

            let dayCount = 0;
            for (const forecastDay in cityPollutionData.pollution) {
                dayCount++;
                const forecastDayBox = createContainerElement('div', '', 'pollution-forecasts-day', cityForecastsWrapper);
                const forecastsHeader = createTextElement('h4', cityPollutionData.pollution[forecastDay][0].longDate, '', '', 'pollution-forecasts-day-title', forecastDayBox);
                const forecastsWrapperBox = createContainerElement('div', '', 'pollution-forecasts-day-times-wrapper', forecastDayBox);

                forecastsHeader.addEventListener("click", (event) => { forecastsWrapperBox.classList.toggle("hide"); });
                if (dayCount > 1) {
                    forecastsWrapperBox.classList.add("hide");
                }

                let forecastCount = 0;
                for (const pollutionData of cityPollutionData.pollution[forecastDay]) {
                    forecastCount++;
                    const forecastBox = createContainerElement('div', '', 'pollution-forecast-item', forecastsWrapperBox);
                    const forecastDataBox = createContainerElement('div', '', 'pollution-forecast-data', forecastBox);
                    const pollutantsBox = createContainerElement('div', '', 'pollution-forecast-pollutants', forecastBox);
                    createTextElement('div', `${pollutionData.timeHour}`, '', '', 'pollution-forecast-datetime', forecastDataBox);

                    forecastDataBox.addEventListener("click", (event) => {
                        pollutantsBox.classList.toggle("hide");
                    });
                    if (forecastCount > 1) {
                        pollutantsBox.classList.add("hide");
                    }

                    const qualityIndexElement = createTextElement('div', `${pollutionData.qualityIndex}`, '0', '', ['pollution-forecast-quality-index', `pollution-forecast-quality-index-${pollutionData.qualityIndex}`], forecastDataBox);
                    createTextElementWithTitle('div', "Carbon monoxide:", `${pollutionData.pollutants.co} μg/m3`, '-', '', 'pollution-forecast-pollutants-type', pollutantsBox);
                    createTextElementWithTitle('div', "Nitrogen monoxide:", `${pollutionData.pollutants.no} μg/m3`, '-', '', 'pollution-forecast-pollutants-type', pollutantsBox);
                    createTextElementWithTitle('div', "Nitrogen dioxide:", `${pollutionData.pollutants.no2} μg/m3`, '-', '', 'pollution-forecast-pollutants-type', pollutantsBox);
                    createTextElementWithTitle('div', "Ozone:", `${pollutionData.pollutants.o3} μg/m3`, '-', '', 'pollution-forecast-pollutants-type', pollutantsBox);
                    createTextElementWithTitle('div', "Sulphur dioxide:", `${pollutionData.pollutants.so2} μg/m3`, '-', '', 'pollution-forecast-pollutants-type', pollutantsBox);
                    createTextElementWithTitle('div', "Fine particles:", `${pollutionData.pollutants.pm2_5} μg/m3`, '-', '', 'pollution-forecast-pollutants-type', pollutantsBox);
                    createTextElementWithTitle('div', "Coarse particles:", `${pollutionData.pollutants.pm10} μg/m3`, '-', '', 'pollution-forecast-pollutants-type', pollutantsBox);
                    createTextElementWithTitle('div', "Ammonia:", `${pollutionData.pollutants.nh3} μg/m3`, '-', '', 'pollution-forecast-pollutants-type', pollutantsBox);

                    qualityIndexElement.setAttribute("title", getAirQualityIndexLabel(pollutionData.qualityIndex));
                }
            }
        }
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Visa felmeddelande överst på sidan                                                        [stoffe]
function showErrorMessage(errorText) {
    const errorBox = document.querySelector("#errorsection");
    errorBox.innerHTML = "";

    if (errorText.length > 0) {
        const errorMessage = document.createElement("div");
        errorMessage.innerText = errorText;
        errorBox.appendChild(errorMessage);
        errorBox.classList.remove("hide");
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Rensa ev. felmeddelanden                                                                  [stoffe]
function clearErrorMessages() {
    document.querySelector("#errorsection").innerHTML = "";
    document.querySelector("#errorsection").classList.add("hide");
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Slå av/på Darkmode                                                                        [stoffe]
function toggleDarkMode(enableDarkMode) {
    if (enableDarkMode) {
        document.body.classList.add("darkmode");
    }
    else {
        document.body.classList.remove("darkmode");
    }
    document.querySelector("#darkmodebutton").innerText = (!enableDarkMode ? "DarkMode" : "LightMode");
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Översätt air quality index värde till motsvarande textetikett                             [stoffe]
function getAirQualityIndexLabel(qualityIndex) {
    switch (qualityIndex) {
        case 0: return "Air quality index not available";
        case 1: return "Good air quality";
        case 2: return "Fair air quality";
        case 3: return "Moderate air quality;"
        case 4: return "Poor air quality";
        case 5: return "Very Poor air quality";
    }
}


export { buildWeatherForecastsCallback, buildCurrentWeatherCallback, buildCurrentPollutionCallback, buildPollutionForecastCallback, showErrorMessage, clearErrorMessages, toggleDarkMode }