const asideEl = document.querySelector("aside");
const inputEl = document.querySelector("input");
const btnListEl = document.querySelector(".btn-list");

const apiKey = "e17df6be9e4cbbbfc725cf2b7d19d19a";
const btnList = [];

asideEl.addEventListener("click", function (e) {
  if (e.target.matches("button")) {
    if (e.target.matches(".search") && !inputEl.value) {
      return;
    } else if (!e.target.matches(".search") && e.target.matches("button")) {
      inputEl.value = e.target.textContent;
    }

    btnListEl.textContent = "";
    btnList.push(inputEl.value);
    showBtnList();

    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${inputEl.value}&appid=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        const latLon = [data[0].lat, data[0].lon];
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latLon[0]}&lon=${latLon[1]}&appid=${apiKey}`
        )
          .then((res) => res.json())
          .then((data) => {
            const mapedData = data.list.map((el) => {
              const index = data.list.indexOf(el);
             
              if (
                index !== 0 &&
                data.list[index].dt_txt.slice(0, 10) ===
                  data.list[index - 1].dt_txt.slice(0, 10)
              )
                return;

              return {
                date: el.dt_txt.slice(0, 10),
                temp: (el.main.temp - 273.15).toFixed(2),
                wind: el.wind.speed,
                humidity: el.main.humidity,
              };
            });
            const filteredData = mapedData.filter((data) => data !== undefined);
            
            console.log(filteredData);
    
          });
      });
  }
});

const showBtnList = () => {
  const uniqBtnList = [...new Set(btnList)];
  uniqBtnList.forEach((btn) => {
    const btnEl = document.createElement("button");
    btnEl.textContent = btn;
    btnListEl.append(btnEl);
  });
};
