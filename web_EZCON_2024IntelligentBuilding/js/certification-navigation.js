// Adapted from contact.html's back-to-top code and js/indicator_new.js.
// Styles are shared with contact.html through css/indicator.css and assets/css/main.css.
document.addEventListener('DOMContentLoaded', function () {
  const indicator = document.getElementById('scroll-indicator');
  const backToTop = document.querySelector('.xb-backtotop');
  const topLink = backToTop && backToTop.querySelector('.scroll-to-top-btn');
  const targets = Array.from(document.querySelectorAll('section[id][data-title]'))
    .filter(section => window.getComputedStyle(section).display !== 'none');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollBehavior = () => reducedMotion.matches ? 'auto' : 'smooth';
  let navItems = [];
  let pendingFrame = false;

  if (indicator && targets.length) {
    const list = document.createElement('ul');
    targets.forEach((target, index) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      const title = target.getAttribute('data-title');
      item.setAttribute('data-title', title);
      item.setAttribute('data-target-id', target.id);
      link.href = '#' + target.id;
      link.textContent = String(index + 1).padStart(2, '0');
      link.setAttribute('aria-label', title);
      item.appendChild(link);
      list.appendChild(item);
    });
    indicator.replaceChildren(list);
    navItems = Array.from(list.children);

    indicator.addEventListener('click', function (event) {
      const link = event.target.closest('a');
      if (!link || !indicator.contains(link)) return;
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      event.preventDefault();
      // Keep section deep links usable without triggering a second native jump.
      history.replaceState(null, '', link.getAttribute('href'));
      target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
      scheduleUpdate();
    });
  }

  function updateNavigation() {
    pendingFrame = false;
    if (backToTop) backToTop.classList.toggle('active', window.scrollY > 300);
    if (!navItems.length) return;

    // Re-read current positions instead of retaining stale IntersectionObserver offsets.
    const activationLine = window.innerHeight * 0.25;
    let activeTarget = targets[0];
    for (const target of targets) {
      if (target.getBoundingClientRect().top <= activationLine) activeTarget = target;
      else break;
    }
    const atBottom = window.scrollY > 0 &&
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    if (atBottom) activeTarget = targets[targets.length - 1];

    navItems.forEach(item => {
      const active = item.getAttribute('data-target-id') === activeTarget.id;
      item.classList.toggle('active', active);
      const link = item.querySelector('a');
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function scheduleUpdate() {
    if (pendingFrame) return;
    pendingFrame = true;
    window.requestAnimationFrame(updateNavigation);
  }

  if (topLink) {
    topLink.addEventListener('click', function (event) {
      event.preventDefault();
      history.replaceState(null, '', topLink.getAttribute('href'));
      window.scrollTo({ top: 0, behavior: scrollBehavior() });
      scheduleUpdate();
    });
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);
  window.addEventListener('pageshow', scheduleUpdate);
  if ('ResizeObserver' in window) {
    const layoutObserver = new ResizeObserver(scheduleUpdate);
    targets.forEach(target => layoutObserver.observe(target));
  }
  updateNavigation();
});
