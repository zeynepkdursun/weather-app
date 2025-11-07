const button = document.getElementById("data");
const inputText = document.getElementById("city-name");
button.addEventListener("click", getData);
inputText.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getData();
  }
});


function getCity() {
  const cityName = inputText.value;
  return cityName;
}

// let cityName = getCity;
// document.addEventListener("DOMContentLoaded", getData);
async function getData() {
  const city = getCity();
  if (!city || city.trim() === "") {
    console.log("enter a city name");
    return;
  }
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=f56123dea7a74a7e85e72524252810&q=${city}&days=2&aqi=no&alerts=no`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    addCurrentWeather(data);
    addHourlyWeather(data);
    deleteInputText(inputText);
  } catch (error) {
    console.log("Something went wrong! Error is:", error);
  }
}


function addCurrentWeather(data) {
  const weatherSection = document.getElementById("weather-result");
  weatherSection.classList.remove("day");
  weatherSection.classList.remove("night");
  if (data.current.is_day === 1) {
    weatherSection.classList.add("day");
  } else {
    weatherSection.classList.add("night");
  }
  document.querySelector(".card-title").textContent = data.location.name;
  document.querySelector(".current-icon").src = data.current.condition.icon;
  document.querySelector(".current-temp").textContent = `${data.current.temp_c}°C`;
  document.querySelector(".current-condition").textContent = data.current.condition.text;
}


function addHourlyWeather(data) {
  const hourlyWeatherElement = document.getElementById("carousel-container");
  hourlyWeatherElement.innerHTML = "";
  let html = "";
  data.forecast.forecastday[0].hour.forEach((hour) => {
    // let iconHTML = "";
    // if (hour.is_day === 1) {
    //     iconHTML = `<img src="${hour.condition.icon}" class="card-img-left " alt="weather icon">`;
    // }
    html += `
        <div class="hour-card">
            <div class="hour-time">${hour.time.substring(10)}</div>
            <div class="hour-info">
                <img src="${
                  hour.condition.icon
                }" class="card-img-left " alt="weather icon">
                <div class="hour-temp">${hour.temp_c}°C</div>
            </div>
        </div>`;
  });
  hourlyWeatherElement.innerHTML = html;
}

function deleteInputText(input) {
  input.value = "";
}

const carousel = document.getElementById("carousel-container");
const next = document.getElementById("carousel-next");
const prev = document.getElementById("carousel-prev");

let scrollAmount = 0;
const cardWidth = 110; // 6 cards visible (width + margin)

next.addEventListener("click", () => {
  carousel.scrollLeft += cardWidth;
});

prev.addEventListener("click", () => {
  carousel.scrollLeft -= cardWidth;
});
