// reflection.js
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const angleSlider = document.getElementById("angleSlider");
const angleVal = document.getElementById("angleVal");
const angleInc = document.getElementById("angleInc");
const angleRef = document.getElementById("angleRef");
const angleRefr = document.getElementById("angleRefr");
const n1Display = document.getElementById("n1");
const n2Display = document.getElementById("n2");

const modeSelect = document.getElementById("modeSelect");
const medium1 = document.getElementById("medium1");
const medium2 = document.getElementById("medium2");

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

function drawLabel(x, y, text, color = "white") {
  ctx.fillStyle = color;
  ctx.font = "14px Arial";
  ctx.fillText(text, x, y);
}

function drawAngleArc(cx, cy, radius, startAngle, endAngle, color, label) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.arc(cx, cy, radius, startAngle, endAngle);
  ctx.stroke();
  if (label) {
    const labelAngle = (startAngle + endAngle) / 2;
    const labelX = cx + (radius + 10) * Math.cos(labelAngle);
    const labelY = cy + (radius + 10) * Math.sin(labelAngle);
    drawLabel(labelX, labelY, label, color);
  }
}

function drawSimulation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const angle = parseFloat(angleSlider.value);
  const n1 = parseFloat(medium1.value);
  const n2 = parseFloat(medium2.value);
  const mode = modeSelect.value;

  // Display angle values with clear formatting
  angleVal.textContent = `${angle}°`;
  angleInc.textContent = `θi = ${angle}°`;
  n1Display.textContent = n1.toFixed(2);
  n2Display.textContent = n2.toFixed(2);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const rayLen = 200;

  // Draw interface
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.stroke();
  drawLabel(20, centerY - 10, "Medium 1", "#aaa");
  drawLabel(20, centerY + 20, "Medium 2", "#aaa");

  // Draw normal
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
  drawLabel(centerX + 5, 30, "Normal");

  const angleRad = degToRad(angle);

  // Incident ray
  const incidentX = centerX - rayLen * Math.sin(angleRad);
  const incidentY = centerY - rayLen * Math.cos(angleRad);

  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(incidentX, incidentY);
  ctx.lineTo(centerX, centerY);
  ctx.stroke();
  drawLabel(incidentX + 10, incidentY + 10, "Incident Ray", "red");
  drawAngleArc(centerX, centerY, 40, -Math.PI / 2 - angleRad, -Math.PI / 2, "red", "θi");

  // Reflection ray
  const reflectX = centerX + rayLen * Math.sin(angleRad);
  const reflectY = centerY - rayLen * Math.cos(angleRad);

  if (mode === "reflection" || mode === "refraction") {
    ctx.strokeStyle = "orange";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(reflectX, reflectY);
    ctx.stroke();
    drawLabel(reflectX + 10, reflectY + 10, "Reflected Ray", "orange");
    drawAngleArc(centerX, centerY, 50, -Math.PI / 2, -Math.PI / 2 + angleRad, "orange", "θr");
    angleRef.textContent = `θr = ${angle}°`;
  }

  // Refraction ray
  if (mode === "refraction") {
    const sinRefr = (n1 / n2) * Math.sin(angleRad);
    let refrAngle = NaN;

    if (Math.abs(sinRefr) <= 1) {
      const refrRad = Math.asin(sinRefr);
      refrAngle = radToDeg(refrRad);

      const refractX = centerX + rayLen * Math.sin(refrRad);
      const refractY = centerY + rayLen * Math.cos(refrRad);

      ctx.strokeStyle = "cyan";
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(refractX, refractY);
      ctx.stroke();
      drawLabel(refractX + 10, refractY + 10, "Refracted Ray", "cyan");

      drawAngleArc(centerX, centerY, 60, Math.PI / 2 - refrRad, Math.PI / 2, "cyan", "θt");

      angleRefr.textContent = `θt = ${refrAngle.toFixed(2)}°`;

      const eqY = canvas.height - 100;
      ctx.fillStyle = "#fff";
      ctx.font = "16px Arial";
      ctx.fillText(`n₁ · sin(θi) = n₂ · sin(θt)`, 20, eqY);
      ctx.fillText(`${n1.toFixed(2)} · sin(${angle}°) = ${n2.toFixed(2)} · sin(${refrAngle.toFixed(2)}°)`, 20, eqY + 24);
    } else {
      angleRefr.textContent = "Total Internal Reflection";
      ctx.fillStyle = "#ff6";
      ctx.fillText("Total Internal Reflection", 20, canvas.height - 60);
    }
  } else {
    angleRefr.textContent = "-";
  }
}

angleSlider.addEventListener("input", drawSimulation);
modeSelect.addEventListener("change", drawSimulation);
medium1.addEventListener("change", drawSimulation);
medium2.addEventListener("change", drawSimulation);

// Initial draw
drawSimulation();

// Mobile navbar toggle
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
});
