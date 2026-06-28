const GAME_STATE = {
  gameId: "labyrinth_g3_game1",
  island: "labyrinth",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};

const starSVG = `<svg class="game-item star-item" width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M50,5 L64,36 L98,36 L70,57 L81,91 L50,70 L19,91 L30,57 L2,36 L36,36 Z" fill="#DFCCA9" stroke="#272624" stroke-width="4" stroke-linejoin="round"/>
    <path d="M50,15 L50,65 M30,42 L70,42" fill="none" stroke="#272624" stroke-width="2" stroke-dasharray="3,3"/> </svg>`;

let starTotal = 0;
let targetIndexFromLeft = 0;
let isWaiting = false;

const optCont = document.getElementById("options-cont");
const feedbackMsg = document.getElementById("feedback-msg");
const promptLabel = document.getElementById("prompt-label");
const objVisCont = document.getElementById("obj-visual-cont");

function convertToRom(num) {
  const romans = [
    [20, "XX"],
    [19, "XIX"],
    [18, "XVIII"],
    [17, "XVII"],
    [16, "XVI"],
    [15, "XV"],
    [14, "XIV"],
    [13, "XIII"],
    [12, "XII"],
    [11, "XI"],
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
  isWaiting = false;
  if (objVisCont) objVisCont.innerHTML = "";
  if (feedbackMsg) {
    feedbackMsg.innerText =
      "თითო-თითოდ მიჰყევი ფიგურებს, დააკვირდი მიმართულებას.";
    feedbackMsg.style.color = "var(--color-text)";
  }

  starTotal = Math.floor(Math.random() * 11) + 10;
  const targetPosition = Math.floor(Math.random() * starTotal) + 1;
  const romanNum = convertToRom(targetPosition);

  const isRightToLeft = Math.random() < 0.5;

  if (isRightToLeft) {
    targetIndexFromLeft = starTotal - targetPosition;
    promptLabel.innerHTML = `მონიშნე <span class="orange-txt">მარჯვნიდან</span> <span class="roman-num cabin-sketch-txt">${romanNum}</span> ვარსკვლავი`;
  } else {
    targetIndexFromLeft = targetPosition - 1;
    promptLabel.innerHTML = `მონიშნე <span class="orange-txt">მარცხნიდან</span> <span class="roman-num cabin-sketch-txt">${romanNum}</span> ვარსკვლავი`;
  }

  for (let i = 0; i < starTotal; i++) {
    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    wrapper.innerHTML = starSVG;
    wrapper.dataset.index = 1;

    wrapper.onclick = function () {
      checkAns(this, i);
    };
    objVisCont.appendChild(wrapper);
  }
}

function checkAns(element, clickedIndex) {
  if (gameState.isFinished || isWaiting) return;

  if (clickedIndex === targetIndexFromLeft) {
    isWaiting = true;
    onCorrect();
    showFeedback("ყოჩაღ, სწორია!", true);

    setTimeout(() => {
      hideFeedback();
      startRound();
    }, 2000);
  } else {
    showFeedback("რაღაც შეცდომაა... დააკვირდი მიმართულებას", false);
  }
}
