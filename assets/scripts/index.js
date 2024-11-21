const prizes = [
  {
    title: "Підписка на місяць безкоштовно",
    color: "#1F1F1F",
    i18nKey: "spinner.spins.subscribe",
  },
  {
    title: "Проксі в подарунок",
    color: "#6732D9",
    i18nKey: "spinner.spins.proxy",
  },
  {
    title: "Інтерв'ю з Вусатим",
    color: "#1F1F1F",
    i18nKey: "spinner.spins.interview",
  },
  {
    title: "Знижка 15% на розхідники",
    color: "#6732D9",
    i18nKey: "spinner.spins.sale",
  },
  {
    title: "1 крео в подарунок",
    color: "#1F1F1F",
    i18nKey: "spinner.spins.creo",
  },
  {
    title: "Доступ до приватного чату",
    color: "#6732D9",
    i18nKey: "spinner.spins.chat",
  },
  {
    title: "+1 зідзвон з наставником",
    color: "#1F1F1F",
    i18nKey: "spinner.spins.call",
  },
  {
    title: "Акаунт 7-денного фарму в подарунок",
    color: "#6732D9",
    i18nKey: "spinner.spins.account",
  },
];

/**
 * From: https://thecode.media/fortune/
 */
const wheel = document.querySelector(".deal-wheel");
const spinner = wheel.querySelector(".spinner");
const trigger = wheel.querySelector(".btn-spin");
const ticker = wheel.querySelector(".ticker");

const prizeSlice = 360 / prizes.length;
const prizeOffset = Math.floor(180 / prizes.length);
const spinClass = "is-spinning";
const selectedClass = "selected";
const spinnerStyles = window.getComputedStyle(spinner);

let tickerAnim;
let rotation = 0;
let currentSlice = 0;
let prizeNodes;

const createPrizeNodes = () => {
  prizes.forEach(({ title, color, i18nKey, reaction }, i) => {
    const rotation = prizeSlice * i * -1 - prizeOffset;
    spinner.insertAdjacentHTML(
      "beforeend",
      `<li class="prize" data-reaction=${reaction} style="--rotate: ${rotation}deg">
        <span class="text" data-i18n="${i18nKey}">${title}</span>
      </li>`
    );
  });
};

const createConicGradient = () => {
  spinner.setAttribute(
    "style",
    `background: conic-gradient(
      from 0deg,
      ${prizes.map(({ color }, i) => `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`).reverse()}
    );`
  );
};

const setupWheel = () => {
  createConicGradient();
  createPrizeNodes();
  prizeNodes = wheel.querySelectorAll(".prize");
};

setupWheel();

const spinertia = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const runTickerAnimation = () => {
  const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];
  let rad = Math.atan2(b, a);

  if (rad < 0) {
    rad += 2 * Math.PI;
  }

  const angle = Math.round(rad * (180 / Math.PI));
  const slice = Math.floor(angle / prizeSlice);

  if (currentSlice !== slice) {
    currentSlice = slice;
  }
};

const selectPrize = () => {
  const selected = Math.floor(Math.abs(rotation + 270) / prizeSlice) % prizes.length;
  prizeNodes[selected].classList.add(selectedClass);
};

trigger.addEventListener("click", () => {
  trigger.disabled = true;
  // For random sector win
  // rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));
  // For current sector win (8 - sector)
  rotation = prizes.length * 360 + (8 - 1) * prizeSlice + Math.floor(Math.random() * 10);
  prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
  wheel.classList.add(spinClass);
  spinner.style.setProperty("--rotate", rotation);
  runTickerAnimation();
});

spinner.addEventListener("transitionend", () => {
  cancelAnimationFrame(tickerAnim);
  rotation %= 360;

  selectPrize();

  wheel.classList.remove(spinClass);
  spinner.style.setProperty("--rotate", rotation);
  trigger.disabled = false;
});

// Menu

const menuModal = document.getElementById("menu");
const openModalBtn = document.getElementById("menu-open");
const closeModal = document.getElementById("menu-close");
const links = document.querySelectorAll(".menu__link");

links.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

openModalBtn.addEventListener("click", () => {
  menuModal.classList.add("header__menu--active");
  openModalBtn.style.display = "none";
  document.body.style.overflow = "hidden";
});

closeModal.addEventListener("click", () => {
  closeMenu();
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeMenu();
  }
});

function closeMenu() {
  menuModal.classList.remove("header__menu--active");
  openModalBtn.style.display = "flex";
  document.body.style.overflow = "";
}

// Expanded panels

const panels = document.querySelectorAll(".expanded");

panels.forEach((panel) => {
  const header = panel.querySelector(".expanded__header");
  const content = panel.querySelector(".expanded__content");
  const icon = header.querySelector("i");

  header.addEventListener("click", function () {
    content.classList.toggle("expanded__content--opening");
    icon.classList.toggle("expanded__icon--opening");

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

const languageMenuButton = document.getElementById("languageMenuButton");
const languageMenu = document.getElementById("languageMenu");

languageMenuButton.addEventListener("click", function () {
  languageMenu.classList.toggle("drop-menu--active");
});

languageMenu.addEventListener("click", function () {
  languageMenu.classList.toggle("drop-menu--active");
});
