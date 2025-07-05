const releaseBtn = document.getElementById("releaseBtn");
const acidLevel = document.getElementById("acidLevel");
const volumeDisplay = document.getElementById("volumeDisplay");
const statusText = document.getElementById("statusText");
const flaskLiquid = document.getElementById("flaskLiquid");
const dropSound = document.getElementById("dropSound");
const completeSound = document.getElementById("completeSound");

let volume = 0;
let pouring = true;
const dropSize = 0.5;
const maxVolume = 25;

function releaseDrop() {
  if (!pouring) return;

  volume += dropSize;
  if (volume >= maxVolume) {
    volume = maxVolume;
    pouring = false;
    flaskLiquid.classList.remove("pink");
    flaskLiquid.classList.add("clear");
    statusText.textContent = "Titration complete! Color changed.";
    completeSound.play();
  } else {
    statusText.textContent = "Releasing acid... watch for color change.";
    dropSound.play();
  }

  // Update visuals
  const acidHeight = ((maxVolume - volume) / maxVolume) * 100;
  acidLevel.style.height = `${acidHeight}%`;
  volumeDisplay.textContent = volume.toFixed(1);
}

releaseBtn.addEventListener("click", releaseDrop);
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    releaseDrop();
  }
});
