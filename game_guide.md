# Game Engine — სრული გზამკვლევი

> "მათემატიკა თამაშ-თამაშით" — თამაშის სისტემის სრული დოკუმენტაცია

---

## 1. ფაილების სტრუქტურა

```
js/
├── game-engine.js      ← timer, gameState, start/stop
├── game-submit.js      ← backend-ზე გაგზავნა + ანიმაციები
└── game-loader.js      ← URL-იდან თამაშის ჩატვირთვა

games/
├── castle/
│   ├── grade1.js       ← I კლასის 5 თამაში
│   ├── grade2.js
│   ├── grade3.js
│   └── grade4.js
├── jungle/
│   └── grade1.js ...
└── labyrinth/
    └── grade1.js ...
```

---

## 2. gameState — "გულისცემა"

ყველა თამაში ამ ერთ ობიექტს იყენებს.
**არასდროს** შევქმნათ ახალი — ყოველთვის ეს:

```js
const gameState = {
  // ინფო (game-loader.js ავსებს)
  gameId: null, // "castle_g1_game1"
  island: null, // "castle"
  gameGrade: null, // 2
  maxTime: 120, // წამი — თამაშის config-იდან

  // სკორი (თამაში ავსებს)
  correctCount: 0,

  // დრო (game-engine.js მართავს)
  startTime: null, // Date.now()
  timerInterval: null, // setInterval reference

  // დაცვა
  isFinished: false, // ორჯერ submit-ისგან
};
```

---

## 3. თამაშის კონფიგი (games/castle/grade1.js)

```js
/**
 * games/castle/grade1.js
 * I კლასი — ციხე კუნძულის 5 თამაში
 */
const CASTLE_GRADE1 = [
  {
    gameId:         "castle_g1_game1",
    title:          "რიცხვების მატარებელი",
    type:           "drag-drop",      // engine იცის ამ ტიპის UI
    maxTimeSeconds: 120,
    questions: [
      // თამაშის ტიპის მიხედვით სხვადასხვა სტრუქტურა
    ]
  },
  {
    gameId:         "castle_g1_game2",
    title:          "შეკრების ოსტატი",
    type:           "fill-blank",
    maxTimeSeconds: 90,
    questions: [ ... ]
  },
  // ... სულ 5 თამაში
];
```

### თამაშის ტიპები და questions სტრუქტურა

**fill-blank** (ველის შევსება):

```js
{ id: 1, display: "3 + _ = 7",  answer: 4 }
{ id: 2, display: "_ × 3 = 12", answer: 4 }
```

**multiple-choice** (4 პასუხი):

```js
{
  id: 1,
  display: "5 + 3 = ?",
  options: [6, 7, 8, 9],
  answer: 8
}
```

**drag-drop** (გადათრევა):

```js
{
  id: 1,
  display: "დაალაგე ზრდადობით",
  items:   [7, 2, 9, 1, 5],
  answer:  [1, 2, 5, 7, 9]
}
```

**match** (დაწყვილება):

```js
{
  id: 1,
  left:  ["2×3", "4×2", "5×1"],
  right: [8, 6, 5],
  pairs: { 0:1, 1:0, 2:2 }   // left[0]→right[1], და ა.შ
}
```

**sort** (დახარისხება):

```js
{
  id: 1,
  display: "ჩამოალაგე კლებადობით",
  items:   [3, 8, 1, 6, 4],
  answer:  [8, 6, 4, 3, 1]
}
```

---

## 4. game-engine.js — სასიცოცხლო ციკლი

```js
// ეს ფუნქციები game-engine.js-შია

startGame(config); // gameState-ს ავსებს, timer-ს იწყებს
onActionDone(correct); // actionsTotal++, სწორია? actionsCorrect++
endGame(reason); // timer-ს აჩერებს, submitGame()-ს იძახებს
```

### startGame()

```js
function startGame(config) {
  gameState.gameId = config.gameId;
  gameState.island = config.island; // URL-იდან
  gameState.gameGrade = config.gameGrade; // URL-იდან
  gameState.maxTime = config.maxTimeSeconds;
  gameState.startTime = Date.now();

  startTimer(); // countdown UI
}
```

### onActionDone() — ყველა თამაში ამას იძახებს

```js
/**
 * თამაში ამ ფუნქციას იძახებს ყოველ მოქმედებაზე.
 * @param {boolean} isCorrect
 */
function onActionDone(isCorrect) {
  gameState.actionsTotal++;
  if (isCorrect) gameState.actionsCorrect++;

  // ✅ ახალი — მხოლოდ timer ამთავრებს
  function onActionDone(isCorrect) {
    if (isCorrect) {
      gameState.correctCount++;
      // შემდეგ კითხვაზე გადასვლა
    }
    // არასწორზე — იგივე კითხვა რჩება
    // timer ამთავრებს თამაშს!
  }
}
```

### endGame()

```js
function endGame(reason) {
  if (gameState.isFinished) return; // ორჯერ არ გაიგზავნოს!
  gameState.isFinished = true;

  clearInterval(gameState.timerInterval);

  // game-submit.js-ს გადაეცემა
  submitGame();
}
```

---

## 5. Timer — წამზომი

```js
function startTimer() {
  updateTimerUI(gameState.maxTime); // პირველი ჩვენება

  gameState.timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    const remaining = gameState.maxTime - elapsed;

    updateTimerUI(remaining);

    if (remaining <= 0) {
      endGame("timeout"); // დრო ამოიწურა
    }
  }, 1000);
}

function updateTimerUI(seconds) {
  const el = document.getElementById("timer-display");
  if (!el) return;
  el.textContent = seconds + "წმ";

  // ≤10 წამი → გაფრთხილება (CSS class)
  el.classList.toggle("timer-warning", seconds <= 10);
}
```

**CSS:**

```css
#timer-display {
  font-size: 24px;
  font-weight: bold;
}

/* ≤10 წამი → წითელი + ანიმაცია */
#timer-display.timer-warning {
  color: #e74c3c;
  animation: pulse 0.5s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}
```

---

## 6. game-submit.js — Backend-ზე გაგზავნა

```js
async function submitGame() {
  const timeSpent = Math.floor((Date.now() - gameState.startTime) / 1000);

  const payload = {
    userId: localStorage.getItem("userId"),
    gameId: gameState.gameId,
    island: gameState.island,
    gameGrade: gameState.gameGrade,
    correctCount: gameState.correctCount,
    timeLimitSeconds: gameState.maxTime,
  };

  try {
    showLoadingOverlay();
    const data = await apiFetch("/game/submit", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // localStorage განახლება
    updateLocalStorage(data);

    // ანიმაციები და შედეგი
    showResults(data);
  } catch (err) {
    hideLoadingOverlay();
    showError("submit-error", "გაგზავნა ვერ მოხერხდა, სცადეთ თავიდან");
  }
}

function updateLocalStorage(data) {
    localStorage.setItem(STORAGE_KEYS.userStars,  data.updatedStars);
    localStorage.setItem(STORAGE_KEYS.userPoints, data.updatedPoints);
    localStorage.setItem(STORAGE_KEYS.userRank,   data.updatedRank);

    if (data.newBadges && data.newBadges.length > 0) {
        const stored  = localStorage.getItem(STORAGE_KEYS.userBadges);
        const current = stored ? JSON.parse(stored) : [];
        const updated = [...new Set([...current, ...data.newBadges])];
        localStorage.setItem(STORAGE_KEYS.userBadges, JSON.stringify(updated));
    }
}
```

---

## 7. შედეგების ეკრანი + ანიმაციები

### showResults() — თანმიმდევრობა

```
1. overlay გამოჩნდება (fade in)
2. ქულა ითვლება (count-up ანიმაცია)
3. ვარსკვლავები ჩნდება (ერთ-ერთ-ერთი)
4. newBadges? → badge popup
5. updatedRank შეიცვალა? → rank-up ანიმაცია
6. ღილაკები: "კვლავ თამაში" | "რუკაზე დაბრუნება"
```

### ქულის count-up ანიმაცია

```js
/**
 * 0-დან მიზნამდე ითვლება — ბავშვებს უყვართ!
 * @param {number} target  - საბოლოო ქულა
 * @param {string} elementId
 */
function animateScore(target, elementId) {
  const el = document.getElementById(elementId);
  const dur = 1500; // 1.5 წამი
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / dur, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
```

### ვარსკვლავების ანიმაცია

```js
/**
 * ვარსკვლავებს თანმიმდევრულად ანათებს.
 * @param {number} count - 1, 2, ან 3
 */
function animateStars(count) {
  const stars = document.querySelectorAll(".result-star");

  stars.forEach((star, i) => {
    star.classList.remove("active");
    if (i < count) {
      // 300ms დაყოვნება თითოეულს
      setTimeout(() => {
        star.classList.add("active");
        // ხმა აქ დაემატება მომავალში
      }, i * 300);
    }
  });
}
```

**HTML:**

```html
<div class="stars-container">
  <span class="result-star">⭐</span>
  <span class="result-star">⭐</span>
  <span class="result-star">⭐</span>
</div>
```

**CSS:**

```css
.result-star {
  font-size: 48px;
  opacity: 0;
  transform: scale(0) rotate(-30deg);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.result-star.active {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}
```

### Badge popup

```js
/**
 * ახალი badge-ების popup-ი.
 * @param {string[]} badges
 */
function showBadges(badges) {
  if (!badges || badges.length === 0) return;

  badges.forEach((badge, i) => {
    setTimeout(() => {
      const popup = document.createElement("div");
      popup.className = "badge-popup";
      popup.innerHTML = `🏅 ახალი ბეიჯი: <strong>${badge}</strong>`;
      document.body.appendChild(popup);

      // 3 წამის შემდეგ ქრება
      setTimeout(() => popup.remove(), 3000);
    }, i * 1000); // თანმიმდევრულად
  });
}
```

**CSS:**

```css
.badge-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #f9c74f;
  border-radius: 12px;
  padding: 14px 20px;
  font-size: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation:
    slideIn 0.4s ease,
    fadeOut 0.4s 2.6s ease forwards;
  z-index: 1000;
}

@keyframes slideIn {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}
```

### Rank-up ანიმაცია

```js
/**
 * წოდება შეიცვალა? → სპეციალური ანიმაცია
 * @param {string} oldRank
 * @param {string} newRank
 */
function checkRankUp(oldRank, newRank) {
  if (oldRank === newRank) return;

  const el = document.getElementById("rank-up-banner");
  if (!el) return;

  el.textContent = `🎉 ახალი წოდება: ${newRank}!`;
  el.classList.add("visible");

  setTimeout(() => el.classList.remove("visible"), 4000);
}
```

---

## 8. თამაშის შიდა ანიმაციები

### სწორი / არასწორი პასუხი

```js
/**
 * პასუხზე რეაგირება — ვიზუალური feedback.
 * @param {boolean} isCorrect
 * @param {HTMLElement} el - კლიკებული ელემენტი
 */
function showAnswerFeedback(isCorrect, el) {
  const cls = isCorrect ? "answer-correct" : "answer-wrong";
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 600);
}
```

```css
@keyframes correctPop {
  0% {
    transform: scale(1);
    background: inherit;
  }
  50% {
    transform: scale(1.15);
    background: #a8e6a3;
  }
  100% {
    transform: scale(1);
    background: inherit;
  }
}

@keyframes wrongShake {
  0%,
  100% {
    transform: translateX(0);
    background: inherit;
  }
  25% {
    transform: translateX(-8px);
    background: #f4a0a0;
  }
  75% {
    transform: translateX(8px);
    background: #f4a0a0;
  }
}

.answer-correct {
  animation: correctPop 0.4s ease;
}
.answer-wrong {
  animation: wrongShake 0.4s ease;
}
```

### პროგრეს ბარი

```js
/**
 * პროგრეს ბარის განახლება.
 * @param {number} current - ამჟამინდელი კითხვა
 * @param {number} total   - სულ კითხვები
 */
function updateProgress(current, total) {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;
  const pct = Math.round((current / total) * 100);
  bar.style.width = pct + "%";
}
```

```html
<div class="progress-track">
  <div id="progress-bar" class="progress-fill"></div>
</div>
```

```css
.progress-track {
  background: #eee;
  border-radius: 10px;
  height: 10px;
}
.progress-fill {
  background: linear-gradient(90deg, #6c63ff, #a78bfa);
  border-radius: 10px;
  height: 100%;
  transition: width 0.4s ease;
}
```

---

## 9. URL-იდან თამაშის ჩატვირთვა

```
game.html?island=castle&grade=2&gameIndex=0
              ↓           ↓         ↓
           კუნძული     კლასი    0=პირველი თამაში
```

```js
// game-loader.js
function loadGameFromURL() {
  const params    = new URLSearchParams(window.location.search);
  const island    = params.get("island");    // "castle"
  const grade     = parseInt(params.get("grade"), 10);  // 2
  const gameIndex = parseInt(params.get("gameIndex") || "0", 10);

  // სწორი grade ფაილი
  // castle + grade 2 → CASTLE_GRADE2[gameIndex]
  const configMap = {
    castle:    [null, CASTLE_GRADE1, CASTLE_GRADE2, CASTLE_GRADE3, CASTLE_GRADE4],
    jungle:    [null, JUNGLE_GRADE1, JUNGLE_GRADE2, JUNGLE_GRADE3, JUNGLE_GRADE4],
    labyrinth: [null, LABYRINTH_GRADE1, ...],
  };

  const gradeGames = configMap[island]?.[grade];
  if (!gradeGames) { /* შეცდომა */ return; }

  const config = gradeGames[gameIndex];
  config.island    = island;
  config.gameGrade = grade;

  startGame(config);
}
```

**map.html-ზე კუნძულის კლიკი:**

```js
// grade URL-ში კი არ გადადის — localStorage-იდან იკითხება game.html-ზე!
function onIslandClick(island) {
  window.location.href = `/pages/game.html?island=${island}&gameIndex=0`;
}
```

---

## 10. HTML id-ები game.html-ზე

```
id="timer-display"      ← წამზომი
id="question-display"   ← კითხვის ტექსტი
id="progress-bar"       ← პროგრეს ბარი
id="answer-input"       ← fill-blank-ისთვის
id="submit-answer"      ← პასუხის ღილაკი
id="result-overlay"     ← შედეგების overlay (display:none)
id="result-score"       ← count-up ქულა
id="result-stars"       ← ვარსკვლავების კონტეინერი
id="rank-up-banner"     ← წოდების ბანერი (display:none)
id="submit-error"       ← error message (display:none)
id="btn-replay"         ← "კვლავ თამაში"
id="btn-map"            ← "რუკაზე დაბრუნება"
```

---

## 11. script-ების თანმიმდევრობა game.html-ზე

```html
<!-- საფუძველი -->
<script src="../js/config.js"></script>
<script src="../js/auth.js"></script>

<!-- თამაშის data ფაილები — ყველა კლასი წინასწარ იტვირთება -->
<script src="../games/castle/grade1.js"></script>
<script src="../games/castle/grade2.js"></script>
<script src="../games/castle/grade3.js"></script>
<script src="../games/castle/grade4.js"></script>
<script src="../games/jungle/grade1.js"></script>
<!-- ... ყველა -->

<!-- engine — data ფაილების შემდეგ! -->
<script src="../js/game-engine.js"></script>
<script src="../js/game-submit.js"></script>
<script src="../js/game-loader.js"></script>
<!-- ბოლო! -->
```

---

## 12. ახალი თამაშის დამატება — ჩეკლისტი

```
□ games/[island]/grade[N].js-ში ახალი ობიექტი დაამატე
□ gameId უნიკალურია? (castle_g1_game3 ✅, castle_game_1 ❌ — უკვე გვაქვს)
□ type სწორია? (fill-blank | multiple-choice | drag-drop | match | sort)
□ maxTimeSeconds — ბავშვის ასაკისთვის შესაფერისი?
□ questions სტრუქტურა ზუსტად ემთხვევა type-ს?
□ game.html-ზე script-ებში ფაილი ჩართულია?
```

---

## 13. მოკლე შეჯამება

```
game data ფაილი   →  კითხვები, ტიპი, დრო
game-loader.js    →  URL წაიკითხა, სწორი config ჩატვირთა
game-engine.js    →  timer, actionsTotal/Correct, endGame
game-submit.js    →  backend, ანიმაციები, შედეგი
onActionDone()    →  ეს ერთი ფუნქცია აკავშირებს თამაშს engine-თან
```
