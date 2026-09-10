document.addEventListener('DOMContentLoaded', function () {
  const scrollIndicator = document.getElementById('scroll-indicator');
  
  // 💡 只抓取擁有 id 且擁有 data-title 的元素（你想顯示在側邊欄的區塊）
  // 如果某些 section 被隱藏或不加 data-title，就不會被顯示出來
  const targets = Array.from(document.querySelectorAll('[id][data-title]')).filter(el => {
    // 排除被 CSS 隱藏 (display: none) 的元素
    return window.getComputedStyle(el).display !== 'none';
  });

  if (targets.length === 0) return;

  // 1. 動態建立選單 HTML
  const ul = document.createElement('ul');
  
  targets.forEach((target, index) => {
    const count = (index < 9 ? '0' : '') + (index + 1);
    const title = target.getAttribute('data-title');
    const id = target.id;

    const li = document.createElement('li');
    li.setAttribute('data-title', title);
    li.setAttribute('data-target-id', id);

    const a = document.createElement('a');
    a.href = '#' + id;
    a.innerHTML = count;

    li.appendChild(a);
    ul.appendChild(li);
  });

  scrollIndicator.appendChild(ul);

  const navItems = scrollIndicator.querySelectorAll('li');

  // 2. 點擊平滑滾動（使用瀏覽器原生 smooth scroll，極度絲滑不卡頓）
  scrollIndicator.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (!link) return;

    e.preventDefault();
    const targetId = link.getAttribute('href').replace('#', '');
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      targetEl.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });

  // 修改 observerOptions 擴大偵測範圍
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40% 0px', // 當區塊進入螢幕上半部時開始監聽
    threshold: 0
  };

  const visibleTargets = new Map();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        visibleTargets.set(entry.target.id, entry.target.getBoundingClientRect().top);
      } else {
        visibleTargets.delete(entry.target.id);
      }
    });

    // 找出目前在畫面中最靠近頂部的 Section
    if (visibleTargets.size > 0) {
      let activeId = null;
      let minTop = Infinity;

      visibleTargets.forEach((top, id) => {
        // 優先挑選靠近頂部（但不過度超出上界）的區塊
        if (Math.abs(top) < minTop) {
          minTop = Math.abs(top);
          activeId = id;
        }
      });

      navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-target-id') === activeId);
      });
    }
  }, observerOptions);

  // 綁定觀察目標
  targets.forEach(target => observer.observe(target));
});