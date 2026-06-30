const GAME_STATE = {
  gameId: "jungle_g2_game1",
  island: "jungle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};

const shapeDrawings = {
  3: `<svg width="70" height="70" viewBox="0 0 100 100"><polygon points="50,15 90,85 10,85" fill="#F1C40F" stroke="#272624" stroke-width="4" stroke-linejoin="round"/></svg>`, // სამკუთხედი
  4: `<svg width="70" height="70" viewBox="0 0 100 100"><rect x="15" y="15" width="70" height="70" fill="#E74C3C" stroke="#272624" stroke-width="4" stroke-linejoin="round"/></svg>`, // ოთხკუთხედი
  5: `<svg width="70" height="70" viewBox="0 0 100 100"><polygon points="50,10 90,40 75,90 25,90 10,40" fill="#9B59B6" stroke="#272624" stroke-width="4" stroke-linejoin="round"/></svg>`, // ხუთკუთხედი
  6: `<svg width="70" height="70" viewBox="0 0 100 100"><polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="#2ECC71" stroke="#272624" stroke-width="4" stroke-linejoin="round"/></svg>`, // ექვსკუთხედი
};

let currentQuest = null;

const shapeCont = document.getElementById("shapes-cont");
const optCont = document.getElementById("options-cont");
const feedbackMsg = document.getElementById("feedback-msg");

function startRound() {
  gameState.isFinished = false;
  feedbackMsg.style.color = "";
  feedbackMsg.innerHTML = `გაითვალისწინე, ფიგურები დალაგებულია <span class="orange-txt">წვეროების რაოდენობის</span> მიხედვით.`;

  const vertexSizes = [3, 4, 5, 6];
  let hiddenVertex;
  do {
    hiddenVertex = vertexSizes[Math.floor(Math.random() * vertexSizes.length)];
  } while (currentQuest && hiddenVertex === currentQuest.hidden);

  currentQuest = { hidden: hiddenVertex };

  shapeCont.innerHTML = "";
  vertexSizes.forEach((v) => {
    if (v === hiddenVertex) {
      shapeCont.innerHTML += `<div class='missing-box' id='missing-target'>?</div>`;
    } else {
      shapeCont.innerHTML += `<div class='shape-box'>${shapeDrawings[v]}</div>`;
    }
  });

  generateOptions(hiddenVertex);
}

function generateOptions(correctVal) {
  optCont.innerHTML = "";
  let options = [3, 4, 5, 6];

  options.sort(() => Math.random() - 0.5);

  options.forEach((v) => {
    const btn = document.createElement("div");
    btn.className = "shape-btn";
    btn.innerHTML = shapeDrawings[v];
    btn.onclick = () => checkAns(v);
    optCont.appendChild(btn);
  });
}

function checkAns(selectedVertex) {
  if (gameState.isFinished) return;

  if (selectedVertex === currentQuest.hidden) {
    gameState.isFinished = true;
    const target = document.getElementById("missing-target");
    target.className = "shape-box";
    target.innerHTML = shapeDrawings[currentQuest.hidden];
    onCorrect();
    showFeedback(
      `სწორია! ეს არის <span>${currentQuest.hidden}</span>-კუთხედი`,
      true,
    );
    setTimeout(() => {
      startRound();
    }, 2000);
  } else {
    showFeedback(
      `რაღაც შეცდომაა... კარგად გადათვალე <span>წვეროების რაოდენობა</span>.`,
      false,
    );
  }
}
