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
const canvas = document.getElementById("earthCanvas");
const ctx = canvas.getContext("2d");
const infoBox = document.getElementById("layerInfoBox");
const quizPrompt = document.getElementById("quizPrompt");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score");

let score = 0;
let currentTarget = null;

const winSound = new Audio("win.mp3");
const failSound = new Audio("fail.mp3");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const layers = [
  {
    name: "Inner Core",
    radius: 60,
    color: "#ffcc00",
    depth: "5100–6371 km",
    temp: "~5000°C - 7000°C",
    fact: "It is solid despite extreme heat due to high pressure."
  },
  {
    name: "Outer Core",
    radius: 100,
    color: "#ff6600",
    depth: "2900–5100 km",
    temp: "~4000°C - 6000°C",
    fact: "This layer is liquid and causes Earth’s magnetic field."
  },
  {
    name: "Mantle",
    radius: 160,
    color: "#cc3300",
    depth: "35–2900 km",
    temp: "~500°C - 4000°C",
    fact: "Convection currents here move tectonic plates."
  },
  {
    name: "Crust",
    radius: 200,
    color: "#339966",
    depth: "0–35 km",
    temp: "~0°C - 1000°C",
    fact: "The outermost layer where we live."
  }
];

function drawLayers(highlight = null) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i];
    ctx.beginPath();
    ctx.arc(centerX, centerY, layer.radius, 0, Math.PI * 2);
    ctx.fillStyle = layer.name === highlight ? "#ffffff33" : layer.color;
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();
  }
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.fillText("Hover or Click a Layer", centerX - 80, centerY);
}

drawLayers();

function detectLayer(x, y) {
  const dx = x - centerX;
  const dy = y - centerY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  for (let i = 0; i < layers.length; i++) {
    if (dist <= layers[i].radius) return layers[i];
  }
  return null;
}

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const hovered = detectLayer(x, y);
  drawLayers(hovered ? hovered.name : null);
});

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const clicked = detectLayer(x, y);

  if (clicked) {
    infoBox.innerHTML = `
      <h2>🌎 ${clicked.name}</h2>
      <p><strong>Depth:</strong> ${clicked.depth}</p>
      <p><strong>Temp:</strong> ${clicked.temp}</p>
      <p><strong>Fact:</strong> ${clicked.fact}</p>
    `;

    if (currentTarget) {
      if (clicked.name === currentTarget.name) {
        feedback.textContent = `✅ Correct! You clicked the ${clicked.name}.`;
        feedback.style.color = "#0f0";
        score++;
        winSound.play();
      } else {
        feedback.textContent = `❌ That's the ${clicked.name}. Try again!`;
        feedback.style.color = "#f66";
        failSound.play();
      }
      scoreDisplay.textContent = score;
    }
  }
});

function newChallenge() {
  const randomIndex = Math.floor(Math.random() * layers.length);
  currentTarget = layers[randomIndex];
  quizPrompt.innerHTML = `🎯 Click on: <strong>${currentTarget.name}</strong>`;
  feedback.textContent = "";
}

newChallenge();
