# 🎮 თამაშის დეველოპმენტის გზამკვლევი
> "მათემატიკა თამაშ-თამაშით" — ახალი თამაშის დამატების სრული სახელმძღვანელო

---

## არქიტექტურა — ვინ რას აკეთებს

```
┌─────────────────────────────────────────────────────────────┐
│  SHARED (ყველა თამაში იყენებს — არ შეიცვლება!)             │
│                                                             │
│  config.js       → BASE_URL, STORAGE_KEYS, localStorage    │
│  auth.js         → checkAuth(), apiFetch(), logout()        │
│  game-engine.js  → timer, correctCount, feedback, endGame   │
│  game-submit.js  → backend submit, stars save, result UI    │
├─────────────────────────────────────────────────────────────┤
│  GAME-SPECIFIC (თითო თამაშისთვის)                          │
│                                                             │
│  [game].html     → UI, ანიმაციები, game elements           │
│  [game].js       → GAME_STATE + startRound() + game logic   │
└─────────────────────────────────────────────────────────────┘
```

---

## Script თანმიმდევრობა — ყველა თამაშის HTML-ში

```html
<!-- ყოველთვის ამ თანმიმდევრობით! -->
<script src="[path]/config.js"></script>      <!-- 1. საფუძველი -->
<script src="[path]/auth.js"></script>        <!-- 2. auth -->
<script src="[path]/game-engine.js"></script> <!-- 3. engine -->
<script src="[path]/game-submit.js"></script> <!-- 4. submit -->
<script src="[game].js"></script>             <!-- 5. ბოლოს! -->
```

> ⚠️ `[game].js` **ყოველთვის ბოლოს** — GAME_STATE-ს უნდა ჰქონდეს engine-ის ფუნქციები.

---

## GAME_STATE — სავალდებულო ობიექტი

```js
// ყოველ game.js-ში ეს ობიექტი სავალდებულოა!
// engine.js DOMContentLoaded-ზე startGame(GAME_STATE)-ს გამოიძახებს.

const GAME_STATE = {
  gameId:           "castle_g1_game1",  // ← უნიკალური ID
  island:           "castle",           // ← "castle"|"jungle"|"labyrinth"
  gameGrade:        parseInt(           // ← URL-იდან ავტომატურად
    new URLSearchParams(window.location.search).get("grade"), 10
  ) || 1,
  timeLimitSeconds: 60,                 // ← შენ გადაწყვეტ
};
```

**gameId ფორმატი:**
```
castle_g1_game1  → castle კუნძული, I კლასი, 1-ლი თამაში
jungle_g2_game3  → jungle კუნძული, II კლასი, 3-ე თამაში
```

---

## startRound() — სავალდებულო ფუნქცია

```js
// engine.js handleStartGame()-ი ამ ფუნქციას იძახებს!
// ახალ round/კითხვას იწყებს.

function startRound() {
  // შენი ლოგიკა — ახალი კითხვა, UI განახლება
}
```

---

## Engine-ის ფუნქციები — გამოიყენე game.js-ში

```js
onCorrect()                    // სწორ პასუხზე — correctCount++
showFeedback(msg, isCorrect)   // feedback-msg-ს ავსებს (green/red)
hideFeedback()                 // feedback-ს მალავს
gameState.isFinished           // timer ამოიწურა? → true
handleStartGame()              // start button-ზე — HTML-ში onclick=""
endGame()                      // ხელით დასრულება (ჩვეულებრივ არ ჭირდება)
```

---

## HTML — სავალდებულო Elements

```html
<!-- HUD — თამაშის ინფო -->
<div id="timer-display"></div>      <!-- timer: "45 წმ" -->
<div id="score-display">0</div>     <!-- correctCount -->
<div id="feedback-msg"></div>       <!-- სწორი/არასწორი შეტყობინება -->

<!-- Start overlay — თამაშის დაწყებამდე -->
<div id="start-overlay">
  <button onclick="handleStartGame()">თამაშის დაწყება</button>
</div>

<!-- Result overlay — timer ამოიწურა -->
<div id="result-overlay" style="display:none;">
  <p id="result-count"></p>          <!-- "X სწორი პასუხი!" -->
  <p id="result-score"></p>          <!-- totalScore -->
  <p id="result-improved"></p>       <!-- "პირადი რეკორდი!" -->
  <span class="result-star"></span>  <!-- × 3 სავალდებულო! -->
  <span class="result-star"></span>
  <span class="result-star"></span>
  <button id="btn-replay">კვლავ</button>
  <button id="btn-map">კუნძული</button>
</div>

<!-- Loading -->
<div id="loading-overlay" style="display:none;">გაიგზავნება...</div>
```

---

## CSS — სავალდებულო სტილები

```css
/* timer warning — engine-ი ამ class-ს ამატებს ≤10 წამზე */
#timer-display.timer-warning {
  color: red;
  animation: pulse 0.5s infinite;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.15); }
}

/* stars ანიმაცია */
.result-star {
  opacity: 0;
  transform: scale(0) rotate(-30deg);
  display: inline-block;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.result-star.active {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}
```

---

## Minimal game.js Template

```js
/**
 * [gameName].js
 * "[თამაშის სახელი]" — [island], [კლასი] კლასი
 *
 * Engine-ის ფუნქციები:
 *   onCorrect()              ← სწორ პასუხზე
 *   showFeedback(msg, bool)  ← feedback
 *   hideFeedback()           ← feedback-ის დამალვა
 *   gameState.isFinished     ← timer ამოიწურა?
 */

const GAME_STATE = {
  gameId:           "[island]_g[N]_game[N]",
  island:           "[island]",
  gameGrade:        parseInt(
    new URLSearchParams(window.location.search).get("grade"), 10
  ) || 1,
  timeLimitSeconds: 60,
};

// ← engine-ი ამ ფუნქციას გამოიძახებს!
function startRound() {
  // ახალი კითხვის გენერაცია და UI განახლება
}

// შენი game logic...

function checkAnswer() {
  if (gameState.isFinished) return;

  const isCorrect = /* შენი შემოწმება */;

  if (isCorrect) {
    onCorrect();
    showFeedback("სწორია! ✅", true);
    setTimeout(() => { hideFeedback(); startRound(); }, 700);
  } else {
    showFeedback("❌ სცადე თავიდან!", false);
  }
}
```

---

## island-config.js — ახალი თამაშის დამატება

```js
// 1. games/ საქაღალდეში შექმენი:
//    games/[island]/grade[N]/game[N]/
//    ├── [gameName].html
//    └── [gameName].js

// 2. island-config.js-ში დაამატე:
{
  gameId: "[island]_g[N]_game[N]",  // ← GAME_STATE.gameId-ს ემთხვევა!
  title:  "თამაშის სახელი",
  icon:   "🎮",
  desc:   "მოკლე აღწერა",
  path:   "../games/[island]/grade[N]/game[N]/[gameName].html"
}
```

---

## ✅ Checklist ახალი თამაშისთვის

```
□ games/[island]/grade[N]/game[N]/ საქაღალდე შეიქმნა
□ GAME_STATE.gameId უნიკალურია
□ startRound() განსაზღვრულია
□ onCorrect() გამოიძახება სწორ პასუხზე
□ showFeedback() / hideFeedback() გამოიძახება
□ gameState.isFinished შემოწმება interaction-ებში
□ HTML-ში სავალდებულო ID-ები: timer-display, score-display,
  feedback-msg, start-overlay, result-overlay, btn-replay, btn-map
□ 3 .result-star span-ი HTML-ში
□ Scripts: config → auth → game-engine → game-submit → [game].js
□ island-config.js-ში path დაემატა
```

---

## Scores სისტემა

```
correctCount × 5 = totalScore

>15 სწორი  → ⭐⭐⭐
>8  სწორი  → ⭐⭐
≥1  სწორი  → ⭐
0   სწორი  → არ ჩაითვლება
```
