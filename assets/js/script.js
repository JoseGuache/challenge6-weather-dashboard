const searchFormEl = document.getElementById('search-form');
const cityNameEl = document.getElementById('city-name');
const currentWeatherEl = document.getElementById('current-weather');
const fiveDayEl = document.getElementById('five-day');
const savedCitiesEl = document.getElementById('saved-cities');
const cityArr = JSON.parse(localStorage.getItem('cities')) || [];
const apiKey = '1aa2d0916f0d2dc957529b88740b6708';

function storeCities() {
    localStorage.getItem('cities', JSON.stringify(cities))
}

function displaySavedCities() {
    savedCitiesEl.innerHTML = '';
    cityArr.forEach(city => {
        const cityBtn = document.createElement('button');
        cityBtn.textContent = city;
        cityBtn.setAttribute('class', 'btn btn-secondary w-100 my-2')
        savedCitiesEl.appendChild(cityBtn)
    });
}

function searchCity(cityName) {
    populateCurrentWeather(cityName);
    populate5day(cityName);
}

function populateCurrentWeather(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

    cityName = cityName.trim();

    if (!cityName) {
        alert('A valid city name must be entered!');
        return;
    }

    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`City not found ${response.status}`);
            }
            return response.json();
        })
        .then(function (data) {
            if (!cityArr.includes(data.name)) {
                cityArr.push(data.name);
                localStorage.setItem('cities', JSON.stringify(cityArr));
                displaySavedCities();
            }
            currentWeatherEl.innerHTML = `
               <h3>${data.name} (${dayjs.unix(data.dt).format('MM/DD/YYYY')})<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt=""></h3>
            <h6 class="mb-4">Temp: <span>${data.main.temp} °F</span></h6>
            <h6 class="mb-4">Wind: <span>${data.wind.speed} MPH</span></h6>
            <h6 class="mb-4">Humidity: <span>${data.main.humidity} %</span></h6>`;
            console.log(data);
        })
        .catch(function (error) {
            alert(error.message);
            currentWeatherEl.innerHTML = '';
        });
}

function populate5day(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`;

    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`City not found ${response.status}`);
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            fiveDayEl.textContent = '';

            for (let i = 3; i < data.list.length; i = i + 8) {
                const forecast = data.list[i]
                console.log(forecast)
                fiveDayEl.innerHTML += `
                <div class="col-sm-2 mb-3 mb-sm-0">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${dayjs.unix(forecast.dt).format('MM/DD/YYYY')}</h5>
                            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="">
                            <p> Temp: <span>${forecast.main.temp} °F</span></p>
                            <p> Wind: <span>${forecast.wind.speed} MPH</span></p>
                            <p> Humidity: <span>${forecast.main.humidity} %</span></p>
                        </div>
                    </div>
                </div>`
            }
        })
        .catch(function (error) {
            alert(error.message);
            fiveDayEl.textContent = '';
        });
}

searchFormEl.addEventListener('submit', function (event) {
    event.preventDefault();
    const cityName = cityNameEl.value;
    searchCity(cityName);
    cityNameEl.value = '';
});

savedCitiesEl.addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
        const cityName = event.target.textContent;
        searchCity(cityName);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    displaySavedCities();
});

const lastCity = cityArr.length > 0 ? cityArr[cityArr.length - 1] : 'miami'
populateCurrentWeather(lastCity);
populate5day(lastCity);