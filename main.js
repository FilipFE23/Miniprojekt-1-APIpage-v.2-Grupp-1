
import { getWeatherForecastByCity } from '../modules/api.js';


// ETT SNABBT FUL-TEST! - demo/test av getWeatherForecastByCity(), ta bort sen... 
getWeatherForecastByCity("Malmö").then((weatherSearchResult) => {
    const outputBox = document.querySelector("#homeresultsdiv");
    outputBox.innerHTML = "";

    // väder på varje stad som matchar sökningen
    for (const weather of weatherSearchResult) {
        const resultBox = document.createElement("div");
        const cityBox = document.createElement("div");
        const forecastsBox = document.createElement("div");

        resultBox.appendChild(cityBox);
        resultBox.appendChild(forecastsBox);
        cityBox.innerHTML += `<h2>${weather.location.cityName} (${weather.location.countryName})</h2>`;
        cityBox.innerHTML += `<div>Sunrise: ${weather.location.sunrise}</div>`;
        cityBox.innerHTML += `<div>Sunset: ${weather.location.sunset}</div>`;
        // varje dag det finns väderprognos för staden
        for (const forecastDay in weather.forecasts) {
            const forecastDayBox = document.createElement("div");
            forecastsBox.appendChild(forecastDayBox);
            forecastDayBox.style.margin = "1rem 0.5rem";
            forecastDayBox.innerHTML = `<h3 style="text-align: center; background-color: rgb(50,50,50); color: white">${forecastDay}</h3>`;

            // Varje prognostillfälle för den dagen
            let rowCount = 0;
            for (const forecast of weather.forecasts[forecastDay]) {
                const forecastBox = document.createElement("div");
                forecastDayBox.appendChild(forecastBox);
                forecastBox.style.margin = "0.2rem";
                forecastBox.style.padding = "0.5rem";
                forecastBox.style.backgroundColor = (rowCount++ % 2 ? "rgb(140,140,140)" : "rgb(160,160,160)");
                forecastBox.innerHTML += `<h4>${forecast.time} - ${forecast.weatherType[0].description}</h4>`;
                forecastBox.innerHTML += `<img src="https://openweathermap.org/img/wn/${forecast.weatherType[0].icon}${rowCount == 1 ? "@2x" : ""}.png" alt="${forecast.weatherType[0].description}">`;
                forecastBox.innerHTML += `<span>Cloud coverage: ${forecast.cloudinessPercent}%</span>`;
                forecastBox.innerHTML += `<span>Temperature: ${forecast.temperature}°C (${forecast.temperatureFeelsLike}°C)</span>`;
                forecastBox.innerHTML += `<span>Wind: ${forecast.windSpeed} m/s (${forecast.windSpeedGust} m/s)</span>`;
                forecastBox.innerHTML += `<img src="./images/direction-arrow.png" alt="Wind direction ${forecast.windDirectionDegrees} degrees" style="transform: rotate(${forecast.windDirectionDegrees}deg)">`;
                forecastBox.innerHTML += `<span>Visibility range: ${forecast.visibilityMeters}m</span>`;
                forecastBox.innerHTML += `<span>Precipitation: ${forecast.rainOrSnowChance}%</span>`;
                if (forecast.snowAmount > 0) {
                    forecastBox.innerHTML += `<span>Snow: ${forecast.snowAmount} mm</span>`;
                }
                else if (forecast.rainAmount > 0) {
                    forecastBox.innerHTML += `<span>Rain: ${forecast.rainAmount} mm</span>`;
                }

            }

        }
        outputBox.appendChild(resultBox);

        resultBox.style.backgroundColor = 'rgb(225,225,225)';
        resultBox.style.margin = '0.5rem';
        resultBox.style.padding = '1rem';

        cityBox.style.backgroundColor = "rgb(0,0,0)";
        cityBox.style.color = "rgb(255,255,255)";
        cityBox.style.padding = "0.5rem";
    }
});

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