const GAME_STATE = {
  gameId: "labyrinth_g2_game1",
  island: "labyrinth",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 2,
  timeLimitSeconds: 30,
};

const FRUITS = ["apple", "pear", "watermelon"];

let correctAns = null;
let lastCorrectAns = null;
let lastFruitA = null;

const patternCont = document.getElementById("pattern-cont");
const optionsCont = document.getElementById("options-cont");
const feedbackMsg = document.getElementById("feedback-msg");

function generateFruit(fruitType) {
  return `
    <svg viewbox = "0 0 100 100">
    <use href = "#fruit-${fruitType}"/>
    </svg>
    `;
}

function startRound() {
  gameState.isFinished = false;
  feedbackMsg.style.color = "";
  patternCont.innerHTML = "";
  optionsCont.innerHTML = "";

  let fruitA, fruitB, fruitC;
  do {
    const shuffledFruits = [...FRUITS].sort(() => Math.random() - 0.5);
    fruitA = shuffledFruits[0];
    fruitB = shuffledFruits[1];
    fruitC = shuffledFruits[2];
  } while (fruitA === lastFruitA && fruitB === lastCorrectAns);

  lastFruitA = fruitA;
  lastCorrectAns = fruitB;

  const sequence = [fruitA, fruitB, fruitA, fruitB, fruitA];
  correctAns = fruitB;

  sequence.forEach((fruitType) => {
    const div = document.createElement("div");
    div.className = "fruit-item";
    div.innerHTML = generateFruit(fruitType);
    patternCont.appendChild(div);
  });

  const missingBox = document.createElement("div");
  missingBox.className = "missing-box";
  missingBox.innerText = "?";
  patternCont.appendChild(missingBox);

  const wrongAnswer1 = fruitC;
  const wrongAnswer2 = fruitA;

  const options = [correctAns, wrongAnswer1, wrongAnswer2].sort(
    () => Math.random() - 0.5,
  );

  options.forEach((fruitType) => {
    const div = document.createElement("div");
    div.className = "options-btn";
    div.innerHTML = generateFruit(fruitType);

    div.onclick = () => checkAns(fruitType, div);
    optionsCont.appendChild(div);
  });
}

function checkAns(selectedFruit, buttonEl) {
  if (gameState.isFinished) return;

  if (selectedFruit === correctAns) {
    gameState.isFinished = true;
    onCorrect();
    showFeedback("სწორია! ", true);

    const missingBox = document.querySelector(".missing-box");
    missingBox.className = "fruit-item";
    missingBox.innerHTML = generateFruit(correctAns);

    setTimeout(() => {
      hideFeedback();
      startRound();
    }, 2000);
  } else {
    showFeedback("რაღაც შეცდომაა... თავიდან სცადე!", false);
    buttonEl.classList.add("wrong");
  }
}
