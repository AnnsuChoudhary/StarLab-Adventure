document.getElementById('search').addEventListener('input', function () {
  const searchTerm = this.value.toLowerCase();
  const experiments = document.querySelectorAll('.experiment-item');

  experiments.forEach((item) => {
    const title = item.getAttribute('data-experiment').toLowerCase();
    item.style.display = title.includes(searchTerm) ? 'block' : 'none';
  });
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