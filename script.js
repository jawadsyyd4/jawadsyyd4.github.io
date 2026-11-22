/* Minimal progressive enhancement: theme, mobile navigation, and Formspree setup guard. */
(() => {
  'use strict';

  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const menuButton = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  function getSavedTheme() {
    try { return localStorage.getItem('jawad-portfolio-theme'); } catch { return null; }
  }
  function setTheme(theme) {
    const dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    themeButton?.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    themeButton?.setAttribute('aria-pressed', String(dark));
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#111d1c' : '#f7f8f5');
  }
  function saveTheme(theme) {
    try { localStorage.setItem('jawad-portfolio-theme', theme); } catch { /* Private browsing or blocked storage */ }
  }
  const savedTheme = getSavedTheme();
  setTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'light');
  themeButton?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    saveTheme(next);
  });

  function closeMenu() {
    if (!mobileNav || !menuButton) return;
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
  }
  menuButton?.addEventListener('click', () => {
    if (!mobileNav) return;
    const willOpen = mobileNav.hidden;
    mobileNav.hidden = !willOpen;
    menuButton.setAttribute('aria-expanded', String(willOpen));
    menuButton.setAttribute('aria-label', willOpen ? 'Close navigation menu' : 'Open navigation menu');
  });
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileNav && !mobileNav.hidden) {
      closeMenu();
      menuButton?.focus();
    }
  });
  window.matchMedia('(min-width: 821px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });

  document.getElementById('year').textContent = String(new Date().getFullYear());

  if (form) {
    const action = form.getAttribute('action') || '';
    if (!action.includes('YOUR_FORM_ID') && /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(action)) {
      formStatus.textContent = 'The form is connected. Messages are delivered through Formspree.';
    }
    form.addEventListener('submit', event => {
      const endpoint = form.getAttribute('action') || '';
      if (endpoint.includes('YOUR_FORM_ID') || !/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)) {
        event.preventDefault();
        formStatus.textContent = 'The contact form is not configured yet. Please email me at jawadsyyd@gmail.com or use WhatsApp above.';
        formStatus.focus?.();
      }
    });
  }
})();
