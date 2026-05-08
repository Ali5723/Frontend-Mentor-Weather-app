const addAnimations = () => {
  document.querySelectorAll(".dropdown .dropdown-body").forEach((item) => {
    if (!item.className.includes("dropdownAnimation")) {
      item.classList.add("dropdownAnimation");
    }
  });
};

const parseHourly = () => JSON.parse(sessionStorage.getItem("hourly"));
const stringifyHourly = (data) =>
  sessionStorage.setItem("hourly", JSON.stringify(data));

const getTime12 = (time) => {
  const theTime = new Date(time);
  const theResult = theTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });
  return theResult;
};

/* Start DropDown */
document.querySelectorAll(".dropdown").forEach((dropdown) => {
  dropdown
    .querySelector(".dropdown-title")
    .addEventListener("click", (event) => {
      const dropdownBody = dropdown.querySelector(".dropdown-body");
      if (dropdownBody.className.includes("dropdownAnimation")) {
        addAnimations();
        dropdownBody.classList.remove("dropdownAnimation");
      } else {
        addAnimations();
        event.target.blur();
      }
    });
});
/* End DropDown */

/* Start Search */
document.getElementById("searchIcon").addEventListener("click", (event) => {
  event.target.nextElementSibling.focus();
});

document.body.addEventListener("click", (event) => {
  if (
    !(
      event.target.className.includes("dropdown") ||
      event.target.parentElement.className.includes("dropdown")
    )
  ) {
    addAnimations();
  }
});

document
  .querySelector("form.search input")
  .addEventListener("keydown", (event) => {
    const dropdownItems = document.querySelectorAll(
      ".search .dropdown-body .dropdown-item",
    );
    const dropdownItemsLength = dropdownItems.length;
    let dropdownSelectedIndex = 0;
    const removeSelectedItem = () => {
      dropdownItems.forEach((dropdownItem) =>
        dropdownItem.classList.remove("selected-item"),
      );
    };

    dropdownItems.forEach(
      (dropdownItem, index) =>
        (dropdownSelectedIndex = dropdownItem.className.includes(
          "selected-item",
        )
          ? index
          : dropdownSelectedIndex),
    );

    if (event.code === "ArrowUp" || event.code === "ArrowDown") {
      event.preventDefault();
      removeSelectedItem();
    }

    const theContainer = document.querySelector("form.search .dropdown-body");
    let theItem;
    switch (event.code) {
      case "ArrowUp":
        if (dropdownSelectedIndex - 1 >= 0) {
          theItem = dropdownItems[dropdownSelectedIndex - 1];
        } else {
          theItem = dropdownItems[dropdownItemsLength - 1];
        }
        theItem.classList.add("selected-item");
        theContainer.scrollTo({
          top: theItem.offsetTop - 10,
          behavior: "smooth",
        });
        break;

      case "ArrowDown":
        if (dropdownSelectedIndex + 1 >= dropdownItemsLength) {
          theItem = dropdownItems[0];
        } else {
          theItem = dropdownItems[dropdownSelectedIndex + 1];
        }
        theItem.classList.add("selected-item");
        theContainer.scrollTo({
          top: theItem.offsetTop - 10,
          behavior: "smooth",
        });
        break;

      case "Escape":
        event.target.blur();
        addAnimations();
        break;

      case "Enter":
        event.target.value = document.querySelector(
          "form.search .dropdown-body .selected-item",
        ).innerText;
        document.getElementById("searchButton").click();
        event.target.blur();
        addAnimations();
        break;

      default:
        break;
    }
  });
/* End Search */

/* Start Hourly */
document
  .querySelector(".hourly .dropdown-body")
  .addEventListener("click", (dropdown) => {
    if (dropdown.target.className.includes("item")) {
      dropdown.target.parentElement
        .querySelectorAll(".dropdown-item")
        .forEach((item) => {
          item.classList.remove("selected-item");
        });

      dropdown.target.classList.add("selected-item");

      document.getElementById("hourly").innerText = dropdown.target.innerText;

      addAnimations();
    }
  });
/* End Hourly */

/* Start Logic */
document
  .querySelector("form.search input")
  .addEventListener("keyup", (event) => {
    if (
      !(
        event.code === "ArrowUp" ||
        event.code === "ArrowDown" ||
        event.code === "Enter" ||
        event.code === "Escape" ||
        event.code === "ArrowLeft" ||
        event.code === "ArrowRight"
      )
    ) {
      const searchInput = event.target.value;
      fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${searchInput}`,
      )
        .then((res) => res.json())
        .then((data) => data.results)
        .then((data) => {
          if (data) {
            document
              .querySelectorAll("form.search .dropdown-item")
              .forEach((removeItem) => removeItem.remove());

            data.forEach((element) => {
              const dropdownItem = document.createElement("div");
              dropdownItem.classList.add("dropdown-item");

              dropdownItem.append(element.name + " / " + element.country);

              dropdownItem.dataset.name = element.name;
              dropdownItem.dataset.country = element.country;
              dropdownItem.dataset.latitude = element.latitude;
              dropdownItem.dataset.longitude = element.longitude;

              dropdownItem.addEventListener("click", (subEvent) => {
                addAnimations();
                document.querySelector("form.search input").value =
                  subEvent.target.innerText;
                document.getElementById("searchButton").click();
              });

              document
                .querySelector("form.search .dropdown-body")
                .append(dropdownItem);
            });

            document
              .querySelector(
                "form.search .dropdown-body .dropdown-item:first-child",
              )
              .classList.add("selected-item");
          }
        })
        .catch((err) => console.error(err));
    }
  });

function getWeatherIcon(code) {
  if (code === 0) {
    return "icon-sunny.webp";
  }

  if ([1, 2].includes(code)) {
    return "icon-partly-cloudy.webp";
  }

  if (code === 3) {
    return "icon-overcast.webp";
  }

  if ([45, 48].includes(code)) {
    return "icon-fog.webp";
  }

  if ([51, 53, 55].includes(code)) {
    return "icon-drizzle.webp";
  }

  if ([61, 63, 65, 80, 81, 82].includes(code)) {
    return "icon-rain.webp";
  }

  if ([71, 73, 75].includes(code)) {
    return "icon-snow.webp";
  }

  if (code >= 95) {
    return "icon-storm.webp";
  }

  return "icon-overcast.webp";
}

function changeHourly(index) {
  let theIndex = document.querySelector(".hourly .dropdown-item.selected-item")
    .dataset.index;
  if (index != undefined) {
    theIndex = index;
  }

  let theRange = {};
  theRange.start = theIndex * 24;
  theRange.end = theRange.start + 24;

  const theData = {
    temp: parseHourly().temperature_2m.slice(theRange.start, theRange.end),
    code: parseHourly().weather_code.slice(theRange.start, theRange.end),
    time: parseHourly().time.slice(theRange.start, theRange.end),
  };

  document
    .querySelectorAll(".hourly .main-part .item")
    .forEach((item) => item.remove());

  for (let i = 0; i < 24; i++) {
    const theItem = document.createElement("div");
    theItem.classList.add("item");
    const theItemContainer = document.createElement("div");
    theItemContainer.classList.add("container");
    const theItemContainerImg = document.createElement("img");
    theItemContainerImg.src = `/images/${getWeatherIcon(theData.code[i])}`;
    theItemContainerImg.alt = getWeatherIcon(theData.code[i]);
    theItemContainer.append(theItemContainerImg);
    const theItemContainerTime = document.createElement("div");
    theItemContainerTime.classList.add("time");
    theItemContainerTime.append(getTime12(theData.time[i]));
    theItemContainer.append(theItemContainerTime);
    theItem.append(theItemContainer);
    const theItemDegree = document.createElement("div");
    theItemDegree.classList.add("degree");
    theItemDegree.append(theData.temp[i] + "°");
    theItem.append(theItemDegree);

    document.querySelector(".hourly .main-part").append(theItem);
  }
}

document.querySelector("form.search").addEventListener("submit", (event) => {
  event.preventDefault();

  let theItem;
  document
    .querySelectorAll("form.search .dropdown-body .dropdown-item")
    .forEach((item) => {
      theItem =
        event.target.querySelector("input").value === item.innerText
          ? item
          : theItem;
    });

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${theItem.dataset.latitude}&longitude=${theItem.dataset.longitude}&current=temperature_2m,wind_speed_10m,weather_code,relative_humidity_2m,precipitation&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto`,
  )
    .then((res) => res.json())
    .then((data) => {
      // Weather
      const currentDate = new Date(data.current.time);
      const theDate = `${daysOfWeek[currentDate.getDay()]}, ${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

      document.querySelector(".weather .date").innerText = theDate;
      return { data: data, currentDate: currentDate };
    })
    .then((data) => {
      // Hourly Choose
      document.getElementById("hourly").innerText =
        daysOfWeek[data.currentDate.getDay()];

      const weekArray = [
        ...daysOfWeek.slice(data.currentDate.getDay()),
        ...daysOfWeek.slice(0, data.currentDate.getDay()),
      ];

      // Hourly and Daily
      document
        .querySelectorAll(".hourly .dropdown-item")
        .forEach((item) => item.remove());
      document
        .querySelectorAll(".daily .daily-item")
        .forEach((item) => item.remove());

      weekArray.forEach((theDay, index) => {
        // Hourly
        const dropdownItem = document.createElement("div");
        dropdownItem.classList.add("dropdown-item");
        dropdownItem.dataset.index = index;
        dropdownItem.append(theDay);
        dropdownItem.addEventListener("click", (event) => {
          changeHourly(index);
        });
        document.querySelector(".hourly .dropdown-body").append(dropdownItem);

        // Daily
        const dailyItem = document.createElement("div");
        dailyItem.classList.add("daily-item");
        const dailyItemTitle = document.createElement("h3");
        dailyItemTitle.classList.add("title");
        dailyItemTitle.append(theDay);
        dailyItem.append(dailyItemTitle);
        const dailyItemImage = document.createElement("img");
        dailyItemImage.src = `/images/${getWeatherIcon(data.data.daily.weather_code[index])}`;
        dailyItemImage.alt = getWeatherIcon(
          data.data.daily.weather_code[index],
        );
        dailyItem.append(dailyItemImage);
        const dailyItemDegrees = document.createElement("div");
        dailyItemDegrees.classList.add("degrees");
        const dailyItemDegreesHigh = document.createElement("h3");
        dailyItemDegreesHigh.classList.add("high");
        const dailyItemDegreesLow = document.createElement("h3");
        dailyItemDegreesLow.classList.add("low");

        dailyItemDegreesHigh.append(
          `${data.data.daily.temperature_2m_max[index]}${data.data.daily_units.temperature_2m_max[0]}`,
        );
        dailyItemDegreesLow.append(
          `${data.data.daily.temperature_2m_min[index]}${data.data.daily_units.temperature_2m_min[0]}`,
        );
        dailyItemDegrees.append(dailyItemDegreesHigh);
        dailyItemDegrees.append(dailyItemDegreesLow);
        dailyItem.append(dailyItemDegrees);
        document.querySelector(".daily .daily-items").append(dailyItem);
      });

      document
        .querySelector(".hourly .dropdown-item:first-child")
        .classList.add("selected-item");

      return data.data;
    })
    .then((data) => {
      // City
      const theCity = `${theItem.dataset.name}, ${theItem.dataset.country}`;

      document.querySelector(".weather .city").innerText = theCity;
      return data;
    })
    .then((data) => {
      // Status
      const theWind = `${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`;
      document.getElementById("wind").innerText = theWind;

      const theHumidity = `${data.current.relative_humidity_2m}${data.current_units.relative_humidity_2m}`;
      document.getElementById("humidity").innerText = theHumidity;

      const thePrecipitation = `${data.current.precipitation} ${data.current_units.precipitation}`;
      document.getElementById("precipitation").innerText = thePrecipitation;

      return data;
    })
    .then((data) => {
      // Temperature
      const theTemperature = `${data.current.temperature_2m}${data.current_units.temperature_2m}`;
      document.getElementById("temperature").innerText = theTemperature;
      document.querySelector(".degree").innerText = theTemperature.slice(0, -1);

      return data;
    })
    .then((data) => {
      // Image
      document.querySelector(".weather img").src =
        `/images/${getWeatherIcon(data.current.weather_code)}`;

      return data;
    })
    .then((data) => {
      // Hourly
      stringifyHourly(data.hourly);

      changeHourly();
    });
});
/* End Logic */
