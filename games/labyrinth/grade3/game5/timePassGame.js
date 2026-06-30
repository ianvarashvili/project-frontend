const GAME_STATE = {
  gameId: "labyrinth_g3_game5",
  island: "labyrinth",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 3,
  timeLimitSeconds: 50,
};
const startHourHand = document.getElementById("start-hour-hand");
const startMinuteHand = document.getElementById("start-minute-hand");
const endHourHand = document.getElementById("end-hour-hand");
const endMinuteHand = document.getElementById("end-minute-hand");
const optionsCont = document.getElementById("options-box");
const feedbackMsg = document.getElementById("feedback-msg");

let correctDuration = "";
let lastQuestDur = null;

function formatDuration(totalMins) {
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  if (hrs > 0 && mins > 0) {
    return `${hrs} საათი და ${mins} წუთი`;
  } else if (hrs > 0) {
    return `${hrs} საათი`;
  } else {
    return `${mins} წუთი`;
  }
}

function startRound() {
  gameState.isFinished = false;
  optionsCont.innerHTML = "";
  feedbackMsg.style.color = "";
  feedbackMsg.textContent =
    "რა დრო გავიდა მეცადინეობის დაწყებიდან დამთავრებამდე?";

  let startHour = Math.floor(Math.random() * 12) + 1;
  let startMin = Math.floor(Math.random() * 12) * 5;

  let randHours, randMins, duration;
  do {
    randHours = Math.floor(Math.random() * 3);
    randMins = (Math.floor(Math.random() * 11) + 1) * 5;
    duration = randHours * 60 + randMins;
  } while (duration === lastQuestDur);

  lastQuestDur = duration;

  correctDuration = formatDuration(duration);

  let endMin = startMin + duration;
  let endHour = startHour + Math.floor(endMin / 60);
  endMin = endMin % 60;
  endHour = ((endHour - 1) % 12) + 1;

  let startMinDeg = startMin * 6;
  let startHourDeg = (startHour % 12) * 30 + startMin * 0.5;
  startHourHand.style.transform = `translateX(-50%) rotate(${startHourDeg}deg)`;
  startMinuteHand.style.transform = `translateX(-50%) rotate(${startMinDeg}deg)`;

  let endMinDeg = endMin * 6;
  let endHourDeg = (endHour % 12) * 30 + endMin * 0.5;
  endHourHand.style.transform = `translateX(-50%) rotate(${endHourDeg}deg)`;
  endMinuteHand.style.transform = `translateX(-50%) rotate(${endMinDeg}deg)`;

  let optionsSet = new Set();
  optionsSet.add(correctDuration);

  while (optionsSet.size < 4) {
    let fakeHours = Math.floor(Math.random() * 2);
    let fakeMins = (Math.floor(Math.random() * 11) + 1) * 5;
    let fakeDuration = fakeHours * 60 + fakeMins;

    optionsSet.add(formatDuration(fakeDuration));
  }

  let scrambledOpt = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  scrambledOpt.forEach((durationString) => {
    const card = document.createElement("div");
    card.className = "option-card";
    card.textContent = durationString;

    card.onclick = function () {
      checkAns(this, durationString);
    };
    optionsCont.appendChild(card);
  });
}

function checkAns(selectedCard, selectedDuration) {
  if (gameState.isFinished) return;
  if (selectedDuration === correctDuration) {
    gameState.isFinished = true;
    selectedCard.classList.add("correct");
    onCorrect();
    showFeedback("ყოჩაღ! შენ სწორად გამოიცანი!", true);
    setTimeout(() => {
      startRound();
    }, 2000);
  } else {
    selectedCard.classList.add("wrong");
    showFeedback("რაღაც შეცდომაა... კარგად დააკვირდი ისრებს", false);
  }
}
