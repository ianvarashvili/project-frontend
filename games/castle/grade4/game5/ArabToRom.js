const GAME_STATE = {
  gameId: "castle_g4_game5",
  island: "castle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 4,
  timeLimitSeconds: 30,
};
let currArabic = 0;
let currRoman = "";
let ufoSelected = false;
let lastArabic = null;

const ufoEl = document.getElementById("ufo");
const ufoNumEl = document.getElementById("ufo-num");
const feedbackMsg = document.getElementById("feedback-msg");

function convertToRom(num) {
  const romans = [
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [8, "VIII"],
    [7, "VII"],
    [6, "VI"],
    [5, "V"],
    [4, "IV"],
    [3, "III"],
    [2, "II"],
    [1, "I"],
  ];
  let result = "";
  for (let i = 0; i < romans.length; i++) {
    while (num >= romans[i][0]) {
      result += romans[i][1];
      num -= romans[i][0];
    }
  }
  return result;
}

function startRound() {
  feedbackMsg.style.color = "";
  ufoSelected = false;
  gameState.isFinished = false;
  ufoEl.classList.remove("selected");

  for (let i = 0; i < 3; i++) {
    const planetEL = document.getElementById(`planet-${i}`);
    planetEL.className = "planet-item";
  }

  do {
    currArabic = Math.floor(Math.random() * 100) + 1;
  } while (lastArabic !== null && currArabic === lastArabic);

  lastArabic = currArabic;

  currRoman = convertToRom(currArabic);
  ufoNumEl.textContent = currArabic;

  let wrongAns1, wrongAns2;
  do {
    let offset = Math.floor(Math.random() * 10) - 5;
    wrongAns1 = currArabic + (offset === 0 ? 3 : offset);
  } while (wrongAns1 < 1 || wrongAns1 > 100 || wrongAns1 === currArabic);

  do {
    let offset = Math.floor(Math.random() * 10) - 5;
    wrongAns2 = currArabic + (offset === 0 ? -3 : offset);
  } while (
    wrongAns2 < 1 ||
    wrongAns2 > 100 ||
    wrongAns2 === currArabic ||
    wrongAns2 === wrongAns1
  );

  let wrongRoman1 = convertToRom(wrongAns1);
  let wrongroman2 = convertToRom(wrongAns2);

  let options = [currRoman, wrongRoman1, wrongroman2];
  options.sort(() => Math.random() - 0.5);

  for (let i = 0; i < 3; i++) {
    const planetELTxt = document.getElementById(`planet-txt-${i}`);
    const planetELItem = document.getElementById(`planet-${i}`);
    planetELTxt.textContent = options[i];
    planetELItem.dataset.roman = options[i];
  }
  feedbackMsg.innerText =
    "ჯერ გაააქტიურე ხომალდი მასზე დაჭერით და აირჩიე პლანეტა!";
}

function toggleUfo() {
  if (gameState.isFinished) return;
  ufoSelected = !ufoSelected;
  if (ufoSelected) {
    ufoEl.classList.add("selected");
    // showFeedback("ხომალდი ჩართულია! აირჩიე შესაბამისი პლანეტა!", true);
  } else {
    ufoEl.classList.remove("selected");
    feedbackMsg.style.color = "";
    feedbackMsg.innerText =
      "ჯერ გაააქტიურე ხომალდი მასზე დაჭერით და აირჩიე პლანეტა!";
  }
}

function checkAns(index) {
  if (gameState.isFinished) return;
  if (!ufoSelected) return;

  const planetEL = document.getElementById(`planet-${index}`);
  const chosenVal = planetEL.dataset.roman;

  if (chosenVal === currRoman) {
    gameState.isFinished = true;
    planetEL.classList.add("correct");
    showFeedback("ყოჩაღ, სწორია!", true);

    onCorrect();
    setTimeout(() => {
      startRound();
    }, 2000);
  } else {
    planetEL.classList.add("wrong");
    showFeedback("რაღაც შეცდომაა... თავიდან სცადე!", false);
  }
}
