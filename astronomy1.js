const sun = document.getElementById("sun");
const earth = document.getElementById("earth");
const moon = document.getElementById("moon");
const umbra = document.getElementById("shadow-umbra");
const penumbra = document.getElementById("shadow-penumbra");
const messageBox = document.getElementById("message-box");

const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stepBtn = document.getElementById("stepBtn");

let isPlaying = false;
let interval;
let time = 0;

// Constants
const CENTER_X = 250;
const CENTER_Y = 250;
const EARTH_ORBIT_RADIUS = 130;
const MOON_ORBIT_RADIUS = 40;

function updatePositions() {
  // Earth position around Sun
  const earthAngle = (time % 360) * (Math.PI / 180);
  const earthX = CENTER_X + EARTH_ORBIT_RADIUS * Math.cos(earthAngle);
  const earthY = CENTER_Y + EARTH_ORBIT_RADIUS * Math.sin(earthAngle);
  earth.style.left = `${earthX - 15}px`;
  earth.style.top = `${earthY - 15}px`;

  // Moon position around Earth
  const moonAngle = ((time * 13) % 360) * (Math.PI / 180);
  const moonX = earthX + MOON_ORBIT_RADIUS * Math.cos(moonAngle);
  const moonY = earthY + MOON_ORBIT_RADIUS * Math.sin(moonAngle);
  moon.style.left = `${moonX - 7.5}px`;
  moon.style.top = `${moonY - 7.5}px`;

  detectEclipse(CENTER_X, CENTER_Y, earthX, earthY, moonX, moonY);
}

function detectEclipse(sunX, sunY, earthX, earthY, moonX, moonY) {
  const dxSE = earthX - sunX;
  const dySE = earthY - sunY;
  const dxSM = moonX - sunX;
  const dySM = moonY - sunY;

  const dot = dxSE * dxSM + dySE * dySM;
  const magSE = Math.sqrt(dxSE ** 2 + dySE ** 2);
  const magSM = Math.sqrt(dxSM ** 2 + dySM ** 2);
  const alignment = dot / (magSE * magSM);

  const distEarthMoon = Math.sqrt((earthX - moonX) ** 2 + (earthY - moonY) ** 2);
  const distSunEarth = magSE;
  const distSunMoon = magSM;

  // Solar Eclipse: Moon is between Sun and Earth
  if (alignment > 0.995 && distSunMoon < distSunEarth && distEarthMoon < 90) {
    umbra.style.left = `${earthX}px`;
    umbra.style.top = `${earthY}px`;
    penumbra.style.left = `${earthX}px`;
    penumbra.style.top = `${earthY}px`;
    umbra.style.display = "block";
    penumbra.style.display = "block";
    messageBox.textContent = "🌑 Solar Eclipse! The Moon is casting shadow on Earth.";
  }

  // Lunar Eclipse: Earth is between Sun and Moon
  else if (alignment < -0.995 && distSunEarth < distSunMoon && distEarthMoon < 90) {
    umbra.style.left = `${moonX - 10}px`;
    umbra.style.top = `${moonY - 10}px`;
    penumbra.style.left = `${moonX}px`;
    penumbra.style.top = `${moonY}px`;
    umbra.style.display = "block";
    penumbra.style.display = "block";
    messageBox.textContent = "🌕 Lunar Eclipse! Earth is casting shadow on the Moon.";
  }

  else {
    umbra.style.display = "none";
    penumbra.style.display = "none";
    messageBox.textContent = "Simulation running... Try aligning Earth & Moon!";
  }
}

function startSimulation() {
  if (!isPlaying) {
    interval = setInterval(() => {
      time += 1;
      updatePositions();
    }, 300); // Slowed down for clarity
    isPlaying = true;
  }
}

function pauseSimulation() {
  clearInterval(interval);
  isPlaying = false;
}

function stepSimulation() {
  pauseSimulation();
  time += 1;
  updatePositions();
}

playBtn.onclick = startSimulation;
pauseBtn.onclick = pauseSimulation;
stepBtn.onclick = stepSimulation;

// Initial render
updatePositions();

// Mobile navbar toggle
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
});
