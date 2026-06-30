const GAME_STATE = {
  gameId: "jungle_g3_game4",
  island: "jungle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 3,
  timeLimitSeconds: 30,
};
const pathCurves = [
  "M 95 175 C 210 40, 440 40, 555 175",
  "M 95 175 C 210 100, 440 250, 555 175",
  "M 95 175 C 210 310, 440 310, 555 175",
];

const unitRatesToMM = { მმ: 1, სმ: 10, დმ: 100, მ: 1000 };

const butterfly = document.getElementById("butterfly");
const feedbackMsg = document.getElementById("feedback-msg");
const groups = document.querySelectorAll(".path-group");

let correctAns = null;

function generateRound() {
  const paths = [];
  const usedValuesInMM = new Set();
  const units = ["მმ", "სმ", "დმ", "მ"];

  while (paths.length < 3) {
    const unit = units[Math.floor(Math.random() * units.length)];
    let value = 0;

    if (unit === "მ") {
      value = 1;
    } else if (unit === "დმ") {
      value = Math.floor(Math.random() * 10) + 1;
    } else if (unit === "სმ") {
      value = (Math.floor(Math.random() * 20) + 1) * 5;
    } else if (unit === "მმ") {
      value = (Math.floor(Math.random() * 20) + 1) * 50;
    }
    const mmVal = value * unitRatesToMM[unit];

    if (!usedValuesInMM.has(mmVal)) {
      usedValuesInMM.add(mmVal);
      paths.push({
        text: `${value} ${unit}`,
        mm: mmVal,
      });
    }
  }
  return paths;
}

function startRound() {
  gameState.isFinished = false;
  butterfly.classList.remove("animate-fly");
  butterfly.style.offsetPath = `path('${pathCurves[0]}')`;
  butterfly.style.offsetDistance = "6%";
  feedbackMsg.style.color = "";
  feedbackMsg.innerHTML = `დააჭირე ყველაზე მოკლე გზას, დააკვირდი <span class="orange-txt">საზომ ერთეულებს`;

  const currentRoundData = generateRound();
  const minMM = Math.min(...currentRoundData.map((p) => p.mm));

  groups.forEach((group, index) => {
    group.classList.remove("correct", "wrong");

    const textNode = group.querySelector(".path-text");
    textNode.textContent = currentRoundData[index].text;

    if (currentRoundData[index].mm === minMM) {
      correctAns = index;
    }
  });
}

function checkAns(selectedIndex) {
  if (gameState.isFinished) return;

  const selectedGroup = groups[selectedIndex];

  if (selectedIndex === correctAns) {
    gameState.isFinished = true;
    selectedGroup.classList.add("correct");
    onCorrect();
    showFeedback("ყოჩაღ! ეს ყველაზე მოკლე გზაა!", true);
    butterfly.style.offsetPath = `path('${pathCurves[selectedIndex]}')`;

    setTimeout(() => {
      butterfly.classList.add("animate-fly");
      butterfly.style.offsetDistance = "94%";
    }, 20);

    setTimeout(() => {
      startRound();
    }, 2300);
  } else {
    selectedGroup.classList.add("wrong");
    showFeedback("სცადე სხვა გზა...", false);

    setTimeout(() => {
      selectedGroup.classList.remove("wrong");
    }, 500);
  }
}
groups.forEach((group) => {
  group.addEventListener("click", () => {
    const index = parseInt(group.dataset.index);
    checkAns(index);
  });
});
