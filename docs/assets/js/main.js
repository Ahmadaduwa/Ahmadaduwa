(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // theme: dark "Terminal" by default, light "Report" on toggle
  var toggle = document.querySelector(".theme-toggle");
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    toggle.textContent = theme === "dark" ? "theme: dark" : "theme: light";
    toggle.setAttribute("aria-pressed", String(theme === "light"));
  }
  var saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (e) {}
  setTheme(saved === "light" ? "light" : "dark");
  toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });

  // hero prompt types once (~40ms per character)
  var typed = document.querySelector("[data-type]");
  if (typed && !reduced) {
    var text = typed.textContent;
    var i = 0;
    typed.textContent = "";
    (function tick() {
      typed.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, 40);
    })();
  }

  // lightbox for photos and certificates
  var box = document.querySelector(".lightbox");
  var boxImg = box.querySelector("img");
  var boxName = box.querySelector(".lightbox-name");
  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-full]");
    if (trigger) {
      boxImg.src = trigger.getAttribute("data-full");
      boxImg.alt = trigger.getAttribute("data-alt") || "";
      boxName.textContent = trigger.getAttribute("data-full").split("/").pop();
      box.showModal();
      return;
    }
    if (event.target === box || event.target.closest(".lightbox-close")) box.close();
  });
})();
