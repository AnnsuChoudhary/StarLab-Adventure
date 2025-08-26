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
const canvas = document.getElementById("dispersionCanvas");
const ctx = canvas.getContext("2d");
const prismType = document.getElementById("prismType");
const angleSlider = document.getElementById("angleSlider");
const angleVal = document.getElementById("angleVal");
const rayInfo = document.getElementById("rayInfo");
const snellCalc = document.getElementById("snellCalc");
const lightType = document.getElementById("lightType");

const COLORS = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
const WAVELENGTHS = [700, 620, 580, 530, 470, 440, 400];
const REFRACTIVE_INDICES = {
  glass:   [1.50, 1.51, 1.52, 1.53, 1.54, 1.55, 1.56],
  diamond: [2.40, 2.42, 2.44, 2.46, 2.48, 2.50, 2.52]
};

const lightOnCheckbox = document.createElement("input");
lightOnCheckbox.type = "checkbox";
lightOnCheckbox.checked = true;
lightOnCheckbox.id = "lightToggle";
const lightLabel = document.createElement("label");
lightLabel.htmlFor = "lightToggle";
lightLabel.innerText = " Light ON/OFF";
document.querySelector(".controls").appendChild(lightOnCheckbox);
document.querySelector(".controls").appendChild(lightLabel);

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}
function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

function drawPrism() {
  ctx.beginPath();
  ctx.moveTo(500, 150);
  ctx.lineTo(750, 300);
  ctx.lineTo(500, 450);
  ctx.closePath();
  ctx.fillStyle = "rgba(200, 200, 255, 0.1)";
  ctx.fill();
  ctx.strokeStyle = "#aaa";
  ctx.stroke();
}

function drawDispersion(material, angle, lightOn, type) {
  if (!lightOn) {
    rayInfo.innerHTML = "<em>Light is OFF</em>";
    snellCalc.textContent = "";
    return;
  }

  const indices = REFRACTIVE_INDICES[material];
  const incidentAngle = degToRad(angle);
  let tableHTML = "<table id='rayInfoTable'><tr><th>Color</th><th>λ (nm)</th><th>n</th><th>θt</th></tr>";

  let colorsToDraw = COLORS;
  if (type === "mono") {
    colorsToDraw = ["green"];
  } else if (type === "sunlight") {
    colorsToDraw = COLORS.concat(["cyan", "magenta"]);
  }

  ctx.shadowColor = "rgba(255,255,255,0.2)";
  ctx.shadowBlur = 8;

  colorsToDraw.forEach((color, i) => {
    const colorIndex = COLORS.indexOf(color);
    const wavelength = WAVELENGTHS[colorIndex] || 550;
    const n2 = indices[colorIndex] || 1.53;
    const n1 = 1.00;

    const sinRefr = Math.sin(incidentAngle) * n1 / n2;
    let refrAngle = sinRefr <= 1 ? Math.asin(sinRefr) : null;

    const baseX = 500;
    const baseY = 300;
    const incidentX = baseX - 100 * Math.cos(incidentAngle);
    const incidentY = baseY - 100 * Math.sin(incidentAngle);

    if (i === 0) {
      ctx.beginPath();
      ctx.moveTo(incidentX, incidentY);
      ctx.lineTo(baseX, baseY);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.lineWidth = 1;
    }

    if (refrAngle !== null) {
      const exitX = baseX + 200 * Math.cos(refrAngle);
      const exitY = baseY + 200 * Math.sin(refrAngle) + (i - 3) * 6;

      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(exitX, exitY);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.9;
      ctx.stroke();

      if (color === "green") {
        snellCalc.textContent = `1.00·sin(${angle}°) = ${n2}·sin(θt) ⇒ θt ≈ ${radToDeg(refrAngle).toFixed(1)}°`;
      }

      tableHTML += `<tr><td style='color:${color}'>${color}</td><td>${wavelength}</td><td>${n2}</td><td>${radToDeg(refrAngle).toFixed(1)}°</td></tr>`;
    }
  });

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1.0;
  tableHTML += "</table>";
  rayInfo.innerHTML = tableHTML;
}

function drawAngleArc(cx, cy, r, angle, label) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, -angle, 0);
  ctx.strokeStyle = "#888";
  ctx.stroke();
  const x = cx - r * Math.cos(angle / 2);
  const y = cy - r * Math.sin(angle / 2);
  ctx.fillStyle = "#ccc";
  ctx.fillText(label, x - 10, y);
}

function drawScene() {
  const angle = parseInt(angleSlider.value);
  angleVal.textContent = angle;
  const type = lightType.value;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPrism();
  drawDispersion(prismType.value, angle, lightOnCheckbox.checked, type);
  if (lightOnCheckbox.checked) {
    drawAngleArc(500, 300, 50, degToRad(angle), "θi");
  }
}

angleSlider.addEventListener("input", drawScene);
prismType.addEventListener("change", drawScene);
lightOnCheckbox.addEventListener("change", drawScene);
lightType.addEventListener("change", drawScene);

window.onload = drawScene;
