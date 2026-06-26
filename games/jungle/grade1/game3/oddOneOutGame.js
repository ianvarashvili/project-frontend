const GAME_STATE = {
  gameId: "jungle_g1_game3",
  island: "jungle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};

const SHAPES = [
  { id: "circle", nameKa: "წრეები", nameSing: "წრე" },
  { id: "triangle", nameKa: "სამკუთხედები", nameSing: "სამკუთხედი" },
  { id: "square", nameKa: "კვადრატები", nameSing: "კვადრატი" },
  { id: "rectangle", nameKa: "მართკუთხედები", nameSing: "მართკუთხედი" },
  { id: "pentagon", nameKa: "ხუთკუთხედები", nameSing: "ხუთკუთხედი" },
  { id: "hexagon", nameKa: "ექვსკუთხედები", nameSing: "ექვსკუთხედი" },
];

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
let answered = false;

function startRound() {
  if (feedbackEl) feedbackEl.style.color = "";
  answered = false;

  const groupShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const oddPool = SHAPES.filter((s) => s.id !== groupShape.id);
  const oddShape = oddPool[Math.floor(Math.random() * oddPool.length)];

  const colors = [...PALETTE].sort(() => Math.random() - 0.5).slice(0, 4);

  const items = [
    { shape: groupShape, color: colors[0] },
    { shape: groupShape, color: colors[1] },
    { shape: groupShape, color: colors[2] },
    { shape: oddShape, color: colors[3], isOdd: true },
  ].sort(() => Math.random() - 0.5);

  const oddIndex = items.findIndex((i) => i.isOdd);

  currentRound = { items, oddIndex, groupShape };

  if (feedbackEl) {
    feedbackEl.innerHTML = 'ვინ <span class="orange-txt">არ ჯდება?</span>';
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
  if (answered || gameState.isFinished) return;

  const cards = gridEl.querySelectorAll(".shape-card");

  if (index === currentRound.oddIndex) {
    answered = true;
    onCorrect();
    cards[index].classList.add("card-correct");
    showFeedback(`სწორია! ყველა ${currentRound.groupShape.nameKa} იყო!`, true);
    setTimeout(() => startRound(), 1400);
  } else {
    cards[index].classList.add("card-wrong");
    setTimeout(() => cards[index].classList.remove("card-wrong"), 500);
    showFeedback("ისევ სცადე!", false);
  }
}

function getShapeSVG(type, color) {
  const fillClass = `fill-dynamic-${Math.random().toString(36).slice(2, 7)}`;

  let shapeEl = "";
  switch (type) {
    case "circle":
      shapeEl = `<circle cx="50" cy="50" r="38" class="${fillClass}"/>`;
      break;
    case "triangle":
      shapeEl = `<polygon points="50,12 88,82 12,82" class="${fillClass}" stroke-linejoin="round"/>`;
      break;
    case "square":
      shapeEl = `<rect x="12" y="12" width="76" height="76" rx="6" class="${fillClass}"/>`;
      break;
    case "rectangle":
      shapeEl = `<rect x="8" y="24" width="84" height="52" rx="6" class="${fillClass}"/>`;
      break;
    case "pentagon":
      shapeEl = `<polygon points="50,10 90,38 74,84 26,84 10,38" class="${fillClass}" stroke-linejoin="round"/>`;
      break;
    case "hexagon":
      shapeEl = `<polygon points="50,8 86,29 86,71 50,92 14,71 14,29" class="${fillClass}" stroke-linejoin="round"/>`;
      break;
  }

  return `
    <style>.${fillClass} { fill: ${color}; }</style>
    <svg class="shape-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      ${shapeEl}
    </svg>`;
}
