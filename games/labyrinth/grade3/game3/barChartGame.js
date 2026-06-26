const GAME_STATE = {
  gameId: "labyrinth_g3_game3",
  island: "labyrinth",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 3,
  timeLimitSeconds: 30,
};

const CATEGORIES = [
  {
    id: "sunny",
    label: "მზიანი",
    barColor: "var(--color-gold)",
  },
  {
    id: "rainy",
    label: "წვიმიანი",
    barColor: "var(--color-blue)",
  },
  {
    id: "snowy",
    label: "თოვლიანი",
    barColor: "var(--color-purple)",
  },
];

const chartPlot = document.getElementById("chart-plot");
const promptLabel = document.getElementById("prompt-label");
const compareOptions = document.getElementById("compare-options");
const feedbackEl = document.getElementById("feedback-msg");

let roundType = null;
let answered = false;
let buildTarget = 0;

function getRandNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function shuffled(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function startRound() {
  answered = false;
  roundType = Math.random() < 0.5 ? "build" : "compare";

  if (feedbackEl) {
    feedbackEl.style.color = "";
    feedbackEl.style.display = "block";
  }

  if (roundType === "build") startBuildRound();
  else startCompareRound();
}

function startBuildRound() {
  compareOptions.style.display = "none";
  compareOptions.innerHTML = "";
  chartPlot.style.display = "flex";

  const cat = CATEGORIES[getRandNum(0, CATEGORIES.length - 1)];
  buildTarget = getRandNum(1, 10) * 10;

  promptLabel.innerHTML = `ამ კვირას <span class="orange-txt">${buildTarget}</span> დღე იყო ${cat.label}. მონიშნე სვეტი სწორ სიმაღლეზე`;
  feedbackEl.textContent = "აირჩიე სიმაღლე მარჯვენა ღერძზე";

  chartPlot.innerHTML = "";
  chartPlot.appendChild(renderBarColumn(cat, 0, true));
}

function checkBuild(value, fillEl, trackEl) {
  if (answered || gameState.isFinished) return;

  fillEl.style.height = value + "%";

  if (value === buildTarget) {
    answered = true;
    trackEl.classList.add("bar-correct");
    onCorrect();
    showFeedback(`სწორია! ${buildTarget} დღე — ზუსტად მოხერხდა!`, true);
    setTimeout(() => startRound(), 1300);
  } else {
    trackEl.classList.add("bar-wrong");
    showFeedback(`სცადე ისევ — ეს არ არის ${buildTarget}`, false);
    setTimeout(() => {
      trackEl.classList.remove("bar-wrong");
      fillEl.style.height = "0%";
    }, 500);
  }
}

function startCompareRound() {
  chartPlot.style.display = "flex";

  // ორი განსხვავებული კატეგორია
  const picks = shuffled(CATEGORIES).slice(0, 2);
  let valA = getRandNum(2, 10) * 10;
  let valB = getRandNum(1, 9) * 10;
  if (valA === valB) valB = valA > 10 ? valA - 10 : valA + 10;
  if (valA < valB) {
    [valA, valB] = [valB, valA];
  }

  const diff = valA - valB;

  promptLabel.innerHTML = `რამდენით მეტი დღე იყო <span class="orange-txt">${picks[0].label}</span>, ვიდრე <span class="orange-txt">${picks[1].label}</span>?`;
  feedbackEl.textContent = "დააკვირდი დიაგრამას და აირჩიე პასუხი";

  chartPlot.innerHTML = "";
  chartPlot.appendChild(renderBarColumn(picks[0], valA, false));
  chartPlot.appendChild(renderBarColumn(picks[1], valB, false));

  renderCompareOptions(diff);
}

function renderCompareOptions(correctDiff) {
  const options = new Set([correctDiff]);
  while (options.size < 4) {
    const offset = getRandNum(-3, 3) * 10;
    const candidate = correctDiff + offset;
    if (candidate >= 0 && candidate <= 100) options.add(candidate);
  }

  const shuffledOpts = shuffled(Array.from(options));
  compareOptions.innerHTML = "";
  compareOptions.style.display = "grid";

  shuffledOpts.forEach((val) => {
    const btn = document.createElement("button");
    btn.className = "compare-btn chalk-txt";
    btn.textContent = val;
    btn.onclick = () => checkCompare(val, correctDiff, btn);
    compareOptions.appendChild(btn);
  });
}

function checkCompare(selected, correctDiff, btnEl) {
  if (answered || gameState.isFinished) return;

  if (selected === correctDiff) {
    answered = true;
    btnEl.classList.add("compare-correct");
    onCorrect();
    showFeedback(`სწორია! სხვაობა არის ${correctDiff}`, true);
    setTimeout(() => startRound(), 1300);
  } else {
    btnEl.classList.add("compare-wrong");
    showFeedback("სცადე ისევ — დააკვირდი სვეტების სიმაღლეს", false);
    setTimeout(() => btnEl.classList.remove("compare-wrong"), 400);
  }
}

function renderBarColumn(cat, value, interactive) {
  const col = document.createElement("div");
  col.className = "bar-col";

  const track = document.createElement("div");
  track.className = "bar-track";

  const fill = document.createElement("div");
  fill.className = "bar-fill";
  fill.style.height = value + "%";
  fill.style.backgroundColor = cat.barColor;
  track.appendChild(fill);

  if (interactive) {
    for (let v = 1; v <= 10; v++) {
      const zone = document.createElement("div");
      zone.className = "tick-zone";
      zone.style.height = "10%";
      zone.style.bottom = (v - 1) * 10 + "%";
      zone.dataset.value = v * 10;
      zone.onclick = () => checkBuild(v * 10, fill, track);
      track.appendChild(zone);
    }
  }

  col.appendChild(track);

  const labelEl = document.createElement("div");
  labelEl.className = "bar-label reg-txt";
  labelEl.textContent = cat.label;
  col.appendChild(labelEl);

  return col;
}
