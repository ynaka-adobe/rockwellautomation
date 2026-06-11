import { createOptimizedPicture } from '../../scripts/aem.js';

const AUTOPLAY_MS = 6000;

function buildControls(count) {
  const controls = document.createElement('div');
  controls.className = 'hero-carousel-controls';

  // Play/pause button
  const playPause = document.createElement('button');
  playPause.type = 'button';
  playPause.className = 'hero-carousel-playpause';
  playPause.setAttribute('aria-label', 'Pause slideshow');
  playPause.dataset.playing = 'true';
  playPause.innerHTML = `<svg viewBox="0 0 10 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect class="pp-pause-bar" x="0" y="0" width="3" height="12"/>
    <rect class="pp-pause-bar" x="5" y="0" width="3" height="12"/>
    <polygon class="pp-play-arrow" points="0,0 10,6 0,12" style="display:none"/>
  </svg>`;
  controls.append(playPause);

  // Dots
  const dots = document.createElement('div');
  dots.className = 'hero-carousel-dots';
  dots.setAttribute('role', 'tablist');
  dots.setAttribute('aria-label', 'Slides');
  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Show slide ${i + 1}`);
    dot.dataset.index = String(i);
    dots.append(dot);
  }
  controls.append(dots);

  return { controls, dots, playPause };
}

export default function decorate(block) {
  const rows = [...block.children];

  // Each authored row = one slide. Cell 1: image. Cell 2: heading + text + CTA.
  const slides = rows.map((row, index) => {
    const cells = [...row.children];
    const imageCell = cells[0];
    const textCell = cells[1] || cells[0];

    const slide = document.createElement('div');
    slide.className = 'hero-carousel-slide';
    slide.setAttribute('role', 'tabpanel');
    slide.dataset.index = String(index);

    const bg = document.createElement('div');
    bg.className = 'hero-carousel-bg';
    const img = imageCell?.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(
        img.src,
        img.alt,
        index === 0, // eager-load the first slide
        [{ width: '2000' }],
      );
      bg.append(optimized);
    }

    const patternLeft = document.createElement('div');
    patternLeft.className = 'hero-carousel-pattern hero-carousel-pattern--left';
    const patternMid = document.createElement('div');
    patternMid.className = 'hero-carousel-pattern hero-carousel-pattern--mid';
    const patternRight = document.createElement('div');
    patternRight.className = 'hero-carousel-pattern hero-carousel-pattern--right';

    const content = document.createElement('div');
    content.className = 'hero-carousel-content';
    if (textCell) {
      [...textCell.children].forEach((el) => content.append(el));
      content.querySelectorAll('a').forEach((a) => a.classList.add('button'));
    }

    slide.append(bg, patternLeft, patternMid, patternRight, content);
    return slide;
  });

  block.textContent = '';

  const track = document.createElement('div');
  track.className = 'hero-carousel-track';
  slides.forEach((s) => track.append(s));
  block.append(track);

  const { controls, dots, playPause } = buildControls(slides.length);
  block.append(controls);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = -1;
  let timer = null;
  let isPlaying = !reduceMotion && slides.length > 1;

  function show(index) {
    if (index === current) return;
    slides.forEach((s, i) => {
      const active = i === index;
      s.classList.toggle('is-active', active);
      if (active && !reduceMotion) {
        s.classList.remove('is-animating');
        void s.offsetWidth; // force reflow so animation replays
        s.classList.add('is-animating');
      }
    });
    dots.querySelectorAll('.hero-carousel-dot').forEach((d, i) => {
      const active = i === index;
      d.classList.toggle('is-active', active);
      d.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    current = index;
  }

  const next = () => show((current + 1) % slides.length);

  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function startAutoplay() {
    if (reduceMotion || slides.length < 2) return;
    stopAutoplay();
    timer = setInterval(next, AUTOPLAY_MS);
  }

  function setPlayingState(playing) {
    isPlaying = playing;
    const pauseBars = playPause.querySelectorAll('.pp-pause-bar');
    const playArrow = playPause.querySelector('.pp-play-arrow');
    if (playing) {
      pauseBars.forEach((el) => { el.style.display = ''; });
      playArrow.style.display = 'none';
      playPause.setAttribute('aria-label', 'Pause slideshow');
      playPause.dataset.playing = 'true';
      startAutoplay();
    } else {
      pauseBars.forEach((el) => { el.style.display = 'none'; });
      playArrow.style.display = '';
      playPause.setAttribute('aria-label', 'Play slideshow');
      playPause.dataset.playing = 'false';
      stopAutoplay();
    }
  }

  playPause.addEventListener('click', () => setPlayingState(!isPlaying));

  dots.addEventListener('click', (e) => {
    const dot = e.target.closest('.hero-carousel-dot');
    if (!dot) return;
    show(Number(dot.dataset.index));
    if (isPlaying) startAutoplay();
  });

  block.addEventListener('mouseenter', stopAutoplay);
  block.addEventListener('mouseleave', () => { if (isPlaying) startAutoplay(); });
  block.addEventListener('focusin', stopAutoplay);
  block.addEventListener('focusout', () => { if (isPlaying) startAutoplay(); });

  show(0);
  if (isPlaying) startAutoplay();
}
