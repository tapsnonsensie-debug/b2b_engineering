const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || '';
const METRIKA_ID = import.meta.env.VITE_METRIKA_ID || '';
const COOKIE_KEY = 'tp_cookie_consent';

/* ─── Analytics ─── */
let cookieConsent = null; // {technical, analytics, advertising, timestamp, version}

function analyticsAllowed() {
  return !!(cookieConsent && cookieConsent.analytics);
}

function trackEvent(name, params = {}) {
  if (!analyticsAllowed()) return; // не трекаем без согласия на аналитику
  if (METRIKA_ID && typeof ym === 'function') {
    ym(METRIKA_ID, 'reachGoal', name, params);
  }
  if (typeof gtag === 'function') {
    gtag('event', name, params);
  }
}

function initAnalytics() {
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => trackEvent('phone_click'));
  });
}

/* ─── Burger menu ─── */
function initBurgerMenu() {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  if (!burger || !menu || !overlay) return;

  function openMenu() {
    menu.classList.add('is-active');
    overlay.classList.add('is-active');
    document.body.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    menu.removeAttribute('aria-hidden');
  }

  function closeMenu() {
    menu.classList.remove('is-active');
    overlay.classList.remove('is-active');
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    burger.focus();
  }

  burger.addEventListener('click', () => {
    burger.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  menu.querySelectorAll('[data-close-menu]').forEach(btn => {
    btn.addEventListener('click', closeMenu);
  });

  menu.querySelectorAll('.mobile-menu__nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-active')) closeMenu();
  });
}

/* ─── FAQ accordion ─── */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const btn = item.querySelector('.faq-item__btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      items.forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.faq-item__btn')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

/* ─── Modal ─── */
function initModal() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;

  const modal = overlay.querySelector('.modal');
  const closeBtns = overlay.querySelectorAll('[data-modal-close]');
  const triggers = document.querySelectorAll('[data-modal-open]');
  let lastFocused = null;

  const focusableSelectors = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

  function getFocusable() {
    return [...modal.querySelectorAll(focusableSelectors)].filter(el => !el.closest('[hidden]'));
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const els = getFocusable();
    if (!els.length) return;
    const first = els[0], last = els[els.length - 1];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  }

  function openModal() {
    lastFocused = document.activeElement;
    overlay.classList.add('is-active');
    document.body.classList.add('menu-open');
    overlay.removeAttribute('aria-hidden');
    const firstInput = modal.querySelector('input, textarea');
    if (firstInput) firstInput.focus();
    document.addEventListener('keydown', trapFocus);
  }

  function closeModal() {
    overlay.classList.remove('is-active');
    document.body.classList.remove('menu-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', trapFocus);
    if (lastFocused) lastFocused.focus();
  }

  triggers.forEach(t => t.addEventListener('click', openModal));
  closeBtns.forEach(b => b.addEventListener('click', closeModal));
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('is-active')) closeModal();
  });
}

/* ─── Phone mask ─── */
function phoneMask(input) {
  function buildMask(raw) {
    let m = '+7';
    if (raw.length > 1) m += ' (' + raw.slice(1, 4);
    if (raw.length >= 4) m += ') ' + raw.slice(4, 7);
    if (raw.length >= 7) m += '-' + raw.slice(7, 9);
    if (raw.length >= 9) m += '-' + raw.slice(9, 11);
    return m;
  }

  function normalizeRaw(val) {
    let r = val.replace(/\D/g, '');
    if (r.startsWith('8')) r = '7' + r.slice(1);
    if (r.length > 0 && !r.startsWith('7')) r = '7' + r;
    return r.slice(0, 11);
  }

  input.addEventListener('keydown', function (e) {
    if (e.key !== 'Backspace') return;
    const val = this.value;
    const pos = this.selectionStart;
    const selEnd = this.selectionEnd;

    if (val === '' || val === '+7' || val === '+') {
      e.preventDefault();
      this.value = '';
      return;
    }

    if (pos !== selEnd) return;

    if (pos > 0 && /\D/.test(val[pos - 1])) {
      e.preventDefault();
      let i = pos - 1;
      while (i > 0 && /\D/.test(val[i - 1])) i--;
      if (i <= 0) return;
      const newRaw = normalizeRaw(val.slice(0, i - 1) + val.slice(i));
      this.value = newRaw.length <= 1 ? '' : buildMask(newRaw);
      this.setSelectionRange(i - 1, i - 1);
    }
  });

  input.addEventListener('input', function () {
    const raw = normalizeRaw(this.value);
    this.value = raw.length <= 1 ? '+7' : buildMask(raw);
  });

  input.addEventListener('focus', function () {
    if (!this.value) this.value = '+7';
  });

  input.addEventListener('blur', function () {
    if (this.value === '+7') this.value = '';
  });
}

function isValidPhone(value) {
  return value.replace(/\D/g, '').length === 11;
}

function initPhoneMask() {
  document.querySelectorAll('input[type="tel"]').forEach(phoneMask);
}

/* ─── Forms ─── */
function handleForm(form) {
  const submitBtn = form.querySelector('[type="submit"]');
  const consent = form.querySelector('.form__consent-checkbox');
  const consentWrap = consent?.closest('.form__consent');
  const status = form.querySelector('.form__status');
  let pending = false;

  if (submitBtn) submitBtn.disabled = false;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (pending) return;

    if (status) { status.textContent = ''; status.className = 'form__status'; }

    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('is-error');
      const isEmpty = !field.value.trim();
      const isPhone = field.type === 'tel' && !isValidPhone(field.value);
      if (isEmpty || isPhone) {
        field.classList.add('is-error');
        valid = false;
      }
    });

    if (consent && !consent.checked) {
      consentWrap?.classList.add('is-error');
      valid = false;
    } else {
      consentWrap?.classList.remove('is-error');
    }

    if (!valid) {
      if (status) {
        status.textContent = 'Заполните все обязательные поля и подтвердите согласие на обработку данных.';
        status.className = 'form__status is-error';
      }
      return;
    }

    pending = true;
    if (submitBtn) submitBtn.classList.add('is-loading');

    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('server');
      trackEvent('form_submit_success', { form_id: form.id || 'main' });
      if (status) {
        status.textContent = 'Заявка отправлена. Свяжемся с вами в течение рабочего дня.';
        status.className = 'form__status is-success';
      }
      form.reset();
      consentWrap?.classList.remove('is-error');
    } catch {
      trackEvent('form_submit_error', { form_id: form.id || 'main' });
      if (status) {
        status.textContent = 'Не удалось отправить. Позвоните нам или попробуйте ещё раз.';
        status.className = 'form__status is-error';
      }
    } finally {
      pending = false;
      if (submitBtn) submitBtn.classList.remove('is-loading');
    }
  });
}

function initForms() {
  document.querySelectorAll('.form').forEach(handleForm);
}

/* ─── Cookie banner (две панели + категории) ─── */
const CONSENT_VERSION = '1.0';

function getStoredConsent() {
  try {
    const data = JSON.parse(localStorage.getItem(COOKIE_KEY));
    // принимаем только валидный объект текущей версии
    if (data && typeof data === 'object' && data.version === CONSENT_VERSION) return data;
  } catch { /* устаревший формат — переспросим */ }
  return null;
}

function applyConsent(consent) {
  cookieConsent = consent;
  // Аналитику и рекламу подключать ТОЛЬКО при согласии (реальный init добавляет заказчик)
  if (consent.analytics) {
    // window.ym && ym(METRIKA_ID, 'init', {...})
    // window.gtag && gtag('config', GA4_ID)
  }
  if (consent.advertising) {
    // загрузка ретаргетинга
  }
}

function saveConsent({ analytics = false, advertising = false }) {
  const data = {
    technical: true,
    analytics,
    advertising,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION
  };
  localStorage.setItem(COOKIE_KEY, JSON.stringify(data));
  applyConsent(data);
}

function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const settings = document.getElementById('cookie-settings');
  if (!banner || !settings) return;

  const stored = getStoredConsent();
  if (stored) { applyConsent(stored); return; } // согласие уже есть — не показываем

  function show(el) {
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('is-visible'));
  }
  function hide(el) {
    el.classList.remove('is-visible');
    const onEnd = (e) => {
      if (e.target !== el) return; // игнорируем всплытие с дочерних (переключатели)
      el.hidden = true;
      el.removeEventListener('transitionend', onEnd);
    };
    el.addEventListener('transitionend', onEnd);
  }

  show(banner);

  // Делегирование действий по data-cookie-action
  function onAction(e) {
    const action = e.target.closest('[data-cookie-action]')?.dataset.cookieAction;
    if (!action) return;
    switch (action) {
      case 'accept-all':
        saveConsent({ analytics: true, advertising: true });
        hide(banner);
        break;
      case 'open-settings':
        hide(banner);
        show(settings);
        break;
      case 'back':
        hide(settings);
        show(banner);
        break;
      case 'save-settings': {
        const analytics = settings.querySelector('[data-category="analytics"]').checked;
        const advertising = settings.querySelector('[data-category="advertising"]').checked;
        saveConsent({ analytics, advertising });
        hide(settings);
        break;
      }
    }
  }
  banner.addEventListener('click', onAction);
  settings.addEventListener('click', onAction);

  // Раскрытие описаний категорий
  settings.querySelectorAll('.cookie-category__toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const desc = btn.closest('.cookie-category')?.querySelector('.cookie-category__desc');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (desc) desc.hidden = expanded;
    });
  });
}

/* ─── Scroll top ─── */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ─── Cases slider ─── */
function initCasesSlider() {
  const track = document.getElementById('cases-track');
  if (!track) return;

  const wrapper = track.parentElement;
  const cards = track.querySelectorAll('.case-card');
  const dotsContainer = document.getElementById('cases-dots');
  const btnPrev = document.getElementById('cases-prev');
  const btnNext = document.getElementById('cases-next');
  if (!cards.length) return;

  let current = 0;
  let startX = 0;
  let isDragging = false;

  const dots = [];

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'cases__dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', `Кейс ${i + 1}`);
    dot.addEventListener('click', () => go(i));
    dotsContainer?.appendChild(dot);
    dots.push(dot);
  });

  function getOffset() {
    const cardW = cards[0].offsetWidth + 16;
    return current * cardW;
  }

  function go(idx) {
    current = Math.max(0, Math.min(idx, cards.length - 1));
    track.style.transform = `translateX(-${getOffset()}px)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    if (btnPrev) btnPrev.disabled = current === 0;
    if (btnNext) btnNext.disabled = current === cards.length - 1;
  }

  btnPrev?.addEventListener('click', () => go(current - 1));
  btnNext?.addEventListener('click', () => go(current + 1));

  wrapper.addEventListener('touchstart', e => { startX = e.touches[0].clientX; isDragging = true; }, { passive: true });
  wrapper.addEventListener('touchend', e => {
    if (!isDragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) go(diff > 0 ? current + 1 : current - 1);
    isDragging = false;
  });

  go(0);
}

/* ─── Scroll animations ─── */
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}

/* ─── Cert lightbox ─── */
function initCertLightbox() {
  const lb = document.getElementById('cert-lightbox');
  const inner = lb?.querySelector('.cert-lightbox__inner');
  const closeBtn = document.getElementById('cert-lightbox-close');
  if (!lb || !inner || !closeBtn) return;

  let lastFocused = null;

  function open(card) {
    const svg = card.querySelector('svg');
    if (!svg) return;
    const clone = svg.cloneNode(true);
    // remove any stale clone from previous open
    inner.querySelectorAll('svg').forEach(s => s.remove());
    inner.appendChild(clone);
    lastFocused = document.activeElement;
    lb.classList.add('is-active');
    lb.removeAttribute('aria-hidden');
    document.body.classList.add('menu-open');
    closeBtn.focus();
  }

  function close() {
    lb.classList.remove('is-active');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => open(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
    });
  });

  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lb.classList.contains('is-active')) close();
  });
}

/* ─── Boot ─── */
document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  initFAQ();
  initModal();
  initPhoneMask();
  initForms();
  initCookieBanner();
  initScrollTop();
  initCasesSlider();
  initScrollAnimations();
  initAnalytics();
  initCertLightbox();
});
