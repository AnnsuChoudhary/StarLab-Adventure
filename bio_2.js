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
// bio_2.js - visual without images
const peelBtn = document.getElementById("peelBtn");
const placeSlideBtn = document.getElementById("placeSlideBtn");
const stainBtn = document.getElementById("stainBtn");
const coverBtn = document.getElementById("coverBtn");
const observeBtn = document.getElementById("observeBtn");
const resetBtn = document.getElementById("resetBtn");
const challengeBtn = document.getElementById("challengeBtn");
const timerDisplay = document.getElementById("timerDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");

const procedureStatus = document.getElementById("procedureStatus");
const messageBox = document.getElementById("messageBox");

const onionSkin = document.getElementById("onionSkin");
const stainDrop = document.getElementById("stainDrop");
const coverSlip = document.getElementById("coverSlip");
const microscopeView = document.getElementById("microscopeView");

const peelSound = document.getElementById("peelSound");
const stainSound = document.getElementById("stainSound");
const coverSound = document.getElementById("coverSound");
const viewSound = document.getElementById("viewSound");

let score = 0, timeLeft = 30, timerInterval = null;
let stepProgress = {
  peeled: false,
  placed: false,
  stained: false,
  covered: false,
  observed: false
};

peelBtn.addEventListener("click", () => {
  stepProgress.peeled = true;
  procedureStatus.textContent = "✅ Onion skin peeled! Now place it on the slide.";
  placeSlideBtn.disabled = false;
  peelBtn.disabled = true;
  peelSound.play();

  onionSkin.classList.remove("hidden");
  onionSkin.classList.add("show");
});

placeSlideBtn.addEventListener("click", () => {
  if (!stepProgress.peeled) return;
  stepProgress.placed = true;
  procedureStatus.textContent = "✅ Onion peel placed! Add iodine stain.";
  stainBtn.disabled = false;
  placeSlideBtn.disabled = true;
});

stainBtn.addEventListener("click", () => {
  if (!stepProgress.placed) return;
  stepProgress.stained = true;
  procedureStatus.textContent = "✅ Iodine stain added! Place cover slip.";
  coverBtn.disabled = false;
  stainBtn.disabled = true;
  stainSound.play();

  stainDrop.classList.remove("hidden");
  stainDrop.classList.add("show");
});

coverBtn.addEventListener("click", () => {
  if (!stepProgress.stained) return;
  stepProgress.covered = true;
  procedureStatus.textContent = "✅ Covered! Ready to observe under microscope.";
  observeBtn.disabled = false;
  coverBtn.disabled = true;
  coverSound.play();

  coverSlip.classList.remove("hidden");
  coverSlip.classList.add("show");
});

observeBtn.addEventListener("click", () => {
  if (!stepProgress.covered) return;
  stepProgress.observed = true;
  procedureStatus.textContent = "🔍 Observation Complete! You can now reset or challenge again.";
  observeBtn.disabled = true;
  viewSound.play();

  microscopeView.classList.remove("hidden");
  microscopeView.classList.add("show");
  messageBox.textContent = "✅ Onion cells observed successfully!";
  score++;
  scoreDisplay.textContent = `🏆 Score: ${score}`;
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = "🏆 Score: 0";
  timerDisplay.textContent = "⏰ Time Left: --";
  procedureStatus.textContent = "Start by peeling the onion skin.";
  messageBox.textContent = "🧪 Ready to begin slide preparation.";

  onionSkin.classList.add("hidden");
  onionSkin.classList.remove("show");
  stainDrop.classList.add("hidden");
  stainDrop.classList.remove("show");
  coverSlip.classList.add("hidden");
  coverSlip.classList.remove("show");
  microscopeView.classList.add("hidden");
  microscopeView.classList.remove("show");

  stepProgress = {
    peeled: false,
    placed: false,
    stained: false,
    covered: false,
    observed: false
  };

  peelBtn.disabled = false;
  placeSlideBtn.disabled = true;
  stainBtn.disabled = true;
  coverBtn.disabled = true;
  observeBtn.disabled = true;
});

challengeBtn.addEventListener("click", () => {
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = `🏆 Score: ${score}`;
  timerDisplay.textContent = `⏰ Time Left: ${timeLeft}`;
  challengeBtn.disabled = true;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `⏰ Time Left: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      challengeBtn.disabled = false;
      messageBox.textContent = `⏰ Time's up! Final Score: ${score}`;
    }
  }, 1000);
});


