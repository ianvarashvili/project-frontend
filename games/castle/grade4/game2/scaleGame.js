const GAME_STATE = {
  gameId: "castle_g4_game2",
  island: "castle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};
let correctAns;
let lastRightTxt = null;

const beam = document.getElementById("beam");
const optCont = document.getElementById("options-cont");
const dropTarget = document.getElementById("drop-target");
const feedbackMsg = document.getElementById("feedback-msg");

function startRound() {
  feedbackMsg.style.color = "";
  gameState.isFinished = false;

  if (feedbackMsg) {
    feedbackMsg.innerText = "აირჩიე სწორი რიცხვი სასწორის გასათანაბრებლად";
    feedbackMsg.style.color = "var(--color-text)";
  }

  dropTarget.innerText = "?";
  dropTarget.style.backgroundColor = "transparent";

  beam.style.transform = "rotate(15deg)";
  optCont.innerHTML = "";

  let gameMode, rightTxt, leftTxt, leftUnit;
  do {
    gameMode = Math.floor(Math.random() * 3);
    rightTxt = "";
    leftTxt = "";
    leftUnit = "";

    if (gameMode === 0) {
      let kg = Math.floor(Math.random() * 9) + 1;
      rightTxt = `${kg} კგ`;
      leftTxt = "";
      leftUnit = "გ";
      correctAns = kg * 1000;
    } else if (gameMode === 1) {
      let ton = Math.floor(Math.random() * 5) + 1;
      rightTxt = `${ton} ტ`;
      leftTxt = "";
      leftUnit = "კგ";
      correctAns = ton * 1000;
    } else {
      let kg = Math.floor(Math.random() * 4) + 1;
      let g = (Math.floor(Math.random() * 9) + 1) * 100;
      rightTxt = `${kg * 1000 + g}გ`;
      leftTxt = `${kg} კგ +`;
      leftUnit = "გ";
      correctAns = g;
    }
  } while (lastRightTxt !== null && rightTxt === lastRightTxt);

  lastRightTxt = rightTxt;

  document.getElementById("left-text").innerText = leftTxt;
  document.getElementById("left-unit").innerText = leftUnit;
  document.getElementById("right-total").innerText = rightTxt;

  let wrongAns1 =
    correctAns >= 1000
      ? correctAns / 10
      : correctAns + (Math.random() > 0.5 ? 100 : -100);
  let wrongAns2 = correctAns * 10;

  if (wrongAns1 <= 0 || wrongAns1 === correctAns) wrongAns1 = correctAns + 500;
  if (wrongAns2 === correctAns) wrongAns2 = correctAns + 200;

  let options = [correctAns, wrongAns1, wrongAns2];

  options = [...new Set(options)].sort(() => Math.random() - 0.5);

  options.forEach((val) => {
    let div = document.createElement("div");
    div.className = "weight chalk-txt";
    div.innerText = val;

    div.onclick = () => checkAns(val);
    optCont.appendChild(div);
  });
}

function checkAns(val) {
  if (gameState.isFinished) return;
  dropTarget.innerText = val;

  if (val === correctAns) {
    gameState.isFinished = true;
    beam.style.transform = "rotate(0deg)";
    dropTarget.style.backgroundColor = "var(--color-green)";
    onCorrect();
    showFeedback("ყოჩაღ! სასწორი გათანაბრდა", true);
    setTimeout(() => {
      hideFeedback();
      startRound();
    }, 2200);
  } else if (val > correctAns) {
    beam.style.transform = "rotate(-15deg)";
    showFeedback("ზედმეტი მოგივიდა! კიდევ სცადე", false);
    resetPlates();
  } else {
    beam.style.transform = "rotate(15deg)";
    showFeedback("ცოტა დაგაკლდა...", false);
    resetPlates();
  }
}
function resetPlates() {
  setTimeout(() => {
    if (!gameState.isFinished) {
      document.getElementById("drop-target").innerText = "?";
      document.getElementById("beam").style.transform = "rotate(15deg)";
      if (feedbackMsg) {
        feedbackMsg.innerText = "აირჩიე სწორი რიცხვი სასწორის გასათანაბრებლად";
        feedbackMsg.style.color = "var(--color-text)";
      }
    }
  }, 1400);
}
