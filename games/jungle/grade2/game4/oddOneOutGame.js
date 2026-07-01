const GAME_STATE = {
  gameId: "jungle_g2_game4",
  island: "jungle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 2,
  timeLimitSeconds: 30,
};

const SHAPES_2D = [
  { id: "circle", nameKa: "წრე", dim: "2d" },
  { id: "triangle", nameKa: "სამკუთხედი", dim: "2d" },
  { id: "square", nameKa: "კვადრატი", dim: "2d" },
  { id: "rectangle", nameKa: "მართკუთხედი", dim: "2d" },
  { id: "pentagon", nameKa: "ხუთკუთხედი", dim: "2d" },
  { id: "hexagon", nameKa: "ექვსკუთხედი", dim: "2d" },
];

const SHAPES_3D = [
  { id: "cube", nameKa: "კუბი", dim: "3d" },
  { id: "sphere", nameKa: "სფერო", dim: "3d" },
  { id: "pyramid", nameKa: "პირამიდა", dim: "3d" },
  { id: "cylinder", nameKa: "ცილინდრი", dim: "3d" },
];

const ALL_SHAPES = [...SHAPES_2D, ...SHAPES_3D];

const PALETTE = [
  "#fee8d5",
  "#dbeafe",
  "#d1fae5",
  "#ede9fe",
  "#f9eed9",
  "#dfcca9",
];

const gridEl = document.getElementById("shapes-grid");
const feedbackEl = document.getElementById("feedback-msg");

let currentRound = null;
let lastFeedbackText = "";

function startRound() {
  if (feedbackEl) feedbackEl.style.color = "";
  gameState.isFinished = false;

  let colors, ruleType, items, oddIndex, feedbackText;
  do {
    colors = [...PALETTE].sort(() => Math.random() - 0.5).slice(0, 4);
    ruleType = Math.random() < 0.6 ? "type" : "dim";

    if (ruleType === "type") {
      const group = ALL_SHAPES[Math.floor(Math.random() * ALL_SHAPES.length)];
      const oddPool = ALL_SHAPES.filter((s) => s.id !== group.id);
      const odd = oddPool[Math.floor(Math.random() * oddPool.length)];

      items = [
        { shape: group, color: colors[0] },
        { shape: group, color: colors[1] },
        { shape: group, color: colors[2] },
        { shape: odd, color: colors[3], isOdd: true },
      ];
      feedbackText = `სწორია! ყველა ${group.nameKa} იყო!`;
    } else {
      const groupIs2D = Math.random() < 0.5;
      const groupPool = groupIs2D ? SHAPES_2D : SHAPES_3D;
      const oddPool = groupIs2D ? SHAPES_3D : SHAPES_2D;

      const [s1, s2, s3] = [...groupPool].sort(() => Math.random() - 0.5);
      const odd = oddPool[Math.floor(Math.random() * oddPool.length)];

      items = [
        { shape: s1, color: colors[0] },
        { shape: s2, color: colors[1] },
        { shape: s3, color: colors[2] },
        { shape: odd, color: colors[3], isOdd: true },
      ];
      feedbackText = groupIs2D
        ? "სწორია! ყველა ბრტყელი ფიგურა იყო!"
        : "სწორია! ყველა სივრცული ფიგურა იყო!";
    }
  } while (feedbackText === lastFeedbackText);
  lastFeedbackText = feedbackText;

  items = items.sort(() => Math.random() - 0.5);
  oddIndex = items.findIndex((i) => i.isOdd);

  currentRound = { items, oddIndex, feedbackText };

  if (feedbackEl) {
    feedbackEl.innerHTML = 'რომელია <span class="orange-txt">ზედმეტი?</span>';
    feedbackEl.style.color = "";
    feedbackEl.style.display = "block";
  }

  renderGrid();
}

function renderGrid() {
  gridEl.innerHTML = "";
  currentRound.items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "shape-card";
    card.innerHTML = getShapeSVG(item.shape.id, item.color);
    card.onclick = () => checkAns(index);
    gridEl.appendChild(card);
  });
}

function checkAns(index) {
  if (gameState.isFinished) return;
  const cards = gridEl.querySelectorAll(".shape-card");

  if (index === currentRound.oddIndex) {
    gameState.isFinished = true;
    onCorrect();
    cards[index].classList.add("card-correct");
    showFeedback(currentRound.feedbackText, true);
    setTimeout(() => startRound(), 1400);
  } else {
    cards[index].classList.add("card-wrong");
    setTimeout(() => cards[index].classList.remove("card-wrong"), 500);
    showFeedback("ისევ სცადე!", false);
  }
}

function getShapeSVG(type, color) {
  const fc = "f" + Math.random().toString(36).slice(2, 9);
  const sh1 = "rgba(39,38,36,0.15)";
  const sh2 = "rgba(39,38,36,0.28)";

  let inner = "";

  switch (type) {
    case "circle":
      inner = `<circle cx="50" cy="50" r="38" class="${fc}"/>`;
      break;
    case "triangle":
      inner = `<polygon points="50,12 88,82 12,82" class="${fc}" stroke-linejoin="round"/>`;
      break;
    case "square":
      inner = `<rect x="12" y="12" width="76" height="76" rx="6" class="${fc}"/>`;
      break;
    case "rectangle":
      inner = `<rect x="8" y="24" width="84" height="52" rx="6" class="${fc}"/>`;
      break;
    case "pentagon":
      inner = `<polygon points="50,10 90,38 74,84 26,84 10,38" class="${fc}" stroke-linejoin="round"/>`;
      break;
    case "hexagon":
      inner = `<polygon points="50,8 86,29 86,71 50,92 14,71 14,29" class="${fc}" stroke-linejoin="round"/>`;
      break;

    case "cube":
      inner = `
        <polygon points="50,17 79,33 50,50 21,33" class="${fc}" stroke-linejoin="round"/>
        <polygon points="79,33 79,66 50,83 50,50" class="${fc}" stroke-linejoin="round"/>
        <polygon points="79,33 79,66 50,83 50,50" style="fill:${sh1};stroke:none"/>
        <polygon points="21,33 50,50 50,83 21,66" class="${fc}" stroke-linejoin="round"/>
        <polygon points="21,33 50,50 50,83 21,66" style="fill:${sh2};stroke:none"/>`;
      break;

    case "sphere":
      inner = `
        <circle cx="50" cy="52" r="38" class="${fc}"/>
        <ellipse cx="56" cy="64" rx="26" ry="18" style="fill:${sh1};stroke:none"/>
        <circle cx="37" cy="36" r="9" style="fill:rgba(255,255,255,0.45);stroke:none"/>`;
      break;

    case "pyramid":
      inner = `
        <polygon points="50,82 79,67 50,52 21,67" class="${fc}" style="opacity:0.55" stroke-linejoin="round"/>
        <polygon points="21,67 50,82 50,18" class="${fc}" stroke-linejoin="round"/>
        <polygon points="79,67 50,82 50,18" class="${fc}" stroke-linejoin="round"/>
        <polygon points="79,67 50,82 50,18" style="fill:${sh2};stroke:none"/>
        <line x1="50" y1="18" x2="50" y2="52"
          style="stroke:var(--color-text);stroke-width:1.5;stroke-dasharray:4,3;opacity:0.4"/>`;
      break;

    case "cylinder":
      inner = `
        <rect x="23" y="33" width="54" height="42" class="${fc}" style="stroke:none"/>
        <line x1="23" y1="33" x2="23" y2="75" style="stroke:var(--color-text);stroke-width:3"/>
        <line x1="77" y1="33" x2="77" y2="75" style="stroke:var(--color-text);stroke-width:3"/>
        <ellipse cx="50" cy="75" rx="27" ry="9" class="${fc}"/>
        <ellipse cx="50" cy="75" rx="27" ry="9" style="fill:${sh1};stroke:none"/>
        <ellipse cx="50" cy="33" rx="27" ry="9" class="${fc}"/>`;
      break;
  }

  return `<style>.${fc}{fill:${color}}</style>
    <svg class="shape-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      ${inner}
    </svg>`;
}
