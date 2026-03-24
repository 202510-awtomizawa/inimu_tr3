const header = document.querySelector(".site-header");
const toggleButton = document.querySelector(".site-header__toggle");
const navigation = document.querySelector(".site-nav");

if (header && toggleButton && navigation) {
  toggleButton.addEventListener("click", () => {
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";

    toggleButton.setAttribute("aria-expanded", String(!isExpanded));
    header.classList.toggle("is-menu-open", !isExpanded);
    navigation.classList.toggle("is-open", !isExpanded);
  });
}

const heroSlider = document.querySelector(".workshop-header__hero-slider");
const heroSlides = document.querySelectorAll(".workshop-header__hero-slide");

if (heroSlider && heroSlides.length > 1) {
  let currentSlideIndex = 0;

  window.setInterval(() => {
    currentSlideIndex = (currentSlideIndex + 1) % heroSlides.length;
    heroSlider.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

    heroSlides.forEach((slide, index) => {
      slide.setAttribute("aria-hidden", String(index !== currentSlideIndex));
    });
  }, 4000);
}

document.addEventListener("click", (event) => {
  const availableCell = event.target.closest('.reservation-calendar .calendar-cell[data-status="available"][data-date]');
  if (!availableCell) return;
  const selectedDate = availableCell.getAttribute("data-date");
  const selectedCourse = availableCell.classList.contains("calendar-cell--special") ? "special" : "standard";
  if (!selectedDate) return;
  window.location.href = `./reservation-form.html?date=${encodeURIComponent(selectedDate)}&course=${encodeURIComponent(selectedCourse)}`;
});

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const date = params.get("date");
  const course = params.get("course");

  if (date) {
    const formattedDate = date.replace(/-/g, "/");
    const dateEl = document.getElementById("selected-date");
    if (dateEl) {
      dateEl.textContent = formattedDate;
    }
  }

  const courseValue = course === "special" ? "special" : "standard";
  const courseEl = document.querySelector(".reservation-form__course");
  const courseNoteEl = document.querySelector(".reservation-form__note");
  const courseCardEl = document.querySelector(".reservation-form__static--course");

  if (courseEl) {
    courseEl.textContent = courseValue === "special" ? "SPECIAL COURSE" : "STANDARD COURSE";
  }
  if (courseNoteEl) {
    courseNoteEl.textContent = "コースは選択した日程に応じて決まります";
  }
  if (courseCardEl) {
    courseCardEl.style.backgroundColor = courseValue === "special" ? "#FDDAC5" : "#CAE8E2";
  }
});
