setTimeout(function() {
  if (window.innerWidth < 768) { // Mobile screen size
    alert("💡 This site is best viewed on a desktop for the best experience!");
  }
}, 1000);

function toggleMenu() {
  document.querySelector(".nav-menu").classList.toggle("show");
}


document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
  });
});



import { setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAI7XhQbo08cEP_YFtmmjr7Z4Bj50bRaMg",
  authDomain: "starlab-adventure.firebaseapp.com",
  projectId: "starlab-adventure",
  storageBucket: "starlab-adventure.firebasestorage.app",
  messagingSenderId: "550598361567",
  appId: "1:550598361567:web:2a99e97d63ad3406aec46a",
  measurementId: "G-5P05SX2MKM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userCollege = document.getElementById("userCollege");
const userAbout = document.getElementById("userAbout");

const profileCard = document.getElementById("profileCard");
const editForm = document.getElementById("editForm");
const loginPrompt = document.getElementById("loginPrompt");

const editBtn = document.getElementById("editProfileBtn");
const logoutBtn = document.getElementById("logoutBtn");
const saveBtn = document.getElementById("saveProfileBtn");
const cancelBtn = document.getElementById("cancelEditBtn");

const editName = document.getElementById("editName");
const editCollege = document.getElementById("editCollege");
const editAbout = document.getElementById("editAbout");

// State
let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    const userRef = doc(db, "users", user.uid);
    let docSnap = await getDoc(userRef);

    // 🔽 If user document doesn't exist, create it
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        name: "New User",
        email: user.email,
        "School/College": "",
        about: ""
      });
      // Re-fetch the updated document
      docSnap = await getDoc(userRef);
    }

    if (docSnap.exists()) {
      const data = docSnap.data();
      userName.textContent = data.name || "N/A";
      userEmail.textContent = data.email || "N/A";
      userCollege.textContent = data["School/College"] || "N/A";
      userAbout.textContent = data.about || "N/A";
    }

    profileCard.style.display = "block";
    loginPrompt.style.display = "none";
  } else {
    profileCard.style.display = "none";
    loginPrompt.style.display = "block";
  }
});


// Edit logic
editBtn.addEventListener("click", () => {
  editForm.classList.remove("hidden");
  profileCard.classList.add("hidden");

  editName.value = userName.textContent;
  editCollege.value = userCollege.textContent;
  editAbout.value = userAbout.textContent;
});

cancelBtn.addEventListener("click", () => {
  editForm.classList.add("hidden");
  profileCard.classList.remove("hidden");
});

saveBtn.addEventListener("click", async () => {
  if (!currentUser) return;

  const userRef = doc(db, "users", currentUser.uid);

  await setDoc(userRef, {
    name: editName.value,
    "School/College": editCollege.value,
    about: editAbout.value,
    email: currentUser.email  // ✅ Add this line
  }, { merge: true });

  userName.textContent = editName.value;
  userCollege.textContent = editCollege.value;
  userAbout.textContent = editAbout.value;
  userEmail.textContent = currentUser.email; // ✅ Also reflect in UI

  editForm.classList.add("hidden");
  profileCard.classList.remove("hidden");
});


// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});


