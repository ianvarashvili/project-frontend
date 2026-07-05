const GAME_STATE = {
  gameId: "castle_g1_game1",
  island: "castle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};

let currentQuest = null;
let basketCount = 0;
let plateCount = 0;
let targetAnswer = 0;
let lastQuest = null;

const basketGrid = document.getElementById("basket-fruits");
const plateGrid = document.getElementById("plate-fruits");
const countBasketSpan = document.getElementById("count-basket");
const countPlateSpan = document.getElementById("count-plate");
const questTxt = document.getElementById("quest-txt");
const feedbackMsg = document.getElementById("feedback-msg");
const fruitColors = ["#4CAF50", "#D32F2F", "#F1C40F"];

function getRandNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function genRandQuest() {
  let total, leftInBasket, color;
  do {
    total = getRandNum(5, 15);
    leftInBasket = getRandNum(1, total - 1);
    color = fruitColors[Math.floor(Math.random() * fruitColors.length)];
  } while (
    lastQuest &&
    lastQuest.total === total &&
    lastQuest.leftInBasket === leftInBasket
  );

  return { total, leftInBasket, color };
}

function startRound() {
  gameState.isFinished = false;
  if (feedbackMsg) {
    feedbackMsg.innerText =
      "დააწკაპუნე ვაშლს მეგობრის თეფშზე გადასატანად ან კალათაში დასაბრუნებლად";
    feedbackMsg.style.color = "";
    feedbackMsg.style.display = "block";
  }
  lastQuest = currentQuest;
  currentQuest = genRandQuest();
  targetAnswer = currentQuest.total - currentQuest.leftInBasket;
  questTxt.innerHTML = `მიეცი მეგობარს კალათიდან იმდენი ვაშლი, რომ კალათაში დარჩეს <span class='num orange-txt'>${currentQuest.leftInBasket}</span> ცალი.`;

  basketGrid.innerHTML = "";
  plateGrid.innerHTML = "";
  basketCount = currentQuest.total;
  plateCount = 0;
  updateCounters();

  for (let i = 0; i < currentQuest.total; i++) {
    const fruitDiv = document.createElement("div");
    fruitDiv.className = "fruit";
    fruitDiv.style.backgroundColor = currentQuest.color;
    fruitDiv.onclick = () => moveFruit(fruitDiv, "toPlate");
    basketGrid.appendChild(fruitDiv);
  }
}

function moveFruit(fruitEl, dir) {
  if (gameState.isFinished) return;
  if (dir === "toPlate") {
    plateGrid.appendChild(fruitEl);
    basketCount--;
    plateCount++;
    fruitEl.onclick = () => moveFruit(fruitEl, "toBasket");
  } else {
    basketGrid.appendChild(fruitEl);
    basketCount++;
    plateCount--;
    fruitEl.onclick = () => moveFruit(fruitEl, "toPlate");
  }
  updateCounters();
}
function updateCounters() {
  countBasketSpan.textContent = "";
  countPlateSpan.textContent = "";
}

function checkAns() {
  if (gameState.isFinished) return;
  if (basketCount === currentQuest.leftInBasket) {
    gameState.isFinished = true;
    onCorrect();
    showFeedback("ყოჩაღ! სწორია! ", true);

    setTimeout(() => {
      hideFeedback();
      startRound();
    }, 2000);
  } else {
    showFeedback("რაღაც შეცდომაა... თავიდან გადათვალე", false);
  }
}
