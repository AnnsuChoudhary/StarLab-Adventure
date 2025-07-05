function calculate() {
  const a = parseFloat(document.getElementById("sideA").value);
  const b = parseFloat(document.getElementById("sideB").value);
  const c = Math.sqrt(a * a + b * b).toFixed(2);

  drawTriangle(a, b);

  document.getElementById("resultC").textContent = c;
  document.getElementById("proofSum").textContent = `${a*a} + ${b*b} = ${(a*a + b*b).toFixed(2)}`;
}

function generateRandom() {
  const a = Math.floor(Math.random() * 9) + 2;
  const b = Math.floor(Math.random() * 9) + 2;
  document.getElementById("sideA").value = a;
  document.getElementById("sideB").value = b;
  calculate();
}

function drawTriangle(a, b) {
  const canvas = document.getElementById("triangleCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid background
  drawGrid(ctx, canvas);

  const scale = 40;
  const offsetX = 100;
  const offsetY = canvas.height - 100;

  const ax = offsetX, ay = offsetY;
  const bx = ax + a * scale, by = ay;
  const cx = ax, cy = ay - b * scale;

  // Animate triangle
  ctx.strokeStyle = "#03a9f4";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.lineTo(cx, cy);
  ctx.closePath();
  ctx.stroke();

  // Squares
  drawSquare(ctx, ax, ay, a * scale, 0, "#f44336", "a²");
  drawSquare(ctx, ax, ay, 0, -b * scale, "#4caf50", "b²");
  drawSquare(ctx, bx, by, cx - bx, cy - by, "#ffeb3b", "c²");

  // Side labels
  ctx.fillStyle = "white";
  ctx.font = "16px sans-serif";
  ctx.fillText("a", ax + (a * scale) / 2 - 10, ay + 20);
  ctx.fillText("b", ax - 20, ay - (b * scale) / 2);
  ctx.fillText("c", (bx + cx) / 2 + 10, (by + cy) / 2 - 10);
}

function drawSquare(ctx, x, y, dx, dy, color, label) {
  ctx.fillStyle = color + "88";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y + dy);
  ctx.lineTo(x + dx - dy, y + dy + dx);
  ctx.lineTo(x - dy, y + dx);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  const labelX = x + dx / 2 - dy / 4;
  const labelY = y + dy / 2 + dx / 4;
  ctx.fillStyle = "#ffffff";
  ctx.font = "14px sans-serif";
  ctx.fillText(label, labelX, labelY);
}

function drawGrid(ctx, canvas) {
  const spacing = 20;
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 0.5;

  for (let x = 0; x <= canvas.width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Run on first load
calculate();


// Mobile navbar toggle
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
});