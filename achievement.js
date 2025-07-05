// achievements.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  // 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const badgesContainer = document.getElementById("badgesContainer");
const labsCompletedEl = document.getElementById("labsCompleted");
const subjectsCoveredEl = document.getElementById("subjectsCovered");
const timelineEl = document.getElementById("timeline");

// Listen for login state
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    labsCompletedEl.textContent = "Please login to view achievements.";
    return;
  }

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    labsCompletedEl.textContent = "No data found.";
    return;
  }

  const userData = docSnap.data();

  // Display Labs Completed
  const labsCompleted = userData.labsCompleted || 0;
  labsCompletedEl.textContent = `Labs Completed: ${labsCompleted}`;

  // Display Subjects Covered (you can enhance this with real tracking)
  subjectsCoveredEl.textContent = `Subjects Covered: ${userData.subjects || "Unknown"}`;

  // Display Badges
  const badges = userData.badges || [];
  badgesContainer.innerHTML = "";
  badges.forEach(badge => {
    const img = document.createElement("img");
    img.src = `badges/${badge.toLowerCase().replace(/ /g, '_')}.png`;
    img.alt = badge;
    img.title = badge;
    badgesContainer.appendChild(img);
  });

  // Timeline (You can expand this logic to track actual events)
  const activity = [
    `Logged in as ${user.displayName || user.email}`,
    `Completed ${labsCompleted} lab${labsCompleted === 1 ? '' : 's'}`,
    `Earned ${badges.length} badge${badges.length === 1 ? '' : 's'}`
  ];
  timelineEl.innerHTML = "";
  activity.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    timelineEl.appendChild(li);
  });
});


// Mobile navbar toggle
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
});
