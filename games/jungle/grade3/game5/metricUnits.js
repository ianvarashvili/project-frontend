const GAME_STATE = {
  gameId: "jungle_g3_game5",
  island: "jungle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 3,
  timeLimitSeconds: 30,
};
let sourceVal = 0;
let sourceUnit = "";
let targetUnit = "";
let targetVal = 0;
let currVal = 0;

const balloon = document.getElementById("balloon");
const promptLabel = document.getElementById("prompt-label");
const currSizeLabel = document.getElementById("current-size-label");
const currUnitLabel = document.getElementById("current-unit-label");
const feedbackMsg = document.getElementById("feedback-msg");

const units = { მმ: 1, სმ: 10, დმ: 100 };
const unitKeys = ["მმ", "სმ", "დმ"];

function startRound() {
  feedbackMsg.style.color = "";
  currVal = 0;
  balloon.classList.remove("pop", "dance");
  updateBalloonSize();
  hideFeedback();

  let randVal = Math.floor(Math.random() * 3);
  let targVal = Math.floor(Math.random() * 3);
  while (randVal === targVal) {
    targVal = Math.floor(Math.random() * 3);
  }

  sourceUnit = unitKeys[randVal];
  targetUnit = unitKeys[targVal];

  const baseNumbers = [1, 2, 3, 4, 5, 6];
  const base = baseNumbers[Math.floor(Math.random() * baseNumbers.length)];
  const totalValMm = base * units[sourceUnit] * units[targetUnit];

  sourceVal = totalValMm / units[sourceUnit];
  targetVal = totalValMm / units[targetUnit];

  promptLabel.innerHTML = `ბუშტის სიმაღლე უნდა იყოს ${sourceVal} ${sourceUnit} შეგიძლია ${targetUnit}-ში გამოთვალო?`;

  currUnitLabel.textContent = targetUnit;
  currSizeLabel.textContent = currVal;
}

function pumpBalloon() {
  if (gameState.isFinished) return;
  let step = targetVal > 100 ? 50 : targetVal > 30 ? 20 : 1;
  currVal += step;
  currSizeLabel.textContent = currVal;

  updateBalloonSize();
}

function deflateBalloon() {
  if (gameState.isFinished) return;
  if (currVal === 0) return;
  let step = targetVal > 100 ? 50 : targetVal > 30 ? 20 : 1;
  currVal -= step;
  if (currVal < 0) {
    currVal = 0;
  }
  currSizeLabel.textContent = currVal;
  updateBalloonSize();
}

function updateBalloonSize() {
  let percentage = targetVal > 0 ? currVal / targetVal : 0;
  if (percentage > 1.6) percentage = 1.6;

  let newSize = 100 + percentage * 80;
  balloon.style.width = newSize + "px";
  balloon.style.height = newSize + "px";
}

function checkAns() {
  if (gameState.isFinished || currVal === 0) return;
  if (currVal === targetVal) {
    onCorrect();
    showFeedback("ყოჩაღ! სწორად გამოიცანი!", true);

    setTimeout(() => {
      startRound();
    }, 2000);
  } else {
    showFeedback("რაღაც შეცდომაა... თავიდან სცადე!", false);
    setTimeout(() => {
      updateBalloonSize();
    }, 2000);
  }
}
