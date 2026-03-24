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
  const step1El = document.getElementById("reservation-step1");
  const step2El = document.getElementById("reservation-step2");
  const step3El = document.getElementById("reservation-step3");
  const step4El = document.getElementById("reservation-step4");
  const nextButton = step1El ? step1El.querySelector(".reservation-form__next") : null;
  const confirmButton = document.getElementById("reservation-confirm-next");
  const completeButton = document.getElementById("reservation-complete-button");

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

  if (step1El && step2El && nextButton) {
    nextButton.addEventListener("click", () => {
      step1El.classList.add("is-hidden");
      step2El.classList.remove("is-hidden");
      step2El.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (step2El && step3El && confirmButton) {
    confirmButton.addEventListener("click", () => {
      const timeSelect = document.getElementById("reservation-time");
      const peopleSelect = document.getElementById("reservation-people");
      const nameEl = document.getElementById("customer-name");
      const kanaEl = document.getElementById("customer-kana");
      const genderEl = document.querySelector('input[name="customer-gender"]:checked');
      const birthYearEl = document.getElementById("birth-year");
      const birthMonthEl = document.getElementById("birth-month");
      const birthDayEl = document.getElementById("birth-day");
      const phoneEl = document.getElementById("customer-tel");
      const emailEl = document.getElementById("customer-email");
      const noteEl = document.getElementById("customer-note");

      const confirmDateEl = document.getElementById("confirm-date");
      const confirmTimeEl = document.getElementById("confirm-time");
      const confirmCountEl = document.getElementById("confirm-count");
      const confirmCourseEl = document.getElementById("confirm-course");
      const confirmNameEl = document.getElementById("confirm-name");
      const confirmKanaEl = document.getElementById("confirm-kana");
      const confirmGenderEl = document.getElementById("confirm-gender");
      const confirmBirthEl = document.getElementById("confirm-birth");
      const confirmPhoneEl = document.getElementById("confirm-phone");
      const confirmEmailEl = document.getElementById("confirm-email");
      const confirmMessageEl = document.getElementById("confirm-message");

      const dateText = document.getElementById("selected-date")?.textContent?.trim() || "";
      const timeText = timeSelect?.options[timeSelect.selectedIndex]?.text || "";
      const countText = peopleSelect?.options[peopleSelect.selectedIndex]?.text || "";
      const courseText = courseEl?.textContent?.trim() || "";
      const genderText = genderEl ? genderEl.parentElement.textContent.trim() : "";
      const yearText = birthYearEl?.value ? birthYearEl.options[birthYearEl.selectedIndex].text : "";
      const monthText = birthMonthEl?.value ? birthMonthEl.options[birthMonthEl.selectedIndex].text : "";
      const dayText = birthDayEl?.value ? birthDayEl.options[birthDayEl.selectedIndex].text : "";
      const birthText = [yearText, monthText, dayText].filter(Boolean).join(" ");

      if (confirmDateEl) confirmDateEl.textContent = dateText;
      if (confirmTimeEl) confirmTimeEl.textContent = timeText;
      if (confirmCountEl) confirmCountEl.textContent = countText;
      if (confirmCourseEl) confirmCourseEl.textContent = courseText;
      if (confirmNameEl) confirmNameEl.textContent = nameEl?.value || "";
      if (confirmKanaEl) confirmKanaEl.textContent = kanaEl?.value || "";
      if (confirmGenderEl) confirmGenderEl.textContent = genderText;
      if (confirmBirthEl) confirmBirthEl.textContent = birthText;
      if (confirmPhoneEl) confirmPhoneEl.textContent = phoneEl?.value || "";
      if (confirmEmailEl) confirmEmailEl.textContent = emailEl?.value || "";
      if (confirmMessageEl) confirmMessageEl.textContent = noteEl?.value || "";

      step2El.classList.add("is-hidden");
      step3El.classList.remove("is-hidden");
      step3El.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (step3El && step4El && completeButton) {
    completeButton.addEventListener("click", () => {
      const completeDateEl = document.getElementById("complete-date");
      const completeTimeEl = document.getElementById("complete-time");
      const completeCountEl = document.getElementById("complete-count");
      const completeCourseEl = document.getElementById("complete-course");

      if (completeDateEl) completeDateEl.textContent = document.getElementById("confirm-date")?.textContent || "";
      if (completeTimeEl) completeTimeEl.textContent = document.getElementById("confirm-time")?.textContent || "";
      if (completeCountEl) completeCountEl.textContent = document.getElementById("confirm-count")?.textContent || "";
      if (completeCourseEl) completeCourseEl.textContent = document.getElementById("confirm-course")?.textContent || "";

      step3El.classList.add("is-hidden");
      step4El.classList.remove("is-hidden");
      step4El.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
});

