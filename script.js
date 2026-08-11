// Get data from weather API
async function getWeather() {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error.message);
  }
}

getWeather();

// Get weather from async function to display on website
async function displayWeather() {
  const weather = await getWeather();

  console.log(weather.current);
}

displayWeather();
