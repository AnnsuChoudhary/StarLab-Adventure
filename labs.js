// Search filter logic
document.getElementById('search').addEventListener('input', function () {
  const searchTerm = this.value.toLowerCase();
  const labs = document.querySelectorAll('.lab-card');

  labs.forEach((lab) => {
    const subject = lab.getAttribute('data-subject').toLowerCase();
    lab.style.display = subject.includes(searchTerm) ? 'block' : 'none';
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
