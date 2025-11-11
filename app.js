const button = document.getElementById("data");
const inputText = document.getElementById("city-name");
const hourlyWeatherElement = document.getElementById("carousel-container");

button.addEventListener("click", displayAllUI);
inputText.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    displayAllUI(e);
  }
});
let defaultCity = "Ankara";
document.addEventListener("DOMContentLoaded", (e) => {
  displayAllUI(e);
});

function getCity() {
  const cityName = inputText.value;
  return cityName;
}

async function getData(city) {
  //const city = getCity();
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
    return data;
  } catch (error) {
    console.log("Something went wrong! Error is:", error);
  }
}

async function displayAllUI(e) {
  let curCity;
  if (e.type === "DOMContentLoaded") {
    curCity = defaultCity;
  } else {
    curCity = getCity();
  }
  const data = await getData(curCity);
  addCurrentWeather(data);
  addHourlyWeather(data);
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
  document.querySelector(".city-name").textContent = data.location.name;
  const currDate = new Date(data.location.localtime);
  document.querySelector(".current-time").textContent =
    currDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  document.querySelector(".current-day").textContent = new Date(
    data.location.localtime
  ).toLocaleDateString("en-GB", { weekday: "long" });

  document.querySelector(".current-icon").src = data.current.condition.icon;
  document.querySelector(
    ".current-temp"
  ).textContent = `${data.current.temp_c}°C`;
  document.querySelector(".current-condition").textContent =
    data.current.condition.text;

  document.querySelector(
    ".current-hi"
  ).textContent = `H:${data.forecast.forecastday[0].day.maxtemp_c} °C`;
  document.querySelector(
    ".current-lo"
  ).textContent = `L:${data.forecast.forecastday[0].day.mintemp_c} °C`;
}

//const timeStr = d.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
function addHourlyWeather(data) {
  hourlyWeatherElement.innerHTML = "";
  let html = "";
  const currDate = new Date(data.location.localtime);
  data.forecast.forecastday[0].hour.forEach((hour) => {
    // let iconHTML = "";
    // if (hour.is_day === 1) {
    //     iconHTML = `<img src="${hour.condition.icon}" class="card-img-left " alt="weather icon">`;
    // }
    //console.log(hour.time.substring(11));
    const currHour = currDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    html += `
        <div class="hour-card">
            <div class="hour-time">${hour.time.substring(11)}</div>
            <div class="hour-info">
                <img src="${
                  hour.condition.icon
                }" class="card-img-left " alt="weather icon">
                <div class="hour-temp">${hour.temp_c}°C</div>

            </div>
        </div>`;
  });
  hourlyWeatherElement.innerHTML = html;
  const cars = hourlyWeatherElement.querySelectorAll(".hour-card");

  const cards = hourlyWeatherElement.querySelectorAll(".hour-card");
  const currHour = currDate.getHours();
  const currCard = cards[currHour];
  //for getting gap to display current card-hour completely
  const styles = getComputedStyle(hourlyWeatherElement);
  const gap = parseInt(styles.gap) || 0;
  const offset = currCard.offsetLeft - currCard.clientWidth / 2 - gap;
  currCard.style.borderStyle = "ridge";
  hourlyWeatherElement.scrollLeft = offset;
}

function deleteInputText(input) {
  input.value = "";
}

const next = document.getElementById("carousel-next");
const prev = document.getElementById("carousel-prev");

let scrollAmount = 0;
const cardWidth = 110; // 6 cards visible (width + margin)

next.addEventListener("click", () => {
  hourlyWeatherElement.scrollLeft += cardWidth;
});

prev.addEventListener("click", () => {
  hourlyWeatherElement.scrollLeft -= cardWidth;
});

// fix the overflow on the current weather display
