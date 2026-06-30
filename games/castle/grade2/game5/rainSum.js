const GAME_STATE = {
  gameId: "castle_g2_game5",
  island: "castle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};

let currentItem = null;
let correctAns = false;
let missingDrop = "right";

const optCont = document.getElementById("options-cont");
const promptLabel = document.getElementById("prompt-label");
const cloudTotal = document.getElementById("cloud-total");
const dropLeft = document.getElementById("drop-left-val");
const dropRight = document.getElementById("drop-right-val");
const feedbackMsg = document.getElementById("feedback-msg");

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
function startRound() {
  if (feedbackMsg) {
    feedbackMsg.innerText =
      "წვიმის წვეთების ჯამით ღრუბელში მოცემული რიცხვი უნდა მიიღო.";
    feedbackMsg.style.color = "";
    feedbackMsg.style.display = "block";
  }
  let total;
  do {
    total = Math.floor(Math.random() * 91) + 10;
  } while (currentItem && total === currentItem.total);

  let knownDropVal = Math.floor(Math.random() * (total + 1));
  let hiddenDropVal = total - knownDropVal;

  missingDrop = Math.random() < 0.5 ? "left" : "right";

  currentItem = {
    total: total,
    shape: hiddenDropVal,
  };
  correctAns = false;

  cloudTotal.innerText = total;

  if (missingDrop === "left") {
    dropLeft.innerText = "?";
    dropRight.innerText = knownDropVal;
    promptLabel.innerHTML = `<h2>რა რიცხვი აკლია <span class=orange-txt>მარცხენა</span> წვეთს?</h2>`;
  } else {
    dropLeft.innerText = knownDropVal;
    dropRight.innerText = "?";
    promptLabel.innerHTML = `<h2>რა რიცხვი აკლია <span class=orange-txt>მარჯვენა</span> წვეთს?</h2>`;
  }

  generateOptions(hiddenDropVal, total);
}

function generateOptions(correctVal, total) {
  optCont.innerHTML = "";
  let options = [correctVal];

  while (options.length < 4) {
    let offset = Math.floor(Math.random() * 21) - 10;
    let fake = correctVal + offset;
    if (fake >= 0 && fake <= total && !options.includes(fake)) {
      options.push(fake);
    }
  }

  shuffle(options);

  options.forEach((num) => {
    const btn = document.createElement("button");
    btn.className = "button sketchy-button--lg chalk-txt";
    btn.innerText = num;
    btn.onclick = () => checkAns(num);
    optCont.appendChild(btn);
  });
}

function checkAns(selectedShape) {
  if (gameState.isFinished || correctAns) return;

  if (selectedShape === currentItem.shape) {
    correctAns = true;

    if (missingDrop === "left") {
      dropLeft.innerText = currentItem.shape;
    } else {
      dropRight.innerText = currentItem.shape;
    }
    onCorrect();
    showFeedback("სწორია!", true);

    setTimeout(() => {
      startRound();
    }, 2000);
  } else {
    showFeedback("რაღაც შეცდომაა...", false);
  }
}
