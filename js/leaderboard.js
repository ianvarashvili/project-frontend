const GRADE_LABELS = { 1: "I", 2: "II", 3: "III", 4: "IV" };
const PODIUM_ORDER = [1, 0, 2];
const PODIUM_PLACES = ["second", "first", "third"];

async function loadLeaderboard() {
  showLoading(true);
  hideError("error-msg");

  try {
    const data = await apiFetch("/leaderboard");
    const grade = parseInt(localStorage.getItem(STORAGE_KEYS.userGrade), 10);

    renderGradeBtn(grade);
    renderGradeTitle(grade);
    renderPodium(data.top10);
    renderTop10(data.top10);
    renderMyPlace(data.myPlace, data.top10);
    if (data.newBadge) {
      const currentBadges = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.userBadges) || "[]",
      );
      if (!currentBadges.includes(data.newBadge)) {
        currentBadges.push(data.newBadge);

        localStorage.setItem(
          STORAGE_KEYS.userBadges,
          JSON.stringify(currentBadges),
        );

        if (typeof showBadgePopups === "function") {
          showBadgePopups([data.newBadge]);
        }
      }
    }
  } catch (err) {
    showError("error-msg", "ლიდერბორდი ვერ ჩაიტვირთა");
  } finally {
    showLoading(false);
  }
}

function renderGradeBtn(grade) {
  const loggedUserGr = document.getElementById("logged-user-grade");
  if (!loggedUserGr) return;
  loggedUserGr.textContent = `${GRADE_LABELS[grade] || grade} კლასი`;
}

function renderGradeTitle(grade) {
  const el = document.getElementById("leaderboard-grade-title");
  if (el) el.textContent = `${GRADE_LABELS[grade] || grade} კლასი`;
}

function renderPodium(top10) {
  const container = document.getElementById("podium-container");
  if (!container || !top10) return;

  const top3 = top10.slice(0, 3);
  if (top3.length === 0) {
    container.innerHTML = "<p>ჯერ არავინ არ არის</p>";
    return;
  }

  container.innerHTML = PODIUM_ORDER.map((srcIdx, podiumIdx) => {
    const entry = top3[srcIdx];
    if (!entry) return "";
    return buildPodiumCard(entry, PODIUM_PLACES[podiumIdx]);
  }).join("");
}

function buildPodiumCard(entry, place) {
  const isMine = isCurrentUser(entry.userId);
  return `
    <div class="flexcolumn ${isMine ? "current-user" : ""}">
    <svg class="icon-top-3-places">
            <use href="#icon-place-${place}"></use>
      </svg>
      <img src="../assets/avatars/avatar-${entry.avatarId}.jpeg"
           alt="${escapeHtml(entry.name)}" class="leaderboard-user-pfp"
           onerror="this.src='../assets/fox-logo.png'">
      <p class="chalk-txt reg-txt">${escapeHtml(entry.name)} ${escapeHtml(entry.surname || "")}</p>
      <p class="grey-txt">@${escapeHtml(entry.username || "")}</p>
      <div class="chalk-txt top-3-score-frame flexrow"> 
      <svg class="icon">
            <use href="#icon-star"></use>
      </svg> ${entry.stars} <span class="grey-txt">•</span>  <span class="orange-txt">${entry.points}</span></div>
      <div class="${place}-place podium-cards">${entry.place}</div>
      
    </div>
  `;
}

function renderTop10(top10) {
  const container = document.getElementById("leaderboard-rows");
  if (!container || !top10) return;

  if (top10.length === 0) {
    container.innerHTML = "<p>მონაცემები არ არის</p>";
    return;
  }

  container.innerHTML = top10.map((entry) => buildTop10Row(entry)).join("");
}

function buildTop10Row(entry) {
  const isMine = isCurrentUser(entry.userId);
  return `
    <div class="top-10-students flexrow ${isMine ? "current-user" : ""}">
      <div class="flexrow">
        <p class="grey-txt">${entry.place}</p>
        <img src="../assets/avatars/avatar-${entry.avatarId}.jpeg"
             alt="${escapeHtml(entry.name)}" class="leaderboard-user-pfp"
             onerror="this.src='../assets/fox-logo.png'">
        <div>
          <p class="reg-txt">${escapeHtml(entry.name)} ${escapeHtml(entry.surname || "")}</p>
          <p class="reg-txt grey-txt">@${escapeHtml(entry.username || "")}</p>
        </div>
      </div>
      <div class="flexrow">
        <svg class="icon">
            <use href="#icon-star"></use>
        </svg>
        <p> ${entry.stars}</p>
        <div class="top-10-score-frame">${entry.points}</div>
      </div>
    </div>
  `;
}
function renderMyPlace(myPlace, top10) {
  if (!myPlace) return;

  const container = document.getElementById("my-place-container");
  if (!container) return;

  container.style.display = "block";

  container.innerHTML = `
    <div class="top-10-students flexrow current-user">
      <div class="flexrow">
        <p class="grey-txt">${myPlace.place}</p>
        <img src="../assets/avatars/avatar-${myPlace.avatarId}.jpeg"
             alt="${escapeHtml(myPlace.name)}" class="leaderboard-user-pfp"
             onerror="this.src='../assets/fox-logo.png'">
        <div>
  
          <p >${escapeHtml(myPlace.name)} ${escapeHtml(myPlace.surname || "")} <span class="grey-txt reg-txt">(შენ)</span></p>
          <p class="reg-txt grey-txt">@${escapeHtml(myPlace.username || "")}</p>
        </div>
      </div>
      <div class="flexrow">
        <svg class="icon">
            <use href="#icon-star"></use>
        </svg>
        <p> ${myPlace.stars}</p>
        <div class="top-10-score-frame">${myPlace.points}</div>
      </div>
    </div>
  `;
}

function isCurrentUser(userId) {
  return userId === localStorage.getItem(STORAGE_KEYS.userId);
}
function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function showLoading(isLoading) {
  const el = document.getElementById("loading-msg");
  if (!el) return;
  el.style.display = isLoading ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  loadLeaderboard();
});
