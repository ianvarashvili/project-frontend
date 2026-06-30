const GAME_STATE = {
  gameId: "labyrinth_g3_game4",
  island: "labyrinth",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 3,
  timeLimitSeconds: 50,
};

const SHAPES = [
  { id: "triangle", label: "სამკუთხედი" },
  { id: "square", label: "კვადრატი" },
  { id: "circle", label: "წრე" },
  { id: "diamond", label: "რომბი" },
];

let SHAPE_VALUES = {};
let currentExpression = null;
let lastAnswer = null;

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

function getRandNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function assignShapeValues() {
  const pool = shuffleArray([3, 4, 5, 6, 7, 8, 9, 10]);
  SHAPES.forEach((shape, i) => {
    SHAPE_VALUES[shape.id] = pool[i];
  });
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
  const SHAPE_COUNT = 3;
  const OP_POOL = ["+", "-", "×", "÷"];

  let finalExpr = null;

  do {
    const picks = pickShapes(SHAPE_COUNT);
    const ops = [];
    const coeffs = [];

    const firstCoeff = Math.random() < 0.35 ? getRandNum(2, 3) : 1;
    coeffs.push(firstCoeff);

    let terms = [{ sign: "+", value: SHAPE_VALUES[picks[0].id] * firstCoeff }];

    for (let i = 1; i < picks.length; i++) {
      const value = SHAPE_VALUES[picks[i].id];
      let op = OP_POOL[Math.floor(Math.random() * OP_POOL.length)];

      const lastTerm = terms[terms.length - 1];
      const runningTotal = terms.reduce(
        (sum, t) => sum + (t.sign === "-" ? -t.value : t.value),
        0,
      );

      if (op === "×" && lastTerm.value * value > 200) op = "+";
      if (op === "÷" && (value === 0 || lastTerm.value % value !== 0)) op = "+";
      if (op === "-" && runningTotal - value < 0) op = "+";

      coeffs.push(1);
      ops.push(op);

      if (op === "×") {
        lastTerm.value *= value;
      } else if (op === "÷") {
        lastTerm.value /= value;
      } else if (op === "-") {
        terms.push({ sign: "-", value });
      } else {
        terms.push({ sign: "+", value });
      }
    }

    const answer = terms.reduce(
      (sum, t) => sum + (t.sign === "-" ? -t.value : t.value),
      0,
    );

    finalExpr = { shapes: picks, ops, coeffs, answer };
  } while (lastAnswer !== null && finalExpr.answer === lastAnswer);

  lastAnswer = finalExpr.answer;

  return finalExpr;
}
function startRound() {
  gameState.isFinished = false;
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
  let html = "";

  if (expr.coeffs[0] > 1) {
    html += `<span class="equation-operator">${expr.coeffs[0]}×</span>`;
  }
  html += shapeIconMarkup(expr.shapes[0].id, "size-lg");

  expr.ops.forEach((op, i) => {
    html += `<span class="equation-operator">${op}</span>`;
    html += shapeIconMarkup(expr.shapes[i + 1].id, "size-lg");
  });

  html += `<span class="equation-equals">=</span>`;
  html += `<div class="equation-question">?</div>`;

  equationCard.innerHTML = html;
}

function renderOptions(correctAnswer) {
  const options = new Set([correctAnswer]);
  const range = Math.max(3, Math.round(correctAnswer * 0.25));

  while (options.size < 4) {
    const offset = Math.floor(Math.random() * (range * 2 + 1)) - range;
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
  if (gameState.isFinished) return;

  if (selected === correctAnswer) {
    gameState.isFinished = true;
    btnEl.classList.add("answer-correct");
    onCorrect();
    showFeedback("ყოჩაღ! სწორი", true);

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
