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
const canvas = document.getElementById("overlayCanvas");
const ctx = canvas.getContext("2d");
const mapImage = document.getElementById("earthMap");

const latVal = document.getElementById("latVal");
const lonVal = document.getElementById("lonVal");
const hemiVal = document.getElementById("hemiVal");
const quizPrompt = document.getElementById("quizPrompt");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score");

let score = 0;
let currentChallenge = null;

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function markClick(x, y) {
  clearCanvas();
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.strokeStyle = "white";
  ctx.stroke();
}

function canvasToLatLon(x, y) {
  const lon = (x / canvas.width) * 360 - 180;
  const lat = 90 - (y / canvas.height) * 180;
  return { lat: lat.toFixed(2), lon: lon.toFixed(2) };
}

function getHemisphere(lat, lon) {
  const ns = lat >= 0 ? "Northern" : "Southern";
  const ew = lon >= 0 ? "Eastern" : "Western";
  return `${ns} & ${ew}`;
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const coord = canvasToLatLon(x, y);
  latVal.textContent = coord.lat + "°";
  lonVal.textContent = coord.lon + "°";
  hemiVal.textContent = getHemisphere(parseFloat(coord.lat), parseFloat(coord.lon));
  markClick(x, y);
});


