const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.email-stack').forEach((stack) => {
  const originals = [...stack.children];
  originals.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.dataset.clone = 'true';
    clone.setAttribute('aria-hidden', 'true');
    clone.tabIndex = -1;
    const image = clone.querySelector('img');
    if (image) image.alt = '';
    stack.appendChild(clone);
  });
  requestAnimationFrame(() => stack.classList.add('is-ready'));
});

const marquee = document.querySelector('.email-marquee');
const motionToggle = document.querySelector('.motion-toggle');
if (motionToggle && marquee) {
  if (prefersReducedMotion) {
    marquee.classList.add('is-paused');
    motionToggle.hidden = true;
  }
  motionToggle.addEventListener('click', () => {
    const paused = marquee.classList.toggle('is-paused');
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionToggle.innerHTML = paused ? '<span aria-hidden="true">▶</span> Resume motion' : '<span aria-hidden="true">Ⅱ</span> Pause motion';
  });
}

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox?.querySelector('.lightbox-scroll img');
const lightboxTitle = document.querySelector('#lightbox-title');
const closeButton = lightbox?.querySelector('.lightbox-close');
let lastFocused = null;

function openLightbox(trigger) {
  if (!lightbox || !lightboxImage || !lightboxTitle) return;
  lastFocused = trigger;
  lightboxImage.src = trigger.dataset.full;
  lightboxImage.alt = trigger.dataset.title || trigger.querySelector('img')?.alt || 'Selected portfolio item';
  lightboxTitle.textContent = trigger.dataset.title || 'Selected work';
  lightbox.hidden = false;
  document.body.classList.add('modal-open');
  closeButton?.focus();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.classList.remove('modal-open');
  if (lightboxImage) lightboxImage.src = '';
  lastFocused?.focus();
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-full]');
  if (trigger) openLightbox(trigger);
  if (event.target.closest('[data-close]')) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
});

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('is-visible'));
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
