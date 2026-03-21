// Controle do menu mobile e fechamento ao clicar em links
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");

if (menuToggle && nav) {
  const syncMenuState = (isOpen) => {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  };

  syncMenuState(nav.classList.contains("active"));

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("active");
    syncMenuState(isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      syncMenuState(false);
    });
  });
}

// Link Home sempre leva ao topo absoluto
const homeLinks = document.querySelectorAll("[data-home-link]");
homeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// Modal de aviso para produtos Rigolim
const productsModal = document.querySelector("[data-products-modal]");
const openProductsButtons = document.querySelectorAll("[data-open-products]");
const closeProductsButton = productsModal?.querySelector(".modal-close");

const openProductsModal = () => {
  if (!productsModal) return;
  productsModal.classList.add("active");
  productsModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeProductsModal = () => {
  if (!productsModal) return;
  productsModal.classList.remove("active");
  productsModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

openProductsButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openProductsModal();
  });
});

closeProductsButton?.addEventListener("click", closeProductsModal);

productsModal?.addEventListener("click", (event) => {
  if (event.target === productsModal) {
    closeProductsModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProductsModal();
  }
});

// Estado visual do header quando a página é rolada
const updateHeaderOnScroll = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 14);
};

updateHeaderOnScroll();
window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });

// Animação de entrada suave ao rolar a página com efeito em cascata
const revealElements = document.querySelectorAll(".reveal");
revealElements.forEach((element, index) => {
  const staggerDelay = Math.min(index * 70, 700);
  element.style.setProperty("--delay", `${staggerDelay}ms`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach((element) => revealObserver.observe(element));

// Parallax discreto nas imagens principais para dar profundidade
const parallaxElements = document.querySelectorAll(".parallax-soft");
const applyParallax = () => {
  if (window.innerWidth < 760) {
    parallaxElements.forEach((element) => {
      element.style.transform = "";
    });
    return;
  }

  const scrollY = window.scrollY;
  parallaxElements.forEach((element) => {
    const speed = 0.035;
    const offset = scrollY * speed;
    element.style.transform = `translateY(${offset}px)`;
  });
};

applyParallax();
window.addEventListener("scroll", applyParallax, { passive: true });

// Slider de imagens do bloco de noivas (uma coluna deslizante)
const bridalSlider = document.querySelector("[data-bridal-slider]");
if (bridalSlider) {
  const track = bridalSlider.querySelector("[data-bridal-track]");
  const slides = [...bridalSlider.querySelectorAll(".bridal-slide")];
  const dots = [...bridalSlider.querySelectorAll(".slider-dot")];
  const prevBtn = bridalSlider.querySelector(".slider-btn.prev");
  const nextBtn = bridalSlider.querySelector(".slider-btn.next");

  let currentIndex = 0;
  let autoSlideTimer;

  const renderSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === currentIndex);
    });
  };

  const startAutoSlide = () => {
    autoSlideTimer = window.setInterval(() => {
      renderSlide(currentIndex + 1);
    }, 4200);
  };

  const resetAutoSlide = () => {
    window.clearInterval(autoSlideTimer);
    startAutoSlide();
  };

  prevBtn?.addEventListener("click", () => {
    renderSlide(currentIndex - 1);
    resetAutoSlide();
  });

  nextBtn?.addEventListener("click", () => {
    renderSlide(currentIndex + 1);
    resetAutoSlide();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      renderSlide(dotIndex);
      resetAutoSlide();
    });
  });

  bridalSlider.addEventListener("mouseenter", () => {
    window.clearInterval(autoSlideTimer);
  });

  bridalSlider.addEventListener("mouseleave", () => {
    startAutoSlide();
  });

  renderSlide(0);
  startAutoSlide();
}
