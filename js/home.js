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
document.addEventListener("DOMContentLoaded", () => {
  initLogout();
  const token = localStorage.getItem(STORAGE_KEYS.firebaseToken);

  const authButtons = document.getElementById("auth-buttons");
  const userButtons = document.getElementById("user-buttons");
  const userStartPlayButton = document.getElementById("user-start-playing");
  const loggedOutRegAuth = document.getElementById("logged-out-user-reg-auth");
  const signUpFrame = document.getElementById("sign-up-frame");

  if (token) {
    if (authButtons) authButtons.style.display = "none";
    if (loggedOutRegAuth) loggedOutRegAuth.style.display = "none";
    if (userButtons) userButtons.style.display = "flex";
    if (userStartPlayButton) userStartPlayButton.style.display = "flex";

    if (signUpFrame) signUpFrame.style.display = "none";
  } else {
    if (authButtons) authButtons.style.display = "flex";
    if (loggedOutRegAuth) loggedOutRegAuth.style.display = "flex";
    if (userButtons) userButtons.style.display = "none";
    if (userStartPlayButton) userStartPlayButton.style.display = "none";

    if (signUpFrame) signUpFrame.style.display = "flex";
  }

  
});



function goToMap(grade) {
  window.location.href = `map.html?grade=${grade}`;
}