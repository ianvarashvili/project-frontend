const GAME_STATE = {
  gameId: "castle_g4_game4",
  island: "castle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};
const pencilPalettes = [
  { main: "#e74c3c", light: "#ff6b6b", dark: "#c0392b" },
  { main: "#3498db", light: "#5dadec", dark: "#2980b9" },
  { main: "#2ecc71", light: "#58d68d", dark: "#27ae60" },
  { main: "#f1c40f", light: "#f5b041", dark: "#d4ac0d" },
  { main: "#9b59b6", light: "#af7ac5", dark: "#8e44ad" },
];

let draggedEl = null;

const pool = document.getElementById("shapes-pool");
const feedbackMsg = document.getElementById("feedback-msg");
const checkBtn = document.getElementById("check-btn");

function generateExp() {
  const list = [];

  while (list.length < 4) {
    let divisor = Math.floor(Math.random() * 7) + 3;
    let quotient = Math.floor(Math.random() * 8) + 2;

    let isExact = Math.random() < 0.5;

    let dividend;
    let type;

    if (isExact) {
      dividend = divisor * quotient;
      type = "exact";
    } else {
      let remainder = Math.floor(Math.random() * (divisor - 1)) + 1;
      dividend = divisor * quotient + remainder;
      type = "remainder";
    }
    let expr = `${dividend} : ${divisor}`;

    if (!list.some((el) => el.text === expr)) {
      list.push({ text: expr, type: type });
    }
  }
  return list;
}

function createPencilSVG(text, p) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 50">
          <path d="M 20,5 L 135,5 L 135,45 L 20,45 Z" fill="none" stroke="%23272624" stroke-width="2" />
          <rect x="20" y="5" width="115" height="13" fill="${p.light}" />
          <rect x="20" y="18" width="115" height="14" fill="${p.main}" />
          <rect x="20" y="32" width="115" height="13" fill="${p.dark}" />
          <polygon points="20,5 0,25 20,45" fill="#e4b382" stroke="%23272624" stroke-width="2" />
          <polygon points="5,19 0,25 5,31" fill="${p.dark}" />
          <rect x="135" y="5" width="6" height="40" fill="#95a5a6" stroke="%23272624" stroke-width="2" />
          <path d="M 141,5 L 146,5 Q 150,5 150,12 L 150,38 Q 150,45 146,45 L 141,45 Z" fill="#ffafbd" stroke="%23272624" stroke-width="2" />
          <line x1="20" y1="5" x2="135" y2="5" stroke="%23272624" stroke-width="1" />
          <line x1="20" y1="45" x2="135" y2="45" stroke="%23272624" stroke-width="1" />
          <text x="80" y="33" font-weight="bold" text-anchor="middle" fill="white">${text}</text>
        </svg>`;
}

function startRound() {
  gameState.isFinished = false;
  feedbackMsg.style.color = "";
  document
    .querySelectorAll(".box .box-content")
    .forEach((el) => (el.innerHTML = ""));

  const roundData = generateExp();
  pool.innerHTML = "";
  feedbackMsg.style.color = "var(--color-text)";
  feedbackMsg.textContent = "ჩაალაგე გამოსახულებები შესაბამის ყუთებში!";

  roundData.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "shape-card";
    card.id = `pencil-${index}`;
    card.draggable = true;
    card.dataset.type = item.type;
    card.textContent = item.text;

    const currentPalette = pencilPalettes[index];
    card.innerHTML = createPencilSVG(item.text, currentPalette);

    card.addEventListener("dragstart", (e) => {
      draggedEl = card;
      e.dataTransfer.setData("text/plain", card.id);
    });

    pool.appendChild(card);
  });
}

document.querySelectorAll(".box").forEach((box) => {
  box.addEventListener("dragover", (e) => e.preventDefault());
  box.addEventListener("dragenter", () => box.classList.add("hover"));
  box.addEventListener("dragleave", () => box.classList.remove("hover"));

  box.addEventListener("drop", (e) => {
    box.classList.remove("hover");

    if (draggedEl) {
      box.querySelector(".box-content").appendChild(draggedEl);

      draggedEl = null;
    }
  });
  box.addEventListener("click", (e) => {
    const card = e.target.closest(".shape-card");

    if (card) {
      pool.appendChild(card);
    }
  });
});

function checkAns() {
  if (gameState.isFinished) return;
  if (pool.querySelectorAll(".shape-card").length > 0) {
    showFeedback("ჯერ ყველა ფანქარი გადაანაწილე!", false);
    return;
  }
  let allCorrect = true;
  const boxes = document.querySelectorAll(".box");

  boxes.forEach((box) => {
    const targetType = box.dataset.type;
    const itemInside = box.querySelectorAll(".shape-card");

    itemInside.forEach((item) => {
      if (item.dataset.type != targetType) {
        allCorrect = false;
      }
    });
  });

  if (allCorrect) {
    gameState.isFinished = true;
    onCorrect();
    showFeedback("ყოჩაღ, სწორია!", true);
    setTimeout(() => {
      startRound();
    }, 2000);
  } else {
    showFeedback("შეცდომაა... თავიდან სცადე", false);
  }
}
