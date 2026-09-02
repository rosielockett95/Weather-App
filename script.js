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

function render(met, imp) {
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

  let date;

  days.forEach((day, index) => {
    dates = new Date(met.daily.time[index]);

    day.querySelector(".date").textContent = dates.toLocaleDateString("en-GB", {
      weekday: "long",
    });
    day.querySelector(".min").textContent = day
      .querySelector(".min")
      .classList.contains("metric")
      ? `${Math.round(dailyForecastArrayMin[index])}°C`
      : `${Math.round(imperialForecastArrayMin[index])}°F`;
    day.querySelector(".max").textContent = day
      .querySelector(".max")
      .classList.contains("metric")
      ? `${Math.round(dailyForecastArrayMax[index])}°C`
      : `${Math.round(imperialForecastArrayMax[index])}°F`;
  });
  const hourlyTempArray = met.hourly.temperature_2m.slice(0, 8);
  const hourlyTimeArray = met.hourly.time.slice(0, 8);

  console.log(met.hourly.temperature_2m);

  const hourlyTempArray2 = met.hourly.temperature_2m.slice(24, 32);
  const hourlyTempArray3 = met.hourly.temperature_2m.slice(48, 56);
  const hourlyTempArray4 = met.hourly.temperature_2m.slice(72, 80);
  const hourlyTempArray5 = met.hourly.temperature_2m.slice(96, 104);
  const hourlyTempArray6 = met.hourly.temperature_2m.slice(120, 128);
  const hourlyTempArray7 = met.hourly.temperature_2m.slice(144, 152);

  const imperialTempArray = imp.hourly.temperature_2m.slice(0, 8);
  const imperialTempArray2 = imp.hourly.temperature_2m.slice(24, 32);
  const imperialTempArray3 = imp.hourly.temperature_2m.slice(48, 56);
  const imperialTempArray4 = imp.hourly.temperature_2m.slice(72, 80);
  const imperialTempArray5 = imp.hourly.temperature_2m.slice(96, 104);
  const imperialTempArray6 = imp.hourly.temperature_2m.slice(120, 128);
  const imperialTempArray7 = imp.hourly.temperature_2m.slice(144, 152);

  const hours = document.querySelectorAll(".hours");
  let allDaysText;
  let currentDay;

  console.log(hourlyTimeArray.slice(0, 24));

  currentDay = met.daily.time.map((currentDay) => {
    return new Date(currentDay).toLocaleDateString("en-GB", {
      weekday: "long",
    });
  });

  document.querySelectorAll(".current-day").forEach((day, index) => {
    day.textContent = currentDay[index];
  });

  allDaysText = document.querySelectorAll(".current-day");

  const daysSelectInput = document.querySelector("#daysSelect");

  function changeHours(currentTempArray, currentImperialTempArray) {
    hours.forEach((hour, index) => {
      const time = new Date(hourlyTimeArray[index]);

      hour.querySelector(".time").textContent = time.toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          hour12: true,
        },
      );

      hour.querySelector(".hourly-temp").textContent = hour
        .querySelector(".hourly-temp")
        .classList.contains("metric")
        ? `${Math.round(currentTempArray[index])}°C`
        : `${Math.round(currentImperialTempArray[index])}°F`;
    });
  }

  changeHours(hourlyTempArray, imperialTempArray);

  function changeInput() {
    const daysSelectInputValue = daysSelectInput.value;
    switch (daysSelectInputValue) {
      case currentDay[0]:
        changeHours(hourlyTempArray, imperialTempArray);
        break;

      case currentDay[1]:
        changeHours(hourlyTempArray2, imperialTempArray2);
        break;

      case currentDay[2]:
        changeHours(hourlyTempArray3, imperialTempArray3);
        break;

      case currentDay[3]:
        changeHours(hourlyTempArray4, imperialTempArray4);
        break;

      case currentDay[4]:
        changeHours(hourlyTempArray5, imperialTempArray5);
        break;

      case currentDay[5]:
        changeHours(hourlyTempArray6, imperialTempArray6);
        break;

      case currentDay[6]:
        changeHours(hourlyTempArray7, imperialTempArray7);
        break;
    }
  }

  daysSelectInput.addEventListener("change", changeInput);
}

// Get API information from search bar input
const search = document.querySelector("#search");
const searchBtn = document.querySelector("#searchBtn");
let query;

let searchLatitude;
let searchLongitude;

searchBtn.addEventListener("click", () => {
  query = search.value;

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

document.querySelector(".currentDate").textContent = formattedDate;
