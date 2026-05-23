const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const menuLines = document.querySelectorAll("[data-menu-line]");
const revealItems = document.querySelectorAll(".reveal");
const carousels = document.querySelectorAll("[data-carousel]");

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("shadow-premium", window.scrollY > 20);
  header.classList.toggle("bg-m9black/95", window.scrollY > 20);
};

const closeMenu = () => {
  mobileMenu?.classList.add("hidden");
  menuButton?.setAttribute("aria-expanded", "false");
  menuLines[0]?.classList.remove("translate-y-[7px]", "rotate-45");
  menuLines[1]?.classList.remove("-translate-y-[7px]", "-rotate-45");
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuButton?.addEventListener("click", () => {
  const isOpen = mobileMenu?.classList.toggle("hidden") === false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuLines[0]?.classList.toggle("translate-y-[7px]", isOpen);
  menuLines[0]?.classList.toggle("rotate-45", isOpen);
  menuLines[1]?.classList.toggle("-translate-y-[7px]", isOpen);
  menuLines[1]?.classList.toggle("-rotate-45", isOpen);
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener(
    "error",
    () => {
      image.style.display = "none";
    },
    { once: true }
  );
});

carousels.forEach((carousel) => {
  const image = carousel.querySelector("[data-carousel-image]");
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const dotsWrap = carousel.querySelector("[data-carousel-dots]");
  const images = (carousel.dataset.images || "").split("|").filter(Boolean);
  const alt = carousel.dataset.alt || image?.alt || "Veículo em destaque";
  let current = 0;

  if (!image || images.length === 0) return;

  const dots = images.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Ver foto ${index + 1}`);
    dot.addEventListener("click", () => show(index));
    dotsWrap?.appendChild(dot);
    return dot;
  });

  const updateDots = () => {
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === current);
      dot.setAttribute("aria-current", index === current ? "true" : "false");
    });
  };

  function show(index) {
    current = (index + images.length) % images.length;
    image.style.opacity = "0";
    window.setTimeout(() => {
      image.src = images[current];
      image.alt = `${alt} - foto ${current + 1}`;
      image.style.display = "";
      image.style.opacity = "1";
      updateDots();
    }, 120);
  }

  prev?.addEventListener("click", () => show(current - 1));
  next?.addEventListener("click", () => show(current + 1));
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });

  updateDots();
});
