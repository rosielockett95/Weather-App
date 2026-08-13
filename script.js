// Get users current geo location
let lan;
let lon;

navigator.geolocation.getCurrentPosition(
  (position) => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;

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

  const imperialResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&current=temperature_2m,precipitation,wind_speed_10m,apparent_temperature&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`,
  );

  const imperialData = await imperialResponse.json();

  document.querySelector("#currentTemp").textContent = document
    .querySelector("#currentTemp")
    .classList.contains("metric")
    ? data.current.temperature_2m + "°C"
    : imperialData.current.temperature_2m + "°F";

  document.querySelector("#feelsLikeTemp").textContent = document
    .querySelector("#feelsLikeTemp")
    .classList.contains("metric")
    ? data.current.apparent_temperature + "°C"
    : imperialData.current.apparent_temperature + "°F";

  document.querySelector("#currentHumidity").textContent =
    data.current.relative_humidity_2m + "%";

  let currentWindSpeed = Math.round(data.current.wind_speed_10m);
  let ImperialWindSpeed = Math.round(imperialData.current.wind_speed_10m);

  document.querySelector("#currentWindSpeed").textContent = document
    .querySelector("#currentWindSpeed")
    .classList.contains("metric")
    ? currentWindSpeed + " " + "kmh"
    : ImperialWindSpeed + " " + "mph";

  document.querySelector("#currentPrecipitation").textContent = document
    .querySelector("#currentPrecipitation")
    .classList.contains("metric")
    ? data.current.precipitation + " " + "mm"
    : imperialData.current.precipitation + " " + "inch";

  const days = document.querySelectorAll(".days");
  const dailyForecastArrayMin = data.daily.temperature_2m_min;
  const dailyForecastArrayMax = data.daily.temperature_2m_max;

  const imperialForecastArrayMin = imperialData.daily.temperature_2m_min;
  const imperialForecastArrayMax = imperialData.daily.temperature_2m_max;

  days.forEach((day, index) => {
    const dates = new Date(data.daily.time[index]);

    day.querySelector(".date").textContent = dates.toLocaleDateString("en-GB", {
      weekday: "long",
    });
    day.querySelector(".min").textContent = day
      .querySelector(".min")
      .classList.contains("metric")
      ? `${dailyForecastArrayMin[index]}`
      : `${imperialForecastArrayMin[index]}`;
    day.querySelector(".max").textContent = day
      .querySelector(".max")
      .classList.contains("metric")
      ? `${dailyForecastArrayMax[index]}`
      : `${imperialForecastArrayMax[index]}`;
  });

  const hourlyTempArray = data.hourly.temperature_2m.slice(0, 8);
  const hourlyTimeArray = data.hourly.time.slice(0, 8);

  const imperialTempArray = imperialData.hourly.temperature_2m.slice(0, 8);

  const hours = document.querySelectorAll(".hours");

  hours.forEach((hour, index) => {
    hour.querySelector(".time").textContent = `${hourlyTimeArray[index]}`;
    hour.querySelector(".hourly-temp").textContent = hour
      .querySelector(".hourly-temp")
      .classList.contains("metric")
      ? `${hourlyTempArray[index]} degrees`
      : `${imperialTempArray[index]} farenheit`;
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
// Function to switch between metric / imperial

const unitSelectBtn = document.querySelector("#unitSelect");

unitSelectBtn.addEventListener("change", () => {
  if (unitSelectBtn.value === "metricBtn") {
    document.querySelector("#feelsLikeTemp").classList.add("metric");
    document.querySelector("#currentTemp").classList.add("metric");
    document.querySelector("#currentWindSpeed").classList.add("metric");
  } else {
    document.querySelector("#feelsLikeTemp").classList.remove("metric");
    document.querySelector("#currentTemp").classList.remove("metric");
  }

  getCurrentWeather(lat, lon);
});
