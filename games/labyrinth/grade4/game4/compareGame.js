const GAME_STATE = {
  gameId: "labyrinth_g4_game4",
  island: "labyrinth",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 4,
  timeLimitSeconds: 30,
};
const gameCont = document.getElementById("game-cont");
const feedbackMsg = document.getElementById("feedback-msg");

let correctSign = "";
let lastRoundMode = null;

function generateFraction(numerator, denominator) {
  let blocksHtml = "";
  for (let i = 0; i < denominator; i++) {
    const isFilled = i < numerator ? "filled" : "";
    blocksHtml += `<div class="fraction-block ${isFilled}"></div>`;
  }
  return blocksHtml;
}

function startRound() {
  feedbackMsg.style.color = "";
  gameState.isFinished = false;
  feedbackMsg.textContent = "გაიხსენე წილადების შედარება";
  gameCont.innerHTML = "";

  let isOpMode;
  do {
    isOpMode = Math.random() > 0.5;
  } while (isOpMode === lastRoundMode);

  lastRoundMode = isOpMode;

  if (!isOpMode) {
    const denominators = [2, 3, 4, 6, 8];

    let denom1 = denominators[Math.floor(Math.random() * denominators.length)];
    let numer1 = Math.floor(Math.random() * (denom1 - 1)) + 1;

    let denom2 = denominators[Math.floor(Math.random() * denominators.length)];
    let numer2 = Math.floor(Math.random() * (denom2 - 1)) + 1;

    if (Math.random() < 0.25) {
      denom2 = denom1;
      numer2 = numer1;
    }

    const val1 = numer1 / denom1;
    const val2 = numer2 / denom2;

    if (Math.abs(val1 - val2) < 0.001) correctSign = "=";
    else if (val1 > val2) correctSign = ">";
    else correctSign = "<";

    gameCont.innerHTML = `
    <div class="fraction-card">${generateFraction(numer1, denom1)}</div>
    <div class="sign-slot" id="target-slot">?</div>
    <div class="fraction-card">${generateFraction(numer2, denom2)}</div>
    `;
  } else {
    const sharedDenom = Math.floor(Math.random() * 4) + 5;

    const leftPlus = Math.random() > 0.5;
    let leftNumer1, leftNumer2, leftFinal;
    if (leftPlus) {
      leftNumer1 = Math.floor(Math.random() * (sharedDenom - 2) + 1);
      leftNumer2 =
        Math.floor(Math.random() * (sharedDenom - leftNumer1 - 1)) + 1;
      leftFinal = leftNumer1 + leftNumer2;
    } else {
      leftNumer1 = Math.floor(Math.random() * (sharedDenom - 2)) + 2;
      leftNumer2 = Math.floor(Math.random() * (leftNumer1 - 1)) + 1;
      leftFinal = leftNumer1 - leftNumer2;
    }

    const rightPlus = Math.random() > 0.5;
    let rightNumer1, rightNumer2, rightFinal;
    if (rightPlus) {
      rightNumer1 = Math.floor(Math.random() * (sharedDenom - 2) + 1);
      rightNumer2 =
        Math.floor(Math.random() * (sharedDenom - rightNumer1 - 1)) + 1;
      rightFinal = rightNumer1 + rightNumer2;
    } else {
      rightNumer1 = Math.floor(Math.random() * (sharedDenom - 2)) + 2;
      rightNumer2 = Math.floor(Math.random() * (rightNumer1 - 1)) + 1;
      rightFinal = rightNumer1 - rightNumer2;
    }
    if (leftFinal === rightFinal) correctSign = "=";
    else if (leftFinal > rightFinal) correctSign = ">";
    else correctSign = "<";

    gameCont.innerHTML = `
    <div class="operation-group">
        <div class="fraction-card">${generateFraction(leftNumer1, sharedDenom)}</div>
        <div class="work-sign">${leftPlus ? "+" : "-"}</div>
        <div class="fraction-card">${generateFraction(leftNumer2, sharedDenom)}</div>
    </div>

    <div class="sign-slot" id="target-slot">?</div>

    <div class="operation-group">
        <div class="fraction-card">${generateFraction(rightNumer1, sharedDenom)}</div>
        <div class="work-sign">${rightPlus ? "+" : "-"}</div>
        <div class="fraction-card">${generateFraction(rightNumer2, sharedDenom)}</div>
    </div>
    `;
  }
}

function checkAns(selectedSign) {
  if (gameState.isFinished) return;
  const slot = document.getElementById("target-slot");

  if (selectedSign === correctSign) {
    onCorrect();
    gameState.isFinished = true;
    slot.textContent = correctSign;
    slot.classList.add("active-sign");
    showFeedback("ყოჩაღ! სწორად გამოიცანი!", true);

    setTimeout(() => {
      startRound();
    }, 2000);
  } else {
    showFeedback("რაღაც შეცდომაა... კარგად დაფიქრდი!", false);
  }
}
