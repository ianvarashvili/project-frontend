const LOGIN_ERRORS = {
  "მომხმარებელი ვერ მოიძებნა": "ასეთი მომხმარებელი არ არსებობს",
  "პაროლი არასწორია": "პაროლი არასწორია",
};
async function handleLogin(e) {
  e.preventDefault();

  const username = document
    .getElementById("username")
    .value.trim()
    .toLowerCase();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    showError("error-msg", "გთხოვთ შეავსოთ ყველა ველი");
    return;
  }

  hideError("error-msg");
  setLoading(true);

  try {
    // POST /auth/login
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    storeUser(data);

    window.location.href = "/pages/profile.html";
  } catch (err) {
    const friendly =
      LOGIN_ERRORS[err.message] || "სერვერის შეცდომა, სცადეთ თავიდან";
    showError("error-msg", friendly);
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading) {
  const btn = document.getElementById("login-btn");
  if (!btn) return;
  btn.disabled = isLoading;
  btn.textContent = isLoading ? "მიმდინარეობს..." : "შესვლა";
}

document.addEventListener("DOMContentLoaded", () => {
  // უკვე შესული იუზერი პირდაპირ პროფილზე გადავიდეს
  if (localStorage.getItem(STORAGE_KEYS.firebaseToken)) {
    window.location.href = "/pages/profile.html";
    return;
  }
  const form = document.getElementById("login-form");
  if (form) form.addEventListener("submit", handleLogin);
});
