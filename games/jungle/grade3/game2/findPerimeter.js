const GAME_STATE = {
  gameId: "jungle_g3_game2",
  island: "jungle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};
const canvCont = document.getElementById("canvas-cont");
const userAns = document.getElementById("user-ans");
const feedbackMsg = document.getElementById("feedback-msg");

let correctAns = 0;
let lastShapeName = "";

const shapesData = [
  {
    name: "ტოლგვერდა სამკუთხედი",
    instruction: "იპოვე ტოლგვერდა სამკუთხედის პერიმეტრი",
  },
  {
    name: "კვადრატი",
    instruction: "იპოვე კვადრატის პერიმეტრი",
  },
  {
    name: "მართკუთხედი",
    instruction: "იპოვე მართკუთხედის პერიმეტრი",
  },
];

function startRound() {
  gameState.isFinished = false;
  feedbackMsg.style.color = "";
  feedbackMsg.textContent = "";
  userAns.value = "";
  userAns.focus();

  let shape;
  do {
    shape = shapesData[Math.floor(Math.random() * shapesData.length)];
  } while (shape.name === lastShapeName);

  lastShapeName = shape.name;
  feedbackMsg.textContent = shape.instruction;

  let htmlCode = "";

  if (shape.name === "ტოლგვერდა სამკუთხედი") {
    let side = Math.floor(Math.random() * 20) + 3;
    correctAns = side * 3;

    htmlCode = `
            <svg class="perimeter-svg" viewBox="0 0 240 240">
              <path d="M 120,50 L 200,190 L 40,190 Z" />
              <text x="135" y="215" class="side-label">${side} სმ</text>
            </svg>
          `;
  } else if (shape.name === "კვადრატი") {
    let side = Math.floor(Math.random() * 20) + 3;
    correctAns = side * 4;

    htmlCode = `
            <svg class="perimeter-svg" viewBox="0 0 240 240">
              <rect x="50" y="50" width="140" height="140" rx="6" />
              <text x="105" y="215" class="side-label">${side} სმ</text>
            </svg>
          `;
  } else if (shape.name === "მართკუთხედი") {
    let length = Math.floor(Math.random() * 5) + 7;
    let width = Math.floor(Math.random() * 4) + 3;
    correctAns = 2 * (length + width);

    htmlCode = `
            <svg class="perimeter-svg" viewBox="0 0 240 240">
              <rect x="40" y="70" width="160" height="100" rx="6" />
              <text x="105" y="195" class="side-label">${length} სმ</text>
              <text x="210" y="125" class="side-label">${width} სმ</text>
            </svg>
          `;
  }
  canvCont.innerHTML = htmlCode;
}

function checkAns() {
  if (gameState.isFinished) return;
  const parsedAns = parseInt(userAns.value);

  if (isNaN(parsedAns)) {
    showFeedback("ჩაწერე რიცხვი!", false);
    return;
  }

  if (parsedAns === correctAns) {
    showFeedback("ყოჩაღ! სწორად იპოვე!", true);
    gameState.isFinished = true;

    onCorrect();
    setTimeout(() => {
      startRound();
    }, 2000);
  } else {
    showFeedback("შეცდომაა... თავიდან სცადე!", false);
  }
}

userAns.addEventListener("keypress", (e) => {
  if (e.key === "Enter") checkAns();
});
