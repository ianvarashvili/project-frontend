const REGISTER_ERRORS = {
  "username უკვე არსებობს": "ეს ზედმეტსახელი დაკავებულია, სცადეთ სხვა",
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
    return "პაროლი: უნდა შედგებოდეს 6-30 ინგლისური სიმბოლოსგან";

  const gradeNum = parseInt(grade, 10);
  if (![1, 2, 3, 4].includes(gradeNum)) {
    return "კლასი უნდა იყოს 1-დან 4-მდე";
  }
  return null;
}

async function handleRegister(e) {
  e.preventDefault();
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

    window.location.href = `/pages/status/success.html`;
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
  const femaleAvatars = [
    { id: 13, src: "../assets/avatars/avatar-13.jpeg", alt: "აფხაზეთი" },
    { id: 14, src: "../assets/avatars/avatar-14.jpeg", alt: "სვანეთი" },
    { id: 15, src: "../assets/avatars/avatar-15.jpeg", alt: "სამეგრელო" },
    { id: 16, src: "../assets/avatars/avatar-16.jpeg", alt: "გურია" },
    { id: 17, src: "../assets/avatars/avatar-17.jpeg", alt: "იმერეთი" },
    { id: 18, src: "../assets/avatars/avatar-18.jpeg", alt: "რაჭა-ლეჩხუმი" },
    { id: 19, src: "../assets/avatars/avatar-19.jpeg", alt: "აჭარა" },
    { id: 20, src: "../assets/avatars/avatar-20.jpeg", alt: "სამცხე-ჯავახეთი" },
    { id: 21, src: "../assets/avatars/avatar-21.jpeg", alt: "შიდა ქართლი" },
    { id: 22, src: "../assets/avatars/avatar-22.jpeg", alt: "ქვემო ქართლი" },
    { id: 23, src: "../assets/avatars/avatar-23.jpeg", alt: "მცხეთა-მთიანეთი" },
    { id: 24, src: "../assets/avatars/avatar-24.jpeg", alt: "კახეთი" },
  ];
  const maleAvatars = [
    { id: 1, src: "../assets/avatars/avatar-1.jpeg", alt: "აფხაზეთი" },
    { id: 2, src: "../assets/avatars/avatar-2.jpeg", alt: "სვანეთი" },
    { id: 3, src: "../assets/avatars/avatar-3.jpeg", alt: "სამეგრელო" },
    { id: 4, src: "../assets/avatars/avatar-4.jpeg", alt: "გურია" },
    { id: 5, src: "../assets/avatars/avatar-5.jpeg", alt: "იმერეთი" },
    { id: 6, src: "../assets/avatars/avatar-6.jpeg", alt: "რაჭა-ლეჩხუმი" },
    { id: 7, src: "../assets/avatars/avatar-7.jpeg", alt: "აჭარა" },
    { id: 8, src: "../assets/avatars/avatar-8.jpeg", alt: "სამცხე-ჯავახეთი" },
    { id: 9, src: "../assets/avatars/avatar-9.jpeg", alt: "შიდა ქართლი" },
    { id: 10, src: "../assets/avatars/avatar-10.jpeg", alt: "ქვემო ქართლი" },
    { id: 11, src: "../assets/avatars/avatar-11.jpeg", alt: "მცხეთა-მთიანეთი" },
    { id: 12, src: "../assets/avatars/avatar-12.jpeg", alt: "კახეთი" },
  ];

  const femaleCont = document.getElementById("female-avatars");
  const maleCont = document.getElementById("male-avatars");

  if (!femaleCont || !maleCont) return;

  function renderAvatars(avatarArr, cont) {
    let htmlContent = "";
    for (let i = 0; i < avatarArr.length; i++) {
      const avatar = avatarArr[i];
      htmlContent += `
      <div class="avatar-picker">
                <div class="avatar-option" data-avatar-id="${avatar.id}">
                  <img src="${avatar.src}" alt="${avatar.alt}"/>
                </div>
              </div>
      `;
    }
    cont.innerHTML = htmlContent;
  }

  renderAvatars(femaleAvatars, femaleCont);
  renderAvatars(maleAvatars, maleCont);

  const femaleBtn = document.querySelector(".female-btn");
  const maleBtn = document.querySelector(".male-btn");

  if (femaleBtn && maleBtn) {
    femaleBtn.addEventListener("click", () => {
      femaleCont.style.display = "flex";
      maleCont.style.display = "none";
      femaleBtn.classList.add("selected-btn");
      maleBtn.classList.remove("selected-btn");
    });

    maleBtn.addEventListener("click", () => {
      maleCont.style.display = "flex";
      femaleCont.style.display = "none";
      femaleBtn.classList.remove("selected-btn");
      maleBtn.classList.add("selected-btn");
    });
  }

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
