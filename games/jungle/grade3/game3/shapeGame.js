const GAME_STATE = {
  gameId: "jungle_g3_game3",
  island: "jungle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 2,
  timeLimitSeconds: 30,
};

const items = [
  {
    name: "სათამაშო კამათლისთვის",
    shape: "cube",
    svg: `<svg class="display-object" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="cube-top" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffb74d"/><stop offset="100%" stop-color="#ffa726"/>
              </linearGradient>
              <linearGradient id="cube-left" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#f57c00"/><stop offset="100%" stop-color="#e65100"/>
              </linearGradient>
              <linearGradient id="cube-right" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fb8c00"/><stop offset="100%" stop-color="#f57c00"/>
              </linearGradient>
            </defs>
            <polygon points="50,15 85,32 50,50 15,32" fill="url(#cube-top)" stroke="#2c3e50" stroke-width="1.5" />
            <polygon points="15,32 50,50 50,85 15,67" fill="url(#cube-left)" stroke="#2c3e50" stroke-width="1.5" />
            <polygon points="50,50 85,32 85,67 50,85" fill="url(#cube-right)" stroke="#2c3e50" stroke-width="1.5" />
            <circle cx="50" cy="32" r="3.5" fill="#fff" opacity="0.9"/>
            <circle cx="32" cy="50" r="3" fill="#fff" opacity="0.9"/>
            <circle cx="32" cy="62" r="3" fill="#fff" opacity="0.9"/>
            <circle cx="68" cy="50" r="3" fill="#fff" opacity="0.9"/>
            <circle cx="68" cy="62" r="3" fill="#fff" opacity="0.9"/>
          </svg>`,
  },
  {
    name: "სასაჩუქრე ყუთისთვის",
    shape: "prism",
    svg: `<svg class="display-object" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="gift-top" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#e1bee7"/><stop offset="100%" stop-color="#ce93d8"/>
              </linearGradient>
              <linearGradient id="gift-front" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ba68c8"/><stop offset="100%" stop-color="#ab47bc"/>
              </linearGradient>
              <linearGradient id="gift-side" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#8e24aa"/><stop offset="100%" stop-color="#7b1fa2"/>
              </linearGradient>
            </defs>
            <rect x="15" y="45" width="50" height="40" fill="url(#gift-front)" stroke="#2c3e50" stroke-width="1.5" />
            <polygon points="15,45 35,22 85,22 65,45" fill="url(#gift-top)" stroke="#2c3e50" stroke-width="1.5" />
            <polygon points="65,45 85,22 85,62 65,85" fill="url(#gift-side)" stroke="#2c3e50" stroke-width="1.5" />
            <rect x="37" y="45" width="8" height="40" fill="#ff5252" opacity="0.9" />
            <polygon points="37,45 57,22 65,22 45,45" fill="#ff1744" opacity="0.9" />
          </svg>`,
  },
  {
    name: "ბეისბოლის ბურთისთვის",
    shape: "sphere",
    svg: `<svg class="display-object" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="#ffffff" stroke="#2c3e50" stroke-width="2.5" />
            
            <path d="M 32,14 Q 48,50 32,86" fill="none" stroke="#bdc3c7" stroke-width="1.5" />
            <path d="M 32,14 Q 48,50 32,86" fill="none" stroke="#e74c3c" stroke-width="3" stroke-dasharray="3,4" />

            <path d="M 68,14 Q 52,50 68,86" fill="none" stroke="#bdc3c7" stroke-width="1.5" />
            <path d="M 68,14 Q 52,50 68,86" fill="none" stroke="#e74c3c" stroke-width="3" stroke-dasharray="3,4" />
          </svg>`,
  },
  {
    name: "ნაყინის ვაფლის ჭიქისთვის",
    shape: "cone",
    svg: `<svg class="display-object" viewBox="0 0 100 100">
            <polygon points="25,30 75,30 50,85" fill="#edbb99" stroke="#2c3e50" stroke-width="2" />
            <ellipse cx="50" cy="30" rx="25" ry="8" fill="#e59866" stroke="#2c3e50" stroke-width="2" />
          </svg>`,
  },
  {
    name: "სადღესასწაულო ტორტისთვის",
    shape: "cylinder",
    svg: `<svg class="display-object" viewBox="0 0 100 100">
            <rect x="25" y="45" width="50" height="35" fill="#ff7675" stroke="#2c3e50" stroke-width="2" />
            <ellipse cx="50" cy="80" rx="25" ry="10" fill="#e84393" stroke="#2c3e50" stroke-width="2" />
            <ellipse cx="50" cy="45" rx="25" ry="10" fill="#fdcb6e" stroke="#2c3e50" stroke-width="2" />
            <path d="M 25 45 Q 30 55 35 45 Q 40 55 45 45 Q 50 55 55 45 Q 60 55 65 45 Q 70 55 75 45" fill="none" stroke="#fdcb6e" stroke-width="4" stroke-linecap="round"/>
            <rect x="48" y="25" width="4" height="20" fill="#a29bfe" />
            <path d="M 50 15 Q 47 21 50 25 Q 53 21 50 15" fill="#ff7675" />
          </svg>`,
  },
  {
    name: "დაბადების დღის ქუდისთვის",
    shape: "cone",
    svg: `<svg class="display-object" viewBox="0 0 100 100">
            <polygon points="25,75 75,75 50,20" fill="#00cec9" stroke="#2c3e50" stroke-width="2" />
            <ellipse cx="50" cy="75" rx="25" ry="7" fill="#00b894" stroke="#2c3e50" stroke-width="2" />
            <path d="M 35 55 Q 50 63 65 55" fill="none" stroke="#ffeaa7" stroke-width="3" />
            <path d="M 42 37 Q 50 43 58 37" fill="none" stroke="#ffeaa7" stroke-width="3" />
            <circle cx="50" cy="17" r="5" fill="#d63031" />
          </svg>`,
  },
  {
    name: "საფოსტო ყუთისთვის",
    shape: "prism",
    svg: `<svg class="display-object" viewBox="0 0 100 100">
            <rect x="25" y="35" width="45" height="50" fill="#0984e3" rx="2" stroke="#2c3e50" stroke-width="2" />
            <polygon points="25,35 45,15 90,15 70,35" fill="#dfe6e9" stroke="#2c3e50" stroke-width="2" />
            <polygon points="70,35 90,15 90,65 70,85" fill="#b2bec3" stroke="#2c3e50" stroke-width="2" />
            <polygon points="70,85 90,65 92,67 72,87" fill="#0051a8" />
            <rect x="35" y="45" width="25" height="6" fill="#fff" opacity="0.3" />
          </svg>`,
  },
  {
    name: "ჩაის ჭიქისთვის",
    shape: "cylinder",
    svg: `<svg class="display-object" viewBox="0 0 100 100">
            <path d="M 65 35 C 85 35 85 65 65 65" fill="none" stroke="#6c5ce7" stroke-width="6" stroke-linecap="round" />
            <rect x="30" y="25" width="40" height="45" fill="#a29bfe" stroke="#2c3e50" stroke-width="2" />
            <ellipse cx="50" cy="70" rx="20" ry="8" fill="#6c5ce7" stroke="#2c3e50" stroke-width="2" />
            <ellipse cx="50" cy="25" rx="20" ry="8" fill="#e0e0e0" stroke="#2c3e50" stroke-width="2" />
            <ellipse cx="50" cy="27" rx="17" ry="6" fill="#634d36" />
          </svg>`,
  },
  {
    name: "რუბიკის კუბიკისთვის",
    shape: "cube",
    svg: `<svg class="display-object" viewBox="0 0 100 100">
            <polygon points="50,12 80,27 50,42 20,27" fill="#2c3e50" stroke="#2c3e50" stroke-width="2" />
            <polygon points="50,15 63,21 50,28 37,21" fill="#00b894" />
            <polygon points="35,19 48,25 36,31 24,25" fill="#0984e3" />
            <polygon points="65,19 77,25 64,31 52,25" fill="#00b894" />
            
            <polygon points="20,27 50,42 50,82 20,67" fill="#2c3e50" stroke="#2c3e50" stroke-width="2" />
            <polygon points="23,31 34,36 34,51 23,45" fill="#d63031" />
            <polygon points="36,37 47,42 47,57 36,52" fill="#ff7675" />
            <polygon points="23,49 34,55 34,70 23,64" fill="#ff7675" />
            <polygon points="36,56 47,61 47,76 36,71" fill="#d63031" />

            <polygon points="50,42 80,27 80,67 50,82" fill="#2c3e50" stroke="#2c3e50" stroke-width="2" />
            <polygon points="53,42 64,37 64,52 53,57" fill="#e67e22" />
            <polygon points="66,36 77,31 77,46 66,51" fill="#f39c12" />
            <polygon points="53,59 64,54 64,69 53,75" fill="#f39c12" />
            <polygon points="66,53 77,48 77,63 66,68" fill="#e67e22" />
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
  feedbackMsg.style.color = "";
  let picker = items[Math.floor(Math.random() * items.length)];
  if (currentItem && items.length > 1) {
    while (picker.name === currentItem.name) {
      picker = items[Math.floor(Math.random() * items.length)];
    }
  }

  currentItem = picker;
  correctAns = false;
  feedbackMsg.style.color = "var(--color-text)";
  promptLabel.innerText = `აირჩიე სწორი ფორმა ${currentItem.name}`;
  objVisCont.innerHTML = currentItem.svg;
}

function checkAns(selectedShape) {
  if (correctAns || gameState.isFinished) return;
  if (selectedShape === currentItem.shape) {
    correctAns = true;
    onCorrect();
    showFeedback("ყოჩაღ! შენ სწორად დააკავშირე ფორმები!", true);

    setTimeout(() => {
      feedbackMsg.style.color = "var(--color-text)";
      feedbackMsg.innerText = "აირჩიე სწორი ფორმა!";
      startRound();
    }, 2000);
  } else {
    showFeedback("რაღაც შეცდომაა... თავიდან სცადე", false);
  }
}
