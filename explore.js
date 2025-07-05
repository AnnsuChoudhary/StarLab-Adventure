// Placeholder for future interactivity like recommendations or fetching data

document.addEventListener("DOMContentLoaded", () => {
  console.log("Explore page loaded.");

  // You can load data here dynamically later
  // e.g., fetch recommendations from Firestore or API
});

// Mobile navbar toggle
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
});
