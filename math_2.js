const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");
const outputBox = document.getElementById("outputBox");

let points = [];

function drawGrid() {
  const size = 30;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#444";
  ctx.lineWidth = 1;

  // vertical lines
  for (let x = 0; x <= canvas.width; x += size) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // horizontal lines
  for (let y = 0; y <= canvas.height; y += size) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // axes
  ctx.strokeStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
}

function toCoord(x, y) {
  const cx = (x - canvas.width / 2) / 30;
  const cy = (canvas.height / 2 - y) / 30;
  return { x: parseFloat(cx.toFixed(2)), y: parseFloat(cy.toFixed(2)) };
}

function toCanvas(x, y) {
  const cx = canvas.width / 2 + x * 30;
  const cy = canvas.height / 2 - y * 30;
  return { x: cx, y: cy };
}

canvas.addEventListener("click", (e) => {
  if (points.length >= 2) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const coord = toCoord(x, y);
  points.push(coord);

  drawGrid();
  drawPoints();

  if (points.length === 2) {
    drawLine(points[0], points[1]);
    showInfo(points[0], points[1]);
  }
});

function drawPoints() {
  points.forEach((pt, index) => {
    const pos = toCanvas(pt.x, pt.y);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.fillStyle = "#00d1ff";
    ctx.fillText(index === 0 ? "A" : "B", pos.x + 8, pos.y - 8);
  });
}

function drawLine(p1, p2) {
  const start = toCanvas(p1.x, p1.y);
  const end = toCanvas(p2.x, p2.y);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = "#00ff88";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function showInfo(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const distance = Math.sqrt(dx ** 2 + dy ** 2).toFixed(2);
  const midpoint = {
    x: ((p1.x + p2.x) / 2).toFixed(2),
    y: ((p1.y + p2.y) / 2).toFixed(2)
  };
  const slope = dx === 0 ? "undefined" : (dy / dx).toFixed(2);

  outputBox.innerHTML = `
    <p><strong>Point A:</strong> (${p1.x}, ${p1.y})</p>
    <p><strong>Point B:</strong> (${p2.x}, ${p2.y})</p>
    <p><strong>Distance AB:</strong> ${distance} units</p>
    <p><strong>Midpoint:</strong> (${midpoint.x}, ${midpoint.y})</p>
    <p><strong>Slope:</strong> ${slope}</p>
  `;

  const stepsBox = document.getElementById("stepsBox");

  let stepText = `
📏 Distance Calculation:
D = √[(x₂ - x₁)² + (y₂ - y₁)²]
  = √[(${p2.x} - ${p1.x})² + (${p2.y} - ${p1.y})²]
  = √[(${dx.toFixed(2)})² + (${dy.toFixed(2)})²]
  = √[${(dx ** 2).toFixed(2)} + ${(dy ** 2).toFixed(2)}]
  = √[${(dx ** 2 + dy ** 2).toFixed(2)}]
  = ${distance}

➗ Midpoint Calculation:
M = ((x₁ + x₂)/2 , (y₁ + y₂)/2)
  = ((${p1.x} + ${p2.x}) / 2 , (${p1.y} + ${p2.y}) / 2)
  = (${midpoint.x}, ${midpoint.y})

📐 Slope Calculation:
m = (y₂ - y₁) / (x₂ - x₁)
  = (${p2.y} - ${p1.y}) / (${p2.x} - ${p1.x})
  = ${dx === 0 ? "undefined (division by 0)" : slope}
`;

  stepsBox.textContent = stepText;
}


function resetGraph() {
  points = [];
  drawGrid();
  outputBox.innerHTML = "<p>Click on the graph to plot two points A and B.</p>";
}

drawGrid();


// Mobile navbar toggle
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
});