const THEME_KEY = "luminaverse-theme";
const themes = {
  safari: "safari",
  dark: "dark",
  luminaverse: "luminaverse",
};

const root = document.documentElement;
const body = document.body;
const pageLoader = document.querySelector(".page-loader");
const themeButtons = document.querySelectorAll("[data-theme-toggle]");
const typewriterEl = document.getElementById("typewriter");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const currentYearEl = document.getElementById("currentYear");

function applyTheme(theme) {
  const nextTheme = themes[theme] ? theme : themes.safari;
  root.setAttribute("data-theme", nextTheme);
  body.setAttribute("data-theme", nextTheme);
  themeButtons.forEach((btn) => {
    const isActive = btn.dataset.themeToggle === nextTheme;
    btn.setAttribute("aria-pressed", String(isActive));
  });
  localStorage.setItem(THEME_KEY, nextTheme);
}

function loadTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored && themes[stored]) {
    applyTheme(stored);
  } else {
    applyTheme(themes.safari);
  }
}

function handleThemeToggle() {
  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.dataset.themeToggle;
      applyTheme(theme);
      animateThemeTransition();
    });
  });
}

function animateThemeTransition() {
  body.classList.add("theme-transition");
  setTimeout(() => {
    body.classList.remove("theme-transition");
  }, 500);
}

function initTypewriter() {
  if (!typewriterEl) return;
  const text = typewriterEl.dataset.text || "";
  const characters = text.split("");
  typewriterEl.textContent = "";
  let index = 0;
  const typingSpeed = 80;

  const interval = setInterval(() => {
    if (index < characters.length) {
      typewriterEl.textContent += characters[index];
      index += 1;
    } else {
      clearInterval(interval);
    }
  }, typingSpeed);
}

function initIntersectionObserver() {
  const elements = document.querySelectorAll("[data-animate]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  elements.forEach((el) => observer.observe(el));
}

function initTimelineAnimation() {
  const timeline = document.querySelector("#experience .timeline");
  if (!timeline) return;

  const items = Array.from(timeline.querySelectorAll(".timeline-item"));
  if (!items.length) return;

  const updateProgress = () => {
    const viewportHeight = window.innerHeight;
    const timelineRect = timeline.getBoundingClientRect();
    const totalHeight = timelineRect.height;

    let visibleIndex = -1;

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const visibilityThreshold = Math.min(viewportHeight * 0.6, viewportHeight - 120);
      if (rect.top < visibilityThreshold) {
        visibleIndex = index;
      }
    });

    const progress = visibleIndex >= 0 ? (visibleIndex + 1) / items.length : 0;
    timeline.style.setProperty("--timeline-progress", progress);
  };

  const handleScroll = () => {
    window.requestAnimationFrame(updateProgress);
  };

  updateProgress();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll);
}

function validateFormField(field) {
  if (!field) return false;
  if (!field.value.trim()) {
    field.setAttribute("aria-invalid", "true");
    return false;
  }
  if (field.type === "email") {
    const pattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (!pattern.test(field.value.trim())) {
      field.setAttribute("aria-invalid", "true");
      return false;
    }
  }
  field.removeAttribute("aria-invalid");
  return true;
}

function handleContactForm() {
  if (!contactForm || !formStatus) return;
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "";

    const nameField = contactForm.querySelector("#name");
    const emailField = contactForm.querySelector("#email");
    const messageField = contactForm.querySelector("#message");

    const validName = validateFormField(nameField);
    const validEmail = validateFormField(emailField);
    const validMessage = validateFormField(messageField);

    if (!validName || !validEmail || !validMessage) {
      formStatus.textContent = "Please complete all required fields with valid information.";
      formStatus.classList.remove("success");
      formStatus.classList.add("error");
      return;
    }

    const formData = new FormData(contactForm);
    const params = new URLSearchParams(formData).toString();
    const subject = encodeURIComponent("Luminaverse Collaboration");
    const mailtoLink = `mailto:hello@luminaverse.africa?subject=${subject}&body=${encodeURIComponent(`Name: ${formData.get("name")}
Email: ${formData.get("email")}
Message: ${formData.get("message")}`)}`;

    window.location.href = mailtoLink;

    formStatus.textContent = "Message ready in your email client!";
    formStatus.classList.remove("error");
    formStatus.classList.add("success");
    contactForm.reset();
  });
}

function updateCurrentYear() {
  if (currentYearEl) {
    currentYearEl.textContent = String(new Date().getFullYear());
  }
}

function initAccessibilityHelpers() {
  document.addEventListener("keyup", (event) => {
    if (event.key === "Tab") {
      body.classList.add("user-tabbed");
    }
  });
}

function removeLoader() {
  window.addEventListener("load", () => {
    body.dataset.loaded = "true";
    setTimeout(() => {
      pageLoader?.remove();
    }, 400);
  });
}

function initParallax() {
  const heroBackground = document.querySelector(".hero-background");
  if (!heroBackground) return;
  window.addEventListener("scroll", () => {
    const offset = window.scrollY * 0.2;
    heroBackground.style.transform = `translateY(${offset}px)`;
  });
}

function initParticleToggle() {
  const particleField = document.querySelector(".particle-field");
  if (!particleField) return;
  const handleParticleVisibility = () => {
    const theme = body.getAttribute("data-theme");
    particleField.style.opacity = theme === themes.luminaverse ? "1" : "0";
  };
  handleParticleVisibility();
  const observer = new MutationObserver(handleParticleVisibility);
  observer.observe(body, { attributes: true, attributeFilter: ["data-theme"] });
}

function init() {
  loadTheme();
  handleThemeToggle();
  initTypewriter();
  initIntersectionObserver();
  handleContactForm();
  updateCurrentYear();
  initAccessibilityHelpers();
  removeLoader();
  initParallax();
  initParticleToggle();
  initTimelineAnimation();
}

document.addEventListener("DOMContentLoaded", init);
