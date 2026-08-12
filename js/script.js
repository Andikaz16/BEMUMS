// ===== HAMBURGER MENU =====
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('hidden');
    });

    // Close menu on link click
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // ===== SCROLL REVEAL =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    '.font-display.text-headline-xl, ' +
    '.font-display.text-display-lg, ' +
    '.font-display.text-display-lg-mobile, ' +
    '.grid > article, ' +
    '.grid > div, ' +
    'section .col-span-12'
  );

  animatedElements.forEach((el) => {
    el.classList.add('fade-in-up');
    observer.observe(el);
  });

  // ===== NAVBAR ACTIVE STATE =====
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      navLinks.forEach((l) => {
        l.classList.remove('text-primary');
        l.classList.add('text-on-surface-variant');
      });
      this.classList.remove('text-on-surface-variant');
      this.classList.add('text-primary');
    });
  });

  // ===== STATS COUNTER ANIMATION =====
  const statsSection = document.querySelector('.bg-on-surface');
  if (statsSection) {
    const statNumbers = statsSection.querySelectorAll('.font-display');

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statNumbers.forEach((stat) => {
            animateCounter(stat);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }
});

function animateCounter(el) {
  const text = el.textContent.trim();
  const hasPlus = text.includes('+');
  const target = parseInt(text.replace('+', ''));
  if (isNaN(target)) return;

  let current = 0;
  const step = Math.max(1, Math.ceil(target / 25));
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = hasPlus ? current + '+' : current;
  }, 40);
}
