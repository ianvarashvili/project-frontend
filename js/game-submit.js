async function submitGame(gameState) {
  const payload = {
    userId: gameState.userId,
    gameId: gameState.gameId,
    island: gameState.island,
    gameGrade: gameState.gameGrade,
    correctCount: gameState.correctCount,
    timeLimitSeconds: gameState.timeLimitSeconds,
  };

  const loadingEl = document.getElementById("loading-overlay");
  if (loadingEl) loadingEl.style.display = "flex";

  try {
    const data = await apiFetch("/game/submit", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    updateLocalStorage(data);

    if (loadingEl) loadingEl.style.display = "none";
    showResults(data, gameState);
  } catch (err) {
    if (loadingEl) loadingEl.style.display = "none";
    console.error("Submit error:", err.message);
    goBackToIsland(gameState);
  }
}

function updateLocalStorage(data) {
  localStorage.setItem(STORAGE_KEYS.userStars, data.updatedStars);
  localStorage.setItem(STORAGE_KEYS.userPoints, data.updatedPoints);
  localStorage.setItem(STORAGE_KEYS.userRank, data.updatedRank);

  if (data.newBadges?.length) {
    const cur = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.userBadges) || "[]",
    );
    const updated = [...new Set([...cur, ...data.newBadges])];
    localStorage.setItem(STORAGE_KEYS.userBadges, JSON.stringify(updated));
  }
}

function showResults(data, gameState) {
  const overlay = document.getElementById("result-overlay");
  if (!overlay) {
    goBackToIsland(gameState);
    return;
  }

  overlay.style.display = "flex";

  const scoreEl = document.getElementById("result-score");
  const countEl = document.getElementById("result-count");
  const improvedEl = document.getElementById("result-improved");

  if (scoreEl) scoreEl.textContent = data.totalScore;

  if (countEl) countEl.textContent = data.correctCount + " სწორი პასუხი!";
  if (improvedEl) {
    if (data.totalScore === 0) {
      improvedEl.textContent = "არ დანებდე, სცადე თავიდან!";
    } else if (data.improved) {
      improvedEl.textContent = "ახალი რეკორდი!";
    } else {
      improvedEl.textContent = `სცადე გააუმჯობესო! შენი რეკორდია ${data.bestScore} ქულა`;
    }
  }

const stars = document.querySelectorAll(".result-star");
  stars.forEach((s) => s.classList.remove("active"));
  //force the browser to paint the initial state before toggling .active
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      stars.forEach((s, i) => {
        if (i < data.stars) setTimeout(() => s.classList.add("active"), i * 350);
      });
    });
  });

  if (data.newBadges?.length) showBadgePopups(data.newBadges);

  const replayBtn = document.getElementById("btn-replay");
  const mapBtn = document.getElementById("btn-map");

  if (replayBtn) replayBtn.onclick = () => window.location.reload();
  if (mapBtn) mapBtn.onclick = () => goBackToIsland(gameState);
}

function goBackToIsland(gameState) {
  window.location.href = `/pages/island.html?island=${gameState.island}&grade=${gameState.gameGrade}`;
}

function showBadgePopups(badges) {
  badges.forEach((badge, i) => {
    setTimeout(() => {
      const popup = document.createElement("div");
      popup.className = "badge-popup";
      popup.textContent = "ახალი მიღწევა: " + badge;
      document.body.appendChild(popup);
      setTimeout(() => popup.remove(), 3500);
    }, i * 1200);
  });
}
