const clockDisplay = document.getElementById("clock");
const dateDisplay = document.getElementById("date");
const timezoneDisplay = document.getElementById("timezone-display");
const timezoneSelect = document.getElementById("timezone-select");
const modeToggleBtn = document.getElementById("mode-toggle");
const themeButtons = document.querySelectorAll(".theme-btn");

let currentSelectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function getTimezoneList() {
  const timezones = [
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Asia/Kolkata",
    "Australia/Sydney",
    "Africa/Nairobi",
    "UTC",
  ];
  if (!timezones.includes(Intl.DateTimeFormat().resolvedOptions().timeZone)) {
    timezones.unshift(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }
  return timezones.sort();
}

function populateTimezoneSelect() {
  const timezones = getTimezoneList();
  timezoneSelect.innerHTML = "";
  timezones.forEach((tz) => {
    const option = document.createElement("option");
    option.value = tz;
    option.textContent = tz.replace(/_/g, " ");
    if (tz === currentSelectedTimezone) {
      option.selected = true;
    }
    timezoneSelect.appendChild(option);
  });
}

function updateClock() {
  const now = new Date();
  const optionsTime = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: currentSelectedTimezone,
  };
  const optionsDate = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: currentSelectedTimezone,
  };

  const timeString = now.toLocaleTimeString("en-US", optionsTime);
  const dateString = now.toLocaleDateString("en-US", optionsDate);

  clockDisplay.textContent = timeString;
  dateDisplay.textContent = dateString;
  timezoneDisplay.textContent = currentSelectedTimezone.replace(/_/g, " ");
}

timezoneSelect.addEventListener("change", (event) => {
  currentSelectedTimezone = event.target.value;
  updateClock();
});

function applyMode(mode) {
  if (mode === "dark") {
    document.body.classList.add("dark-mode");
    modeToggleBtn.textContent = "Désactiver le mode sombre";
  } else {
    document.body.classList.remove("dark-mode");
    modeToggleBtn.textContent = "Activer le mode sombre";
  }
  localStorage.setItem("lastMode", mode);
}

modeToggleBtn.addEventListener("click", () => {
  const currentMode = document.body.classList.contains("dark-mode")
    ? "dark"
    : "light";
  applyMode(currentMode === "dark" ? "light" : "dark");
});

function applyTheme(theme) {
  document.body.classList.forEach((className) => {
    if (className.startsWith("theme-")) {
      document.body.classList.remove(className);
    }
  });
  document.body.classList.add(`theme-${theme}`);

  themeButtons.forEach((button) => {
    if (button.dataset.theme === theme) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  localStorage.setItem("lastTheme", theme);
}

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;
    applyTheme(theme);
  });
});

window.onload = function () {
  const savedMode = localStorage.getItem("lastMode");
  if (savedMode) {
    applyMode(savedMode);
  } else {
    applyMode("light");
  }

  const savedTheme = localStorage.getItem("lastTheme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme("default");
  }

  populateTimezoneSelect();
  updateClock();

  setInterval(updateClock, 1000);
};
