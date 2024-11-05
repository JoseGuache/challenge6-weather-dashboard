const searchFormEl = document.querySelector('#search-form');
const cityNameEl = document.querySelector('#city-name');
const currentWeatherEl = document.querySelector('#current-weather');
const fiveDayEl = document.querySelector('#five-day');
const apiKey = '1aa2d0916f0d2dc957529b88740b6708';

function searchCity(event) {
    event.preventdefault();
    const cityName = cityNameEl.value;
    populateCurrentWeather(cityName);
    populate5day(cityName);
}

function populateCurrentWeather(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            currentWeatherEl.innerHTML = `<h3> ${data.name} (${dayjs.unix(data.dt).format('MM/DD/YYYY')}) <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt=""></h3>
            <p> Temp: <span>${data.main.temp} °F</span></p>
            <p> Wind: <span>6 MPH</span></p>
            <p> Humidity: <span>${data.main.humidity} %</span></p>`;
            console.log(data)
        })
}

function populate5day(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            fiveDayEl.textContent = '';

            for (let i = 3; i < data.list.length; i = i + 8) {
                const forecast = data.list[i]
                console.log(forecast)
                fiveDayEl.innerHTML += `<div class="col-sm-2 mb-3 mb-sm-0">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${dayjs.unix(forecast.dt).format('MM/DD/YYYY')}</h5>
                            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="">
                            <p> Temp: <span>82 °f</span></p>
                            <p> Wind: <span>6 MPH</span></p>
                            <p> Humidity: <span>85 %</span></p>
                        </div>
                    </div>
                </div>`
            }
        })
}

searchFormEl.addEventListener('submit', searchCity);