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
  if (response.status === 401 && !path.startsWith("/auth/")) handleExpiredToken();
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
