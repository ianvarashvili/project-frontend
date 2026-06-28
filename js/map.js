const ISLAND_IDS = ["castle", "jungle", "labyrinth"];

function getGradeFromURL() {
  const params = new URLSearchParams(window.location.search);
  const grade = parseInt(params.get("grade"), 10);
  return [1, 2, 3, 4].includes(grade)
    ? grade
    : parseInt(localStorage.getItem(STORAGE_KEYS.userGrade), 10) || 1;
}

function onIslandClick(island, grade) {
  const token = localStorage.getItem(STORAGE_KEYS.firebaseToken);

  if (!token) {
    window.location.href = "/pages/login.html";
    return;
  }

  const el = document.getElementById(`island-${island}`);
  if (el?.classList.contains("locked")) return;

  window.location.href = `/pages/island.html?island=${island}&grade=${grade}`;
}
function initIslands(grade) {
  ISLAND_IDS.forEach((island) => {
    const el = document.getElementById(`island-${island}`);
    if (!el) return;
    el.addEventListener("click", () => onIslandClick(island, grade));
  });
}
function renderGradeTitle(grade) {
  const labels = { 1: "I", 2: "II", 3: "III", 4: "IV" };
  const el = document.getElementById("grade-number");
  if (el) el.textContent = labels[grade];
}

async function loadProgress() {
  try {
    const data = await apiFetch("/progress");
    renderIslandStates(data);
  } catch (err) {
    console.warn("Progress ვერ ჩაიტვირთა:", err.message);
  }
}

function renderIslandStates(islands) {
  if (!islands) return;

  ISLAND_IDS.forEach((island) => {
    const el = document.getElementById(`island-${island}`);
    if (!el) return;

    const isUnlocked = islands[island]?.unlocked ?? false;
    el.classList.remove("locked", "unlocked");
    el.classList.add(isUnlocked ? "unlocked" : "locked");
  });
}
function renderUserStats() {
  const user = getStoredUser();
  if (!user) return;

  const starsEl = document.getElementById("user-stars");
  const nameEl = document.getElementById("user-name");
    if (starsEl) {
    starsEl.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2.5l2.7 5.5 6.1.9-4.4 4.2 1 6.1-5.4-2.8-5.4 2.8 1-6.1-4.4-4.2 6.1-.9L12 2.5z"></path>
        </svg>
      ${user.stars}
    `;
  }
  if (nameEl) nameEl.textContent = user.userName;
}

document.addEventListener("DOMContentLoaded", () => {
  const grade = getGradeFromURL();

  renderGradeTitle(grade);
  initIslands(grade);

  const token = localStorage.getItem(STORAGE_KEYS.firebaseToken);
  if (token) {
    renderUserStats();
    loadProgress();
  }
});
