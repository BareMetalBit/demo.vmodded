/* Palmeras Home Services — site interactions
   NOTE: the quote form below is wired to fake-submit for this demo.
   Once you have a real Formspree endpoint, drop it into the form's
   action attribute in v_index.html and delete the preventDefault()
   block in setupQuoteForm() so it posts for real. */

document.addEventListener('DOMContentLoaded', () => {
  setupNavScroll();
  setupSideMenu();
  setupQuoteModal();
  setupReveal();
});

/* ─── Nav shadow on scroll ─── */
function setupNavScroll() {
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll);
}

/* ─── Hamburger full-screen menu with drill-down sub-panels ─── */
function setupSideMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const menu = document.getElementById('sideMenu');
  const closeBtn = document.getElementById('menuCloseBtn');
  const links = menu.querySelectorAll('.menu-link');
  const panelTriggers = menu.querySelectorAll('[data-panel-trigger]');
  const backButtons = menu.querySelectorAll('[data-panel-back]');

  function showPanel(name) {
    menu.querySelectorAll('.menu-panel').forEach(p => {
      p.classList.toggle('is-active', p.getAttribute('data-panel') === name);
    });
  }

  function openMenu() {
    showPanel('main');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  hamburger.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });
  closeBtn.addEventListener('click', closeMenu);
  links.forEach(link => link.addEventListener('click', closeMenu));
  panelTriggers.forEach(btn => {
    btn.addEventListener('click', () => showPanel(btn.getAttribute('data-panel-trigger')));
  });
  backButtons.forEach(btn => btn.addEventListener('click', () => showPanel('main')));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });

  /* FAQ accordion inside the menu's FAQ sub-panel */
  menu.querySelectorAll('.menu-faq-item').forEach(item => {
    const q = item.querySelector('.menu-faq-q');
    q.addEventListener('click', () => item.classList.toggle('open'));
  });
}

/* ─── Quote modal (every "Request a Quote" button opens this) ─── */
function setupQuoteModal() {
  const modal = document.getElementById('quoteModal');
  const scrim = document.getElementById('modalScrim');
  const closeBtn = document.getElementById('modalCloseBtn');
  const successCloseBtn = document.getElementById('successCloseBtn');
  const serviceLabel = document.getElementById('modalService');
  const serviceField = document.getElementById('serviceField');
  const form = document.getElementById('quoteForm');
  const successBox = document.getElementById('modalSuccess');
  const submitBtn = document.getElementById('modalSubmitBtn');

  function openModal(service) {
    const label = service || 'General Quote';
    serviceLabel.textContent = label === 'General Quote' ? 'Request a Free Quote' : `Requesting: ${label}`;
    serviceField.value = label;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    scrim.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    scrim.classList.remove('open');
    document.body.classList.remove('no-scroll');
    // reset back to the form view after the close transition
    setTimeout(() => {
      form.hidden = false;
      successBox.hidden = true;
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send';
    }, 300);
  }

  document.querySelectorAll('[data-modal-trigger]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.getAttribute('data-service')));
    // Cards use role="button" + tabindex instead of a real <button>,
    // so Enter/Space need to be wired up manually for keyboard users.
    if (btn.getAttribute('role') === 'button') {
      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(btn.getAttribute('data-service'));
        }
      });
    }
  });

  closeBtn.addEventListener('click', closeModal);
  successCloseBtn.addEventListener('click', closeModal);
  scrim.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  /* DEMO SUBMIT — replace this block once Formspree is live */
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value.trim();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      document.getElementById('successText').textContent = name
        ? `Thanks, ${name.split(' ')[0]} — we'll get back to you within one business day.`
        : `We'll get back to you within one business day.`;
      form.hidden = true;
      successBox.hidden = false;
    }, 700);
  });
}

/* ─── Fade-up reveal on scroll ─── */
function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(i => i.classList.add('in-view'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(i => observer.observe(i));
}