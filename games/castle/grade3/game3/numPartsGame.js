const GAME_STATE = {
  gameId: "castle_g3_game3",
  island: "castle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};

let targetWeight = 0;
let currentWeight = 0;
let lastWeight = null;

const resetBtn = document.getElementById("btn-reset");
const feedbackMsg = document.getElementById("feedback-msg");
let inventory = { 1: 0, 5: 0, 10: 0, 20: 0 };

resetBtn.addEventListener("click", unloadTruck);
const svgTemplates = {
  1: `<svg class="placed-box" width="38" height="38" viewBox="0 0 50 45">
  <use href="../../../../assets/game_assets.svg#icon-package"></use>
      </svg>`,

  5: `<svg class="placed-box" width="28" height="28" viewBox="0 0 40 40">
        <use href="../../../../assets/game_assets.svg#icon-sack"></use>
      </svg>`,

  10: `<svg class="placed-box" width="38" height="32" viewBox="0 0 50 40">
        <use href="../../../../assets/game_assets.svg#icon-suitcase"></use>
      </svg>`,

  20: `<svg class="placed-box" width="48" height="42" viewBox="0 0 60 50">
        <use href="../../../../assets/game_assets.svg#icon-big-box"></use>
      </svg>`,
};

function startRound() {
  gameState.isFinished = false;
  feedbackMsg.style.color = "";
  if (feedbackMsg) {
    feedbackMsg.textContent =
      "დააჭირე საგნებს, რომელთა მოთავსებაც გინდა სატვირთოზე";
  }

  do {
    targetWeight = Math.floor(Math.random() * 91) + 10;
  } while (lastWeight !== null && targetWeight === lastWeight);

  lastWeight = currentWeight;
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

    checkGameStatus();
  }
}

function checkAns() {
  if (gameState.isFinished) return;

  if (currentWeight === targetWeight) {
    gameState.isFinished = true;
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
