// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const googleLoginBtn = document.getElementById("google-login-btn");
const errorMsg = document.getElementById("error-message");
const forgotLink = document.getElementById("forgot-password-link");
const resetSection = document.getElementById("reset-section");
const resetEmail = document.getElementById("reset-email");
const resetPasswordBtn = document.getElementById("reset-password-btn");

// Function to add user data to Firestore if not already present
async function ensureUserProfile(user) {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      name: user.displayName || "Anonymous",
      email: user.email,
      "School/College": "Not set",
      about: "Tell us about yourself",
      badges: ["Explorer"],
      labsCompleted: 0
    });
  }
}

// Email/Password Login
loginBtn.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then(async (result) => {
      await ensureUserProfile(result.user);
      errorMsg.style.color = "green";
      errorMsg.textContent = "Login successful!";
      window.location.href = "index.html";
    })
    .catch((error) => {
      const msg =
        error.code === "auth/wrong-password"
          ? "Wrong password!"
          : error.code === "auth/user-not-found"
          ? "User not found!"
          : "Login failed. Please try again.";
      errorMsg.style.color = "red";
      errorMsg.textContent = msg;
    });
});

// Google Login
googleLoginBtn.addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(async (result) => {
      await ensureUserProfile(result.user);
      errorMsg.style.color = "green";
      errorMsg.textContent = "Google login successful!";
      window.location.href = "index.html";
    })
    .catch((error) => {
      errorMsg.style.color = "red";
      errorMsg.textContent = "Google login failed: " + error.message;
    });
});

// Forgot password
forgotLink.addEventListener("click", () => {
  resetSection.classList.toggle("hidden");
});

resetPasswordBtn.addEventListener("click", () => {
  const email = resetEmail.value;
  if (!email) {
    errorMsg.textContent = "Please enter an email to reset password.";
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      errorMsg.style.color = "green";
      errorMsg.textContent = "Reset email sent!";
    })
    .catch((error) => {
      errorMsg.style.color = "red";
      errorMsg.textContent = "Error: " + error.message;
    });
});



