const addAnimations = () => {
  document.querySelectorAll(".dropdown .dropdown-body").forEach((item) => {
    if (item.classList.length === 1) {
      item.classList.add("dropdownAnimation");
    }
  });
};

/* Start DropDown */
document.querySelectorAll(".dropdown").forEach((dropdown) => {
  dropdown
    .querySelector(".dropdown-title")
    .addEventListener("click", (event) => {
      const dropdownBody = dropdown.querySelector(".dropdown-body");
      if (dropdownBody.className.includes("dropdownAnimation")) {
        addAnimations()
        dropdownBody.classList.remove("dropdownAnimation");
      } else {
        addAnimations();
        event.target.blur()
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

document.querySelector("form.search").addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(event.target.querySelector("input").value);
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

    switch (event.code) {
      case "ArrowUp":
        if (dropdownSelectedIndex - 1 >= 0) {
          dropdownItems[dropdownSelectedIndex - 1].classList.add(
            "selected-item",
          );
        } else {
          dropdownItems[dropdownItemsLength - 1].classList.add("selected-item");
        }
        break;

      case "ArrowDown":
        if (dropdownSelectedIndex + 1 >= dropdownItemsLength) {
          dropdownItems[0].classList.add("selected-item");
        } else {
          dropdownItems[dropdownSelectedIndex + 1].classList.add(
            "selected-item",
          );
        }
        break;

      case "Escape":
        event.target.blur();
        addAnimations();
        break;

      case "Enter":
        document.getElementById("searchButton").click();
        event.target.blur();
        addAnimations();
        break;

      default:
        break;
    }
  });

document
  .querySelectorAll("form.search .dropdown-item")
  .forEach((dropdownItem) => {
    dropdownItem.addEventListener("click", (event) => {
      addAnimations();
      document.querySelector("form.search input").value =
        event.target.innerText;
      document.getElementById("searchButton").click();
    });
  });
/* End Search */
