document.querySelectorAll(".dropdown").forEach((dropdown) => {
  dropdown
    .querySelector(".dropdown-title")
    .addEventListener("click", (event) =>
      dropdown.querySelector(".dropdown-body").classList.toggle("settingsAnimation"),
    );
});

