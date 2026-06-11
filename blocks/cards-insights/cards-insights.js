import { createOptimizedPicture } from '../../scripts/aem.js';

const MAX_VISIBLE = 6;
const COLS = 3;

export default function decorate(block) {
  const rows = [...block.children];

  // Collect unique filter tags from col3 of all rows, preserving first-seen order
  const allTags = [];
  rows.forEach((row) => {
    const tag = [...row.children][2]?.textContent.trim();
    if (tag && !allTags.includes(tag)) allTags.push(tag);
  });

  // --- Filter bar ---
  let filterBtns = [];
  if (allTags.length) {
    const filterBar = document.createElement('div');
    filterBar.className = 'cards-insights-filters';
    const label = document.createElement('span');
    label.className = 'cards-insights-filter-label';
    label.textContent = 'Select your interest:';
    filterBar.append(label);
    allTags.forEach((tag) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cards-insights-filter-btn';
      btn.textContent = tag;
      btn.dataset.filter = tag;
      filterBar.append(btn);
    });
    block.textContent = '';
    block.append(filterBar);
    filterBtns = [...filterBar.querySelectorAll('.cards-insights-filter-btn')];
  } else {
    block.textContent = '';
  }

  // --- Card list ---
  const ul = document.createElement('ul');

  rows.forEach((row) => {
    const li = document.createElement('li');
    const [imageCell, bodyCell, tagCell] = [...row.children];

    if (imageCell) {
      imageCell.className = imageCell.querySelector('picture')
        ? 'cards-insights-card-image'
        : 'cards-insights-card-body';
      li.append(imageCell);
    }

    if (bodyCell) {
      bodyCell.className = 'cards-insights-card-body';
      li.append(bodyCell);
    }

    if (tagCell) {
      li.dataset.filter = tagCell.textContent.trim();
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.append(ul);

  const cardLis = [...ul.querySelectorAll('li')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Assign column-based stagger delay
  cardLis.forEach((li, i) => li.style.setProperty('--col', i % COLS));

  // Animate a subset in: hide all, reveal + animate up to MAX_VISIBLE
  function animateSubset(subset) {
    cardLis.forEach((li) => {
      li.classList.add('is-filtered-out');
      li.classList.remove('is-in-view');
    });
    subset.slice(0, MAX_VISIBLE).forEach((li, i) => {
      li.style.setProperty('--col', i % COLS);
      li.classList.remove('is-filtered-out');
      if (reduceMotion) {
        li.classList.add('is-in-view');
      } else {
        requestAnimationFrame(() => requestAnimationFrame(() => li.classList.add('is-in-view')));
      }
    });
  }

  // Initial state: show first MAX_VISIBLE
  cardLis.forEach((li, i) => li.classList.toggle('is-filtered-out', i >= MAX_VISIBLE));

  // Scroll-in observer — resets when card leaves viewport so animation replays on re-entry
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.remove('no-transition');
        target.classList.add('is-in-view');
      } else {
        // Snap back to hidden state instantly (no reverse animation)
        target.classList.add('no-transition');
        target.classList.remove('is-in-view');
        requestAnimationFrame(() => target.classList.remove('no-transition'));
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  cardLis
    .filter((li) => !li.classList.contains('is-filtered-out'))
    .forEach((li) => observer.observe(li));

  // Filter buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const wasActive = btn.classList.contains('is-active');
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      if (wasActive) {
        animateSubset(cardLis);
      } else {
        btn.classList.add('is-active');
        const matching = cardLis.filter((li) => li.dataset.filter === btn.dataset.filter);
        animateSubset(matching);
      }
    });
  });
}
