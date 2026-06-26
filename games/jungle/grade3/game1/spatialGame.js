const GAME_STATE = {
  gameId: "jungle_g3_game1",
  island: "jungle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 3,
  timeLimitSeconds: 30,
};

let correctAns;
let isWaiting = false;

let isDragging = false;
let lastX, lastY;
let rotateX = -20;
let rotateY = 30;

const shapesData = [
  {
    id: "cube",
    name: "კუბს",
    faces: 6,
    edges: 12,
    vertices: 8,
    render: () => `
            <div class="shape-3d cube" id="current-shape" style="transform: rotateX(${rotateX}deg) rotateY(${rotateY}deg);">
                <div class="face" style="transform: translateZ(70px);"></div>
                <div class="face" style="transform: rotateY(180deg) translateZ(70px);"></div>
                <div class="face" style="transform: rotateY(90deg) translateZ(70px);"></div>
                <div class="face" style="transform: rotateY(-90deg) translateZ(70px);"></div>
                <div class="face" style="transform: rotateX(90deg) translateZ(70px);"></div>
                <div class="face" style="transform: rotateX(-90deg) translateZ(70px);"></div>
            </div>`,
  },
  {
    id: "tri_prism",
    name: "სამკუთხა პრიზმას",
    faces: 5,
    edges: 9,
    vertices: 6,
    render: () => `
            <div class="shape-3d tri-prism" id="current-shape" style="transform: rotateX(${rotateX}deg) rotateY(${rotateY}deg);">
                <div class="face face-side"></div>
                <div class="face face-side"></div>
                <div class="face face-side"></div>
                
                <div class="face face-cap-top">
                    <svg width="100" height="86.6" viewBox="0 0 100 86.6" style="overflow: visible;">
                        <polygon points="50,3 97,83.6 3,83.6" fill="rgba(168, 230, 207, 0.7)" stroke="var(--color-text)" stroke-width="3" stroke-linejoin="round"/>
                    </svg>
                </div>
                
                <div class="face face-cap-bottom">
                    <svg width="100" height="86.6" viewBox="0 0 100 86.6" style="overflow: visible;">
                        <polygon points="50,83.6 3,3 97,3" fill="rgba(168, 230, 207, 0.7)" stroke="var(--color-text)" stroke-width="3" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>`,
  },
  {
    id: "pyramid",
    name: "ოთხკუთხა პირამიდას",
    faces: 5,
    edges: 8,
    vertices: 5,
    render: () => `
            <div class="shape-3d pyramid" id="current-shape" style="transform: rotateX(${rotateX}deg) rotateY(${rotateY}deg);">
                <div class="face face-base"></div>
                <div class="face face-side">
                    <svg width="100" height="112" viewBox="0 0 100 112" style="overflow: visible;">
                        <polygon points="50,0 100,112 0,112" fill="rgba(244, 162, 97, 0.7)" stroke="var(--color-text)" stroke-width="3" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="face face-side">
                    <svg width="100" height="112" viewBox="0 0 100 112" style="overflow: visible;">
                        <polygon points="50,0 100,112 0,112" fill="rgba(244, 162, 97, 0.7)" stroke="var(--color-text)" stroke-width="3" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="face face-side">
                    <svg width="100" height="112" viewBox="0 0 100 112" style="overflow: visible;">
                        <polygon points="50,0 100,112 0,112" fill="rgba(244, 162, 97, 0.7)" stroke="var(--color-text)" stroke-width="3" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="face face-side">
                    <svg width="100" height="112" viewBox="0 0 100 112" style="overflow: visible;">
                        <polygon points="50,0 100,112 0,112" fill="rgba(244, 162, 97, 0.7)" stroke="var(--color-text)" stroke-width="3" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>`,
  },
  {
    id: "cylinder",
    name: "ცილინდრს",
    faces: 2,
    edges: 0,
    vertices: 0,
    render: () => `
            <div class="shape-3d cylinder" id="current-shape" style="transform: rotateX(${rotateX}deg) rotateY(${rotateY}deg);">
                <div class="face face-cap face-cap-top"></div>
                <div class="face face-cap face-cap-bottom"></div>
                <div class="face face-side"></div>
                <div class="face face-side"></div>
                <div class="face face-side"></div>
                <div class="face face-side"></div>
                <div class="face face-side"></div>
                <div class="face face-side"></div>
                <div class="face face-side"></div>
                <div class="face face-side"></div>
            </div>`,
  },
];

const questionsData = [
  { key: "faces", word: "წახნაგი" },
  { key: "edges", word: "წიბო" },
  { key: "vertices", word: "წვერო" },
];
const feedbackMsg = document.getElementById("feedback-msg");

function startRound() {
  feedbackMsg.style.color = "";
  isWaiting = false;

  const shapeCont = document.getElementById("shape-container");
  const optCont = document.getElementById("options-cont");
  const questionText = document.getElementById("question-text");

  if (!shapeCont || !optCont || !questionText) {
    console.error("HTML-ში აკლია საჭირო კონტეინერები (ID)!");
    return;
  }

  if (feedbackMsg) {
    feedbackMsg.innerText = "დაატრიალე ფიგურა და იპოვე პასუხი";
    feedbackMsg.style.color = "var(--color-text)";
  }
  optCont.innerHTML = "";

  const randomShape = shapesData[Math.floor(Math.random() * shapesData.length)];

  //თუ ცილინდრია, კითხვა ყოველთვის მოდის წახნაგებზე
  let randomQuestion;
  if (randomShape.id === "cylinder") {
    randomQuestion = questionsData.find((q) => q.key === "faces");
  } else {
    randomQuestion =
      questionsData[Math.floor(Math.random() * questionsData.length)];
  }

  let questionWord = randomQuestion.word;
  if (randomShape.id === "cylinder" && randomQuestion.key === "faces") {
    questionWord = "ბრტყელი ზედაპირი (ფუძე)";
  }

  correctAns = randomShape[randomQuestion.key];
  questionText.innerText = `რამდენი ${questionWord} აქვს ${randomShape.name}?`;
  shapeCont.innerHTML = randomShape.render();

  let options = [correctAns];
  let possibleWrong = [
    correctAns - 2,
    correctAns - 1,
    correctAns + 1,
    correctAns + 2,
    correctAns + 3,
  ];
  possibleWrong = possibleWrong
    .filter((n) => n >= 0 && !options.includes(n))
    .sort(() => Math.random() - 0.5);

  for (let i = 0; options.length < 4 && i < possibleWrong.length; i++) {
    options.push(possibleWrong[i]);
  }
  options.sort(() => Math.random() - 0.5);

  options.forEach((val) => {
    let btn = document.createElement("div");
    btn.className = "option-btn chalk-txt";
    btn.innerText = val;
    btn.onclick = () => checkAns(val, btn);
    optCont.appendChild(btn);
  });
}

function checkAns(val, btnElement) {
  if (gameState.isFinished || isWaiting) return;
  if (val === correctAns) {
    isWaiting = true;
    btnElement.style.backgroundColor = "var(--color-green, #4CAF50)";
    btnElement.style.color = "white";

    onCorrect();
    if (feedbackMsg) showFeedback("ყოჩაღ! სწორია", true);

    setTimeout(() => {
      hideFeedback();
      startRound();
    }, 1500);
  } else {
    btnElement.style.backgroundColor = "var(--color-red, #F44336)";
    btnElement.style.color = "white";
    if (feedbackMsg) showFeedback("არასწორია, კიდევ სცადე!", false);

    setTimeout(() => {
      if (!gameState.isFinished) {
        btnElement.style.backgroundColor = "";
        btnElement.style.color = "";
        if (feedbackMsg) {
          feedbackMsg.innerText = "დაატრიალე ფიგურა და დათვალე";
          feedbackMsg.style.color = "var(--color-text)";
        }
      }
    }, 1000);
  }
}

document.addEventListener("mousedown", (e) => {
  if (e.target.closest("#shape-container")) {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  }
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging || isWaiting || gameState.isFinished) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;

  rotateY += dx * 0.6;
  rotateX -= dy * 0.6;

  const currentShape = document.getElementById("current-shape");
  if (currentShape) {
    currentShape.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  lastX = e.clientX;
  lastY = e.clientY;
});

document.addEventListener("mouseup", () => (isDragging = false));
document.addEventListener("mouseleave", () => (isDragging = false));
