// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// ✅ Firebase configuration
const firebaseConfig = {
///////
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Email/Password Signup Handler
document.getElementById("signup-btn").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const userClass = document.getElementById("class").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();
  const messageEl = document.getElementById("message");

  // Basic validation
  if (!name || !userClass || !email || !password || !confirmPassword) {
    messageEl.textContent = "Please fill in all fields.";
    messageEl.style.color = "#f44";
    return;
  }

  if (password !== confirmPassword) {
    messageEl.textContent = "Passwords do not match.";
    messageEl.style.color = "#f44";
    return;
  }

  // Firebase signup
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return updateProfile(userCredential.user, {
        displayName: name,
      });
    })
    .then(() => {
      // ✅ Redirect after success
      window.location.href = "index.html";
    })
    .catch((error) => {
      messageEl.textContent = error.message;
      messageEl.style.color = "#f44";
    });
});

// ✅ Google Signup Handler
document.getElementById("google-signup-btn").addEventListener("click", () => {
  const messageEl = document.getElementById("message");

  signInWithPopup(auth, provider)
    .then((result) => {
      // ✅ Redirect after Google login
      window.location.href = "index.html";
    })
    .catch((error) => {
      messageEl.textContent = error.message;
      messageEl.style.color = "#f44";
    });
});
