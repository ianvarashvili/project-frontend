const GRADE_LABELS = { 1: "I", 2: "II", 3: "III", 4: "IV" };

const ISLAND_LABELS = {
  castle: "ციხე-სიმაგრე",
  jungle: "ჯუნგლები",
  labyrinth: "ლაბირინთი",
};

function getParams() {
  const p = new URLSearchParams(window.location.search);
  const island = p.get("island");
  const grade = parseInt(p.get("grade"), 10);

  if (!ISLAND_LABELS[island] || ![1, 2, 3, 4].includes(grade)) return null;
  return { island, grade };
}

function renderHeader(island, grade) {
  const el = document.getElementById("island-title");
  if (el)
    el.textContent = `${ISLAND_LABELS[island]}  •  ${GRADE_LABELS[grade]} კლასი`;
}

// thumbnails
let _gameStarsCache = {};
async function loadAndRenderGames(island, grade) {
  const games = ISLAND_CONFIG?.[island]?.[grade];
  const cachedProgress = JSON.parse(localStorage.getItem("progressCache") || "{}");
  _gameStarsCache = cachedProgress.gameStars || {};
  renderGames(games, grade); 
  try {
    const data = await apiFetch("/progress");
    _gameStarsCache = data.gameStars || {};
    localStorage.setItem("progressCache", JSON.stringify(data));
  } catch (e) {
   console.warn("Progress ვერ ჩაიტვირთა,იხილეთ ძველი stars");
  }
  renderGames(games, grade);
}

function getGameStars(gameId) {
  return _gameStarsCache[gameId] || 0;
}

function renderGames(games, grade) {
  const grid = document.getElementById("games-grid");
  if (!grid) return;

  if (!games || games.length === 0) {
    grid.innerHTML = "<p class='grey-txt'>ამ კლასისთვის თამაშები მალე დაემატება!</p>";
    return;
  }

  grid.innerHTML = games
    .map((game, i) => {
      const stars = getGameStars(game.gameId);
      const starHtml = buildStars(stars);
      return `
        <div class="game-card sketchy-button--md button hover-color-change"
             onclick="goToGame('${game.path}', ${grade})">
          <div class="game-icon">${game.icon}</div>
          <p class="game-title chalk-txt">${game.title}</p>
          <p class="game-desc grey-txt reg-txt">${game.desc}</p>
          <div class="game-stars">${starHtml}</div>
          <div class="sketchy-button-lg button orange-bg push-down-btn reg-txt play-btn">თამაში →</div>
        </div>
      `;
    })
    .join("");
}

function buildStars(count) {
  let html = "";
  for (let i = 0; i < 3; i++) {
    const filled = i < count;
    html += `
      <svg width="22" height="22" viewBox="0 0 24 24"
           class="thumb-star ${filled ? "thumb-star--filled" : "thumb-star--empty"}">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02
                         12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>`;
  }
  return html;
}

function goToGame(path, grade) {
  window.location.href = path + "?grade=" + grade;
}

function goBack(island, grade) {
  window.location.href = `/pages/map.html?grade=${grade}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const params = getParams();

  if (!params) {
    document.getElementById("games-grid").innerHTML =
      "<p>URL ERROR — island და grade საჭიროა</p>";
    return;
  }

  const { island, grade } = params;
  renderHeader(island, grade);
  loadAndRenderGames(island, grade);

  const backBtn = document.getElementById("back-btn");
  if (backBtn) backBtn.addEventListener("click", () => goBack(island, grade));
});
