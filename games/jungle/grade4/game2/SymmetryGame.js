const GAME_STATE = {
  gameId: "jungle_g4_game2",
  island: "jungle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};

const columns = 12;
const rows = 8;
const mid = columns / 2;

const levels = [
  {
    name: "სამკუთხედი",
    pattern: [
      [2, 5],
      [3, 4],
      [3, 5],
      [4, 3],
      [4, 4],
      [4, 5],
      [5, 2],
      [5, 3],
      [5, 4],
      [5, 5],
    ],
  },
  {
    name: "ოთხკუთხედი",
    pattern: [
      [2, 2],
      [2, 3],
      [2, 4],
      [2, 5],
      [3, 2],
      [3, 3],
      [3, 4],
      [3, 5],
      [4, 2],
      [4, 3],
      [4, 4],
      [4, 5],
      [5, 2],
      [5, 3],
      [5, 4],
      [5, 5],
    ],
  },
  {
    name: "ოთხკუთხედი",
    pattern: [
      [2, 2],
      [2, 3],
      [2, 4],
      [2, 5],
      [3, 2],
      [3, 3],
      [3, 4],
      [4, 2],
      [4, 3],
      [4, 4],
      [5, 2],
      [5, 3],
      [5, 4],
    ],
  },
  {
    name: "ოთხკუთხედი",
    pattern: [
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
      [3, 5],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
      [4, 5],
    ],
  },
  {
    name: "სასაჩუქრე ყუთი",
    pattern: [
      [1, 3],
      [1, 4],
      [2, 4],
      [2, 5],
      [3, 2],
      [3, 3],
      [3, 4],
      [3, 5],
      [4, 2],
      [4, 4],
      [4, 5],
      [5, 2],
      [5, 4],
      [5, 5],
      [6, 2],
      [6, 3],
      [6, 4],
      [6, 5],
    ],
  },
  {
    name: "მოჩვენება",
    pattern: [
      [2, 3],
      [2, 4],
      [2, 5],
      [3, 2],
      [3, 4],
      [3, 5],
      [4, 2],
      [4, 3],
      [4, 4],
      [4, 5],
      [5, 2],
      [5, 3],
      [5, 4],
      [5, 5],
      [6, 2],
      [6, 4],
    ],
  },
  {
    name: "კიბორჩხალა",
    pattern: [
      [2, 2],
      [2, 5],
      [3, 2],
      [3, 3],
      [3, 5],
      [4, 1],
      [4, 3],
      [4, 4],
      [4, 5],
      [5, 2],
      [5, 3],
      [5, 4],
      [5, 5],
      [6, 1],
      [6, 3],
      [6, 5],
    ],
  },
  {
    name: "გვირგვინი",
    pattern: [
      [2, 1],
      [2, 3],
      [2, 5],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
      [3, 5],
      [4, 2],
      [4, 3],
      [4, 4],
      [4, 5],
      [5, 1],
      [5, 2],
      [5, 3],
      [5, 4],
      [5, 5],
    ],
  },
  {
    name: "შუასაუკუნეების ციხესიმაგრე",
    pattern: [
      [2, 1],
      [2, 3],
      [2, 5],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
      [3, 5],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
      [4, 5],
      [5, 1],
      [5, 2],
      [5, 3],
      [5, 4],
      [5, 5],
      [6, 1],
      [6, 2],
      [6, 5],
    ],
  },
  {
    name: "უცხოპლანეტელი ხომალდი",
    pattern: [
      [2, 4],
      [2, 5],
      [3, 3],
      [3, 4],
      [3, 5],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
      [4, 5],
      [5, 2],
      [5, 4],
      [5, 5],
    ],
  },
];

const gridCont = document.getElementById("grid-cont");
const feedbackMsg = document.getElementById("feedback-msg");

let grid = Array.from({ length: rows }, () => Array(columns).fill(null));
let currLevelIndex = Math.floor(Math.random() * levels.length);

function startRound() {
  if (gameState.isFinished) return;
  feedbackMsg.style.color = "";
  gridCont.innerHTML = '<div class="symmetry-line"></div>';
  const currentPattern = levels[currLevelIndex].pattern;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (c < mid) {
        cell.classList.add("left-side");
        if (currentPattern.some(([pr, pc]) => pr === r && pc === c)) {
          cell.classList.add("target-color");
        }
      } else {
        cell.addEventListener("click", () => toggleCell(r, c));
      }

      gridCont.appendChild(cell);
      grid[r][c] = cell;
    }
  }
}

function toggleCell(r, c) {
  if (gameState.isFinished) return;
  const cell = grid[r][c];
  cell.classList.toggle("user-color");
}

function checkAns() {
  if (gameState.isFinished) return;
  let isCorrect = true;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const leftCell = grid[r][c];
      const rightCell = grid[r][columns - 1 - c];

      const isLeftColored = leftCell.classList.contains("target-color");
      const isRightColored = rightCell.classList.contains("user-color");

      if (isLeftColored !== isRightColored) {
        isCorrect = false;
        break;
      }
    }
    if (!isCorrect) break;
  }

  if (isCorrect) {
    onCorrect();
    showFeedback("ყოჩაღ! სწორად გამოიცანი!", true);
    const prevLevelIndex = currLevelIndex;
    while (currLevelIndex === prevLevelIndex) {
      currLevelIndex = Math.floor(Math.random() * levels.length);
    }

    setTimeout(() => {
      showFeedback("გააფერადე მარჯვენა მხარე ისე, რომ მარცხენას სიმეტრიული იყოს", true);
      startRound();
    }, 2000);
  } else {
    showFeedback("რაღაც შეცდომაა... თავიდან სცადე!", false);
  }
}

function resetGrid() {
  if (gameState.isFinished) return;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      grid[r][c].classList.remove("user-color");
    }
  }
}
