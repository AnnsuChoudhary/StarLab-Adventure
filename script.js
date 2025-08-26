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


import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Your Firebase config (replace with actual)
const firebaseConfig = {
  //
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const factImage = document.getElementById("factImage");
const factText = document.getElementById("factText");
const nextBtn = document.getElementById("nextBtn");

let allFacts = [];
let todaysFacts = [];
let currentIndex = 0;

// Calculate how many days since Jan 1, 2025
function getDayIndex() {
  const startDate = new Date("2025-01-01");
  const today = new Date();
  const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Show current fact in DOM
function showFact(index) {
  const fact = todaysFacts[index];
  factImage.src = fact.image;
  factText.textContent = fact.text;
}

// Load facts from Firestore and pick today's 5
async function loadFacts() {
  const snapshot = await getDocs(collection(db, "facts"));
  allFacts = snapshot.docs.map(doc => doc.data());

  const dayOffset = getDayIndex();
  const totalFacts = allFacts.length;
  const dailyChunkSize = 5;

  // Pick 5 facts for today using circular offset
  for (let i = 0; i < dailyChunkSize; i++) {
    const index = (dayOffset * dailyChunkSize + i) % totalFacts;
    todaysFacts.push(allFacts[index]);
  }

  currentIndex = 0;
  showFact(currentIndex);
}

// Button to go to next fact
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % todaysFacts.length;
  showFact(currentIndex);
});

document.addEventListener("DOMContentLoaded", loadFacts);


// Mobile navbar toggle

const chatIcon = document.getElementById('chat-icon');
const chatbotBox = document.getElementById('chatbot-box');

chatIcon.addEventListener('click', () => {
    chatbotBox.style.display = chatbotBox.style.display === 'none' ? 'flex' : 'none';
});

