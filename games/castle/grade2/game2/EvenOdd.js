const GAME_STATE = {
  gameId: "castle_g2_game2",
  island: "castle",
  gameGrade:
    parseInt(new URLSearchParams(window.location.search).get("grade"), 10) || 1,
  timeLimitSeconds: 30,
};

let selectedApple = null;
let remainingApples = 10;
let applesCont = document.getElementById("apples-cont");
let evenAppPlaces = document.getElementById("even-apple-places");
let oddAppPlaces = document.getElementById("odd-apple-places");

function startRound() {
  gameState.isFinished = false;
  applesCont.innerHTML = "";
  evenAppPlaces.innerHTML = "";
  oddAppPlaces.innerHTML = "";
  selectedApple = null;
  remainingApples = 10;

  let uniqueApples = new Set();

  do {
    let num = Math.floor(Math.random() * 50) + 1;
    uniqueApples.add(num);
  } while (uniqueApples.size < 10);

  uniqueApples.forEach((num) => {
    let apple = document.createElement("div");
    let x = 10;
    apple.className = "apple-btn";
    apple.textContent = num;

    apple.onclick = function (e) {
      e.stopPropagation();
      if (selectedApple) selectedApple.classList.remove("selected");
      selectedApple = apple;
      apple.classList.add("selected");
    };
    applesCont.appendChild(apple);
  });
}

function chooseBasket(basketType) {
  if (gameState.isFinished || !selectedApple) return;

  const value = parseInt(selectedApple.textContent);
  const isEven = value % 2 === 0;

  if ((isEven && basketType === "even") || (!isEven && basketType === "odd")) {
    selectedApple.classList.remove("selected");
    selectedApple.onclick = null;
    document
      .getElementById(basketType + "-apple-places")
      .appendChild(selectedApple);
    selectedApple = null;
    remainingApples--;

    if (remainingApples === 0) {
      gameState.isFinished = true;
      onCorrect();
      showFeedback("ყოჩაღ, სწორია!", true);

      setTimeout(() => {
        hideFeedback();
        startRound();
      }, 2000);
    }
  } else {
    let wrongApple = selectedApple;
    wrongApple.classList.remove("selected");
    selectedApple = null;

    wrongApple.style.background = "#272624";
    setTimeout(() => {
      wrongApple.style.background = "#ef4444";
    }, 200);
  }
}
