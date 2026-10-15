(function () {
  'use strict';

  var shell;
  var railWrap;
  var rail;
  var lightbox;
  var lightboxImage;
  var lightboxCaption;
  var lightboxCounter;
  var lightboxPrev;
  var lightboxNext;
  var currentItems = [];
  var currentIndex = 0;
  var currentLabel = '';
  var lastTrigger = null;
  var railX = 0;
  var startX = 0;
  var startOffset = 0;
  var dragging = false;
  var moved = false;
  var pressedTile = null;
  var lightboxPointerX = null;

  function stripHtml(html) {
    var node = document.createElement('div');
    node.innerHTML = html || '';
    return (node.textContent || node.innerText || '').trim();
  }

  function createShell() {
    if (shell) return;
    shell = document.createElement('section');
    shell.className = 'ez-bento-gallery';
    shell.setAttribute('aria-hidden', 'true');
    shell.setAttribute('aria-label', '展示空間相簿');
    shell.innerHTML = [
      '<div class="ez-bento-head">',
      '  <div class="ez-bento-heading"><h2><span class="ez-bento-location"></span><img class="ez-bento-title-icon" src="assets/img/icon/project-icon07.svg" alt="" aria-hidden="true"><span class="ez-bento-title-text">展示空間</span></h2><p></p></div>',
      '  <div class="ez-bento-drag-hint"><strong>← 拖曳 →</strong> 或使用滑鼠滾輪</div>',
      '  <button class="ez-bento-close" type="button" aria-label="關閉相簿">×</button>',
      '</div>',
      '<div class="ez-bento-rail-wrap"><div class="ez-bento-rail"></div></div>',
      '<div class="ez-bento-lightbox" aria-hidden="true">',
      '  <span class="ez-bento-lightbox-counter"></span>',
      '  <button class="ez-bento-lightbox-close" type="button" aria-label="關閉大圖">×</button>',
      '  <button class="ez-bento-lightbox-nav ez-bento-lightbox-prev" type="button" aria-label="上一張">‹</button>',
      '  <figure><img class="ez-bento-lightbox-image" alt=""><figcaption class="ez-bento-lightbox-caption"></figcaption></figure>',
      '  <button class="ez-bento-lightbox-nav ez-bento-lightbox-next" type="button" aria-label="下一張">›</button>',
      '</div>'
    ].join('');
    document.body.appendChild(shell);

    railWrap = shell.querySelector('.ez-bento-rail-wrap');
    rail = shell.querySelector('.ez-bento-rail');
    lightbox = shell.querySelector('.ez-bento-lightbox');
    lightboxImage = shell.querySelector('.ez-bento-lightbox-image');
    lightboxCaption = shell.querySelector('.ez-bento-lightbox-caption');
    lightboxCounter = shell.querySelector('.ez-bento-lightbox-counter');
    lightboxPrev = shell.querySelector('.ez-bento-lightbox-prev');
    lightboxNext = shell.querySelector('.ez-bento-lightbox-next');

    shell.querySelector('.ez-bento-close').addEventListener('click', closeGallery);
    shell.querySelector('.ez-bento-lightbox-close').addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function () { showLightbox(currentIndex - 1); });
    lightboxNext.addEventListener('click', function () { showLightbox(currentIndex + 1); });
    lightbox.addEventListener('click', function (event) { if (event.target === lightbox) closeLightbox(); });

    railWrap.addEventListener('pointerdown', onRailPointerDown);
    railWrap.addEventListener('pointermove', onRailPointerMove);
    railWrap.addEventListener('pointerup', onRailPointerUp);
    railWrap.addEventListener('pointercancel', onRailPointerCancel);
    railWrap.addEventListener('click', function (event) {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    }, true);
    railWrap.addEventListener('wheel', function (event) {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      railX -= event.deltaY;
      paintRail();
    }, { passive: false });

    lightbox.addEventListener('pointerdown', function (event) { lightboxPointerX = event.clientX; });
    lightbox.addEventListener('pointerup', function (event) {
      if (lightboxPointerX === null) return;
      var delta = event.clientX - lightboxPointerX;
      lightboxPointerX = null;
      if (Math.abs(delta) < 44) return;
      showLightbox(currentIndex + (delta < 0 ? 1 : -1));
    });

    window.addEventListener('resize', function () { sizeCells(); paintRail(); });
    document.addEventListener('keydown', function (event) {
      if (!shell.classList.contains('is-open')) return;
      if (event.key === 'Escape') {
        if (lightbox.classList.contains('is-open')) closeLightbox();
        else closeGallery();
      } else if (lightbox.classList.contains('is-open') && event.key === 'ArrowLeft') showLightbox(currentIndex - 1);
      else if (lightbox.classList.contains('is-open') && event.key === 'ArrowRight') showLightbox(currentIndex + 1);
    });
  }

  function sizeCells() {
    if (!railWrap || window.matchMedia('(max-width: 767px)').matches) return;
    var usable = Math.max(420, railWrap.clientHeight - 58);
    var cell = Math.max(190, Math.min(430, (usable - 14) / 2));
    shell.style.setProperty('--ez-bento-cell', cell + 'px');
  }

  function clampRail() {
    return Math.min(0, Math.max(railWrap.clientWidth - rail.scrollWidth - 28, railX));
  }

  function paintRail() {
    railX = clampRail();
    rail.style.transform = 'translate3d(' + railX + 'px,0,0)';
  }

  function onRailPointerDown(event) {
    dragging = true;
    moved = false;
    pressedTile = event.target.closest ? event.target.closest('.ez-bento-tile') : null;
    startX = event.clientX;
    startOffset = railX;
    railWrap.classList.add('is-dragging');
    railWrap.setPointerCapture(event.pointerId);
  }

  function onRailPointerMove(event) {
    if (!dragging) return;
    var delta = event.clientX - startX;
    if (Math.abs(delta) > 7) moved = true;
    railX = startOffset + delta;
    paintRail();
  }

  function onRailPointerUp(event) {
    var wasMoved = moved;
    var tile = pressedTile;
    dragging = false;
    pressedTile = null;
    railWrap.classList.remove('is-dragging');
    if (railWrap.hasPointerCapture(event.pointerId)) railWrap.releasePointerCapture(event.pointerId);
    if (!wasMoved && tile) showLightbox(parseInt(tile.getAttribute('data-index'), 10));
  }

  function onRailPointerCancel(event) {
    dragging = false;
    pressedTile = null;
    railWrap.classList.remove('is-dragging');
    if (railWrap.hasPointerCapture(event.pointerId)) railWrap.releasePointerCapture(event.pointerId);
  }

  function renderItems() {
    rail.innerHTML = '';
    currentItems.forEach(function (item, index) {
      var tile = document.createElement('button');
      var variation = index === 0 ? ' is-feature' : (index % 11 === 5 ? ' is-tall' : (index % 9 === 4 ? ' is-wide' : ''));
      tile.type = 'button';
      tile.className = 'ez-bento-tile' + variation;
      tile.setAttribute('data-index', String(index));
      tile.setAttribute('aria-label', stripHtml(item.title) || (currentLabel + ' ' + (index + 1)));
      tile.style.animationDelay = Math.min(index * 28, 420) + 'ms';
      tile.innerHTML = '<img loading="' + (index < 8 ? 'eager' : 'lazy') + '" decoding="async" src="' + item.src + '" alt="' + (stripHtml(item.title) || currentLabel) + '"><span class="ez-bento-caption">' + item.title + '</span>';
      tile.addEventListener('keydown', function (event) { if (event.key === 'Enter' || event.key === ' ') showLightbox(index); });
      rail.appendChild(tile);
    });
  }

  function showLightbox(index) {
    if (!currentItems.length) return;
    currentIndex = Math.max(0, Math.min(currentItems.length - 1, index));
    var item = currentItems[currentIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = stripHtml(item.title) || currentLabel;
    lightboxCaption.innerHTML = item.title;
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + currentItems.length;
    lightboxPrev.disabled = currentIndex === 0;
    lightboxNext.disabled = currentIndex === currentItems.length - 1;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  function closeGallery() {
    closeLightbox();
    shell.classList.remove('is-open');
    shell.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastTrigger) lastTrigger.focus();
  }

  window.openBentoGallery = function (items, label, trigger) {
    createShell();
    currentItems = items || [];
    currentLabel = label || '展示空間';
    lastTrigger = trigger || document.activeElement;
    railX = 0;
    var labelParts = currentLabel.replace(/展示空間\s*$/, '').trim();
    shell.querySelector('.ez-bento-location').textContent = labelParts;
    shell.querySelector('.ez-bento-heading p').textContent = '拖曳探索 ' + currentItems.length + ' 張照片，點選任一照片可放大檢視。';
    renderItems();
    shell.classList.add('is-open');
    shell.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(function () { sizeCells(); paintRail(); });
  };
})();
