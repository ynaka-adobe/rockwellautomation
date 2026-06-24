import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const link = block.querySelector('a');
  const schedulerUrl = link ? link.getAttribute('href') : block.textContent.trim();

  if (!schedulerUrl) return;

  const { match, fallback } = await resolvePromoFragment(schedulerUrl);

  // Try matched fragment first, fall back to default if it 404s
  const paths = [match, fallback].filter(Boolean);
  for (const path of paths) {
    // eslint-disable-next-line no-await-in-loop
    const fragment = await loadFragment(path);
    if (fragment) {
      const fragmentSection = fragment.querySelector(':scope .section');
      if (fragmentSection) {
        block.closest('.section').classList.add(...fragmentSection.classList);
        block.closest('.promo-banner').replaceWith(...fragment.childNodes);
      }
      return;
    }
  }
}

const DATE_KEY = 'promo-date';

// Usage:
//   ?date=2026-06-02   — override date for this session
//   ?date=reset        — clear override and return to today
function getEffectiveDate() {
  const params = new URLSearchParams(window.location.search);
  const urlDate = params.get('date');
  if (urlDate === 'reset') {
    sessionStorage.removeItem(DATE_KEY);
    return new Date();
  }
  if (urlDate) {
    sessionStorage.setItem(DATE_KEY, urlDate);
    return new Date(urlDate);
  }
  const stored = sessionStorage.getItem(DATE_KEY);
  if (stored) return new Date(stored);
  return new Date();
}

function toDateOnly(d) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

async function resolvePromoFragment(schedulerUrl) {
  let resp;
  try {
    resp = await fetch(schedulerUrl);
  } catch {
    return {};
  }
  if (!resp.ok) return {};

  const { data } = await resp.json();
  const now = toDateOnly(getEffectiveDate());

  let match = null;
  let fallback = null;

  for (const row of data) {
    const start = row.start ? toDateOnly(new Date(row.start)) : null;
    const end = row.end ? toDateOnly(new Date(row.end)) : null;
    const fragment = row['fragment URL'] || row.fragment || '';

    if (!fragment) continue;

    if (!start && !end) {
      if (!fallback) fallback = fragment;
      continue;
    }

    if (start && end && now >= start && now < end) {
      match = fragment;
      break;
    }
  }

  return { match, fallback };
}
