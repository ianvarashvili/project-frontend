const GAME_STATE = {
  gameId: "labyrinth_g1_game4",
  island: "labyrinth",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 45,
};
const feedbackMsg = document.getElementById("feedback-msg");
const gameInstruction = document.getElementById("game-instruction");
const toyTitle = document.getElementById("toy-title");
const toyPrice = document.getElementById("toy-price");
const toyVisCont = document.getElementById("toy-visual-container");
const userTotal = document.getElementById("user-total");

const toysDatabase = [
  {
    name: "სათამაშო ბზრიალა",
    minPrice: 5,
    maxPrice: 20,
    svg: `<svg class="toy-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 15 L50 5" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"/>
                <path d="M25 40 C25 20, 75 20, 75 40 C75 65, 50 85, 50 85 C50 85, 25 65, 25 40 Z" fill="#4a90e2" stroke="#1a1a1a" stroke-width="4"/>
                <ellipse cx="50" cy="40" rx="25" ry="8" fill="#357abd" opacity="0.5"/>
                <line x1="25" y1="40" x2="75" y2="40" stroke="#1a1a1a" stroke-width="3"/>
              </svg>`,
  },
  {
    name: "სათამაშო დათუნია",
    minPrice: 5,
    maxPrice: 20,
    svg: `<svg class="toy-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="35" r="12" fill="#e29b6a" stroke="#1a1a1a" stroke-width="4"/>
                <circle cx="70" cy="35" r="12" fill="#e29b6a" stroke="#1a1a1a" stroke-width="4"/>
                <circle cx="50" cy="55" r="28" fill="#f0ad7d" stroke="#1a1a1a" stroke-width="4"/>
                <circle cx="50" cy="45" r="20" fill="#f0ad7d" stroke="#1a1a1a" stroke-width="4"/>
                <circle cx="43" cy="42" r="3" fill="#1a1a1a"/>
                <circle cx="57" cy="42" r="3" fill="#1a1a1a"/>
                <ellipse cx="50" cy="50" rx="6" ry="4" fill="#d38453"/>
              </svg>`,
  },
  {
    name: "ბურთი",
    minPrice: 5,
    maxPrice: 20,
    svg: `<svg class="toy-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="35" fill="#ffcc00" stroke="#1a1a1a" stroke-width="4"/>
                <path d="M25 25 C40 40, 40 60, 25 75" fill="none" stroke="#1a1a1a" stroke-width="4"/>
                <path d="M75 25 C60 40, 60 60, 75 75" fill="none" stroke="#1a1a1a" stroke-width="4"/>
              </svg>`,
  },
  {
    name: "სათამაშო მანქანა",
    minPrice: 5,
    maxPrice: 20,
    svg: `<svg class="toy-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 60 L25 40 L65 40 L80 55 L85 60 Z" fill="#e74c3c" stroke="#1a1a1a" stroke-width="4"/>
                <rect x="10" y="55" width="75" height="15" rx="5" fill="#e74c3c" stroke="#1a1a1a" stroke-width="4"/>
                <circle cx="28" cy="70" r="10" fill="#fff" stroke="#1a1a1a" stroke-width="4"/>
                <circle cx="68" cy="70" r="10" fill="#fff" stroke="#1a1a1a" stroke-width="4"/>
              </svg>`,
  },
];

let targetPrice = 0;
let currentPaidTotal = 0;
let lastToyName = null;
let lastToyPrice = null;

function startRound() {
  gameState.isFinished = false;
  currentPaidTotal = 0;
  userTotal.innerText = currentPaidTotal;

  feedbackMsg.style.color = "";
  feedbackMsg.innerHTML = "დააჭირე შენს საფულეში ფულს გადასახდელად";

  let activeToy;
  do {
    activeToy = toysDatabase[Math.floor(Math.random() * toysDatabase.length)];
    targetPrice =
      Math.floor(
        Math.random() * (activeToy.maxPrice - activeToy.minPrice + 1),
      ) + activeToy.minPrice;
  } while (activeToy.name === lastToyName || targetPrice === lastToyPrice);

  lastToyName = activeToy.name;
  lastToyPrice = targetPrice;

  toyTitle.innerText = activeToy.name;
  toyPrice.innerText = `${targetPrice} ლარი`;
  toyVisCont.innerHTML = activeToy.svg;
}

function addMoney(amount) {
  if (gameState.isFinished) return;
  currentPaidTotal += amount;
  userTotal.innerText = currentPaidTotal;
}
function resetCurrAmount() {
  if (gameState.isFinished) return;
  currentPaidTotal = 0;
  userTotal.innerText = currentPaidTotal;

  feedbackMsg.textContent = "დააჭირე შენს საფულეში ფულს გადასახდელად";
}
function checkAns() {
  if (gameState.isFinished) return;

  if (currentPaidTotal === targetPrice) {
    gameState.isFinished = true;
    onCorrect();
    showFeedback("ყოჩაღ! შენ იყიდე სათამაშო!", true);
    setTimeout(() => {
      startRound();
    }, 2000);
  } else if (currentPaidTotal > targetPrice) {
    showFeedback("ზედმეტი მოგივიდა", false);
  } else {
    showFeedback("ცოტა დაგაკლდა!", false);
  }
}
