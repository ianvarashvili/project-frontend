const GAME_STATE = {
  gameId: "labyrinth_g4_game2",
  island: "labyrinth",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 4,
  timeLimitSeconds: 60,
};

const CATEGORIES = [
  {
    id: "sunny",
    label: "მზიანი",
    icon: `<circle cx="12" cy="12" r="5"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4" y1="12" x2="2" y2="12"/><line x1="22" y1="12" x2="20" y2="12"/><line x1="4.9" y1="4.9" x2="3.5" y2="3.5"/><line x1="20.5" y1="20.5" x2="19.1" y2="19.1"/><line x1="4.9" y1="19.1" x2="3.5" y2="20.5"/><line x1="20.5" y1="3.5" x2="19.1" y2="4.9"/>`,
    barColor: "var(--color-gold)",
  },
  {
    id: "rainy",
    label: "წვიმიანი",
    icon: `<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><line x1="9" y1="22" x2="9" y2="24"/><line x1="13" y1="22" x2="13" y2="24"/>`,
    barColor: "var(--color-blue)",
  },
  {
    id: "snowy",
    label: "თოვლიანი",
    icon: `<line x1="12" y1="2" x2="12" y2="22"/><line x1="4.2" y1="6" x2="19.8" y2="18"/><line x1="4.2" y1="18" x2="19.8" y2="6"/>`,
    barColor: "var(--color-purple)",
  },
  {
    id: "windy",
    label: "ქარიანი",
    icon: `<path d="M3 8h11a3 3 0 1 0-2.5-4.6"/><path d="M3 13h15a3 3 0 1 1-2.5 4.6"/><path d="M3 18h8"/>`,
    barColor: "var(--color-bronze)",
  },
];
const chartPlot = document.getElementById("chart-plot");
const promptLabel = document.getElementById("prompt-label");
const compareOptions = document.getElementById("compare-options");
const feedbackEl = document.getElementById("feedback-msg");

let roundType = null;
let buildTarget = 0;
let lastQuest = null;

function getRandNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function shuffled(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function multiplesOfTen(count, excludeList = []) {
  return shuffled(
    Array.from({ length: 10 }, (_, i) => (i + 1) * 10).filter(
      (v) => !excludeList.includes(v),
    ),
  ).slice(0, count);
}

function startRound() {
  gameState.isFinished = false;

  do {
    roundType = Math.random() < 0.5 ? "build" : "compare";
  } while (roundType === lastQuest);

  lastQuest = roundType;

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

  const [targetCat, refCat] = shuffled(CATEGORIES).slice(0, 2);

  const clueTypes = ["multiply", "sum", "diff"];
  const clueType = clueTypes[getRandNum(0, clueTypes.length - 1)];

  if (clueType === "multiply") {
    const base = getRandNum(1, 5) * 10; // 10-50
    const maxMultiplier = Math.floor(100 / base);
    const multiplier = getRandNum(2, Math.min(3, Math.max(2, maxMultiplier)));
    buildTarget = base * multiplier;

    promptLabel.innerHTML = `${targetCat.label} დღეები ${multiplier}-ჯერ მეტი იყო, ვიდრე ${refCat.label} (${base}). რამდენი ${targetCat.label} დღე იყო?`;
  } else if (clueType === "sum") {
    const total = getRandNum(5, 10) * 10; // 50-100
    const known = getRandNum(1, total / 10 - 1) * 10;
    buildTarget = total - known;

    promptLabel.innerHTML = `ჯამში ${total} დღე იყო ${targetCat.label} და ${refCat.label}. ${refCat.label} იყო ${known}. რამდენი ${targetCat.label} დღე იყო?`;
  } else {
    const known = getRandNum(1, 9) * 10;
    const delta = getRandNum(1, 5) * 10;
    const goesUp = Math.random() < 0.5;
    buildTarget = goesUp ? known + delta : known - delta;
    buildTarget = Math.max(10, Math.min(100, buildTarget));

    promptLabel.innerHTML = goesUp
      ? `${targetCat.label} დღეები ${delta}-ით მეტი იყო, ვიდრე ${refCat.label} (${known}). რამდენი ${targetCat.label} დღე იყო?`
      : `${targetCat.label} დღეები ${delta}-ით ნაკლები იყო, ვიდრე ${refCat.label} (${known}). რამდენი ${targetCat.label} დღე იყო?`;
  }

  feedbackEl.textContent = "გამოთვალე და მონიშნე სვეტი სწორ სიმაღლეზე";

  chartPlot.innerHTML = "";
  chartPlot.appendChild(renderBarColumn(targetCat, 0, true));
}

function checkBuild(value, fillEl, trackEl) {
  if (gameState.isFinished) return;

  fillEl.style.height = value + "%";

  if (value === buildTarget) {
    gameState.isFinished = true;
    trackEl.classList.add("bar-correct");
    onCorrect();
    showFeedback(`სწორია! სწორი პასუხი იყო ${buildTarget}!`, true);
    setTimeout(() => startRound(), 1300);
  } else {
    trackEl.classList.add("bar-wrong");
    showFeedback("სცადე ისევ — ჯერ გამოთვალე, მერე დააწექი", false);
    setTimeout(() => {
      trackEl.classList.remove("bar-wrong");
      fillEl.style.height = "0%";
    }, 500);
  }
}

function startCompareRound() {
  chartPlot.style.display = "flex";

  const picks = shuffled(CATEGORIES).slice(0, 3);
  const questionTypes = ["sum", "diff", "multiplier", "avg2", "avg3"];
  const qType = questionTypes[getRandNum(0, questionTypes.length - 1)];

  let values;
  let correctAnswer;
  let promptHtml;

  if (qType === "multiplier") {
    // ორი კატეგორია
    const small = getRandNum(1, 3) * 10;
    const multiplier = getRandNum(2, 3);
    const big = small * multiplier;
    const thirdVal = multiplesOfTen(1, [small, big])[0];

    values = [big, small, thirdVal];
    correctAnswer = multiplier;
    promptHtml = `რამდენჯერ მეტია <span class="orange-txt">${picks[0].label}</span>, ვიდრე <span class="orange-txt">${picks[1].label}</span>?`;
  } else if (qType === "sum") {
    values = multiplesOfTen(3);
    correctAnswer = values.reduce((a, b) => a + b, 0);
    promptHtml = `სულ რამდენი დღე იყო <span class="orange-txt">${picks[0].label}</span>, <span class="orange-txt">${picks[1].label}</span> და <span class="orange-txt">${picks[2].label}</span> ერთად?`;
  } else if (qType === "diff") {
    let a = getRandNum(2, 10) * 10;
    let b = getRandNum(1, 9) * 10;
    if (a === b) b = a > 10 ? a - 10 : a + 10;
    if (a < b) {
      [a, b] = [b, a];
    }
    const thirdVal = multiplesOfTen(1, [a, b])[0];

    values = [a, b, thirdVal];
    correctAnswer = a - b;
    promptHtml = `რამდენით მეტი დღე იყო <span class="orange-txt">${picks[0].label}</span>, ვიდრე <span class="orange-txt">${picks[1].label}</span>?`;
  } else if (qType === "avg2") {
    // ნებისმიერი 2 ათეულის ჯამი ლუწია
    const [a, b, c] = multiplesOfTen(3);
    values = [a, b, c];
    correctAnswer = (a + b) / 2;
    promptHtml = `რა არის <span class="orange-txt">${picks[0].label}</span> და <span class="orange-txt">${picks[1].label}</span> დღეების საშუალო რაოდენობა?`;
  } else {
    //სამივეს ჯამი უნდა იყოფოდეს 3-ზე ნაშთის გარეშე
    let a,
      b,
      c,
      attempts = 0;
    do {
      [a, b, c] = multiplesOfTen(3);
      attempts++;
    } while ((a + b + c) % 3 !== 0 && attempts < 50);

    if ((a + b + c) % 3 !== 0) {
      // c-ს ისეთ მნიშვნელობაზე ვაბრუნებთ, რომ ჯამი გაიყოს 3-ზე
      const remainder = (a + b) % 3;
      const adjust = (3 - remainder) % 3;
      c = Math.min(100, Math.max(10, c + adjust * 10));
    }

    values = [a, b, c];
    correctAnswer = (a + b + c) / 3;
    promptHtml = `რა არის <span class="orange-txt">${picks[0].label}</span>, <span class="orange-txt">${picks[1].label}</span> და <span class="orange-txt">${picks[2].label}</span> დღეების საშუალო რაოდენობა?`;
  }

  promptLabel.innerHTML = promptHtml;
  feedbackEl.textContent = "დააკვირდი დიაგრამას და აირჩიე პასუხი";

  chartPlot.innerHTML = "";
  picks.forEach((cat, i) => {
    chartPlot.appendChild(renderBarColumn(cat, values[i], false));
  });

  renderCompareOptions(correctAnswer, qType);
}

function renderCompareOptions(correct, qType) {
  const spreadMap = { multiplier: 1, sum: 20, diff: 10, avg2: 5, avg3: 5 };
  const capMap = { multiplier: 6, sum: 300, diff: 90, avg2: 100, avg3: 100 };

  const spread = spreadMap[qType];
  const cap = capMap[qType];

  const options = new Set([correct]);
  while (options.size < 4) {
    const offset = getRandNum(-3, 3) * spread;
    const candidate = correct + offset;
    if (candidate >= 0 && candidate <= cap) options.add(candidate);
  }

  const shuffledOpts = shuffled(Array.from(options));
  compareOptions.innerHTML = "";
  compareOptions.style.display = "grid";

  shuffledOpts.forEach((val) => {
    const btn = document.createElement("button");
    btn.className = "compare-btn chalk-txt";
    btn.textContent = val;
    btn.onclick = () => checkCompare(val, correct, btn);
    compareOptions.appendChild(btn);
  });
}

function checkCompare(selected, correctAnswer, btnEl) {
  if (gameState.isFinished) return;

  if (selected === correctAnswer) {
    gameState.isFinished = true;
    btnEl.classList.add("compare-correct");
    onCorrect();
    showFeedback(`სწორია! პასუხია ${correctAnswer}`, true);
    setTimeout(() => startRound(), 1300);
  } else {
    btnEl.classList.add("compare-wrong");
    showFeedback("სცადე ისევ — ყურადღებით დააკვირდი სვეტებს", false);
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
