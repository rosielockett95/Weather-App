// Get users current geo location
navigator.geolocation.getCurrentPosition(
  (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    getCurrentWeather(lat, lon);
  },
  (error) => {
    console.log("Unable to get location:", error);
  },
);

// Get weather data depending on users location
async function getCurrentWeather(lat, lon) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation&hourly=temperature_2m`,
  );

  const data = await response.json();

  console.log(data);

  document.querySelector("#currentTemp").textContent =
    data.current.temperature_2m + "°C";

  document.querySelector("#feelsLikeTemp").textContent =
    data.current.apparent_temperature + "°C";

  document.querySelector("#currentHumidity").textContent =
    data.current.relative_humidity_2m + "%";

  let currentWindSpeed = Math.round(data.current.wind_speed_10m);

  document.querySelector("#currentWindSpeed").textContent =
    currentWindSpeed + " " + "mph";

  document.querySelector("#currentPrecipitation").textContent =
    data.current.precipitation + " " + "in";

  const days = document.querySelectorAll(".days");
  const dailyForecastArrayMin = data.daily.temperature_2m_min;
  const dailyForecastArrayMax = data.daily.temperature_2m_max;

  days.forEach((day, index) => {
    const dates = new Date(data.daily.time[index]);

    day.querySelector(".date").textContent = dates.toLocaleDateString("en-GB", {
      weekday: "long",
    });
    day.querySelector(".min").textContent = `${dailyForecastArrayMin[index]}`;
    day.querySelector(".max").textContent = `${dailyForecastArrayMax[index]}`;
  });

  const hourlyTempArray = data.hourly.temperature_2m.slice(0, 8);
  const hourlyTimeArray = data.hourly.time.slice(0, 8);

  console.log(hourlyTempArray);
  console.log(hourlyTimeArray);

  const hours = document.querySelectorAll(".hours");

  hours.forEach((hour, index) => {
    hour.querySelector(".time").textContent = `${hourlyTimeArray[index]}`;
    hour.querySelector(".hourly-temp").textContent =
      `${hourlyTempArray[index]} degrees`;
  });
}

// Get API information from search bar input
const search = document.querySelector("#search");
const searchBtn = document.querySelector("#searchBtn");
let query;

searchBtn.addEventListener("click", () => {
  query = search.value;
  console.log(query);

  if (query) {
    searchLocation();
  } else {
    console.log("No country selected");
  }
});

async function searchLocation() {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${query}`,
  );

  console.log(response);

  const data = await response.json();

  console.log(data.results[0].admin1);
}
