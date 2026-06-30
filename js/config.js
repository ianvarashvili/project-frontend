const BASE_URL = "https://math-games-service.onrender.com";

const STORAGE_KEYS = {
  firebaseToken: "firebaseToken",
  userNickname: "userNickname",
  userId: "userId",
  userName: "userName",
  userSurname: "userSurname",
  userGrade: "userGrade",
  userAvatar: "userAvatar",
  userStars: "userStars",
  userPoints: "userPoints",
  userRank: "userRank",
  userBadges: "userBadges",
  selectedGrade: "selectedGrade",
  progressCache: "progressCache"
};

const STAR_THRESHOLDS = { three: 15, two: 8 };

const RANK_THRESHOLDS = [
  { min: 1300, label: "მათემატიკის ლეგენდა" },
  { min: 800, label: "მათემატიკის გმირი" },
  { min: 300, label: "მათემატიკის რაინდი" },
  { min: 0, label: "მათემატიკის მოსწავლე" },
];

function getStoredUser() {
  const token = localStorage.getItem(STORAGE_KEYS.firebaseToken);
  if (!token) return null;
  return {
    token: token,
    userNickname: localStorage.getItem(STORAGE_KEYS.userNickname),
    userId: localStorage.getItem(STORAGE_KEYS.userId),
    userName: localStorage.getItem(STORAGE_KEYS.userName),
    userSurname: localStorage.getItem(STORAGE_KEYS.userSurname),
    grade: parseInt(localStorage.getItem(STORAGE_KEYS.userGrade), 10),
    avatar: parseInt(localStorage.getItem(STORAGE_KEYS.userAvatar), 10),
    stars: parseInt(localStorage.getItem(STORAGE_KEYS.userStars), 10),
    points: parseInt(localStorage.getItem(STORAGE_KEYS.userPoints), 10),
    rank: localStorage.getItem(STORAGE_KEYS.userRank),
    badges: JSON.parse(localStorage.getItem(STORAGE_KEYS.userBadges) || "[]"),
  };
}

function storeUser(data) {
  localStorage.setItem(STORAGE_KEYS.firebaseToken, data.firebaseToken);
  localStorage.setItem(STORAGE_KEYS.userNickname, data.username);
  localStorage.setItem(STORAGE_KEYS.userId, data.userId);
  localStorage.setItem(STORAGE_KEYS.userName, data.name);
  localStorage.setItem(STORAGE_KEYS.userSurname, data.surname);
  localStorage.setItem(STORAGE_KEYS.userGrade, data.grade);
  localStorage.setItem(STORAGE_KEYS.userAvatar, data.avatarId);
  localStorage.setItem(STORAGE_KEYS.userStars, data.stars);
  localStorage.setItem(STORAGE_KEYS.userPoints, data.points);
  localStorage.setItem(STORAGE_KEYS.userRank, data.rank);
  localStorage.setItem(
    STORAGE_KEYS.userBadges,
    JSON.stringify(data.badges || []),
  );
}

function clearUser() {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
}

//გვერდის გახსნისთანავე ping რომ სერვერმა გაიღვიძოს
document.addEventListener("DOMContentLoaded", () => {
  fetch(`${BASE_URL}/health`).catch(() => {});
});