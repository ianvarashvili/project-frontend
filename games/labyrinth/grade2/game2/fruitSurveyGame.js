const GAME_STATE = {
  gameId: "labyrinth_g2_game2",
  island: "labyrinth",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 2,
  timeLimitSeconds: 45,
};

const FRUITS = [
  {
    id: "strawberry",
    name: "მარწყვი",
    color: "var(--color-red)",
    svg: `<path d="M32 12 C46 12 52 26 46 40 C42 50 22 50 18 40 C12 26 18 12 32 12 Z" fill="#E0334D" stroke="var(--color-text)" stroke-width="2"/>
          <path d="M24 13 L32 5 L40 13 L32 18 Z" fill="#3FA34D" stroke="var(--color-text)" stroke-width="1.5"/>
          <circle cx="26" cy="26" r="1.3" fill="#fff"/>
          <circle cx="36" cy="24" r="1.3" fill="#fff"/>
          <circle cx="30" cy="36" r="1.3" fill="#fff"/>
          <circle cx="38" cy="34" r="1.3" fill="#fff"/>`,
  },
  {
    id: "apple",
    name: "ვაშლი",
    color: "var(--color-primary)",
    svg: `<path d="M32 18 C40 14 50 20 50 32 C50 44 40 52 32 52 C24 52 14 44 14 32 C14 20 24 14 32 18 Z" fill="#E25921" stroke="var(--color-text)" stroke-width="2"/>
          <path d="M32 18 L32 10" stroke="var(--color-text)" stroke-width="2"/>
          <path d="M32 12 C36 8 40 10 40 14" fill="#3FA34D" stroke="var(--color-text)" stroke-width="1.5"/>`,
  },
  {
    id: "orange",
    name: "ფორთოხალი",
    color: "var(--color-gold)",
    svg: `<circle cx="32" cy="33" r="20" fill="#F59E0B" stroke="var(--color-text)" stroke-width="2"/>
          <path d="M32 13 L32 8" stroke="var(--color-text)" stroke-width="2"/>
          <path d="M30 9 C34 6 38 8 37 12" fill="#3FA34D" stroke="var(--color-text)" stroke-width="1.5"/>`,
  },
  {
    id: "watermelon",
    name: "საზამთრო",
    color: "var(--color-green)",
    svg: `<g transform="translate(0,10)">
          <path d="M4 32 A28 28 0 0 1 60 32 Z" fill="#9ACD32" stroke="var(--color-text)" stroke-width="2"/>
          <path d="M9 32 A23 23 0 0 1 55 32 Z" fill="#FF6B6B" stroke="none"/>
          <circle cx="22" cy="24" r="1.6" fill="var(--color-text)"/>
          <circle cx="32" cy="20" r="1.6" fill="var(--color-text)"/>
          <circle cx="42" cy="24" r="1.6" fill="var(--color-text)"/>
        </g>`,
  },
  {
    id: "banana",
    name: "ბანანი",
    color: "#F1C40F",
    svg: `<g>
    <path d="M 16 46 C 26 52, 43 45, 49 18 C 51 13, 46 11, 43 16 C 33 34, 23 37, 17 34 C 13 32, 12 41, 16 46 Z"
          fill="#F1C40F" stroke="var(--color-text)" stroke-width="2" stroke-linejoin="round"/>
    
    <path d="M 22 43 C 31 43, 40 34, 45 22" 
          fill="none" stroke="var(--color-text)" stroke-width="1.2" opacity="0.7"/>
          
    <path d="M 49 18 C 51 13, 54 10, 51 8 C 48 6, 46 11, 43 16 Z" 
          fill="#5D4037" stroke="var(--color-text)" stroke-width="1.5"/>
          
    <path d="M 16 46 C 15 47, 13 49, 14 50 C 16 51, 18 48, 16 46 Z" 
          fill="#3E2723" stroke="var(--color-text)" stroke-width="1"/>
  </g>`,
  },
  {
    id: "grape",
    name: "ყურძენი",
    color: "var(--color-purple)",
    svg: `<line x1="32" y1="6" x2="32" y2="14" stroke="var(--color-text)" stroke-width="2"/>
        <ellipse cx="38" cy="7" rx="5" ry="3" fill="#3FA34D" stroke="var(--color-text)" stroke-width="1.2"/>
        <circle cx="32" cy="18" r="6.5" fill="#9B59B6" stroke="var(--color-text)" stroke-width="1.5"/>
        <circle cx="24" cy="28" r="6.5" fill="#9B59B6" stroke="var(--color-text)" stroke-width="1.5"/>
        <circle cx="40" cy="28" r="6.5" fill="#9B59B6" stroke="var(--color-text)" stroke-width="1.5"/>
        <circle cx="18" cy="38" r="6.5" fill="#9B59B6" stroke="var(--color-text)" stroke-width="1.5"/>
        <circle cx="32" cy="38" r="6.5" fill="#9B59B6" stroke="var(--color-text)" stroke-width="1.5"/>
        <circle cx="46" cy="38" r="6.5" fill="#9B59B6" stroke="var(--color-text)" stroke-width="1.5"/>
        <circle cx="25" cy="48" r="6.5" fill="#9B59B6" stroke="var(--color-text)" stroke-width="1.5"/>
        <circle cx="39" cy="48" r="6.5" fill="#9B59B6" stroke="var(--color-text)" stroke-width="1.5"/>`,
  },
];

const MAX_SCALE = 8;

const chartPlot = document.getElementById("chart-plot");
const promptLabel = document.getElementById("prompt-label");
const optionsEl = document.getElementById("answer-options");
const feedbackEl = document.getElementById("feedback-msg");

let answered = false;
let currentChart = null;

function getRandNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function shuffled(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function startRound() {
  if (feedbackEl) feedbackEl.style.color = "";
  answered = false;

  const picks = shuffled(FRUITS).slice(0, 3);

  const values = shuffled(
    Array.from({ length: MAX_SCALE }, (_, i) => i + 1),
  ).slice(0, 3);

  currentChart = picks.map((fruit, i) => ({ fruit, value: values[i] }));

  renderChart();
  generateQuestion();
}
function renderChart() {
  chartPlot.innerHTML = "";
  currentChart.forEach((entry) => {
    chartPlot.appendChild(renderBarColumn(entry.fruit, entry.value));
  });
}

function renderBarColumn(fruit, value) {
  const col = document.createElement("div");
  col.className = "bar-col";

  const track = document.createElement("div");
  track.className = "bar-track";

  const fill = document.createElement("div");
  fill.className = "bar-fill";
  fill.style.height = (value / MAX_SCALE) * 100 + "%";
  fill.style.backgroundColor = fruit.color;

  const topper = document.createElement("div");
  topper.className = "bar-topper";
  topper.innerHTML = `<svg viewBox="0 0 64 64">${fruit.svg}</svg>`;
  fill.appendChild(topper);

  track.appendChild(fill);
  col.appendChild(track);

  const labelEl = document.createElement("div");
  labelEl.className = "bar-label reg-txt";
  labelEl.textContent = fruit.name;
  col.appendChild(labelEl);

  return col;
}

function generateQuestion() {
  const types = ["max", "specific", "total", "compare"];
  const type = types[getRandNum(0, types.length - 1)];

  if (type === "max") return askMax();
  if (type === "specific") return askSpecific();
  if (type === "total") return askTotal();
  return askCompare();
}

function askMax() {
  const sorted = [...currentChart].sort((a, b) => b.value - a.value);
  const correct = sorted[0].fruit;

  promptLabel.innerHTML = `რომელი ხილი აირჩია <span class="orange-txt">ყველაზე მეტმა</span> ბავშვმა?`;
  feedbackEl.textContent = "დააკვირდი დიაგრამას";

  const decoyPool = FRUITS.filter(
    (f) => !currentChart.some((c) => c.fruit.id === f.id),
  );
  const decoy = decoyPool[getRandNum(0, decoyPool.length - 1)];
  const optionFruits = shuffled([...currentChart.map((c) => c.fruit), decoy]);

  renderOptions(
    optionFruits.map((f) => ({
      label: f.name,
      isCorrect: f.id === correct.id,
    })),
  );
}

function askSpecific() {
  const target = currentChart[getRandNum(0, currentChart.length - 1)];

  promptLabel.innerHTML = `რამდენმა ბავშვმა აირჩია <span class="orange-txt">${target.fruit.name}</span>?`;
  feedbackEl.textContent = "დააკვირდი სვეტსა და ღერძს";

  renderOptions(buildNumericOptions(target.value, MAX_SCALE));
}

function askTotal() {
  const total = currentChart.reduce((sum, c) => sum + c.value, 0);

  promptLabel.innerHTML = `სულ <span class="orange-txt">რამდენი</span> ბავშვი გამოიკითხეს?`;
  feedbackEl.textContent = "შეკრიბე სამივე სვეტის მნიშვნელობა";

  renderOptions(buildNumericOptions(total, MAX_SCALE * 3));
}

function askCompare() {
  const [a, b] = shuffled(currentChart).slice(0, 2);
  const hi = a.value >= b.value ? a : b;
  const lo = a.value >= b.value ? b : a;
  const diff = hi.value - lo.value;

  promptLabel.innerHTML = `რამდენით მეტმა ბავშვმა აირჩია <span class="orange-txt">${hi.fruit.name}</span>, ვიდრე <span class="orange-txt">${lo.fruit.name}</span>?`;
  feedbackEl.textContent = "იპოვე სვეტების სხვაობა";

  renderOptions(buildNumericOptions(diff, MAX_SCALE));
}

function buildNumericOptions(correct, maxBound) {
  const options = new Set([correct]);
  while (options.size < 4) {
    const offset = getRandNum(-3, 3);
    const candidate = correct + offset;
    if (candidate >= 0 && candidate <= maxBound) options.add(candidate);
  }
  return shuffled(Array.from(options)).map((val) => ({
    label: String(val),
    isCorrect: val === correct,
  }));
}

function renderOptions(opts) {
  optionsEl.innerHTML = "";
  opts.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn chalk-txt";
    btn.textContent = opt.label;
    btn.onclick = () => checkAnswer(opt.isCorrect, btn);
    optionsEl.appendChild(btn);
  });
}

function checkAnswer(isCorrect, btnEl) {
  if (answered || gameState.isFinished) return;

  if (isCorrect) {
    answered = true;
    btnEl.classList.add("answer-correct");
    onCorrect();
    showFeedback("სწორია! კარგად წაიკითხე დიაგრამა!", true);
    setTimeout(() => startRound(), 1300);
  } else {
    btnEl.classList.add("answer-wrong");
    showFeedback("სცადე ისევ — დააკვირდი დიაგრამას", false);
    setTimeout(() => btnEl.classList.remove("answer-wrong"), 400);
  }
}
