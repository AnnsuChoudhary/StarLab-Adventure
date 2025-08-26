import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// 🔹 Firebase config
const firebaseConfig = {
 //
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 DOM references
const labsCompletedEl = document.getElementById("labsCompleted");
const streakEl = document.getElementById("streak");
const earnedEl = document.getElementById("earned");
const totalBadgesEl = document.getElementById("totalBadges");
const badgeGrid = document.getElementById("badgeGrid");
const timelineEl = document.getElementById("timeline");

// List of all possible badges (for locked/earned filter)
const ALL_BADGES = [
  { name: "First Login", desc: "Welcome to Starlab Adventure!" },
  { name: "First Lab Completed", desc: "Completed your first experiment." },
  { name: "5 Labs Completed", desc: "Completed 5 experiments." },
  { name: "10 Day Streak", desc: "Logged in for 10 consecutive days." }
];

// --- Ensure user doc exists
async function ensureUserDoc(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const today = new Date().toDateString();
    const data = { 
      labsCompleted: 0,
      streak: 1,
      lastLogin: today,
      badges: ["First Login"]
    };
    await setDoc(ref, data);
    return data;
  }
  return snap.data();
}

// --- Update daily streak
async function updateStreak(uid, data) {
  const ref = doc(db, "users", uid);
  const today = new Date().toDateString();
  let streak = data.streak || 0;

  if (data.lastLogin !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (data.lastLogin === yesterday.toDateString()) {
      streak += 1;
    } else {
      streak = 1;
    }

    await updateDoc(ref, { streak, lastLogin: today });
    return streak;
  }
  return streak;
}

// --- Award badge
async function awardBadge(uid, data, badgeName) {
  const ref = doc(db, "users", uid);
  let badges = data.badges || [];
  if (!badges.includes(badgeName)) {
    badges.push(badgeName);
    await updateDoc(ref, { badges });
  }
  return badges;
}

// --- Render UI
function renderUI(user, data) {
  labsCompletedEl.textContent = data.labsCompleted || 0;
  streakEl.textContent = data.streak || 0;

  // badges
  badgeGrid.innerHTML = "";
  const earnedBadges = data.badges || [];
  earnedEl.textContent = earnedBadges.length;
  totalBadgesEl.textContent = ALL_BADGES.length;

  ALL_BADGES.forEach(b => {
    const div = document.createElement("div");
    div.className = "badge " + (earnedBadges.includes(b.name) ? "earned" : "locked");
    div.innerHTML = `
      <div class="bicon">🏅</div>
      <div class="btxt">
        <div class="name">${b.name}</div>
        <div class="desc">${b.desc}</div>
      </div>
      ${earnedBadges.includes(b.name) ? "" : "<div class='lock'>🔒</div>"}
    `;
    badgeGrid.appendChild(div);
  });

  // timeline
  timelineEl.innerHTML = "";
  [
    `Logged in as ${user.email}`,
    `🔥 Streak: ${data.streak || 0} days`,
    `Labs: ${data.labsCompleted || 0}`,
    `Badges: ${earnedBadges.length}`
  ].forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    timelineEl.appendChild(li);
  });
}

// --- Auth listener
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    labsCompletedEl.textContent = "Please login first.";
    return;
  }

  // 1. Ensure doc
  let data = await ensureUserDoc(user.uid);

  // 2. Update streak
  data.streak = await updateStreak(user.uid, data);

  // 3. Award “First Login” badge
  data.badges = await awardBadge(user.uid, data, "First Login");

  // 4. Extra streak milestone badges
  if (data.streak >= 10) {
    data.badges = await awardBadge(user.uid, data, "10 Day Streak");
  }

  // 5. Extra labs milestone badges
  if (data.labsCompleted >= 1) {
    data.badges = await awardBadge(user.uid, data, "First Lab Completed");
  }
  if (data.labsCompleted >= 5) {
    data.badges = await awardBadge(user.uid, data, "5 Labs Completed");
  }

  // 6. Render
  renderUI(user, data);
});

// --- Example: Call this after a lab completion in your app
export async function completeLab(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  let data = snap.data();

  let labs = (data.labsCompleted || 0) + 1;
  await updateDoc(ref, { labsCompleted: labs });

  // award milestone badges
  if (labs === 1) data.badges = await awardBadge(user.uid, data, "First Lab Completed");
  if (labs === 5) data.badges = await awardBadge(user.uid, data, "5 Labs Completed");

  renderUI(user, { ...data, labsCompleted: labs });
}


// ****************
// -------- Firebase Setup --------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// TODO: Replace with your Firebase config
// const firebaseConfig = {
//   apiKey: "AIzaSyAI7XhQbo08cEP_YFtmmjr7Z4Bj50bRaMg",
//   authDomain: "starlab-adventure.firebaseapp.com",
//   projectId: "starlab-adventure",
//   storageBucket: "starlab-adventure.firebasestorage.app",
//   messagingSenderId: "550598361567",
//   appId: "1:550598361567:web:2a99e97d63ad3406aec46a",
//   measurementId: "G-5P05SX2MKM"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

const gridElement = document.getElementById("streakGrid");
const streakCountElement = document.getElementById("streakCount");
const markTodayBtn = document.getElementById("markToday");

// Create 30-day grid
function renderGrid(streakData = {}) {
  gridElement.innerHTML = "";
  let streak = 0;
  let prevDayDone = true;

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];

    const cell = document.createElement("div");
    cell.classList.add("streak-cell");

    if (streakData[dateKey]) {
      cell.classList.add("active");
      if (prevDayDone) streak++;
      prevDayDone = true;
    } else {
      prevDayDone = false;
    }

    gridElement.appendChild(cell);
  }

  streakCountElement.textContent = `Current Streak: ${streak} days`;
}

// Firestore Sync
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, { streak: {} });
    }

    let data = snap.data();
    renderGrid(data.streak);

    // Button click → mark today
    markTodayBtn.addEventListener("click", async () => {
      const today = new Date().toISOString().split("T")[0];
      if (!data.streak[today]) {
        await updateDoc(userRef, {
          [`streak.${today}`]: true
        });
        data.streak[today] = true;
        renderGrid(data.streak);
      }
    });
  }
});



