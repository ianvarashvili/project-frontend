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

function showPopups(badges) {
  badges.forEach((badge, i) => {
    setTimeout(() => {
      const popup = document.createElement("div");
      popup.className = "badge-popup";
      popup.textContent =badge;
      document.body.appendChild(popup);
      setTimeout(() => popup.remove(), 3500);
    }, i * 1200);
  });
}

// Settings Modal
function openSettingsModal() {
  document.getElementById("settings-modal").classList.add("visible");
  showSettingsStep("settings-options");
}

function closeSettingsModal() {
  document.getElementById("settings-modal").classList.remove("visible");
  resetSettingsForms();
}

function showSettingsStep(stepId) {
  const box     = document.querySelector("#settings-modal .settings-box");
  const current = box.querySelector(".settings-step.active");
  const next    = document.getElementById(stepId);
  if (!next || current === next) return;

  const isGoingBack = stepId === "settings-options";

  box.style.height = box.offsetHeight + "px"; 

  if (current) {
    current.classList.remove("active");
    current.classList.add("exiting");      
    current.style.transform = isGoingBack ? "translateX(24px)" : "translateX(-24px)";
    current.style.opacity = "0";
  }

  next.style.display   = "block";
  next.style.opacity   = "0";
  next.style.transform = isGoingBack ? "translateX(-24px)" : "translateX(24px)";

  const targetHeight = box.scrollHeight; 

  requestAnimationFrame(() => {
    box.style.height = targetHeight + "px";
    requestAnimationFrame(() => {
      next.classList.add("active");
      next.style.transform = "";
      next.style.opacity = "";
    });
  });

  if (current) {
    setTimeout(() => {
      current.classList.remove("exiting");
      current.style.display = "none";
      current.style.transform = "";
      current.style.opacity = "";
    }, 250);
  }
}


function backToSettingsOptions() {
  resetSettingsForms();
  showSettingsStep("settings-options");
}

function resetSettingsForms() {
  document.getElementById("current-password").value = "";
  document.getElementById("new-password").value = "";
  document.getElementById("delete-confirm-password").value = "";
  document.getElementById("password-error").style.display = "none";
  document.getElementById("delete-error").style.display = "none";
}

// Change Password
async function savePasswordChange() {
  const currentPassword = document.getElementById("current-password").value;
  const newPassword     = document.getElementById("new-password").value;
  const errorEl         = document.getElementById("password-error");

  if (!currentPassword || !newPassword) {
    errorEl.textContent   = "გთხოვთ შეავსოთ ორივე ველი";
    errorEl.style.display = "block";
    return;
  }

  try {
    await apiFetch("/profile/change-password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    closeSettingsModal();
    showPopups(["პაროლი წარმატებით შეიცვალა!"]);
  } catch (err) {
    errorEl.textContent   = err.message || "შეცდომა, სცადეთ თავიდან";
    errorEl.style.display = "block";
  }
}

// Delete Account
async function confirmDeleteAccount() {
  const password = document.getElementById("delete-confirm-password").value;
  const errorEl  = document.getElementById("delete-error");

  if (!password) {
    errorEl.textContent   = "გთხოვთ შეიყვანოთ პაროლი";
    errorEl.style.display = "block";
    return;
  }

  try {
    await apiFetch("/profile/delete", {
      method: "DELETE",
      body: JSON.stringify({ password }),
    });
    clearUser();
    clearUser();
window.location.href = "/pages/status/deleted.html";
  } catch (err) {
    errorEl.textContent   = err.message || "შეცდომა, სცადეთ თავიდან";
    errorEl.style.display = "block";
  }
}