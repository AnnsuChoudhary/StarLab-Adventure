// Select DOM elements
const substanceSelect = document.getElementById("substance");
const testBtn = document.getElementById("testBtn");
const beaker = document.getElementById("beaker");
const scoreDisplay = document.getElementById("scoreDisplay");
const instructionBox = document.getElementById("instructionBox");
const fillBtn = document.getElementById("fillBtn");
const phGuessSelect = document.getElementById("phGuess");
const guessBtn = document.getElementById("guessBtn");

let score = 0;
let canTest = false;
let testTubeFilled = false;

// Firebase Integration (placeholder)
function saveScoreToFirebase(score) {
  // Example Firebase code
  // const userRef = doc(db, "users", auth.currentUser.uid);
  // updateDoc(userRef, { chemScore: score });
}

const substances = {
  vinegar: { ph: 2.5, color: "#ff4c4c", name: "Vinegar" },
  baking_soda: { ph: 9, color: "#4caf50", name: "Baking Soda" },
  lemon_juice: { ph: 2, color: "#ffcc00", name: "Lemon Juice" },
  soap: { ph: 10, color: "#3399ff", name: "Soap" },
  milk: { ph: 6.5, color: "#e6e6fa", name: "Milk" },
  orange_juice: { ph: 3.5, color: "#ffa500", name: "Orange Juice" },
  ammonia: { ph: 11.5, color: "#00bcd4", name: "Ammonia" },
  bleach: { ph: 12.6, color: "#f50057", name: "Bleach" },
  battery_acid: { ph: 0, color: "#8b0000", name: "Battery Acid" },
  mystery: { ph: Math.random() * 14, name: "Mystery Liquid" }
};

const testTube = document.getElementById("testTube");
const beakerContainer = document.getElementById("beakerContainer");
const beakerFill = document.createElement("div");
beakerFill.classList.add("beaker-fill");
beaker.appendChild(beakerFill);

const pourStream = document.createElement("div");
pourStream.style.width = "6px";
pourStream.style.height = "0px";
pourStream.style.background = "#00f0ff";
pourStream.style.position = "absolute";
pourStream.style.left = "30px";
pourStream.style.top = "150px";
pourStream.style.transition = "height 0.8s ease-in-out";
testTube.appendChild(pourStream);

const soundPour = new Audio('sounds/pour.mp3');
const soundTest = new Audio('sounds/test.mp3');
const soundSuccess = new Audio('sounds/success.mp3');

// Fill test tube first
fillBtn.addEventListener("click", () => {
  const selected = substanceSelect.value;
  const sub = substances[selected];
  if (!sub) return;
  testTube.style.backgroundColor = sub.color;
  testTubeFilled = true;
  instructionBox.textContent = `💧 Test tube filled with ${sub.name}. Now drag it over the beaker.`;
});

testTube.addEventListener("dragstart", (e) => {
  if (!testTubeFilled) {
    e.preventDefault();
    instructionBox.textContent = "⚠️ Please fill the test tube first!";
    return;
  }
  e.dataTransfer.setData("text/plain", e.target.id);
});

beakerContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
});

beakerContainer.addEventListener("drop", () => {
  const selected = substanceSelect.value;
  const sub = substances[selected];
  if (!sub) return;

  pourStream.style.background = sub.color;
  pourStream.style.height = "80px";
  soundPour.play();

  setTimeout(() => {
    pourStream.style.height = "0px";
    beakerFill.style.height = "100px";
    beakerFill.style.backgroundColor = sub.color;
    instructionBox.textContent = `✅ ${sub.name} poured. Now guess the pH and click 'Test Substance'.`;
    canTest = true;
  }, 1000);
});

guessBtn.addEventListener("click", () => {
  const guess = phGuessSelect.value;
  if (!guess) {
    instructionBox.textContent = "⚠️ Please select your pH guess first!";
    return;
  }
  instructionBox.textContent = `You guessed: ${guess}. Now click 'Test Substance' to verify.`;
});

testBtn.addEventListener("click", () => {
  if (!canTest) {
    instructionBox.textContent = "⚠️ Please pour the liquid into the beaker first!";
    return;
  }

  const selected = substanceSelect.value;
  const sub = substances[selected];
  if (!sub) return;

  soundTest.play();
  instructionBox.textContent = `🔍 Testing ${sub.name}...`;

  setTimeout(() => {
    soundSuccess.play();
    const category = getPhCategory(sub.ph);
    const userGuess = phGuessSelect.value;
    const correct = userGuess === category ? "✅ Correct!" : `❌ Incorrect! It is ${category}.`;
    instructionBox.textContent = `${sub.name} has a pH of ${sub.ph.toFixed(1)} → ${category}. ${correct}`;
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    saveScoreToFirebase(score);
    canTest = false;
    testTubeFilled = false;
    beakerFill.style.height = "0px";
    testTube.style.backgroundColor = "#ddd";
    phGuessSelect.value = "";
  }, 1200);
});

function getPhCategory(ph) {
  if (ph < 7) return "Acidic";
  else if (ph > 7) return "Basic";
  else return "Neutral";
}

window.addEventListener("load", () => {
  instructionBox.textContent = "Step 1: Fill the test tube to begin your experiment.";
});


// Mobile navbar toggle
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
});
