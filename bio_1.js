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

// bio_1.js
const crushBtn = document.getElementById("crushBtn");
const waterBtn = document.getElementById("waterBtn");
const filterBtn = document.getElementById("filterBtn");
const testBtn = document.getElementById("testBtn");
const resetBtn = document.getElementById("resetBtn");
const challengeBtn = document.getElementById("challengeBtn");

const sampleSelect = document.getElementById("sample");
const procedureStatus = document.getElementById("procedureStatus");
const messageBox = document.getElementById("messageBox");
const testTube = document.getElementById("testTube");
const beaker = document.getElementById("beaker");
const liquid = document.getElementById("liquid");
const particles = document.getElementById("particles");
const droplets = document.getElementById("droplets");

const timerDisplay = document.getElementById("timerDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");

const crushSound = document.getElementById("crushSound");
const waterSound = document.getElementById("waterSound");
const filterSound = document.getElementById("filterSound");
const pourSound = document.getElementById("pourSound");
const testSound = document.getElementById("testSound");
const successSound = document.getElementById("successSound");
const failSound = document.getElementById("failSound");

const samples = {
  potato: { result: true, color: "#4b0082", name: "Potato" },
  rice: { result: true, color: "#6a5acd", name: "Rice" },
  apple: { result: false, color: "#f08080", name: "Apple" },
  onion: { result: false, color: "#f4a460", name: "Onion" },
  banana: { result: true, color: "#9370db", name: "Banana" },
  mystery: { result: Math.random() > 0.5, color: "#777", name: "Mystery Sample" }
};

let score = 0, timeLeft = 30, canTest = false, timerInterval = null;
let stepProgress = { crushed: false, waterAdded: false, filtered: false };

crushBtn.addEventListener("click", () => {
  stepProgress.crushed = true;
  procedureStatus.textContent = "✅ Sample crushed! Now add water.";
  waterBtn.disabled = false;
  crushBtn.disabled = true;
  crushSound.play();

  particles.style.opacity = "1";
});

waterBtn.addEventListener("click", () => {
  stepProgress.waterAdded = true;
  procedureStatus.textContent = "✅ Water added! Now filter the solution.";
  filterBtn.disabled = false;
  waterBtn.disabled = true;
  waterSound.play();

  liquid.style.height = "50%";
});

filterBtn.addEventListener("click", () => {
  stepProgress.filtered = true;
  procedureStatus.textContent = "✅ Filtered! Now pour into the beaker.";
  filterBtn.disabled = true;
  filterSound.play();

  liquid.classList.add("filter-animation");
  setTimeout(() => {
    liquid.classList.remove("filter-animation");
    particles.style.opacity = "0";
  }, 1000);
});

testTube.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text/plain", e.target.id);
});

document.querySelector(".beaker-container").addEventListener("dragover", (e) => e.preventDefault());
document.querySelector(".beaker-container").addEventListener("drop", () => {
  if (!stepProgress.crushed || !stepProgress.waterAdded || !stepProgress.filtered) {
    messageBox.textContent = "⚠️ Complete all steps before pouring!";
    return;
  }
  canTest = true;
  pourSound.play();
  messageBox.textContent = "🔬 Liquid poured! Now click the test button.";

  droplets.style.display = "block";
  setTimeout(() => {
    droplets.style.display = "none";
  }, 1000);
});

testBtn.addEventListener("click", () => {
  if (!canTest) {
    messageBox.textContent = "⚠️ Please pour the liquid first!";
    return;
  }
  const selected = sampleSelect.value;
  const sample = samples[selected];
  beaker.style.backgroundColor = sample.color;
  testTube.style.backgroundColor = sample.color;
  testSound.play();

  setTimeout(() => {
    const msg = sample.result
      ? `${sample.name} contains starch ✅`
      : `${sample.name} does NOT contain starch ❌`;
    messageBox.textContent = msg;
    if (sample.result) {
      successSound.play();
      score++;
    } else {
      failSound.play();
    }
    scoreDisplay.textContent = `🏆 Score: ${score}`;
    canTest = false;
  }, 500);
});

challengeBtn.addEventListener("click", () => {
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = `🏆 Score: ${score}`;
  timerDisplay.textContent = `⏰ Time Left: ${timeLeft}`;
  sampleSelect.disabled = false;
  challengeBtn.disabled = true;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `⏰ Time Left: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      challengeBtn.disabled = false;
      sampleSelect.disabled = true;
      messageBox.textContent = `⏰ Time's up! Final Score: ${score}`;
    }
  }, 1000);
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  score = 0;
  timeLeft = 30;
  beaker.style.backgroundColor = "transparent";
  testTube.style.backgroundColor = "#607d8b";
  sampleSelect.disabled = false;
  challengeBtn.disabled = false;
  scoreDisplay.textContent = "🏆 Score: 0";
  timerDisplay.textContent = "⏰ Time Left: --";
  messageBox.textContent = "Follow all steps and drag the test tube to pour solution.";
  stepProgress = { crushed: false, waterAdded: false, filtered: false };
  crushBtn.disabled = false;
  waterBtn.disabled = true;
  filterBtn.disabled = true;
  procedureStatus.textContent = "Start by choosing your sample.";
  liquid.style.height = "0%";
  liquid.style.backgroundColor = "#00bcd4";
  particles.style.opacity = "0";
  droplets.style.display = "none";
});

