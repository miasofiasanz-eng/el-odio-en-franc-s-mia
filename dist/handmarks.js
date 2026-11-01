// Doodles originales del proyecto. Los PNG se conservan sin modificaciones.
(() => {
  const marks = [
    ['.hero', 'hero-handmark', 14],
    ['.mouth-art', 'mouth-handmark', 4],
    ['.mouth-art', 'mouth-arrow-handmark', 9],
    ['.portrait', 'portrait-handmark', 5],
    ['.scroll-bridge', 'bridge-handmark', 8],
  ];
  marks.forEach(([selector, className, number]) => {
    const container = document.querySelector(selector);
    if (!container) return;
    const mark = document.createElement('img');
    mark.className = `handmark ${className}`;
    mark.src = `assets/doodles/grafismo-${number}.png`;
    mark.alt = '';
    mark.setAttribute('aria-hidden', 'true');
    mark.draggable = false;
    mark.decoding = 'async';
    container.append(mark);
  });
})();
