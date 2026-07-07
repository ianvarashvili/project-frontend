const GAME_STATE = {
  gameId: "jungle_g2_game3",
  island: "jungle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 2,
  timeLimitSeconds: 30,
};

const items = [
  {
    name: "სათამაშო კამათლისთვის",
    shape: "cube",
    spriteId: "shape-dice",
  },
  {
    name: "წიგნისთვის",
    shape: "prism",
    spriteId: "shape-book",
  },
    {
    name: "კარავისთვის",
    shape: "pyramid",
    spriteId: "shape-tent",
  },
  {
    name: "ბეისბოლის ბურთისთვის",
    shape: "sphere",
    spriteId: "shape-baseball",
  },
  {
    name: "საზამთროს ნაჭრისთვის",
    shape: "pyramid",
    spriteId: "shape-watermelon",
    
  },
  {
    name: "სადღესასწაულო ტორტისთვის",
    shape: "cylinder",
    spriteId: "shape-cake",
  },
  {
    name: "დაბადების დღის ქუდისთვის",
    shape: "cone",
    spriteId: "shape-bd",
    
  },
  {
    name: "აკვარიუმისთვის",
    shape: "prism",
    spriteId: "shape-aqua",

  },
  {
    name: "ჩაის ჭიქისთვის",
    shape: "cylinder",
    spriteId: "shape-mug",
  },
  {
    name: "რუბიკის კუბიკისთვის",
    shape: "cube",
    spriteId: "shape-rubix",

  },
];

let currentItem = null;

const optCont = document.getElementById("options-cont");
const promptLabel = document.getElementById("prompt-label");
const objVisCont = document.getElementById("obj-visual-cont");
const feedbackMsg = document.getElementById("feedback-msg");

function startRound() {
  feedbackMsg.innerText = "აირჩიე სწორი ფორმა";
  let picker;
  do {
    picker = items[Math.floor(Math.random() * items.length)];
  } while (currentItem && picker.name === currentItem.name);

  currentItem = picker;
  gameState.isFinished = false;
  feedbackMsg.style.color = "var(--color-text)";
  promptLabel.innerText = `${currentItem.name}`;
  objVisCont.innerHTML = `<svg class="display-object">
            <use href="/assets/game_assets.svg#${currentItem.spriteId}"></use>
          </svg>`;
}

function checkAns(selectedShape) {
  if (gameState.isFinished) return;
  if (selectedShape === currentItem.shape) {
    gameState.isFinished = true;
    onCorrect();
    showFeedback("ყოჩაღ, სწორია!", true);

    setTimeout(() => {
      feedbackMsg.style.color = "var(--color-text)";
      startRound();
    }, 2000);
  } else {
    showFeedback("რაღაც შეცდომაა... თავიდან სცადე", false);
  }
}
