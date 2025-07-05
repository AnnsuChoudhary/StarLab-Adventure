// Search filter logic
document.getElementById('search').addEventListener('input', function () {
  const searchTerm = this.value.toLowerCase();
  const labs = document.querySelectorAll('.lab-card');

  labs.forEach((lab) => {
    const subject = lab.getAttribute('data-subject').toLowerCase();
    lab.style.display = subject.includes(searchTerm) ? 'block' : 'none';
  });
});

// Mobile navbar toggle
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
});
