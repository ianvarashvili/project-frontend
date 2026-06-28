function checkAuth() {
  const token = localStorage.getItem(STORAGE_KEYS.firebaseToken);
  if (!token) {
    window.location.href = "/pages/login.html";
    return null;
  }
  return token;
}

function handleExpiredToken() {
  clearUser();
  window.location.href = "/pages/login.html";
}
//API request
async function apiFetch(path, options = {}) {
  let token = localStorage.getItem(STORAGE_KEYS.firebaseToken);

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    if (
      response.status === 401 &&
      !path.startsWith("/auth/") &&
      path !== "/profile/change-password" &&
      path !== "/profile/delete"
    ) {
      handleExpiredToken();
    }
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  return data;
}

function logout() {
  clearUser();
  window.location.href = "/pages/login.html";
}

// UI errors
function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.style.display = "block";
}

function hideError(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = "";
  el.style.display = "none";
}

//password input ხილვადობა
function togglePasswordVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";

  const icon = btnEl.querySelector("svg");
  icon.innerHTML = isHidden
    ? `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`
    : `<path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A10.94 10.94 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M14.12 14.12a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;
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
