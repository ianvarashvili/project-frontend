const gameState = {
  userId: null,
  gameId: null,
  island: null,
  gameGrade: null,
  correctCount: 0,
  timeLimitSeconds: 60,
  timerInterval: null,
  isFinished: false,
};

function startGame(config) {
  gameState.userId = localStorage.getItem(STORAGE_KEYS.userId);
  gameState.gameId = config.gameId;
  gameState.island = config.island;
  gameState.gameGrade = config.gameGrade;
  gameState.timeLimitSeconds = config.timeLimitSeconds ?? 60;
  gameState.correctCount = 0;
  gameState.isFinished = false;
  updateScoreUI(0);
}

// handleStartGame start button-ზე
function handleStartGame() {
  const overlay = document.getElementById("start-overlay");
  if (overlay) overlay.style.display = "none";
  if (typeof startRound === "function") startRound(); // ← game.js-ში განსაზღვრული
  startTimer();
}

//სწორ პასუხზე.
function onCorrect() {
  gameState.correctCount++;
  updateScoreUI(gameState.correctCount);
}

//submitGame()-ს ვიძახებთ
function endGame() {
  if (gameState.isFinished) return;
  gameState.isFinished = true;
  clearInterval(gameState.timerInterval);
  submitGame(gameState);
}

function startTimer() {
  let timeLeft = gameState.timeLimitSeconds;
  updateTimerUI(timeLeft);

  gameState.timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI(Math.max(0, timeLeft));
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function updateTimerUI(seconds) {
  const el = document.getElementById("timer-display");
  if (!el) return;
  el.textContent = seconds + " წმ";
  el.classList.toggle("timer-warning", seconds <= 10);
}

function updateScoreUI(count) {
  const el = document.getElementById("score-display");
  if (el) el.textContent = count;
}

function showFeedback(msg, isCorrect) {
  const el = document.getElementById("feedback-msg");
  if (!el) return;
  el.innerHTML = msg;
  el.style.color = isCorrect ? "var(--color-green)" : "var(--color-red)";
  el.style.display = "block";
}

function hideFeedback() {
  const el = document.getElementById("feedback-msg");
  if (el) el.style.display = "none";
}


//game header


const ISLAND_LABELS_HEADER = {
  castle: "ციხე-სიმაგრე",
  jungle: "ჯუნგლი",
  labyrinth: "ლაბირინთო",
};

const GRADE_LABELS_HEADER = { 1: "I", 2: "II", 3: "III", 4: "IV" };

function renderGameHeader() {
  const userName = localStorage.getItem(STORAGE_KEYS.userName) || "";
  const points   = localStorage.getItem(STORAGE_KEYS.userPoints) || "0";
  const stars    = localStorage.getItem(STORAGE_KEYS.userStars) || "0";
  const avatar   = localStorage.getItem(STORAGE_KEYS.userAvatar) || "1";

  const islandLabel = ISLAND_LABELS_HEADER[gameState.island] || "";
  const gradeLabel  = GRADE_LABELS_HEADER[gameState.gameGrade] || "";

  const header = document.createElement("header");
  header.id = "game-page-header";
  header.className = "header-container chalk-txt";

  header.innerHTML = `
    <div class="flexrow">
      <div id="game-header-back" class="reg-txt button sketchy-button--sm hover-color-change">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5"></path><path d="M11 6l-6 6 6 6"></path>
        </svg>
        <span>უკან</span>
      </div>
      <span class="chalk-txt">${islandLabel} • ${gradeLabel} კლასი</span>
    </div>

    <div class="flexrow">
      <img src="../../../../assets/avatars/avatar-${avatar}.jpeg"
           class="game-header-avatar" alt=""
           onerror="this.style.display='none'">
      <span class="reg-txt">${escapeHeaderText(userName)}</span>
      <div class="sketchy-button--sm button beige-bg">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2.5l2.7 5.5 6.1.9-4.4 4.2 1 6.1-5.4-2.8-5.4 2.8 1-6.1-4.4-4.2 6.1-.9L12 2.5z"></path>
        </svg>
        <span>${stars}</span>
      </div>
      <div class="sketchy-button--sm button orange-bg white-txt">
        <span>${points}</span>
      </div>
    </div>
  `;

  document.body.prepend(header);

  document.getElementById("game-header-back").addEventListener("click", () => {
    window.location.href = `/pages/island.html?island=${gameState.island}&grade=${gameState.gameGrade}`;
  });
}

function escapeHeaderText(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  if (typeof GAME_STATE !== "undefined") {
    startGame(GAME_STATE);
  }
  renderGameHeader();
  const overlay = document.getElementById("start-overlay");
  if (overlay) overlay.style.display = "flex";

    const feedbackEl = document.getElementById("feedback-msg");
  if (feedbackEl) {
    new MutationObserver(() => {
      if (feedbackEl.style.display === "none") {
        feedbackEl.style.display = "block";
      }
    }).observe(feedbackEl, { childList: true, characterData: true, subtree: true });
  }
});
