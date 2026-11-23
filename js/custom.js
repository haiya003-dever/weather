let sea = document.querySelector("#search");
let btn = document.querySelector("#btn");
let iconEls = document.querySelectorAll("li .icon");
let timeEls = document.querySelectorAll("li p");
let tempEls = document.querySelectorAll("li .temp");
let h2 = document.querySelector("h2");
let img = document.querySelector(".image img");
let time = document.querySelector(".image p");
let num = document.querySelector("p span");
let APIkey = `7e766285d8c60f6716840a126694359f`;

function render(data) {
  let dates = [];
  let temps = [];

  data.list.slice(0, 7).forEach((item, i) => {
    let icon = item.weather[0].icon;
    let iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    iconEls[i].src = iconUrl;

    let temp = Math.round(item.main.temp);
    tempEls[i].textContent = `${temp}℃`;
    temps.push(temp);

    let time = item.dt_txt.slice(11, 16);
    timeEls[i].textContent = time;
    dates.push(time);
  });

  document.querySelector("ul").style.opacity = 1;

  // 여기부터 차트 생성
  const ctx = document.querySelector("#myChart");

  if (window.weatherChart) {
    window.weatherChart.destroy();
  }

  window.weatherChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "온도 (℃)",
          data: temps,
          borderWidth: 3,
          pointRadius: 2,
          fill: false,
          tension: 0.3,
          borderColor: "#2058d1",
          backgroundColor: "#2058d1",
          pointBorderColor: "#2058d1",
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          responsive: true,
          maintainAspectRatio: false,
          labels: {
            color: "#000000",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#000000",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.7)",
          },
        },
        y: {
          beginAtZero: false,
          ticks: {
            color: "#000000",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.7)",
          },
        },
      },
    },
  });
}
function getLocation() {
  navigator.geolocation.getCurrentPosition(success);
}

function success(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  //   console.log(lat, lon);
  async function weather(lat, lon) {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=kr`,
    );
    h2.textContent = `현재위치`;
    let data = await response.json();
    console.log(data);
    render(data);
    let response2 = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=kr`,
    );

    let currentData = await response2.json();

    change(currentData.weather[0].main);
  }
  weather(lat, lon);
}
function change(weather2) {
  if (
    weather2 === `Rain` ||
    weather2 === "Drizzle" ||
    weather2 === "Thunderstorm"
  ) {
    img.src = "img/rainy.gif";
  } else if (weather2 === "Snow") {
    img.src = "img/snowy.gif";
  } else if (weather2 === `Clouds`) {
    img.src = "img/cloudy.gif";
  } else {
    img.src = "img/sunny.gif";
  }
}
async function weather1(cityname) {
  console.log(cityname);

  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${APIkey}&lang=kr&units=metric`,
  );
  if (!response.ok) {
    alert("도시 이름을 영어로 입력해주세요.");
    return;
  }
  h2.textContent = cityname.toUpperCase();

  let data = await response.json();
  console.log(data);

  render(data);
  let response2 = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${APIkey}&units=metric&lang=kr`,
  );
  if (!response2.ok) return;
  let currentData = await response2.json();

  let weather2 = currentData.weather[0].main;

  change(weather2);
}
getLocation();

let start = () => {
  let day = new Date();
  let hour = day.getHours();
  let min = day.getMinutes();

  min = min > 9 ? min : `0${min}`;
  time.textContent = `LOCAL TIME ${hour}:${min} | CURRENT WEATHER`;
};

setInterval(start, 1000);
start();

function se() {
  let cityname = sea.value;

  if (cityname === "") {
    alert(`도시 이름을 영어로 입력해주세요.`);
    return;
  }
  weather1(cityname);
  sea.value = "";
}
btn.addEventListener("click", se);
