const asideEl = document.querySelector("aside");
const inputEl = document.querySelector("input");
const btnListEl = document.querySelector(".btn-list");
const sectionEl = document.querySelector("section");
const forecastlistEl = document.querySelectorAll(".forecast-data");
const loadingMessageEl = document.querySelector(".loading");

const apiKey = "e17df6be9e4cbbbfc725cf2b7d19d19a";
const btnList = JSON.parse(localStorage.getItem("btn-list")) || [];

// Listen for parent click event but react only if clicked a button.
const btnClickHandler = (event) => {
  if (event.target.matches("button")) {
    if (event.target.matches(".search") && !inputEl.value) {
      return;
    } else if (
      !event.target.matches(".search") &&
      event.target.matches("button")
    ) {
      inputEl.value = event.target.textContent;
    }
    
    // Delete before push to prevent repeated items.
    btnListEl.textContent = "";
    btnList.push(inputEl.value);

    displayBtnList();
    fetchForecastData();
  }
};

// Create unique list of buttons, store and display.
const displayBtnList = () => {
  const uniqueBtnList = [...new Set(btnList)];

  localStorage.setItem("btn-list", JSON.stringify(uniqueBtnList));

  uniqueBtnList.forEach((btn) => {
    const btnEl = document.createElement("button");
    btnEl.style.position = "relative";
    btnEl.append(btn);
    btnListEl.append(btnEl);
  });
};

// Fetch forecast data and save in variable.
const fetchForecastData = () => {
  loadingMessageEl.style.opacity = "1";
  loadingMessageEl.textContent = "Loading...";
  loadingMessageEl.style.color = "#214fe6";
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${inputEl.value}&appid=${apiKey}`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const latLon = [data[0].lat, data[0].lon];
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latLon[0]}&lon=${latLon[1]}&appid=${apiKey}`
      )
        .then((res) => res.json())
        .then((data) => {
          document.querySelector(".loading").style.opacity = "0";
          const mapedData = data.list.map((el) => {
            const index = data.list.indexOf(el);

            // Take only first repeating element.
            if (
              index !== 0 &&
              data.list[index].dt_txt.slice(0, 10) ===
                data.list[index - 1].dt_txt.slice(0, 10)
            )
              return;

            return {
              name: inputEl.value,
              date: el.dt_txt.slice(0, 10),
              temp: (((el.main.temp - 273.15) * 9) / 5 + 32).toFixed(2),
              wind: el.wind.speed,
              humidity: el.main.humidity,
              icon: el.weather[0].icon,
            };
          });
          const filteredData = mapedData.filter((data) => data !== undefined);

          displayForecastData(filteredData);
        });
    })
    .catch(() => {
      loadingMessageEl.style.opacity = "1";
      loadingMessageEl.textContent = "No data found!";
      loadingMessageEl.style.color = "#e62121";
      sectionEl.style.display = "none";
    });
};

// Display forecast data on the screan.
const displayForecastData = (filteredData) => {
  sectionEl.style.display = "flex";
  forecastlistEl.forEach((data, i) => {
    if (data.classList.contains("current")) {
      data.children[0].textContent = `${filteredData[0].name.toUpperCase()} (${
        filteredData[i].date
      })`;
    } else if (filteredData[i]) {
      data.children[0].textContent = filteredData[i].date;
    }
    // Display the rest only if data is available.
    // Sometimes during the day data is only for 5 days instead of 6.
    if (filteredData[i]) {
      data.children[1].setAttribute(
        "src",
        `https://openweathermap.org/img/w/${filteredData[i].icon}.png`
      );
      data.children[2].innerHTML = `Temp: ${filteredData[i].temp} <span>&#x2109;</span>`;
      data.children[3].textContent = `Wind: ${filteredData[i].wind} MPH`;
      data.children[4].textContent = `Humidity: ${filteredData[i].humidity} %`;
    } else {
      data.innerHTML =
        "<h3>Sorry</h3><p> Not Available! <span>&#128532;</span></p>";
    }
  });
};

asideEl.addEventListener("click", btnClickHandler);

// Always display search history if it exist in localStorege.
displayBtnList();
