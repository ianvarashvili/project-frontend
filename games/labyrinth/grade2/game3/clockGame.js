const GAME_STATE = {
  gameId: "labyrinth_g2_game3",
  island: "labyrinth",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 2,
  timeLimitSeconds: 30,
};
let correctHour = 0;
let correctMin = 0;
let correctAns = false;

const hourHand = document.getElementById("hour-hand");
const minuteHand = document.getElementById("minute-hand");
const optionsCont = document.getElementById("options-box");
const feedbackMsg = document.getElementById("feedback-msg");

function formatTime(h, m) {
  let hh = h < 10 ? "0" + h : h;
  let mm = m < 10 ? "0" + m : m;
  return `${hh}:${mm}`;
}

function startRound() {
  feedbackMsg.style.color = "";
  optionsCont.innerHTML = "";
  feedbackMsg.textContent = "შეუსაბამე ელექტროსაათი კედლის საათს.";
  correctAns = false;
  correctHour = Math.floor(Math.random() * 24);
  correctMin = Math.random() < 0.5 ? 0 : 30;

  let displayHour = correctHour % 12;
  let minuteDeg = correctMin * 6;
  let hourDeg = displayHour * 30 + correctMin * 0.5;

  hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;

  let optionsSet = new Set();
  optionsSet.add(formatTime(correctHour, correctMin));

  while (optionsSet.size < 3) {
    let fakeHour = Math.floor(Math.random() * 24);
    let fakeMin = Math.random() < 0.5 ? 0 : 30;
    optionsSet.add(formatTime(fakeHour, fakeMin));
  }

  let scrambledOpt = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  scrambledOpt.forEach((timeString) => {
    const card = document.createElement("div");
    card.className = "digital-clock-card";
    card.textContent = timeString;

    card.onclick = function () {
      checkAns(this, timeString);
    };
    optionsCont.appendChild(card);
  });
}

function checkAns(selectedCard, selectedTime) {
  if (gameState.isFinished || correctAns) return;
  let correcTimeStr = formatTime(correctHour, correctMin);

  if (selectedTime === correcTimeStr) {
    correctAns = true;
    selectedCard.classList.add("correct");
    onCorrect();
    showFeedback("ყოჩაღ, სწორია!", true);
    setTimeout(() => {
      hideFeedback();
      startRound();
    }, 2000);
  } else {
    selectedCard.classList.add("wrong");
    showFeedback("რაღაც შეცდომაა... კარგად დააკვირდი ისრებს", false);
  }
}
