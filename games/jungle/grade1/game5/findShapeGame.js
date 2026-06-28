const GAME_STATE = {
  gameId: "jungle_g1_game5",
  island: "jungle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};
const shapeCont = document.getElementById("shapes-cont");
const feedbackMsg = document.getElementById("feedback-msg");

const totalShapes = 12;
const boxBuffer = 70;

const shapeTemplates = {
  square: `<svg class="shape-svg square-task" viewBox="0 0 60 60"><rect x="5" y="5" width="50" height="50" rx="5" class="square-svg"/></svg>`,
  circle: `<svg class="shape-svg circle-task" viewBox="0 0 60 60"><circle cx="30" cy="30" r="25" class="circle-svg"/></svg>`,
  triangle: `<svg class="shape-svg triangle-task" viewBox="0 0 60 60"><path d="M 30,5 L 55,52 L 5,52 Z" class="triangle-svg"/></svg>`,
};

const shapeTypes = ["square", "circle", "triangle"];

const tasks = [
  { id: "square", text: "მონიშნე ყველა ოთხკუთხედი!" },
  { id: "circle", text: "მონიშნე ყველა წრე!" },
  { id: "triangle", text: "მონიშნე ყველა სამკუთხედი!" },
  {
    id: "not-square",
    text: "მონიშნე ყველა ფიგურა, რომელიც არ არის ოთხკუთხედი!",
  },
  { id: "not-circle", text: "მონიშნე ყველა ფიგურა, რომელიც არ არის წრე!" },
  {
    id: "not-triangle",
    text: "მონიშნე ყველა ფიგურა, რომელიც არ არის სამკუთხედი!",
  },
];

let currentTask = null;
let placedShapes = [];

function isOverLap(x, y) {
  for (let i = 0; i < placedShapes.length; i++) {
    const other = placedShapes[i];
    if (
      Math.abs(x - other.x) < boxBuffer &&
      Math.abs(y - other.y) < boxBuffer
    ) {
      return true;
    }
  }
  return false;
}

function startRound() {
  feedbackMsg.style.color = "";
  shapeCont.innerHTML = "";
  placedShapes = [];

  currentTask = tasks[Math.floor(Math.random() * tasks.length)];
  feedbackMsg.textContent = currentTask.text;
  feedbackMsg.style.color = "var(--color-text)";
  const boxWidth = shapeCont.clientWidth;
  const boxHeight = shapeCont.clientHeight;

  for (let i = 0; i < totalShapes; i++) {
    const randType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

    shapeCont.insertAdjacentHTML("beforeend", shapeTemplates[randType]);
    const shapeEl = shapeCont.lastElementChild;

    let posX, posY;
    let attempts = 0;

    do {
      posX = Math.floor(Math.random() * (boxWidth - 70)) + 5;
      posY = Math.floor(Math.random() * (boxHeight - 70)) + 5;
      attempts++;
    } while (isOverLap(posX, posY) && attempts < 150);
    placedShapes.push({ x: posX, y: posY });
    shapeEl.style.left = `${posX}px`;
    shapeEl.style.top = `${posY}px`;

    shapeEl.addEventListener("click", () => {
      shapeEl.classList.toggle("selected");
    });
  }
}

function checkAns() {
  if (gameState.isFinished) return;
  const allShapes = document.querySelectorAll(".shape-svg");
  let isCorrect = true;
  let hasSelection = false;

  allShapes.forEach((shape) => {
    const isSelected = shape.classList.contains("selected");
    if (isSelected) hasSelection = true;
    let shouldBeSelected = false;

    if (
      currentTask.id === "square" &&
      shape.classList.contains("square-task")
    ) {
      shouldBeSelected = true;
    } else if (
      currentTask.id === "circle" &&
      shape.classList.contains("circle-task")
    ) {
      shouldBeSelected = true;
    } else if (
      currentTask.id === "triangle" &&
      shape.classList.contains("triangle-task")
    ) {
      shouldBeSelected = true;
    } else if (
      currentTask.id === "not-circle" &&
      !shape.classList.contains("circle-task")
    ) {
      shouldBeSelected = true;
    } else if (
      currentTask.id === "not-square" &&
      !shape.classList.contains("square-task")
    ) {
      shouldBeSelected = true;
    } else if (
      currentTask.id === "not-triangle" &&
      !shape.classList.contains("triangle-task")
    ) {
      shouldBeSelected = true;
    }
    if (shouldBeSelected !== isSelected) {
      isCorrect = false;
    }
  });
  if (!hasSelection) {
    feedbackMsg.textContent = "ჯერ მონიშნე ფიგურები!";
    return;
  }
  if (isCorrect) {
    onCorrect();
    showFeedback("ყოჩაღ, სწორია!", true);

    setTimeout(() => {
      startRound();
    }, 2000);
  } else {
    showFeedback("რაღაც შეცდომაა... თავიდან სცადე!", false);
  }
}

function resetSelect() {
  if (gameState.isFinished) return;
  const allShapes = document.querySelectorAll(".shape-svg");
  allShapes.forEach((shape) => shape.classList.remove("selected"));
  feedbackMsg.textContent = currentTask.text;
  feedbackMsg.style.color = "var(--color-text)";
}
