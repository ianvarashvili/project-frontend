const GAME_STATE = {
  gameId:           "labyrinth_g2_game5",
  island:           "labyrinth",
  gameGrade:        parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 2,
  timeLimitSeconds: 30,
};
const canvCont = document.getElementById("canvas-cont");
const userAns = document.getElementById("user-ans");
const feedbackMsg = document.getElementById("feedback-msg");
const gameInstruction = document.getElementById("game-instruction");

let correctAns = 0;

function drawTermometer(temp, label) {
  const baselineY = 360;
  const tempHeight = temp * 6;
  const mercuryY = baselineY - tempHeight;

  let svg = `
  <svg class="thermometer-svg" viewBox="0 0 180 450">
          <text x="106" y="25" text-anchor="middle" font-size="18px" font-weight="bold" fill="var(--color-text)">${label}</text>
          
          <rect x="95" y="40" width="22" height="340" rx="11" class="tube" />
          <circle cx="106" cy="385" r="26" fill="#ffffff" stroke="#272624" stroke-width="4" />
  `;

  for (let i = 0; i <= 50; i++) {
    let yPos = baselineY - i * 6;

    if (i % 10 === 0) {
      svg += `<line x1="70" y1="${yPos}" x2="90" y2="${yPos}" class="scale-line" style="stroke-width: 2.5px;" />
            <text x="35" y="${yPos + 5}" class="scale-text" style="font-size: 15px;">${i}</text>`;
    } else if (i % 5 === 0) {
      svg += `<line x1="76" y1="${yPos}" x2="90" y2="${yPos}" class="scale-line" style="stroke-width: 1.5px;" />`;
    } else {
      svg += `<line x1="82" y1="${yPos}" x2="90" y2="${yPos}" class="scale-line" style="opacity: 0.5; stroke-width: 1px;" />`;
    }
  }
  svg += `
          <circle cx="106" cy="385" r="19" fill="var(--color-red)" />
          <rect x="102" y="${mercuryY}" width="8" height="${tempHeight + 15}" fill="var(--color-red)" rx="3" />
        </svg>
      `;

  return svg;
}

function startRound() {
   feedbackMsg.style.color = "";
  feedbackMsg.innerHTML = `შეიყვანე რიცხვი <span class="orange-txt">კლავიატურიდან</span> ან გამოიყენე <span
                    class="orange-txt">ისრები</span> `;
  userAns.value = "";
  userAns.focus();

  let tempBefore = Math.floor(Math.random() * 51);
  let tempNow = Math.floor(Math.random() * 51);

  while (tempBefore === tempNow) {
    tempNow = Math.floor(Math.random() * 51);
  }

  if (tempNow > tempBefore) {
    correctAns = tempNow - tempBefore;
    gameInstruction.innerHTML = `რამდენი გრადუსით მოიმატა ტემპერატურამ?`;
  } else {
    correctAns = tempBefore - tempNow;
    gameInstruction.innerHTML = `რამდენი გრადუსით მოიკლო ტემპერატურამ?`;
  }

  const svg1 = drawTermometer(tempBefore, "ადრე");
  const svg2 = drawTermometer(tempNow, "ახლა");
  canvCont.innerHTML = svg1 + svg2;
}

function checkAns() {
  if (gameState.isFinished) return;  
  const parsedAns = parseInt(userAns.value);

  if (isNaN(parsedAns)) {
    showFeedback("ჩაწერე რიცხვი!", false); 
    return;
  }
  if (parsedAns === correctAns) {
      onCorrect(); 
    showFeedback("ყოჩაღ, სწორია!", true); 
    setTimeout(() => {
      startRound();
    }, 2000);
  } else {
    showFeedback("რაღაც შეცდომაა...თავიდან სცადე!", false);
  }
}

userAns.addEventListener("keypress", (e) => {
  if (e.key === "Enter") checkAns();
});

