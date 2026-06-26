const GAME_STATE = {
  gameId: "castle_g4_game3",
  island: "castle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};
let currentQuest = null;
let basketCount = 0;
let plateCount = 0;
let targetAnswer = 0;

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
  const denominator = getRandNum(2, 5);
  const multiplier = getRandNum(2, 4);
  const total = denominator * multiplier;
  const color = fruitColors[Math.floor(Math.random() * fruitColors.length)];
  return { total, denominator, color };
}

function startRound() {
  feedbackMsg.style.color = "";
  currentQuest = genRandQuest();
  targetAnswer = currentQuest.total / currentQuest.denominator;
  questTxt.innerHTML = `მეგობარს უნდა შენს კალათაში არსებული ${currentQuest.total} ხილიდან <div class="fraction"><span class="num">1</span> <span class="den">${currentQuest.denominator}</span></div> ნაწილი.`;
  feedbackMsg.textContent = `დააწკაპუნე ვაშლს მეგობრის თეფშზე გადასატანად ან კალათაში დასაბრუნებლად`;

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
  if (plateCount === targetAnswer) {
    onCorrect();
    showFeedback(
      `სწორია! ${currentQuest.total}-ის 1/${currentQuest.denominator} = ${targetAnswer}!`,
      true,
    );

    setTimeout(() => {
      hideFeedback();
      startRound();
    }, 2200);
  } else {
    showFeedback(`რაღაც შეცდომაა... თავიდან გადათვალე!`, false);
  }
}
