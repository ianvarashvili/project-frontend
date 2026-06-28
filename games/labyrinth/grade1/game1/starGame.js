const GAME_STATE = {
  gameId: "labyrinth_g1_game1",
  island: "labyrinth",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};
const appleSVG = `
  <svg class="game-item" width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M50,22 C52,10 62,12 65,8 C60,15 53,16 51,22 Z" fill="#8B8D88" stroke="#272624" stroke-width="3" stroke-linejoin="round"/>
    <path d="M50,25 C30,20 15,35 15,60 C15,85 35,95 50,85 C65,95 85,85 85,60 C85,35 70,20 50,25 Z" fill="#E25921" stroke="#272624" stroke-width="4" stroke-linejoin="round"/>
    <path d="M28,40 C22,50 25,65 25,65" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
  </svg>
`;

const starSVG = `
  <svg class="game-item star-item" width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M50,5 L64,36 L98,36 L70,57 L81,91 L50,70 L19,91 L30,57 L2,36 L36,36 Z" fill="#DFCCA9" stroke="#272624" stroke-width="4" stroke-linejoin="round"/>
    <path d="M50,15 L50,65 M30,42 L70,42" fill="none" stroke="#272624" stroke-width="2" stroke-dasharray="3,3"/>
  </svg>
`;

let currentItem = null;
let correctAns = false;

const optCont = document.getElementById("options-cont");
const promptLabel = document.getElementById("prompt-label");
const objVisCont = document.getElementById("obj-visual-cont");

function startRound() {
  const isRightToLeft = Math.random() < 0.5;

  let randomShape = Math.floor(Math.random() * 5) + 1;

  if (currentItem) {
    while (randomShape === currentItem.shape) {
      randomShape = Math.floor(Math.random() * 5) + 1;
    }
  }

  currentItem = {
    shape: randomShape,
    svg: "",
  };

  correctAns = false;

  for (let i = 0; i < 5; i++) {
    let currentPosition;

    if (isRightToLeft) {
      currentPosition = 5 - i;
    } else {
      currentPosition = i + 1;
    }

    if (currentPosition === currentItem.shape) {
      currentItem.svg += starSVG;
    } else {
      currentItem.svg += appleSVG;
    }
  }

  if (isRightToLeft) {
    promptLabel.innerHTML = `<span class="orange-txt">მარჯვნიდან</span> მერამდენეა ვარსკვლავი?`;
  } else {
    promptLabel.innerHTML = `<span class="orange-txt">მარცხნიდან</span> მერამდენეა ვარსკვლავი?`;
  }

  objVisCont.innerHTML = currentItem.svg;
}

function checkAns(selectedShape) {
 if (correctAns || gameState.isFinished) return;
  if (selectedShape === currentItem.shape) {
    correctAns = true;
    onCorrect();
    showFeedback("ყოჩაღ, სწორია!", true);
    setTimeout(() => {
      hideFeedback();
      startRound();
    }, 700);
  } else {
    showFeedback("რაღაც შეცდომაა... თავიდან სცადე", false);
  }
}
