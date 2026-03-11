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
