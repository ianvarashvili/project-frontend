const GAME_STATE = {
  gameId:           "jungle_g2_game2",
  island:           "jungle",         
  gameGrade:        parseInt(         
    new URLSearchParams(window.location.search).get("grade"), 10
  ) || 1,
  timeLimitSeconds: 30, 
};

const items = [
  {
    name: "კალათბურთის ბურთისთვის",
    shape: "circle",
    svg: `<svg class="display-object" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" class="fill-orange" />
                <path d="M 15 50 Q 50 20 85 50" />
                <path d="M 15 50 Q 50 80 85 50" />
                <path d="M 50 8 L 50 92" />
              </svg>`,
  },
  {
    name: "პიცის ნაჭრისთვის",
    shape: "triangle",
    svg: `<svg class="display-object" viewBox="0 0 100 100">
                <polygon points="50,90 15,20 85,20" class="fill-beige" />
                <polygon points="48,80 23,26 77,26" class="fill-orange" />
                <circle cx="40" cy="40" r="6" class="fill-white" />
                <circle cx="60" cy="45" r="6" class="fill-white" />
                <circle cx="50" cy="65" r="6" class="fill-white" />
              </svg>`,
  },
  {
    name: "ყინულების ყუთისთვის",
    shape: "square",
    svg: `<svg class="display-object" viewBox="0 0 100 100">
                <rect x="15" y="15" width="70" height="70" class="fill-white" rx="10"/>
                <rect x="25" y="25" width="20" height="20" class="fill-cream" rx="4"/>
                <rect x="55" y="25" width="20" height="20" class="fill-cream" rx="4"/>
                <rect x="25" y="55" width="20" height="20" class="fill-cream" rx="4"/>
                <rect x="55" y="55" width="20" height="20" class="fill-cream" rx="4"/>
              </svg>`,
  },
  {
    name: "საგზაო ნიშნისთვის",
    shape: "triangle",
    svg: `<svg class="display-object" viewBox="0 0 100 100">
                <polygon points="50,10 92,82 8,82" class="fill-orange" />
                <polygon points="50,23 82,76 18,76" class="fill-cream" />
                <line x1="50" y1="40" x2="50" y2="60" style="stroke-width: 6;" />
                <circle cx="50" cy="69" r="3.5" style="fill: var(--color-text);" />
              </svg>`,
  },
  {
    name: "კედლის საათისთვის",
    shape: "circle",
    svg: `<svg class="display-object" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" class="fill-white" />
                <circle cx="50" cy="50" r="34" class="fill-cream" />
                <line x1="50" y1="50" x2="50" y2="28" style="stroke-width: 4;" />
                <line x1="50" y1="50" x2="68" y2="50" style="stroke-width: 3;" />
                <circle cx="50" cy="50" r="4" style="fill: var(--color-text);" />
              </svg>`,
  },
  {
    name: "სურათის ჩარჩოსთვის",
    shape: "square",
    svg: `<svg class="display-object" viewBox="0 0 100 100">
                <rect x="12" y="12" width="76" height="76" class="fill-orange" rx="6" />
                <rect x="24" y="24" width="52" height="52" class="fill-white" />
                <polygon points="30,65 45,45 55,55 68,38 72,65" class="fill-beige" />
              </svg>`,
  },
  {
    name: "მონეტისთვის",
    shape: "circle",
    svg: `<svg class="display-object" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" class="fill-beige" />
                <circle cx="50" cy="50" r="34" class="fill-cream" style="stroke-dasharray: 4 3;" />
                <rect x="44" y="32" width="12" height="36" class="fill-orange" rx="2" />
              </svg>`,
  },
];

let currentItem = null;
let correctAns = false;

const optCont = document.getElementById("options-cont");
const promptLabel = document.getElementById("prompt-label");
const objVisCont = document.getElementById("obj-visual-cont");
const feedbackMsg = document.getElementById("feedback-msg");

function startRound() {
  let picker = items[Math.floor(Math.random() * items.length)];
  if (currentItem && items.length > 1) {
    while (picker.name === currentItem.name) {
      picker = items[Math.floor(Math.random() * items.length)];
    }
  }

  currentItem = picker;
  correctAns = false;
  // სათაურის/ფედბექის საწყის ეტაპზე დაბრუნება ახალი რაუნდისას
  if (feedbackMsg) {
    feedbackMsg.innerText = "აირჩიე სწორი ფორმა!";
    feedbackMsg.style.color = "";
    feedbackMsg.style.display = "block";
  }

  promptLabel.innerText = `აირჩიე სწორი ფორმა ${currentItem.name}`;
  objVisCont.innerHTML = currentItem.svg;
}

function checkAns(selectedShape) {
  if (correctAns) return;
  if (gameState.isFinished) return;

  if (selectedShape === currentItem.shape) {
    correctAns = true;
onCorrect();
showFeedback("ყოჩაღ! შენ სწორად დააკავშირე ფორმები!", true);

    setTimeout(() => {
      startRound();
    }, 2000);
  } else {
   showFeedback("რაღაც შეცდომაა... თავიდან სცადე", false);
  }
}


