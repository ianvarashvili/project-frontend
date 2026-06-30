const GAME_STATE = {
  gameId: "jungle_g2_game5",
  island: "jungle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 2,
  timeLimitSeconds: 30,
};

const allShapes = [
  { id: "2d-circle", type: "2d" },
  { id: "2d-square", type: "2d" },
  { id: "2d-triangle", type: "2d" },
  { id: "2d-rect", type: "2d" },
  { id: "3d-cube", type: "3d" },
  { id: "3d-cylinder", type: "3d" },
  { id: "3d-cone", type: "3d" },
];

let draggedEl = null;

const pool = document.getElementById("shapes-pool");
const feedbackMsg = document.getElementById("feedback-msg");

function startRound() {
  gameState.isFinished = false;
  feedbackMsg.style.color = "";
  document
    .querySelectorAll(".box .box-content")
    .forEach((el) => (el.innerHTML = ""));

  const shuffled = [...allShapes].sort(() => 0.5 - Math.random());
  const roundShapes = shuffled.slice(0, 4);

  pool.innerHTML = "";
  feedbackMsg.style.color = "var(--color-text)";
  feedbackMsg.textContent = "ჩაალაგე ფიგურები შესაბამის ყუთებში!";

  roundShapes.forEach((allShapes, index) => {
    const card = document.createElement("div");
    card.className = "shape-card";
    card.id = `shape-${index}`;
    card.draggable = true;
    card.dataset.type = allShapes.type;
    card.innerHTML = `<svg> <use href="#${allShapes.id}"></use></svg>`;

    card.addEventListener("dragstart", (e) => {
      draggedEl = card;
      e.dataTransfer.setData("text/plain", card.id);
    });

    card.addEventListener("touchstart", () => {
      draggedEl = card;
    });

    pool.appendChild(card);
  });
}

document.querySelectorAll(".box").forEach((box) => {
  box.addEventListener("dragover", (e) => e.preventDefault());
  box.addEventListener("dragenter", () => box.classList.add("hover"));
  box.addEventListener("dragleave", () => box.classList.remove("hover"));

  box.addEventListener("drop", (e) => {
    box.classList.remove("hover");

    if (draggedEl) {
      box.querySelector(".box-content").appendChild(draggedEl);
      draggedEl = null;
    }
  });
  box.addEventListener("click", (e) => {
    const card = e.target.closest(".shape-card");

    if (card) {
      pool.appendChild(card);
    }
  });
});

function checkAns() {
  if (gameState.isFinished) return;
  if (pool.querySelectorAll(".shape-card").length > 0) {
    showFeedback("ჯერ ყველა ფიგურა გადაანაწილე!", false);

    return;
  }
  let allCorrect = true;
  const boxes = document.querySelectorAll(".box");

  boxes.forEach((box) => {
    const targetType = box.dataset.type;
    const itemInside = box.querySelectorAll(".shape-card");

    itemInside.forEach((item) => {
      if (item.dataset.type != targetType) {
        allCorrect = false;
      }
    });
  });

  if (allCorrect) {
    gameState.isFinished = true;
    onCorrect();
    showFeedback("ყოჩაღ! სწორად გადაანაწილე!", true);
    setTimeout(() => {
      startRound();
    }, 2000);
  } else {
    showFeedback("შეცდომაა... თავიდან სცადე", false);
  }
}
