const benefits = [
  {
    title: "1 year of Mobile on us",
    iconSrc: "./assets/mobile.png",
  },
  {
    title: "WiFi equipment & unlimited data",
    iconSrc: "./assets/wifi.png",
  },
  {
    title: "5-Year Price Guarantee",
    iconSrc: "./assets/price-guarantee.png",
  },
  {
    title: "Simple 15-min self-install",
    iconSrc: "./assets/self-install.png",
  },
  {
    title: "No contracts or commitments",
    iconSrc: "./assets/no-contracts.png",
  },
  {
    title: "24/7 support with the Xfinity app",
    iconSrc: "./assets/support.png",
    compactText: true,
  },
];

const stage = document.querySelector(".benefits-stage");
const toggle = document.querySelector(".carousel-control");
const arrows = document.querySelectorAll(".carousel-arrow");
const form = document.querySelector(".address-form");
const slideDuration = 560;
let activeIndex = 1;
let isPaused = false;
let isAnimating = false;
let intervalId;

function normalizeIndex(index) {
  return (index + benefits.length) % benefits.length;
}

function getBenefit(offset, baseIndex = activeIndex) {
  const index = normalizeIndex(baseIndex + offset);
  return benefits[index];
}

function renderCard(card, benefit) {
  card.innerHTML = `
    <div class="benefit-icon"><img src="${benefit.iconSrc}" alt="" aria-hidden="true" /></div>
    <h2 class="${benefit.compactText ? "compact-label" : ""}">${benefit.title}</h2>
  `;
}

function setCardPosition(card, position) {
  card.dataset.position = position;
  card.classList.toggle("featured", position === "active");
  card.classList.toggle("side", position !== "active");
}

function createCard(position, benefit) {
  const card = document.createElement("article");
  card.className = "benefit-card";
  setCardPosition(card, position);
  renderCard(card, benefit);
  return card;
}

function renderBenefits() {
  stage.replaceChildren(
    createCard("previous", getBenefit(-1)),
    createCard("active", getBenefit(0)),
    createCard("next", getBenefit(1)),
  );
}

function moveCarousel(direction) {
  if (isAnimating) {
    return;
  }

  isAnimating = true;
  arrows.forEach((arrow) => {
    arrow.disabled = true;
  });

  const previousCard = stage.querySelector('[data-position="previous"]');
  const activeCard = stage.querySelector('[data-position="active"]');
  const nextCard = stage.querySelector('[data-position="next"]');
  const incomingPosition = direction > 0 ? "off-right" : "off-left";
  const incomingOffset = direction > 0 ? 2 : -2;
  const incomingCard = createCard(incomingPosition, getBenefit(incomingOffset));
  stage.append(incomingCard);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (direction > 0) {
        setCardPosition(previousCard, "off-left");
        setCardPosition(activeCard, "previous");
        setCardPosition(nextCard, "active");
        setCardPosition(incomingCard, "next");
      } else {
        setCardPosition(incomingCard, "previous");
        setCardPosition(previousCard, "active");
        setCardPosition(activeCard, "next");
        setCardPosition(nextCard, "off-right");
      }
    });
  });

  window.setTimeout(() => {
    activeIndex = normalizeIndex(activeIndex + direction);
    renderBenefits();
    isAnimating = false;
    updateControls();
  }, slideDuration);
}

function startCarousel() {
  stopCarousel();
  intervalId = window.setInterval(() => moveCarousel(1), 3600);
}

function stopCarousel() {
  window.clearInterval(intervalId);
  intervalId = undefined;
}

function updateControls() {
  toggle.classList.toggle("is-paused", isPaused);
  toggle.setAttribute("aria-pressed", String(isPaused));
  toggle.setAttribute("aria-label", isPaused ? "Play benefit carousel" : "Pause benefit carousel");

  arrows.forEach((arrow) => {
    arrow.disabled = !isPaused || isAnimating;
  });
}

toggle.addEventListener("click", () => {
  isPaused = !isPaused;
  updateControls();

  if (isPaused) {
    stopCarousel();
  } else {
    startCarousel();
  }
});

arrows.forEach((arrow) => {
  arrow.addEventListener("click", () => {
    if (!isPaused) {
      return;
    }

    moveCarousel(arrow.dataset.direction === "previous" ? -1 : 1);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
});

renderBenefits();
updateControls();
startCarousel();
