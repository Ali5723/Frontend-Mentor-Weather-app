const addAnimations = () => {
  document.querySelector("h2.page-error").style.display = "none";
  document.querySelectorAll(".dropdown .dropdown-body").forEach((item) => {
    if (!item.className.includes("dropdownAnimation")) {
      item.classList.add("dropdownAnimation");
    }
  });
};

const parseHourly = () => JSON.parse(sessionStorage.getItem("hourly"));
const stringifyHourly = (data) =>
  sessionStorage.setItem("hourly", JSON.stringify(data));

const parseUnits = () => JSON.parse(localStorage.getItem("units"));
const stringifyUnits = (data) =>
  localStorage.setItem("units", JSON.stringify(data));

const getTime12 = (time) => {
  const theTime = new Date(time);
  const theResult = theTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });
  return theResult;
};

const imgPrefix = () =>
  location.href === "http://localhost:5173/"
    ? "/images"
    : "/Frontend-Mentor-Weather-app/images";

const switchChangeData = {
  imperial: {
    temperature: "fahrenheit",
    wind: "mph",
    precipitation: "inch",
  },
  metric: {
    temperature: "celsius",
    wind: "kmh",
    precipitation: "mm",
  },
  all: {
    temperature: ["fahrenheit", "celsius"],
    wind: ["mph", "kmh"],
    precipitation: ["inch", "mm"],
  },
};

const unitsChange = (item) => {
  if (item) {
    if (!item.className.includes("selected-item")) {
      let theResult = parseUnits();
      if (switchChangeData.all.precipitation.includes(item.dataset.value)) {
        theResult.precipitation = item.dataset.value;
      } else if (
        switchChangeData.all.temperature.includes(item.dataset.value)
      ) {
        theResult.temperature = item.dataset.value;
      } else if (switchChangeData.all.wind.includes(item.dataset.value)) {
        theResult.wind = item.dataset.value;
      }
      stringifyUnits(theResult);
    }
  }

  document
    .querySelectorAll(".header .dropdown-group .dropdown-item")
    .forEach((dropdownItem) => {
      dropdownItem.classList.remove("selected-item");
      if (Object.values(parseUnits()).includes(dropdownItem.dataset.value)) {
        dropdownItem.classList.add("selected-item");
      }
    });

  if (
    switchChangeData.imperial.precipitation === parseUnits().precipitation &&
    switchChangeData.imperial.temperature === parseUnits().temperature &&
    switchChangeData.imperial.wind === parseUnits().wind
  ) {
    document.querySelector(".header .dropdown-item:first-child").innerText =
      "Switch to Metric";
  } else if (
    switchChangeData.metric.precipitation === parseUnits().precipitation &&
    switchChangeData.metric.temperature === parseUnits().temperature &&
    switchChangeData.metric.wind === parseUnits().wind
  ) {
    document.querySelector(".header .dropdown-item:first-child").innerText =
      "Switch to Imperial";
  }
};

const searchAction = (event) => {
  // event.target.blur();
  // document.getElementById("searchButton").click();
  document.querySelector(".search .dropdown-body").className =
    "dropdown-body scroll";
  // addAnimations();
  const dropdownProgress = document.createElement("div");
  dropdownProgress.classList.add("dropdown-item", "progress");
  dropdownProgress.append("Search in progress");
  document
    .querySelectorAll(".search .dropdown-item")
    .forEach((removeItem) => removeItem.classList.add("visHidden"));
  const dropdownBody = document.querySelector(".search .dropdown-body");
  dropdownBody.classList.add("progress");
  dropdownBody.prepend(dropdownProgress);
  dropdownBody.scrollTo({
    top: 5,
    behavior: "smooth",
  });
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

/* Start Units */
if (!parseUnits()) {
  let theRequest = {
    temperature: "",
    wind: "",
    precipitation: "",
  };
  document
    .querySelectorAll(".header .selected-item")
    .forEach((reqItem, index) => {
      index === 0
        ? (theRequest.temperature = reqItem.dataset.value)
        : index === 1
          ? (theRequest.wind = reqItem.dataset.value)
          : index === 2
            ? (theRequest.precipitation = reqItem.dataset.value)
            : "";
    });
  stringifyUnits(theRequest);
}

window.addEventListener("DOMContentLoaded", (event) => unitsChange());

document
  .querySelector(".header .dropdown-body")
  .addEventListener("click", (dropdown) => {
    if (dropdown.target.className.includes("item")) {
      if (!dropdown.target.parentElement.className.includes("group")) {
        if (dropdown.target.innerText.includes("Imperial")) {
          stringifyUnits(switchChangeData.imperial);
          dropdown.target.innerText = "Switch to Metric";
        } else if (dropdown.target.innerText.includes("Metric")) {
          stringifyUnits(switchChangeData.metric);
          dropdown.target.innerText = "Switch to Imperial";
        }
        unitsChange();
      } else {
        unitsChange(dropdown.target);
      }
    }
  });
/* End Units */

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
        if (
          document.querySelector("form.search .dropdown-body .selected-item")
            .innerText !== "City Name"
        ) {
          event.target.value = document.querySelector(
            "form.search .dropdown-body .selected-item",
          ).innerText;

          searchAction(event);
        }
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
      searchAction();
      fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${searchInput}`,
      )
        .then((res) => res.json())
        .then((data) => data.results)
        .then((data) => {
          if (data) {
            document.querySelector("h2.page-error").style.display = "none";
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

              const dropdownBody = document.querySelector(
                ".search .dropdown-body",
              );
              dropdownBody.classList.remove("progress");
              // dropdownBody.querySelector(".progress").remove();
              dropdownBody
                .querySelectorAll(".visHidden")
                .forEach((removeItem) =>
                  removeItem.classList.remove("visHidden"),
                );

              document
                .querySelector("form.search .dropdown-body")
                .append(dropdownItem);
            });

            document
              .querySelector(
                "form.search .dropdown-body .dropdown-item:first-child",
              )
              .classList.add("selected-item");
          } else {
            console.log(Error("No Search Results"));
            document.querySelector("h2.page-error").style.display = "block";
          }
        })
        .catch((err) => {
          console.log(Error(err));
          console.log(err);
        });
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
    theItemContainerImg.src = `${imgPrefix()}/${getWeatherIcon(theData.code[i])}`;
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
  if (theItem === undefined) {
    theItem = document.querySelector(
      "form.search .dropdown-body .dropdown-item:first-child",
    );
  }

  event.target.querySelector("input").value =
    theItem.innerText === "City Name" ? "" : theItem.innerText;

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

  const theRequest = parseUnits();
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${theItem.dataset.latitude}&longitude=${theItem.dataset.longitude}&current=temperature_2m,wind_speed_10m,weather_code,relative_humidity_2m,precipitation&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto&temperature_unit=${theRequest.temperature}&wind_speed_unit=${theRequest.wind}&precipitation_unit=${theRequest.precipitation}`,
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
        dailyItemImage.src = `${imgPrefix()}/${getWeatherIcon(data.data.daily.weather_code[index])}`;
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
      const theTemperature = `${data.current.temperature_2m}${data.current_units.temperature_2m[0]}`;
      document.getElementById("temperature").innerText = theTemperature;
      document.querySelector(".degree").innerText = theTemperature;

      return data;
    })
    .then((data) => {
      // Image
      document.querySelector(".weather img").src =
        `${imgPrefix()}/${getWeatherIcon(data.current.weather_code)}`;

      return data;
    })
    .then((data) => {
      // Hourly
      stringifyHourly(data.hourly);
      changeHourly();

      // Remove VisHidden
      addAnimations();

      document
        .querySelectorAll(".visHidden")
        .forEach((removeItem) => removeItem.classList.remove("visHidden"));
      document
        .querySelectorAll(".search .progress")
        .forEach((removeItem, index) => {
          if (index === 1) {
            removeItem.remove();
          } else {
            removeItem.classList.remove("progress");
          }
        });

      console.log(data);
    });
});

/* End Logic */
