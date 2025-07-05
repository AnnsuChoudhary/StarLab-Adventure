document.getElementById('search').addEventListener('input', function () {
  const searchTerm = this.value.toLowerCase();
  const experiments = document.querySelectorAll('.experiment-item');

  experiments.forEach((item) => {
    const title = item.getAttribute('data-experiment').toLowerCase();
    item.style.display = title.includes(searchTerm) ? 'block' : 'none';
  });
});


// Mobile navbar toggle
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
});
