// Mount the unchanged contact header in its original style/script environment.
(function () {
  const script = document.currentScript;
  const frame = document.createElement('iframe');
  frame.className = 'ezcon-contact-header';
  frame.title = '易控官網導覽';
  frame.src = new URL('contact-header.html?v=20261020-standalone-1', script.src).href;
  frame.style.setProperty('--header-visible-height', '100px');
  const style = document.createElement('style');
  style.textContent = `
    .ezcon-contact-header {position:fixed;inset:0;width:100%;height:100dvh;border:0;z-index:90;clip-path:inset(0 0 max(0px,calc(100% - var(--header-visible-height))) 0);color-scheme:normal}
    .event-overview .site-header {top:105px!important;height:54px!important;border:0!important;background:none!important;pointer-events:none}
    .event-overview .site-header .brand {display:none}
    .event-overview .site-header .view-switch {pointer-events:auto}
    .event-overview .collection-section {top:165px}
    body:has(.event-overview.is-event-open) .ezcon-contact-header {visibility:hidden}
    @media(max-width:760px){.event-overview .site-header{top:72px!important;justify-content:center}.event-overview .site-header .view-switch{margin:0}.event-overview .scene-topline{display:none}}
  `;
  document.head.append(style);
  document.body.append(frame);
  window.addEventListener('message', function(event){
    if(event.origin !== location.origin || event.source !== frame.contentWindow || event.data?.type !== 'ezcon-contact-header-size') return;
    frame.style.setProperty('--header-visible-height', Math.min(innerHeight,Math.max(70,Number(event.data.height)||100))+'px');
  });
})();
