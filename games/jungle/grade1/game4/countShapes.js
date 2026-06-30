const GAME_STATE = {
  gameId: "jungle_g1_game4",
  island: "jungle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};

const canvCont = document.getElementById("canvas-cont");
const userAns = document.getElementById("user-ans");
const feedbackMsg = document.getElementById("feedback-msg");
const gameInstruction = document.getElementById("game-instruction");

let correctAns = 0;
let lastQuest = "";

const shapesData = [
  {
    html: `
    <svg class="house-svg" viewBox="0 0 240 240">
            <rect x="40" y="110" width="160" height="100" fill="#fab1a0" />
            <rect x="105" y="150" width="30" height="60" fill="#ffeaa7" />
            <polygon points="120,30 210,110 30,110" fill="#ff7675" opacity="0.9" />
            <polygon points="120,50 180,110 60,110" fill="#d63031" opacity="0.8" />
            <circle cx="75" cy="140" r="15" fill="#74b9ff" />
            <circle cx="165" cy="140" r="15" fill="#74b9ff" />
          </svg>`,
    answers: {
      triangles: 2,
      squares: 0,
      rectangles: 2,
      squaresAndRect: 2,
      circles: 2,
    },
  },
  {
    html: `<svg class="house-svg" viewBox="0 0 240 240">
            <rect x="60" y="140" width="120" height="70" fill="#a29bfe" />
            <rect x="80" y="80" width="80" height="60" fill="#74b9ff" />
            <polygon points="120,20 170,80 70,80" fill="#e84393" opacity="0.9" />
            <circle cx="120" cy="110" r="12" fill="#ffeaa7" />
          </svg>`,
    answers: {
      triangles: 1,
      squares: 0,
      rectangles: 2,
      squaresAndRect: 2,
      circles: 1,
    },
  },
  {
    html: `<svg class="house-svg" viewBox="0 0 240 240">
            <rect x="70" y="90" width="100" height="120" fill="#B2EBF2" />
            <polygon points="120,20 180,90 60,90" fill="#F8BBD0" />
            <circle cx="120" cy="120" r="12" fill="#E0F7FA" />
            <circle cx="120" cy="155" r="12" fill="#E0F7FA" />
            <rect x="105" y="180" width="30" height="30" fill="#D1C4E9" />
</svg>
`,
    answers: {
      triangles: 1,
      squares: 1,
      rectangles: 1,
      squaresAndRect: 2,
      circles: 2,
    },
  },
  {
    html: `<svg class="house-svg" viewBox="0 0 240 240">
            <rect x="30" y="120" width="90" height="90" fill="#f39c12" />
            <rect x="120" y="100" width="90" height="110" fill="#d35400" />
            <polygon points="75,50 120,120 30,120" fill="#c0392b" />
            <polygon points="165,30 210,100 120,100" fill="#962d22" />
            <rect x="60" y="150" width="30" height="30" fill="#ecf0f1" />
          </svg>`,
    answers: {
      triangles: 2,
      squares: 2,
      rectangles: 1,
      squaresAndRect: 3,
      circles: 0,
    },
  },
  {
    html: `<svg class="house-svg" viewBox="0 0 240 240">
            <rect x="50" y="100" width="140" height="110" fill="#B39DDB" />
            <polygon points="120,20 200,100 40,100" fill="#9575CD" />
            <circle cx="120" cy="65" r="15" fill="#FFF59D" />
            <rect x="75" y="135" width="35" height="35" fill="#E1F5FE" />
            <rect x="135" y="140" width="30" height="70" fill="#D7CCC8" />
        </svg>`,
    answers: {
      triangles: 1,
      squares: 1,
      rectangles: 2,
      squaresAndRect: 3,
      circles: 1,
    },
  },
];

const questionsPool = [
  { key: "triangles", text: "სულ რამდენი სამკუთხედია სურათზე?" },
  { key: "squares", text: "სულ რამდენი კვადრატია სურათზე?" },
  { key: "rectangles", text: "სულ რამდენი მართკუთხედია სურათზე?" },
  { key: "squaresAndRect", text: "სულ რამდენი ოთხკუთხედია სურათზე?" },
  { key: "circles", text: "სულ რამდენი წრეა სურათზე?" },
];

function startRound() {
  gameState.isFinished = false;
  feedbackMsg.style.color = "";
  userAns.value = "";
  userAns.focus();

  const currentShape =
    shapesData[Math.floor(Math.random() * shapesData.length)];

  let question;
  do {
    question = questionsPool[Math.floor(Math.random() * questionsPool.length)];
  } while (question.key === lastQuest);

  lastQuest = question.key;

  gameInstruction.textContent = question.text;
  correctAns = currentShape.answers[question.key];

  canvCont.innerHTML = currentShape.html;
}

function checkAns() {
  if (gameState.isFinished) return;
  const parsedAns = parseInt(userAns.value);

  if (isNaN(parsedAns)) {
    feedbackMsg.textContent = "ჩაწერე რიცხვი!";
    return;
  }

  if (parsedAns === correctAns) {
    gameState.isFinished = true;
    onCorrect();
    showFeedback(`ყოჩაღ! სწორად დაითვალე!`, true);
    setTimeout(() => {
      feedbackMsg.textContent = "კარგად დააკვირდი, შეიძლება საერთოდ არ იყოს";

      startRound();
    }, 2000);
  } else {
    showFeedback("რაღაც შეცდომაა... თავიდან გადათვალე!", false);
  }
}

userAns.addEventListener("keypress", (e) => {
  if (e.key === "Enter") checkAns();
});
