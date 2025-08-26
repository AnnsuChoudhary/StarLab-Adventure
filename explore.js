// Placeholder for future interactivity like recommendations or fetching data

document.addEventListener("DOMContentLoaded", () => {
  console.log("Explore page loaded.");

  // You can load data here dynamically later
  // e.g., fetch recommendations from Firestore or API
});

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