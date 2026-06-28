const GAME_STATE = {
  gameId: "castle_g4_game1",
  island: "castle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};

let BeeSelected = false;
let correctAns = 0;
let isMoving = false;

const beeEl = document.getElementById("bee");
const expResult = document.getElementById("result-board");
const feedbackMsg = document.getElementById("feedback-msg");

function startRound() {
  if (feedbackMsg) {
    feedbackMsg.innerHTML = `დააჭირე <span class="orange-txt">ფუტკარს</span>, შემდეგ კი <span class="orange-txt">ყვავილს</span>, რომელიც მიიღება <span class="orange-txt">გამოსახულების</span> შედეგად`;
    feedbackMsg.style.color = "";
    feedbackMsg.style.display = "block";
  }

  BeeSelected = false;
  isMoving = false;

  beeEl.classList.remove("selected");
  beeEl.style.left = "30px";
  beeEl.style.top = "190px";
  beeEl.style.transform = "scale(1)";

  const flowers = document.querySelectorAll(".flower");
  flowers.forEach((f) => f.classList.remove("wrong"));

  const isMult = Math.random() > 0.5;
  let num1, num2, displayTxt;

  if (isMult) {
    num1 = Math.floor(Math.random() * 12) + 1;
    num2 = Math.floor(Math.random() * 8) + 1;
    correctAns = num1 * num2;
    displayTxt = `${num1} ⋅ ${num2}`;
  } else {
    correctAns = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;
    num1 = correctAns * num2;
    displayTxt = `${num1} ÷ ${num2}`;
  }

  expResult.textContent = displayTxt;

  let wrongAns1 = correctAns + (Math.random() > 0.5 ? 1 : -1);
  if (wrongAns1 === correctAns || wrongAns1 < 1) wrongAns1 = correctAns + 2;

  let wrongAns2 = correctAns + (Math.random() > 0.5 ? 2 : -2);
  if (wrongAns2 === correctAns || wrongAns2 < 1) wrongAns2 = correctAns + 3;

  const answers = [correctAns, wrongAns1, wrongAns2].sort(
    () => Math.random() - 0.5,
  );

  for (let i = 0; i < 3; i++) {
    document.getElementById(`ans-${i}`).textContent = answers[i];
    document.getElementById(`flower-${i}`).dataset.value = answers[i];
  }
}

function toggleBee() {
  if (gameState.isFinished || isMoving) return;

  BeeSelected = !BeeSelected;

  if (BeeSelected) {
    beeEl.classList.add("selected");
  } else {
    beeEl.classList.remove("selected");
  }
}

function selectFlower(index, flowerEl) {
  if (gameState.isFinished || !BeeSelected || isMoving) return;

  const chosenVal = parseInt(flowerEl.dataset.value);

  if (chosenVal === correctAns) {
    isMoving = true;
    const flowerRect = flowerEl.getBoundingClientRect();
    const fieldRect = document
      .querySelector(".games-container")
      .getBoundingClientRect();

    const targetLeft =
      flowerRect.left -
      fieldRect.left +
      flowerRect.width / 2 -
      beeEl.offsetWidth / 2;
    const targetTop =
      flowerRect.top -
      fieldRect.top +
      flowerRect.height / 2 -
      beeEl.offsetHeight / 2;

    beeEl.style.left = `${targetLeft}px`;
    beeEl.style.top = `${targetTop}px`;
    beeEl.style.transform = `scale(1.15)`;
    onCorrect();

    showFeedback("ყოჩაღ, სწორია!", true);

    setTimeout(() => {
      startRound();
    }, 2000);
  } else {
    showFeedback("რაღაც შეცდომაა... თავიდან სცადე! ", false);
    flowerEl.classList.add("wrong");
    BeeSelected = false;
    beeEl.classList.remove("selected");
  }
}
startRound();
