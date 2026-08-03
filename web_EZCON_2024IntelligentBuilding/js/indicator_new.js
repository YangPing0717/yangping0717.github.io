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

  // 3. 滾動監聽與自動切換 Active 狀態 (使用 IntersectionObserver 高效監聽)
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // 當區塊進入螢幕上緣 20%~40% 區域時觸發
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(item => {
          if (item.getAttribute('data-target-id') === id) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  // 綁定觀察目標
  targets.forEach(target => observer.observe(target));
});