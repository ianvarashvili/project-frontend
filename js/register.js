const REGISTER_ERRORS = {
  "username უკვე არსებობს": "ეს სახელი დაკავებულია, სცადეთ სხვა",
  "კლასი უნდა იყოს 1-4": "კლასი უნდა იყოს 1-დან 4-მდე",
};
const NAME_REGEX = /^[ა-ჰa-zA-Z\s]{2,30}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWORD_REGEX = /^[\x20-\x7E]{6,30}$/;



function validateRegister({ username, password, name, surname, grade }) {
  if (!username || !password || !name || !surname || !grade) {
    return "გთხოვთ შეავსოთ ყველა ველი";
  }
  if (!NAME_REGEX.test(name))
    return "სახელი: მხოლოდ ქართული ან ინგლისური ასოები (2-30)";
  if (!NAME_REGEX.test(surname))
    return "გვარი: მხოლოდ ქართული ან ინგლისური ასოები (2-30)";
  if (!USERNAME_REGEX.test(username))
    return "ზედმეტსახელი: მხოლოდ ინგლისური ასოები, რიცხვები და _ (3-20)";
  if (!PASSWORD_REGEX.test(password))
    return "პაროლი: ქართული ასოები დაუშვებელია (6-30 სიმბოლო)";

  const gradeNum = parseInt(grade, 10);
  if (![1, 2, 3, 4].includes(gradeNum)) {
    return "კლასი უნდა იყოს 1-დან 4-მდე";
  }
  return null;
}

async function handleRegister(e) {
  e.preventDefault();
  // const error = validateForm(name, surname, username, password);
  // if (error) {
  //   showError("error-msg", error);
  //   return;
  // }
  const username = document
    .getElementById("username")
    .value.trim()
    .toLowerCase();
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value.trim();
  const surname = document.getElementById("surname").value.trim();
  const grade = getSelectedGrade();
  const avatarId = getSelectedAvatar();

  const validationError = validateRegister({
    username,
    password,
    name,
    surname,
    grade,
  });
  if (validationError) {
    showError("error-msg", validationError);
    return;
  }

  hideError("error-msg");
  setLoading(true);

  try {
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        name,
        surname,
        avatarId,
        grade,
      }),
    });

    window.location.href = `/pages/login.html?registered=1`;
  } catch (err) {
    const friendly =
      REGISTER_ERRORS[err.message] || "სერვერის შეცდომა, სცადეთ თავიდან";
    showError("error-msg", friendly);
  } finally {
    setLoading(false);
  }
}

function getSelectedGrade() {
  const selected = document.querySelector('input[name="choice"]:checked');
  return selected ? parseInt(selected.value, 10) : null;
}

function getSelectedAvatar() {
  const selected = document.querySelector(".avatar-option.selected");
  return selected ? parseInt(selected.dataset.avatarId, 10) : 1;
}

function initAvatarPicker() {
  const options = document.querySelectorAll(".avatar-option");
  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      options.forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");
    });
  });
}

function setLoading(isLoading) {
  const btn = document.getElementById("register-btn");
  if (!btn) return;
  btn.disabled = isLoading;
  btn.textContent = isLoading ? "მიმდინარეობს..." : "რეგისტრაცია";
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem(STORAGE_KEYS.firebaseToken)) {
    window.location.href = "/pages/home.html";
    return;
  }

  initAvatarPicker();

  const form = document.getElementById("register-form");
  if (form) form.addEventListener("submit", handleRegister);

  const params = new URLSearchParams(window.location.search);
  if (params.get("registered")) {
  }
});
