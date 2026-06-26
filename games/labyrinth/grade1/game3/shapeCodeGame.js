const GAME_STATE = {
  gameId: "labyrinth_g1_game3",
  island: "labyrinth",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 45,
};

const SHAPES = [
  { id: "triangle", label: "სამკუთხედი" },
  { id: "square", label: "კვადრატი" },
  { id: "circle", label: "წრე" },
  { id: "diamond", label: "რომბი" },
];

let SHAPE_VALUES = {};
let answered = false;
let currentExpression = null;

const legendPanel = document.getElementById("legend-panel");
const equationCard = document.getElementById("equation-card");
const answerOpts = document.getElementById("answer-opts");
const promptLabel = document.getElementById("prompt-label");
const feedbackMsg = document.getElementById("feedback-msg");

function shapeIconMarkup(shapeId, extraClass = "") {
  const paths = {
    triangle: `<polygon points="50,12 90,88 10,88" />`,
    square: `<rect x="14" y="14" width="72" height="72" rx="12" />`,
    circle: `<circle cx="50" cy="50" r="40" />`,
    diamond: `<polygon points="50,8 92,50 50,92 8,50" />`,
  };
  return `<svg viewBox="0 0 100 100" class="shape-icon shape-${shapeId} ${extraClass}">${paths[shapeId]}</svg>`;
}

function assignShapeValues() {
  const pool = shuffleArray([2, 3, 4, 5, 6, 7, 8, 9]);
  SHAPES.forEach((shape, i) => {
    SHAPE_VALUES[shape.id] = pool[i];
  });
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function renderLegend() {
  if (!legendPanel) return;
  legendPanel.innerHTML = SHAPES.map(
    (shape) => `
    <div class="legend-chip">
      ${shapeIconMarkup(shape.id)}
      <span class="legend-value">= ${SHAPE_VALUES[shape.id]}</span>
    </div>
  `,
  ).join("");
}

assignShapeValues();
document.addEventListener("DOMContentLoaded", renderLegend);

function pickShapes(count) {
  const picks = [];
  for (let i = 0; i < count; i++) {
    picks.push(SHAPES[Math.floor(Math.random() * SHAPES.length)]);
  }
  return picks;
}

function buildExpression() {
  const grade = GAME_STATE.gameGrade;
  const allowSubtraction = grade >= 3;
  const shapeCount = grade >= 4 ? 3 : 2;

  const picks = pickShapes(shapeCount);
  const ops = [];

  while (true) {
    const picks = pickShapes(shapeCount);
    const ops = [];
    let total = SHAPE_VALUES[picks[0].id];

    for (let i = 1; i < picks.length; i++) {
      let op = allowSubtraction && Math.random() < 0.5 ? "-" : "+";
      const value = SHAPE_VALUES[picks[i].id];

      if (op === "-" && total - value < 0) op = "+"; // უარყოფითი პასუხი რომ არ მივიღოთ

      total = op === "+" ? total + value : total - value;
      ops.push(op);
    }

    if (total <= 20) {
      return { shapes: picks, ops, answer: total };
    }
  }
}

function startRound() {
  answered = false;
  currentExpression = buildExpression();

  if (feedbackMsg) {
    feedbackMsg.innerText = "ამოხსენი გამოსახულება და აირჩიე სწორი პასუხი!";
    feedbackMsg.style.color = "";
    feedbackMsg.style.display = "block";
  }

  promptLabel.textContent = "რა მნიშვნელობა აქვს ნიშანს?";

  renderEquation(currentExpression);
  renderOptions(currentExpression.answer);
}

function renderEquation(expr) {
  let html = shapeIconMarkup(expr.shapes[0].id, "size-lg");

  expr.ops.forEach((op, i) => {
    html += `<span class="equation-operator">${op === "+" ? "+" : "−"}</span>`;
    html += shapeIconMarkup(expr.shapes[i + 1].id, "size-lg");
  });

  html += `<span class="equation-equals">=</span>`;
  html += `<div class="equation-question">?</div>`;

  equationCard.innerHTML = html;
}

function renderOptions(correctAnswer) {
  const options = new Set([correctAnswer]);
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 7) - 3;
    const candidate = correctAnswer + offset;
    if (candidate >= 0 && candidate !== correctAnswer) options.add(candidate);
  }

  const shuffledOpts = shuffleArray(Array.from(options));
  answerOpts.innerHTML = "";

  shuffledOpts.forEach((value) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn chalk-txt";
    btn.textContent = value;
    btn.onclick = () => checkAnswer(value, correctAnswer, btn);
    answerOpts.appendChild(btn);
  });
}

function checkAnswer(selected, correctAnswer, btnEl) {
  if (answered || gameState.isFinished) return;

  if (selected === correctAnswer) {
    answered = true;
    btnEl.classList.add("answer-correct");
    onCorrect();
    showFeedback("ყოჩაღ! სწორია", true);

    setTimeout(() => {
      hideFeedback();
      startRound();
    }, 1500);
  } else {
    btnEl.classList.add("answer-wrong");
    showFeedback("არასწორია, დათვალე ფიგურების მნიშვნელობები ისევ", false);
    setTimeout(() => btnEl.classList.remove("answer-wrong"), 400);
  }
}
