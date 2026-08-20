// Get users current geo location
let lat;
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

  render(data, imperialData);
}

function render(imp, met) {
  document.querySelector("#currentTemp").textContent = document
    .querySelector("#currentTemp")
    .classList.contains("metric")
    ? met.current.temperature_2m + "°C"
    : imp.current.temperature_2m + "°F";

  document.querySelector("#feelsLikeTemp").textContent = document
    .querySelector("#feelsLikeTemp")
    .classList.contains("metric")
    ? met.current.apparent_temperature + "°C"
    : imp.current.apparent_temperature + "°F";

  document.querySelector("#currentHumidity").textContent =
    met.current.relative_humidity_2m + "%";

  let currentWindSpeed = Math.round(met.current.wind_speed_10m);
  let ImperialWindSpeed = Math.round(imp.current.wind_speed_10m);

  document.querySelector("#currentWindSpeed").textContent = document
    .querySelector("#currentWindSpeed")
    .classList.contains("metric")
    ? currentWindSpeed + " " + "kmh"
    : ImperialWindSpeed + " " + "mph";

  document.querySelector("#currentPrecipitation").textContent = document
    .querySelector("#currentPrecipitation")
    .classList.contains("metric")
    ? met.current.precipitation + " " + "mm"
    : imp.current.precipitation + " " + "inch";

  const days = document.querySelectorAll(".days");
  const dailyForecastArrayMin = met.daily.temperature_2m_min;
  const dailyForecastArrayMax = met.daily.temperature_2m_max;

  const imperialForecastArrayMin = imp.daily.temperature_2m_min;
  const imperialForecastArrayMax = imp.daily.temperature_2m_max;

  days.forEach((day, index) => {
    const dates = new Date(met.daily.time[index]);

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

  const hourlyTempArray = met.hourly.temperature_2m.slice(0, 8);
  const hourlyTimeArray = met.hourly.time.slice(0, 8);

  const imperialTempArray = imp.hourly.temperature_2m.slice(0, 8);

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

let searchLatitude;
let searchLongitude;

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

  searchLatitude = data.results[0].latitude;
  searchLongitude = data.results[0].longitude;

  searchData(searchLatitude, searchLongitude);
}

async function searchData(searchLatitude, searchLongitude) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${searchLatitude}&longitude=${searchLongitude}&daily=temperature_2m_max,temperature_2m_min&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation&hourly=temperature_2m`,
  );

  const imperialResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${searchLatitude}&longitude=${searchLongitude}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&current=temperature_2m,precipitation,wind_speed_10m,apparent_temperature&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`,
  );

  const inputMetricData = await response.json();
  const inputImperialData = await imperialResponse.json();

  render(inputMetricData, inputImperialData);
}

// Function to switch between metric / imperial

const unitSelectBtn = document.querySelector("#unitSelect");

function addClassList(idname) {
  document.querySelector(idname).classList.add("metric");
}

function RemoveClassList(idname) {
  document.querySelector(idname).classList.remove("metric");
}

unitSelectBtn.addEventListener("change", () => {
  if (unitSelectBtn.value === "metricBtn") {
    addClassList("#feelsLikeTemp");
    addClassList("#currentTemp");
    addClassList("#currentWindSpeed");
    document.querySelectorAll(".min").forEach((min) => {
      min.classList.add("metric");
    });
    document.querySelectorAll(".max").forEach((max) => {
      max.classList.add("metric");
    });
    document.querySelectorAll(".hourly-temp").forEach((hourlyTemp) => {
      hourlyTemp.classList.add("metric");
    });
  } else {
    RemoveClassList("#feelsLikeTemp");
    RemoveClassList("#currentTemp");
    RemoveClassList("#currentWindSpeed");
    document.querySelectorAll(".min").forEach((min) => {
      min.classList.remove("metric");
    });
    document.querySelectorAll(".max").forEach((max) => {
      max.classList.remove("metric");
    });
    document.querySelectorAll(".hourly-temp").forEach((hourlyTemp) => {
      hourlyTemp.classList.remove("metric");
    });
  }

  console.log(document.querySelectorAll(".min"));
  getCurrentWeather(lat, lon);
});

// Formatting for page

const currentDate = new Date();

const formattedDate = currentDate.toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

console.log(formattedDate);

document.querySelector(".currentDate").textContent = formattedDate;
