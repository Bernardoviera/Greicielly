document.addEventListener('DOMContentLoaded', () => {
  initTestimonialCarousel();
  initFaqAccordion();
});

function initTestimonialCarousel() {
  const carousel = document.getElementById('testimonialCarousel');
  const dotsWrap = document.getElementById('testimonialDots');
  if (!carousel || !dotsWrap) return;

  const slides = Array.from(carousel.querySelectorAll('.testimonial-slide'));
  if (slides.length === 0) return;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);
  let current = 0;
  let timer = startAutoplay();

  function goToSlide(index) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  }

  function startAutoplay() {
    return setInterval(() => goToSlide(current + 1), 6000);
  }

  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', () => { timer = startAutoplay(); });
}

function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const button = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');
    if (!button || !answer) return;

    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      items.forEach(other => {
        const otherButton = other.querySelector('.faq-item__question');
        const otherAnswer = other.querySelector('.faq-item__answer');
        otherButton.setAttribute('aria-expanded', 'false');
        otherAnswer.style.maxHeight = null;
      });

      if (!isOpen) {
        button.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}
