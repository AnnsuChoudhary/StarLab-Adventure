const prismViewer = document.getElementById("prismViewer");
const toggleBtn = document.getElementById("toggleDispersion");
const toggleRaysBtn = document.getElementById("toggleRays");
const rayCanvas = document.getElementById("rayCanvas");
const ctx = rayCanvas.getContext("2d");
const angleInfo = document.getElementById("angleInfo");

let dispersionOn = false;
let raysOn = true;

const n1 = 1.0; // air
const n2 = 1.5; // glass
let incidentAngle = 30 * Math.PI / 180; // default 30° in radians

// Camera state for canvas overlay
let camera = {
  x: 0,
  y: 0,
  zoom: 1,
  isDragging: false,
  lastX: 0,
  lastY: 0
};

// Resize canvas to match viewer
function resizeCanvas() {
  rayCanvas.width = rayCanvas.offsetWidth;
  rayCanvas.height = rayCanvas.offsetHeight;
  drawRays();
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ---------------------------
// Draw Rays + Spectrum
// ---------------------------
function drawRays() {
  ctx.clearRect(0, 0, rayCanvas.width, rayCanvas.height);
  if (!raysOn) return;

  ctx.save();
  ctx.translate(camera.x, camera.y);
  ctx.scale(camera.zoom, camera.zoom);

  const w = rayCanvas.width;
  const h = rayCanvas.height;

  // Incident beam
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 8;
  ctx.shadowColor = "white";
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.moveTo(w * 0.1, h * 0.5);
  ctx.lineTo(w * 0.4, h * 0.5);
  ctx.stroke();
  ctx.restore();

  if (dispersionOn) {
    // Spectrum colors
    const colors = [
      { color: "red", offset: -0.12 },
      { color: "orange", offset: -0.08 },
      { color: "yellow", offset: -0.04 },
      { color: "green", offset: 0 },
      { color: "blue", offset: 0.05 },
      { color: "indigo", offset: 0.1 },
      { color: "violet", offset: 0.15 }
    ];

    colors.forEach(c => {
      ctx.save();
      const startX = w * 0.4;
      const startY = h * 0.5;
      const endX = w * 0.8;
      const endY = h * (0.5 + c.offset);

      const grad = ctx.createLinearGradient(startX, startY, endX, endY);
      grad.addColorStop(0, c.color);
      grad.addColorStop(1, "transparent");

      ctx.strokeStyle = grad;
      ctx.lineWidth = 6;
      ctx.shadowColor = c.color;
      ctx.shadowBlur = 20;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.restore();
    });
  } else {
    // Single outgoing white ray
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 8;
    ctx.shadowColor = "white";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(w * 0.4, h * 0.5);
    ctx.lineTo(w * 0.8, h * 0.5);
    ctx.stroke();
    ctx.restore();
  }

  // ✅ Show angles
  drawAngles(w, h);

  ctx.restore(); // restore camera transform
}

// ---------------------------
// Draw Angles (Snell's Law)
// ---------------------------
function drawAngles(w, h) {
  const sinTheta2 = (n1 / n2) * Math.sin(incidentAngle);
  let refractionAngle = Math.asin(Math.min(1, sinTheta2));

  if (isNaN(refractionAngle)) refractionAngle = 0; // safeguard

  angleInfo.innerHTML = `
    <b>Angles (degrees):</b><br>
    Incident (θi): ${(incidentAngle * 180 / Math.PI).toFixed(2)}°<br>
    Refraction (θr): ${(refractionAngle * 180 / Math.PI).toFixed(2)}°<br>
    Formula: n₁·sin(θi) = n₂·sin(θr)
  `;

  const centerX = w * 0.4;
  const centerY = h * 0.5;
  const radius = 50;

  // Incident angle arc
  ctx.beginPath();
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 2;
  ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + incidentAngle, false);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fillText("θi", centerX - radius, centerY - 10);

  // Refraction angle arc
  ctx.beginPath();
  ctx.strokeStyle = "cyan";
  ctx.lineWidth = 2;
  ctx.arc(centerX, centerY, radius, 0, refractionAngle, false);
  ctx.stroke();
  ctx.fillStyle = "cyan";
  ctx.fillText("θr", centerX + radius, centerY + 15);
}

// ---------------------------
// Button Toggles
// ---------------------------
toggleBtn.addEventListener("click", () => {
  dispersionOn = !dispersionOn;
  drawRays();
  toggleBtn.innerText = dispersionOn ? "Remove Dispersion" : "Toggle Dispersion";
});

toggleRaysBtn.addEventListener("click", () => {
  raysOn = !raysOn;
  drawRays();
  toggleRaysBtn.innerText = raysOn ? "Hide Rays" : "Show Rays";
});

// ---------------------------
// Camera Controls (Pan + Zoom)
// ---------------------------
rayCanvas.addEventListener("mousedown", (e) => {
  camera.isDragging = true;
  camera.lastX = e.clientX;
  camera.lastY = e.clientY;
});
window.addEventListener("mouseup", () => camera.isDragging = false);
window.addEventListener("mousemove", (e) => {
  if (!camera.isDragging) return;
  let dx = e.clientX - camera.lastX;
  let dy = e.clientY - camera.lastY;
  camera.x += dx;
  camera.y += dy;
  camera.lastX = e.clientX;
  camera.lastY = e.clientY;
  drawRays();
});
rayCanvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const zoomFactor = 1.1;
  camera.zoom *= e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
  drawRays();
});

// ---------------------------
// AR Camera On/Off
// ---------------------------
const startAR = document.getElementById("startAR");
const stopAR = document.getElementById("stopAR");

startAR.addEventListener("click", () => {
  prismViewer.activateAR();
  rayCanvas.style.display = "block";
  angleInfo.style.display = "block";
});

stopAR.addEventListener("click", () => {
  if (prismViewer.exitAR) {
    prismViewer.exitAR();
  } else {
    alert("Some browsers don’t support stopping AR programmatically. Close AR manually if needed.");
  }
  rayCanvas.style.display = "none";
  angleInfo.style.display = "none";
});
