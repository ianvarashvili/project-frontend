const GAME_STATE = {
  gameId: "castle_g2_game4",
  island: "castle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};

let targetWeight = 0;
let currentWeight = 0;

const resetBtn = document.getElementById("btn-reset");
const feedbackMsg = document.getElementById("feedback-msg");
let inventory = { 1: 0, 5: 0, 10: 0, 20: 0 };

resetBtn.addEventListener("click", unloadTruck);

const svgTemplates = {
  1: `<svg class="placed-box" width="38" height="38" viewBox="0 0 50 45">
         <path d="M16 14 C10 25 7 41 25 41 C43 41 40 25 34 14 C31 9 19 9 16 14 Z" fill="#a78bfa" stroke="#272624" stroke-width="2"/>
         <path d="M16 14 C20 18 30 18 34 14 C32 10 18 10 16 14 Z" fill="#7c3aed" opacity="0.3"/>
         <ellipse cx="25" cy="13" rx="7" ry="2.5" fill="#f59e0b" stroke="#272624" stroke-width="1.5"/>
       </svg>`,
  5: `<svg class="placed-box" width="28" height="28" viewBox="0 0 40 40">
        <rect x="2" y="2" width="36" height="36" rx="6" fill="#e5cfa3" stroke="#272624" stroke-width="2"/>
        <rect x="2" y="30" width="36" height="8" rx="2" fill="#bfa573" opacity="0.4"/>
        <line x1="20" y1="2" x2="20" y2="38" stroke="#a67c52" stroke-width="3"/>
        <line x1="2" y1="20" x2="38" y2="20" stroke="#a67c52" stroke-width="1.5" stroke-dasharray="3,2"/>
      </svg>`,
  10: `<svg class="placed-box" width="38" height="32" viewBox="0 0 50 40">
        <path d="M17 8 V3 H33 V8" fill="none" stroke="#272624" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="3" y="8" width="44" height="29" rx="6" fill="#dd9668" stroke="#272624" stroke-width="2"/>
        <rect x="3" y="29" width="44" height="8" rx="2" fill="#bc7547" opacity="0.4"/>
        <circle cx="14" cy="14" r="2" fill="#272624"/>
        <circle cx="36" cy="14" r="2" fill="#272624"/>
        <rect x="6" y="18" width="6" height="19" fill="#bc7547" rx="1"/>
        <rect x="38" y="18" width="6" height="19" fill="#bc7547" rx="1"/>
      </svg>`,
  20: `<svg class="placed-box" width="48" height="42" viewBox="0 0 60 50">
         <rect x="3" y="3" width="54" height="44" rx="8" fill="#34d399" stroke="#272624" stroke-width="2"/>
         <rect x="3" y="35" width="54" height="12" rx="2" fill="#059669" opacity="0.3"/>
         <rect x="9" y="9" width="42" height="32" rx="4" fill="none" stroke="#059669" stroke-width="2" stroke-dasharray="4,4"/>
         <line x1="3" y1="3" x2="57" y2="47" stroke="#272624" stroke-width="1.5" opacity="0.7"/>
         <line x1="57" y1="3" x2="3" y2="47" stroke="#272624" stroke-width="1.5" opacity="0.7"/>
         <circle cx="30" cy="25" r="5" fill="#34d399" stroke="#272624" stroke-width="2"/>
       </svg>`,
};

function startRound() {
  feedbackMsg.style.color = "";
  if (feedbackMsg) {
    feedbackMsg.textContent =
      "დააჭირე საგნებს, რომელთა მოთავსებაც გინდა სატვირთოზე";
  }
  targetWeight = Math.floor(Math.random() * 91) + 10;
  currentWeight = 0;

  inventory[20] = Math.floor(targetWeight / 20) + 1;
  inventory[10] = Math.floor((targetWeight % 20) / 10) + 2;
  inventory[5] = 4;
  inventory[1] = 9;

  document.getElementById("target-weight").textContent = targetWeight;
  document.getElementById("truck-bed").innerHTML = "";

  for (let key in inventory) {
    const countEl = document.getElementById(`count-${key}`);
    if (countEl) {
      countEl.textContent = inventory[key];
      countEl.closest(".box-card").classList.remove("disabled");
    }
  }
}

function loadBox(value) {
  if (gameState.isFinished) return;

  if (inventory[value] > 0) {
    inventory[value]--;
    currentWeight += value;

    const bed = document.getElementById("truck-bed");
    bed.insertAdjacentHTML("beforeend", svgTemplates[value]);

    for (let key in inventory) {
      const countEl = document.getElementById(`count-${key}`);
      countEl.textContent = inventory[key];
      const cardEl = countEl.closest(".box-card");
      cardEl.classList.remove("disabled");
    }

    const countEl = document.getElementById(`count-${value}`);
    if (countEl) {
      countEl.textContent = inventory[value];
      if (inventory[value] <= 0) {
        countEl.closest(".box-card").classList.add("disabled");
      }
    }
  }
}

function checkAns() {
  if (gameState.isFinished) return;

  if (currentWeight === targetWeight) {
    onCorrect();
    showFeedback("სწორია!", true);
    document
      .querySelectorAll(".box-card")
      .forEach((card) => card.classList.add("disabled"));
    setTimeout(() => {
      hideFeedback();
      startRound();
    }, 2000);
  } else if (currentWeight > targetWeight) {
    showFeedback("ზედმეტი მოგივიდა! თავიდან სცადე... ", false);
  } else if (currentWeight < targetWeight) {
    showFeedback("ცოტა დაგაკლდა! თავიდან სცადე...", false);
  }
}

function unloadTruck() {
  if (gameState.isFinished) return;
  document.getElementById("truck-bed").innerHTML = "";
  feedbackMsg.style.color = ""; 
  feedbackMsg.textContent = `დააჭირე საგნებს, რომელთა მოთავსებაც გინდა სატვირთოზე`;

  currentWeight = 0;

  inventory[20] = Math.floor(targetWeight / 20) + 1;
  inventory[10] = Math.floor((targetWeight % 20) / 10) + 2;
  inventory[5] = 4;
  inventory[1] = 9;

  for (let key in inventory) {
    const countEl = document.getElementById(`count-${key}`);
    if (countEl) {
      countEl.textContent = inventory[key];
      const cardEl = countEl.closest(".box-card");
      if (cardEl) cardEl.classList.remove("disabled");
    }
  }
}

document.querySelectorAll(".box-card").forEach((card) => {
  card.addEventListener("click", () => {
    const value = parseInt(card.getAttribute("data-value"));
    loadBox(value);
  });
});
