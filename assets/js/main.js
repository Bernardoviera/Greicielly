document.addEventListener('DOMContentLoaded', () => {
  initTestimonialCarousel();
  initFaqAccordion();
  initCheckoutTracking();
  initStickyCta();
});

function initTestimonialCarousel() {
  const carousel = document.getElementById('testimonialCarousel');
  const dotsWrap = document.getElementById('testimonialDots');
  if (!carousel || !dotsWrap) return;

  const slides = Array.from(carousel.querySelectorAll('.testimonial-slide'));
  if (slides.length === 0) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer = null;
  let userPaused = false;
  let hovering = false;
  let focused = false;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'testimonials__dot';
    dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
    if (i === 0) {
      dot.classList.add('is-active');
      dot.setAttribute('aria-current', 'true');
    }
    dot.addEventListener('click', () => {
      goToSlide(i);
      syncAutoplay();
    });
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  function goToSlide(index) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    dots[current].removeAttribute('aria-current');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
    dots[current].setAttribute('aria-current', 'true');
  }

  function syncAutoplay() {
    clearInterval(timer);
    timer = null;
    if (reduceMotion || userPaused || hovering || focused) return;
    timer = setInterval(() => goToSlide(current + 1), 6000);
  }

  if (!reduceMotion) {
    const pause = document.createElement('button');
    pause.type = 'button';
    pause.className = 'testimonials__pause';
    pause.setAttribute('aria-label', 'Pausar troca automática dos depoimentos');
    pause.addEventListener('click', () => {
      userPaused = !userPaused;
      pause.classList.toggle('is-paused', userPaused);
      pause.setAttribute('aria-label', userPaused
        ? 'Retomar troca automática dos depoimentos'
        : 'Pausar troca automática dos depoimentos');
      syncAutoplay();
    });
    dotsWrap.appendChild(pause);
  }

  // Só o mouse pausa por hover: no toque, o mouseenter emulado nunca "sai".
  carousel.addEventListener('pointerenter', e => {
    if (e.pointerType === 'mouse') { hovering = true; syncAutoplay(); }
  });
  carousel.addEventListener('pointerleave', e => {
    if (e.pointerType === 'mouse') { hovering = false; syncAutoplay(); }
  });
  dotsWrap.addEventListener('focusin', () => { focused = true; syncAutoplay(); });
  dotsWrap.addEventListener('focusout', () => { focused = false; syncAutoplay(); });

  syncAutoplay();
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

// Avisa o Meta Pixel quando alguém clica para ir ao checkout.
function initCheckoutTracking() {
  document.querySelectorAll('a[href*="pay.kiwify.com.br"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof window.fbq === 'function') window.fbq('track', 'InitiateCheckout');
    });
  });
}

// Barra fixa de compra no mobile: aparece depois do hero e some quando
// já há um botão de compra na tela (oferta e FAQ).
function initStickyCta() {
  const bar = document.getElementById('stickyCta');
  if (!bar || !('IntersectionObserver' in window)) return;

  const watched = ['.hero', '.offer', '.faq__cta']
    .map(selector => document.querySelector(selector))
    .filter(Boolean);
  const onScreen = new Set();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) onScreen.add(entry.target);
      else onScreen.delete(entry.target);
    });
    bar.classList.toggle('is-visible', onScreen.size === 0);
  });
  watched.forEach(el => observer.observe(el));
}
