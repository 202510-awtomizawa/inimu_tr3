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
