const ALL_BADGES = [
  {
    id: "პირველი ნაბიჯი",
    icon: "../assets/sprites.svg#icon-star",
    description: "დარეგისტრირდი გვერდზე",
  },
  {
    id: "სწრაფი მოაზროვნე",
    icon: "../assets/sprites.svg#icon-flash",
    description: "ერთ თამაშში 20+ სწორი პასუხი",
  },
  {
    id: "ჩემპიონი",
    icon: "../assets/sprites.svg#icon-trophy-profile",
    description: "მოხვდი ტოპ სამეულში",
  },
  {
    id: "სრული სიზუსტე",
    icon: "../assets/sprites.svg#icon-target-profile",
    description: "100% სიზუსტე კუნძულზე",
  },
];

const PROFILE_ERRORS = {
  invalid_name: "სახელი უნდა შეიცავდეს მხოლოდ ასოებს (2-30 სიმბოლო)",
  invalid_surname: "გვარი უნდა შეიცავდეს მხოლოდ ასოებს (2-30 სიმბოლო)",
};
const PROFILE_NAME_REGEX = /^[ა-ჰa-zA-Z\s]{2,30}$/;

function renderProfile() {
  const user = getStoredUser();
  if (!user) return;
  setText("profile-name", `${user.userName} ${user.userSurname || ""}`);
  setText("profile-nickname", `@${user.userNickname}`);
  setText("profile-grade", `${user.grade} კლასი`);
  setText("profile-stars", ` ${user.stars}`);
  setText("profile-points", ` ${user.points}`);
  setText("profile-rank", user.rank);

  const avatarEl = document.getElementById("profile-avatar");
  if (avatarEl) {
    avatarEl.src = `../assets/avatars/avatar-${user.avatar}.jpeg`;
    avatarEl.alt = "ავატარი";
  }
}

function renderBadges(earnedBadges) {
  const container = document.getElementById("profile-badges");
  if (!container) return;

  container.innerHTML = ALL_BADGES.map((badge) => {
    const earned =
      badge.id === "პირველი ნაბიჯი" ? true : earnedBadges.includes(badge.id);
    return `
      <div class="flexcolumn profile-cards badges ${earned ? "badge-earned" : "badge-locked"}">
        <svg class="icon-badges">
          <use href="${badge.icon}"></use>
        </svg>
        <p>${badge.id}</p>
        <p class="grey-txt">${badge.description}</p>
        ${!earned ? '<p class="locked-label"></p>' : ""}
      </div>
    `;
  }).join("");
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function initLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  const modal = document.getElementById("logout-modal");
  const cancelBtn = document.getElementById("cancel-logout");
  const confirmBtn = document.getElementById("confirm-logout");

  if (logoutBtn && modal) {
    logoutBtn.addEventListener("click", () => {
      modal.style.display = "flex";
    });

    cancelBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    confirmBtn.addEventListener("click", () => {
      modal.style.display = "none";
      logout();
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }
}

function initStartGame() {
  const btn = document.getElementById("start-game-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const user = getStoredUser();
    if (user && user.grade) {
      window.location.href = `map.html?grade=${user.grade}`;
    } else {
      window.location.href = "map.html";
    }
  });
}

function openEdit() {
  const user = getStoredUser();
  document.getElementById("edit-name").value = user.userName || "";
  document.getElementById("edit-surname").value = user.userSurname || "";
  document.getElementById("edit-form").style.display = "block";
  document.getElementById("edit-btn").style.display = "none";
  document.getElementById("profile-name").style.display = "none";
}

function cancelEdit() {
  document.getElementById("edit-form").style.display = "none";
  document.getElementById("edit-btn").style.display = "flex";
  document.getElementById("profile-name").style.display = "block";
  document.getElementById("edit-error").style.display = "none";
}

async function saveEdit() {
  const name = document.getElementById("edit-name").value.trim();
  const surname = document.getElementById("edit-surname").value.trim();
  const errorEl = document.getElementById("edit-error");

  if (!name || !surname) {
    showProfileError("გთხოვთ შეავსოთ ორივე ველი");
    return;
  }
  if (!PROFILE_NAME_REGEX.test(name) || !PROFILE_NAME_REGEX.test(surname)) {
    showProfileError("მხოლოდ ქართული ან ინგლისური ასოები (2-30 სიმბოლო)");
    return;
  }

  try {
    await apiFetch("/profile/update", {
      method: "PATCH",
      body: JSON.stringify({
        userId: localStorage.getItem(STORAGE_KEYS.userId),
        name: name,
        surname: surname,
      }),
    });

    localStorage.setItem(STORAGE_KEYS.userName, name);
    localStorage.setItem(STORAGE_KEYS.userSurname, surname);
    cancelEdit();
    renderProfile();
  } catch (err) {
    const friendlyMessage =
      PROFILE_ERRORS[err.message] || "განახლება ვერ მოხერხდა, სცადეთ თავიდან";
    showProfileError(friendlyMessage);
  }
}

function showProfileError(msg) {
  const errorEl = document.getElementById("edit-error");
  errorEl.textContent = msg;
  errorEl.style.display = "block";
}

document.addEventListener("DOMContentLoaded", async () => {
  checkAuth();
  renderProfile();
  initLogout();
  initStartGame();

  const user = getStoredUser();
  if (user) renderBadges(user.badges);

  //მყისიერად გამოვაჩინოთ სტატისტიკა local storageდან
  const cachedProgress = JSON.parse(localStorage.getItem("progressCache") || "{}");
  if (cachedProgress.gamesPlayed !== undefined) {
    setText("games-played-total", cachedProgress.gamesPlayed);
    setText("streak-total", cachedProgress.streak);
  }
  try {
    const data = await apiFetch("/progress");
    localStorage.setItem("progressCache", JSON.stringify(data));
    setText("games-played-total", data.gamesPlayed);
    setText("streak-total", data.streak);
  } catch (err) {
    console.warn("Stats ვერ ჩაიტვირთა:", err.message);
  }
});

const profileCont = document.querySelector(".profile-page-changing-container");
const accompBtn = document.querySelector(".accomplishments-btn");
const chartBtn = document.querySelector(".chart-btn");

accompBtn.addEventListener("click", function () {
  profileCont.classList.add("show");
  accompBtn.classList.add("active");
  chartBtn.classList.remove("active");
});
chartBtn.addEventListener("click", function () {
  profileCont.classList.remove("show");
  chartBtn.classList.add("active");
  accompBtn.classList.remove("active");
});
