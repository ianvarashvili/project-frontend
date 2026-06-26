const GAME_STATE = {
  gameId: "labyrinth_g1_game5",
  island: "labyrinth",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 45,
};
const ballCont = document.getElementById("ball-container");
const taskBar = document.getElementById("task-bar-cont");
const feedbackMsg = document.getElementById("feedback-msg");
const redBtn = document.getElementById("red-btn");
const blueBtn = document.getElementById("blue-btn");

let numBlue = 0;
let numRed = 0;
let currentBrush = "red";
let isRoundActive = true;

function generateBalloon() {
  return `
        <svg viewBox="0 0 50 75" class="balloon-svg">
          <path d="M25,52 Q21,62 27,72" class="balloon-string"/>
          <polygon points="25,47 20,53 30,53" class="balloon-path"/>
          <ellipse cx="25" cy="27" rx="18" ry="22" class="balloon-path"/>
          <ellipse cx="19" cy="19" rx="3" ry="5" fill="rgba(255,255,255,0.4)" transform="rotate(-15 19 19)"/>
        </svg>`;
}

function selectBrush(color) {
  currentBrush = color;
  redBtn.classList.toggle("active", color === "red");
  blueBtn.classList.toggle("active", color === "blue");
}

function generateExpr(target) {
  const isAddition = Math.random() > 0.5;
  if (isAddition) {
    const a = Math.floor(Math.random() * (target - 1)) + 1;
    const b = target - a;
    return `${a}+${b}`;
  } else {
    const diff = Math.floor(Math.random() * 3) + 1;
    const a = target + diff;
    return `${a}-${diff}`;
  }
}

function startRound() {
  isRoundActive = true;
   feedbackMsg.style.color = "";
  feedbackMsg.textContent = "გამოთვალე, შეადარე და გააფერადე!";
  ballCont.innerHTML = "";
  selectBrush("red");

  let ans1 = Math.floor(Math.random() * 5) + 2;
  let ans2 = Math.floor(Math.random() * 5) + 2;

  while (ans1 === ans2) {
    ans2 = Math.floor(Math.random() * 5) + 2;
  }

  const expr1 = generateExpr(ans1);
  const expr2 = generateExpr(ans2);

  if (ans1 > ans2) {
    numRed = ans1;
    numBlue = ans2;
  } else {
    numBlue = ans1;
    numRed = ans2;
  }

  taskBar.innerHTML = `
  <div class="expr-card">${expr1}</div>
  <div class="vs-txt">და</div>
  <div class="expr-card">${expr2}</div>
  `;
  for (let i = 0; i < 20; i++) {
    const card = document.createElement("div");
    card.className = "balloon-card";
    card.innerHTML = generateBalloon();
    card.onclick = () => handeBallClick(card);
    ballCont.appendChild(card);
  }
}

function handeBallClick(card) {
  if (!isRoundActive || gameState.isFinished) return;

  if (card.classList.contains(currentBrush)) {
    card.classList.remove("blue", "red");
  } else {
    card.classList.remove("blue", "red");
    card.classList.add(currentBrush);
  }
}

function resetBalloons() {
  if (!isRoundActive || gameState.isFinished) return;
  const cards = document.querySelectorAll(".balloon-card");
  cards.forEach((card) => card.classList.remove("blue", "red"));
  feedbackMsg.textContent = "ამოხსენი ორივე მაგალითი";
}

function checkAns(selectedSign) {
  if (!isRoundActive || gameState.isFinished) return;

  const actualRed = document.querySelectorAll(".balloon-card.red").length;
  const actualBlue = document.querySelectorAll(".balloon-card.blue").length;

  if (actualBlue === numBlue && actualRed === numRed) {
    isRoundActive = false;
    onCorrect();
    showFeedback("ყოჩაღ! სწორად გამოიცანი!",true);

    setTimeout(() => {
      startRound();
    }, 2000);
  } else {
    showFeedback("შეცდომაა... კარგად დაფიქრდი!",false);
  }
}

