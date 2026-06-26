const GAME_STATE = {
  gameId: "labyrinth_g2_game4",
  island: "labyrinth",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 2,
  timeLimitSeconds: 30,
};

const FRUIT_ICONS = [
  {
    id: "apple",
    svg: `<path d="M32 18 C40 14 50 20 50 32 C50 44 40 52 32 52 C24 52 14 44 14 32 C14 20 24 14 32 18 Z" fill="#E25921" stroke="var(--color-text)" stroke-width="3"/>
          <path d="M32 18 L32 9" stroke="var(--color-text)" stroke-width="3"/>
          <path d="M32 12 C36 7 41 9 40 14" fill="#3FA34D" stroke="var(--color-text)" stroke-width="2"/>`,
  },
  {
    id: "orange",
    svg: `<circle cx="32" cy="34" r="20" fill="#F59E0B" stroke="var(--color-text)" stroke-width="3"/>
          <path d="M32 14 L32 8" stroke="var(--color-text)" stroke-width="3"/>
          <path d="M29 9 C34 5 39 8 37 13" fill="#3FA34D" stroke="var(--color-text)" stroke-width="2"/>`,
  },
  {
    id: "strawberry",
    svg: `<path d="M32 14 C46 14 52 27 46 40 C42 50 22 50 18 40 C12 27 18 14 32 14 Z" fill="#E0334D" stroke="var(--color-text)" stroke-width="3"/>
          <path d="M22 15 L32 6 L42 15 L32 19 Z" fill="#3FA34D" stroke="var(--color-text)" stroke-width="2"/>
          <circle cx="26" cy="27" r="1.6" fill="#fff"/>
          <circle cx="38" cy="25" r="1.6" fill="#fff"/>
          <circle cx="30" cy="37" r="1.6" fill="#fff"/>
          <circle cx="40" cy="35" r="1.6" fill="#fff"/>`,
  },
  {
    id: "grape",
    svg: `<line x1="32" y1="8" x2="32" y2="15" stroke="var(--color-text)" stroke-width="2.5"/>
          <ellipse cx="38" cy="9" rx="5.5" ry="3.5" fill="#3FA34D" stroke="var(--color-text)" stroke-width="1.5"/>
          <circle cx="32" cy="20" r="7" fill="#9B59B6" stroke="var(--color-text)" stroke-width="2"/>
          <circle cx="23" cy="30" r="7" fill="#9B59B6" stroke="var(--color-text)" stroke-width="2"/>
          <circle cx="41" cy="30" r="7" fill="#9B59B6" stroke="var(--color-text)" stroke-width="2"/>
          <circle cx="16" cy="41" r="7" fill="#9B59B6" stroke="var(--color-text)" stroke-width="2"/>
          <circle cx="32" cy="41" r="7" fill="#9B59B6" stroke="var(--color-text)" stroke-width="2"/>
          <circle cx="48" cy="41" r="7" fill="#9B59B6" stroke="var(--color-text)" stroke-width="2"/>`,
  },
];

const gridEl = document.getElementById("cards-grid");
const feedbackEl = document.getElementById("feedback-msg");

let currentRound = null;
let answered = false;

function getRandNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function shuffled(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
function startRound() {
  answered = false;

  const fruit = FRUIT_ICONS[getRandNum(0, FRUIT_ICONS.length - 1)];

  const majorityIsOdd = Math.random() < 0.5;

  const evens = [2, 4, 6, 8, 10];
  const odds = [3, 5, 7, 9, 11];

  const majorityPool = majorityIsOdd ? odds : evens;
  const minorityPool = majorityIsOdd ? evens : odds;

  const majorityCounts = shuffled(majorityPool).slice(0, 3);
  const oddOneCount = minorityPool[getRandNum(0, minorityPool.length - 1)];

  const items = [
    ...majorityCounts.map((c) => ({ count: c, isOdd: false })),
    { count: oddOneCount, isOdd: true },
  ];

  const shuffledItems = shuffled(items);
  const oddIndex = shuffledItems.findIndex((i) => i.isOdd);

  currentRound = { items: shuffledItems, oddIndex, fruit, majorityIsOdd };

  if (feedbackEl) {
    feedbackEl.innerHTML =
      'რომელი ბარათი <span class="orange-txt">არ ჯდება?</span>';
    feedbackEl.style.color = "";
    feedbackEl.style.display = "block";
  }

  renderGrid();
}

function renderGrid() {
  gridEl.innerHTML = "";

  currentRound.items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "count-card";

    const iconsWrap = document.createElement("div");
    iconsWrap.className = "icons-wrap";
    for (let i = 0; i < item.count; i++) {
      const iconDiv = document.createElement("div");
      iconDiv.className = "mini-icon";
      iconDiv.innerHTML = `<svg viewBox="0 0 64 64">${currentRound.fruit.svg}</svg>`;
      iconsWrap.appendChild(iconDiv);
    }
    card.appendChild(iconsWrap);

    const countLabel = document.createElement("div");
    countLabel.className = "count-label chalk-txt";
    countLabel.textContent = item.count;
    card.appendChild(countLabel);

    card.onclick = () => checkAns(index);
    gridEl.appendChild(card);
  });
}

function checkAns(index) {
  if (answered || gameState.isFinished) return;

  const cards = gridEl.querySelectorAll(".count-card");

  if (index === currentRound.oddIndex) {
    answered = true;
    onCorrect();
    cards[index].classList.add("card-correct");

    const parityWord = currentRound.majorityIsOdd ? "კენტი" : "ლუწი";
    showFeedback(`სწორია! დანარჩენი ${parityWord} რიცხვებია!`, true);
    setTimeout(() => startRound(), 1400);
  } else {
    cards[index].classList.add("card-wrong");
    setTimeout(() => cards[index].classList.remove("card-wrong"), 500);
    showFeedback("ისევ დაითვალე — ლუწია თუ კენტი?", false);
  }
}
