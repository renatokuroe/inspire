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

// Slider de treinamentos no mobile
const trainingSlider = document.querySelector("[data-training-slider]");
if (trainingSlider) {
  const track = trainingSlider.querySelector("[data-training-track]");
  const slides = [...trainingSlider.querySelectorAll(".training-slide")];
  const dots = [...trainingSlider.querySelectorAll(".slider-dot")];
  const prevBtn = trainingSlider.querySelector(".slider-btn.prev");
  const nextBtn = trainingSlider.querySelector(".slider-btn.next");

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
    }, 4600);
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

  trainingSlider.addEventListener("mouseenter", () => {
    window.clearInterval(autoSlideTimer);
  });

  trainingSlider.addEventListener("mouseleave", () => {
    startAutoSlide();
  });

  renderSlide(0);
  startAutoSlide();
}

// Widget flutuante de chat integrado com n8n
const CHAT_WEBHOOK_URL = "https://n8n-panel.aria.social.br/webhook/judith-chat";

const getChatSessionId = () => {
  const key = "judith-chat-session";
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(key, id);
  }
  return id;
};

const sendMessageToN8n = async (message) => {
  const response = await fetch(CHAT_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      sessionId: getChatSessionId(),
      page: window.location.pathname,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return (
    data.reply ||
    data.output ||
    data.text ||
    "Nao consegui responder agora. Tente novamente em instantes."
  );
};

const chatWidget = document.querySelector("[data-chat-widget]");

if (chatWidget) {
  const chatToggle = chatWidget.querySelector("[data-chat-toggle]");
  const chatPanel = chatWidget.querySelector("[data-chat-panel]");
  const chatClose = chatWidget.querySelector("[data-chat-close]");
  const chatForm = chatWidget.querySelector("[data-chat-form]");
  const chatInput = chatWidget.querySelector("[data-chat-input]");
  const chatMessages = chatWidget.querySelector("[data-chat-messages]");

  const chatTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const setChatOpen = (isOpen) => {
    chatPanel?.classList.toggle("active", isOpen);
    chatPanel?.setAttribute("aria-hidden", String(!isOpen));
    chatToggle?.setAttribute("aria-expanded", String(isOpen));
    chatToggle?.setAttribute("aria-label", isOpen ? "Fechar chat" : "Abrir chat");

    if (isOpen) {
      window.setTimeout(() => {
        chatInput?.focus();
      }, 160);
    }
  };

  const appendChatMessage = (content, sender, label) => {
    if (!chatMessages) return;

    const message = document.createElement("article");
    const text = document.createElement("p");
    const meta = document.createElement("span");

    message.className = `chat-message ${sender === "user" ? "chat-message-user" : "chat-message-bot"}`;
    text.textContent = content;
    meta.textContent = label || chatTimeFormatter.format(new Date());

    message.append(text, meta);
    chatMessages.append(message);
    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: "smooth" });
  };

  const autoResizeChatInput = () => {
    if (!chatInput) return;
    chatInput.style.height = "auto";
    chatInput.style.height = `${Math.min(chatInput.scrollHeight, 124)}px`;
  };

  chatToggle?.addEventListener("click", () => {
    const nextState = chatToggle.getAttribute("aria-expanded") !== "true";
    setChatOpen(nextState);
  });

  chatClose?.addEventListener("click", () => {
    setChatOpen(false);
  });

  chatInput?.addEventListener("input", autoResizeChatInput);

  chatInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      chatForm?.requestSubmit();
    }
  });

  chatForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = chatInput?.value.trim();
    if (!message || !chatInput) return;

    appendChatMessage(message, "user");
    chatInput.value = "";
    autoResizeChatInput();

    const sendButton = chatForm.querySelector(".chat-send");
    sendButton?.setAttribute("disabled", "disabled");

    try {
      const reply = await sendMessageToN8n(message);
      appendChatMessage(reply, "bot");
    } catch {
      appendChatMessage(
        "Estou com instabilidade no momento. Se preferir, fale com a equipe pelo WhatsApp.",
        "bot"
      );
    } finally {
      sendButton?.removeAttribute("disabled");
    }
  });
}
