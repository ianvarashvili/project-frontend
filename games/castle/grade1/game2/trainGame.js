const GAME_STATE = {
  gameId: "castle_g1_game2",
  island: "castle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};

let correctAns = 0;
let lastRound = null;

const train = document.getElementById("train");
const w1 = document.getElementById("w1");
const w2 = document.getElementById("w2");
const w3 = document.getElementById("w3");
const optionsGrid = document.getElementById("options-grid");
const feedbackMsg = document.getElementById("feedback-msg");

function startRound() {
  feedbackMsg.style.color = "";
  const types = ["plus1", "plus2", "plus5", "minus1", "minus2", "minus5"];

  let chosenType;

  do {
    chosenType = types[Math.floor(Math.random() * types.length)];
  } while (chosenType === lastRound);

  lastRound = chosenType;

  let num1, num2, num3;

  switch (chosenType) {
    case "plus1":
      num1 = Math.floor(Math.random() * 18) + 1;
      num2 = num1 + 1;
      num3 = num1 + 2;
      break;
    case "plus2":
      num1 = Math.floor(Math.random() * 16) + 1;
      num2 = num1 + 2;
      num3 = num1 + 4;
      break;
    case "plus5":
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = num1 + 5;
      num3 = num1 + 10;
      break;
    case "minus1":
      num1 = Math.floor(Math.random() * 18) + 3;
      num2 = num1 - 1;
      num3 = num1 - 2;
      break;
    case "minus2":
      num1 = Math.floor(Math.random() * 16) + 5;
      num2 = num1 - 2;
      num3 = num1 - 4;
      break;
    case "minus5":
      num1 = Math.floor(Math.random() * 10) + 11;
      num2 = num1 - 5;
      num3 = num1 - 10;
      break;
  }

  const missingIndex = Math.floor(Math.random() * 3);

  w1.textContent = num1;
  w1.classList.remove("missing-num");

  w2.textContent = num2;
  w2.classList.remove("missing-num");

  w3.textContent = num3;
  w3.classList.remove("missing-num");

  if (missingIndex === 0) {
    w1.textContent = "?";
    w1.classList.add("missing-num");
    correctAns = num1;
  } else if (missingIndex === 1) {
    w2.textContent = "?";
    w2.classList.add("missing-num");
    correctAns = num2;
  } else {
    w3.textContent = "?";
    w3.classList.add("missing-num");
    correctAns = num3;
  }

  let choices = new Set([correctAns]);
  while (choices.size < 4) {
    let wrong = correctAns + (Math.floor(Math.random() * 7) - 3);
    if (wrong >= 0 && wrong !== correctAns) choices.add(wrong);
  }

  const shuffleChoices = Array.from(choices).sort(() => Math.random() - 0.5);
  optionsGrid.innerHTML = "";
  shuffleChoices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "option-btn chalk-txt";
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(choice, btn);
    optionsGrid.appendChild(btn);
  });
}

function checkAnswer(selected, buttonElement) {
  if (gameState.isFinished) return;

  if (selected === correctAns) {
    gameState.isFinished = true;
    onCorrect();
    showFeedback("სწორია!", true);

    train.classList.add("zoom-away");

    setTimeout(() => {
      train.classList.add("enter-stage");
      train.classList.remove("zoom-away");
      hideFeedback();
      startRound();

      setTimeout(() => {
        feedbackMsg.innerText =
          "ამოიცანი რიცხვების კანონზომიერება და გაუშვი მატარებელი";

        train.classList.remove("enter-stage");
        gameState.isFinished = false;
      }, 100);
    }, 500);
  } else {
    showFeedback("რაღაც შეცდომაა... თავიდან სცადე!", false);

    buttonElement.style.backgroundColor = "rgba(226,89,33,0.2)";
    buttonElement.style.borderColor = "var(--color-primary)";
    setTimeout(() => {
      buttonElement.style.backgroundColor = "";
      buttonElement.style.borderColor = "";
    }, 400);
  }
}
