(() => {
  'use strict';
  const opening = document.querySelector('.opening');
  const hero = document.querySelector('.hero');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const canvas = document.createElement('canvas');
  canvas.className = 'energy-particles';
  canvas.setAttribute('aria-hidden', 'true');
  opening.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, frame = 0, previous = 0, visible = true, particles = [], bursts = [];
  let targetX = 0, targetY = 0, pointerPending = false;
  const resize = () => {
    width = opening.clientWidth;
    height = Math.min(opening.clientHeight, 1100);
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.height = height + 'px';
    ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: width < 760 ? 12 : 25 }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      speed: 5 + Math.random() * 12, radius: .5 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2
    }));
  };
  const running = () => !!ctx && !reduced.matches && !document.hidden && visible;
  const render = time => {
    frame = 0;
    if (!running()) return;
    if (time - previous < 33) { frame = requestAnimationFrame(render); return; }
    const dt = Math.min((time - previous) / 1000, .06);
    previous = time;
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.y -= p.speed * dt;
      if (p.y < height * .13) { p.y = height * .88; p.x = Math.random() * width; }
      const fade = Math.min(1, (p.y - height * .13) / 80) * (.3 + .25 * Math.sin(time * .0007 + p.phase));
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,137,49,${fade})`;
      ctx.arc(p.x + Math.sin(time * .0004 + p.phase) * 12, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    bursts = bursts.filter(b => time - b.start < 950);
    for (const b of bursts) {
      const progress = (time - b.start) / 950;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,122,28,${(1 - progress) * .55})`;
      ctx.lineWidth = 1;
      ctx.ellipse(b.x, b.y, 8 + progress * 140, 4 + progress * 55, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (pointerPending) {
      opening.style.setProperty('--scene-x', targetX + 'px');
      opening.style.setProperty('--scene-y', targetY + 'px');
      pointerPending = false;
    }
    frame = requestAnimationFrame(render);
  };
  const synchronize = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    opening.classList.toggle('effects-paused', !running());
    if (running()) { previous = performance.now(); frame = requestAnimationFrame(render); }
    else { ctx?.clearRect(0, 0, width, height); opening.style.setProperty('--scene-x', '0px'); opening.style.setProperty('--scene-y', '0px'); }
  };
  new ResizeObserver(resize).observe(opening);
  const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; synchronize(); });
  visibility.observe(opening);
  document.addEventListener('visibilitychange', synchronize);
  reduced.addEventListener('change', synchronize);
  hero.addEventListener('pointermove', e => {
    if (!fine.matches || reduced.matches) return;
    const r = hero.getBoundingClientRect();
    targetX = ((e.clientX - r.left) / r.width - .5) * 12;
    targetY = ((e.clientY - r.top) / r.height - .5) * 7;
    pointerPending = true;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; pointerPending = true; });
  hero.addEventListener('pointerdown', e => {
    if (!running() || e.target.closest('a,button,input,select')) return;
    const r = opening.getBoundingClientRect();
    bursts.push({ x: e.clientX - r.left, y: e.clientY - r.top, start: performance.now() });
    if (bursts.length > 5) bursts.shift();
  }, { passive: true });
  document.querySelector('#service-panel').addEventListener('pointermove', e => {
    if (!fine.matches || reduced.matches) return;
    const card = e.target.closest('.service-card');
    if (!card) return;
    const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.style.setProperty('--tilt-x', (-(y - .5) * 5) + 'deg');
    card.style.setProperty('--tilt-y', ((x - .5) * 5) + 'deg');
    card.style.setProperty('--card-x', x * 100 + '%');
    card.style.setProperty('--card-y', y * 100 + '%');
  }, { passive: true });
  document.querySelector('#service-panel').addEventListener('pointerout', e => {
    const card = e.target.closest('.service-card');
    if (card && !card.contains(e.relatedTarget)) { card.style.setProperty('--tilt-x', '0deg'); card.style.setProperty('--tilt-y', '0deg'); }
  });
  if (!reduced.matches) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); }
    }), { threshold: .06 });
    document.querySelectorAll('.section-heading,.about>div,.feedback>div,.faq>div,.contact,.process').forEach((el, i) => {
      el.classList.add('motion-reveal');
      el.style.setProperty('--reveal-delay', (i % 2) * 85 + 'ms');
      reveal.observe(el);
    });
  }
  resize();
  synchronize();
})();
