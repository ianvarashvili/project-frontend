const GAME_STATE = {
  gameId: "castle_g3_game1",
  island: "castle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};

let correctAns;
let lastNum1 = null;

const beam = document.getElementById("beam");
const optCont = document.getElementById("options-cont");
const dropTarget = document.getElementById("drop-target");
const feedbackMsg = document.getElementById("feedback-msg");

function startRound() {
  gameState.isFinished = false;
  feedbackMsg.style.color = "";

  if (feedbackMsg) {
    feedbackMsg.innerText = "აირჩიე სწორი რიცხვი";
    feedbackMsg.style.color = "var(--color-text)";
  }

  dropTarget.innerText = "?";
  dropTarget.style.backgroundColor = "transparent";

  beam.style.transform = "rotate(15deg)";
  optCont.innerHTML = "";

  let num1, tens1, ones1, tens2, ones2;

  do {
    tens1 = Math.floor(Math.random() * 4) + 1;
    ones1 = Math.floor(Math.random() * 5);

    tens2 = Math.floor(Math.random() * 4) + 1;
    ones2 = Math.floor(Math.random() * 5);

    num1 = tens1 * 10 + ones1;
    correctAns = tens2 * 10 + ones2;
  } while (num1 === lastNum1);

  lastNum1 = num1;

  let total = num1 + correctAns;

  document.getElementById("num1").innerText = num1;
  document.getElementById("right-total").innerText = total;

  let options = [correctAns, correctAns + 2, Math.abs(correctAns - 3) || 12];

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

  let num1 = parseInt(document.getElementById("num1").innerText);
  let total = parseInt(document.getElementById("right-total").innerText);
  let leftSum = num1 + val;

  if (leftSum === total) {
    gameState.isFinished = true;
    beam.style.transform = "rotate(0deg)";
    dropTarget.style.backgroundColor = "var(--color-green)";
    onCorrect();
    showFeedback("ყოჩაღ! სასწორი გათანაბრდა", true);
    setTimeout(() => {
      hideFeedback();
      startRound();
    }, 2200);
  } else if (leftSum > total) {
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
        feedbackMsg.innerText = "აირჩიე სწორი რიცხვი";
        feedbackMsg.style.color = "var(--color-text)";
      }
    }
  }, 1400);
}
