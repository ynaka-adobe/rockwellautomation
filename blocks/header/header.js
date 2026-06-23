import { getMetadata } from '../../scripts/aem.js';

const isDesktop = window.matchMedia('(min-width: 1024px)');

/**
 * Fetches nav content with dual-fetch strategy.
 * Tries /content/nav.plain.html first, falls back to metadata navPath.
 * @returns {Document} parsed nav document
 */
async function fetchNav() {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  let resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) return null;
  const html = await resp.text();
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

/**
 * Closes all open dropdown panels
 * @param {Element} nav
 */
function closeAllPanels(nav) {
  nav.querySelectorAll('.nav-main-link[aria-expanded="true"]').forEach((link) => {
    link.setAttribute('aria-expanded', 'false');
  });
  nav.querySelectorAll('.nav-dropdown-panel.open').forEach((panel) => {
    panel.classList.remove('open');
  });
}

/**
 * Toggles mobile menu open/closed
 * @param {Element} nav
 * @param {boolean|null} forceState
 */
function toggleMobileMenu(nav, forceState = null) {
  const isOpen = forceState !== null ? !forceState : nav.classList.contains('nav-mobile-open');
  const hamburger = nav.querySelector('.nav-hamburger');
  if (isOpen) {
    nav.classList.remove('nav-mobile-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation');
    document.body.style.overflowY = '';
  } else {
    nav.classList.add('nav-mobile-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation');
    document.body.style.overflowY = 'hidden';
  }
}

/**
 * Globe icon SVG for locale selector
 * @returns {string}
 */
function getGlobeIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>`;
}

/**
 * Chevron down icon SVG
 * @returns {string}
 */
function getChevronIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>`;
}

/**
 * Builds the utility bar (top row)
 * @param {Element[]} utilityLinks - array of anchor elements
 * @returns {Element}
 */
function buildUtilityBar(utilityLinks) {
  const bar = document.createElement('div');
  bar.className = 'nav-utility-bar';

  const locale = document.createElement('button');
  locale.className = 'nav-locale';
  locale.setAttribute('aria-label', 'Select region and language: US English');
  locale.innerHTML = `${getGlobeIcon()}<span>US|EN</span>${getChevronIcon()}`;
  bar.append(locale);

  const links = document.createElement('ul');
  links.className = 'nav-utility-links';
  utilityLinks.forEach((a) => {
    const li = document.createElement('li');
    const link = a.cloneNode(true);
    // Add chevron to "Resources" link (last item with sub-items)
    const text = link.textContent.trim().toLowerCase();
    if (text === 'resources') {
      link.classList.add('nav-utility-has-dropdown');
      link.innerHTML = `${link.textContent}${getChevronIcon()}`;
    }
    li.append(link);
    links.append(li);
  });
  bar.append(links);

  return bar;
}

/**
 * Builds search icon SVG
 * @returns {string}
 */
function getSearchIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>`;
}

/**
 * Builds account icon SVG
 * @returns {string}
 */
function getAccountIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>`;
}

/**
 * Builds the main navigation bar (second row)
 * @param {Element[]} navItems - top-level nav list items
 * @returns {Element}
 */
function buildMainBar(navItems) {
  const bar = document.createElement('div');
  bar.className = 'nav-main-bar';

  // Logo
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const a = document.createElement('a');
  a.href = '/en-us.html';
  a.setAttribute('aria-label', 'Rockwell Automation Home');
  const img = document.createElement('img');
  img.src = 'https://www.rockwellautomation.com/content/dam/rockwell-automation/sites/images/logos/2019_Logo_rgb_RA_Bug-LeftText_color.svg';
  img.alt = 'Rockwell Automation';
  img.loading = 'eager';
  a.append(img);
  brand.append(a);
  bar.append(brand);

  // Nav links
  const navLinks = document.createElement('div');
  navLinks.className = 'nav-main-links';
  navItems.forEach((item, index) => {
    const topLink = item.querySelector(':scope > p > a, :scope > a');
    if (!topLink) return;

    const trigger = document.createElement('button');
    trigger.className = 'nav-main-link';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('data-index', index);
    trigger.textContent = topLink.textContent;
    navLinks.append(trigger);
  });
  bar.append(navLinks);

  // Icons
  const icons = document.createElement('div');
  icons.className = 'nav-icons';

  const searchBtn = document.createElement('button');
  searchBtn.className = 'nav-icon-btn nav-search-btn';
  searchBtn.setAttribute('aria-label', 'Search');
  searchBtn.innerHTML = getSearchIcon();
  icons.append(searchBtn);

  const accountBtn = document.createElement('button');
  accountBtn.className = 'nav-icon-btn nav-account-btn';
  accountBtn.setAttribute('aria-label', 'Account');
  accountBtn.innerHTML = getAccountIcon();
  icons.append(accountBtn);

  bar.append(icons);

  // Hamburger
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';
  bar.append(hamburger);

  return bar;
}

/**
 * Builds dropdown panels for desktop megamenu
 * @param {Element[]} navItems - top-level nav list items
 * @returns {Element}
 */
function buildDropdownPanels(navItems) {
  const container = document.createElement('div');
  container.className = 'nav-dropdown-container';

  navItems.forEach((item, index) => {
    const subList = item.querySelector(':scope > ul');
    if (!subList) return;

    const panel = document.createElement('div');
    panel.className = 'nav-dropdown-panel';
    panel.setAttribute('data-index', index);

    const topLink = item.querySelector(':scope > p > a, :scope > a');
    const panelHeader = document.createElement('div');
    panelHeader.className = 'nav-dropdown-header';
    if (topLink) {
      const headerLink = document.createElement('a');
      headerLink.href = topLink.href;
      headerLink.textContent = `View All ${topLink.textContent}`;
      headerLink.className = 'nav-dropdown-view-all';
      panelHeader.append(headerLink);
    }
    panel.append(panelHeader);

    const grid = document.createElement('div');
    grid.className = 'nav-dropdown-grid';

    subList.querySelectorAll(':scope > li').forEach((li) => {
      const link = li.querySelector(':scope > a');
      if (link) {
        const a = document.createElement('a');
        a.href = link.href;
        a.className = 'nav-dropdown-link';
        a.textContent = link.textContent;
        grid.append(a);
      }
    });

    panel.append(grid);
    container.append(panel);
  });

  return container;
}

/**
 * Builds mobile slide-in menu
 * @param {Element[]} navItems - top-level nav list items
 * @param {Element[]} utilityLinks - utility link anchors
 * @returns {Element}
 */
function buildMobileMenu(navItems, utilityLinks) {
  const menu = document.createElement('div');
  menu.className = 'nav-mobile-menu';

  const menuInner = document.createElement('div');
  menuInner.className = 'nav-mobile-menu-inner';

  // Main nav accordion
  navItems.forEach((item) => {
    const topLink = item.querySelector(':scope > p > a, :scope > a');
    if (!topLink) return;

    const section = document.createElement('div');
    section.className = 'nav-mobile-section';

    const trigger = document.createElement('button');
    trigger.className = 'nav-mobile-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.textContent = topLink.textContent;

    const chevron = document.createElement('span');
    chevron.className = 'nav-mobile-chevron';
    trigger.append(chevron);

    section.append(trigger);

    const subList = item.querySelector(':scope > ul');
    if (subList) {
      const subMenu = document.createElement('div');
      subMenu.className = 'nav-mobile-submenu';

      // View all link
      const viewAll = document.createElement('a');
      viewAll.href = topLink.href;
      viewAll.className = 'nav-mobile-view-all';
      viewAll.textContent = `View All ${topLink.textContent}`;
      subMenu.append(viewAll);

      subList.querySelectorAll(':scope > li').forEach((li) => {
        const link = li.querySelector(':scope > a');
        if (link) {
          const a = document.createElement('a');
          a.href = link.href;
          a.className = 'nav-mobile-link';
          a.textContent = link.textContent;
          subMenu.append(a);
        }
      });

      section.append(subMenu);

      // Accordion toggle
      trigger.addEventListener('click', () => {
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        // Close other open sections
        menu.querySelectorAll('.nav-mobile-trigger[aria-expanded="true"]').forEach((t) => {
          if (t !== trigger) {
            t.setAttribute('aria-expanded', 'false');
            t.nextElementSibling.style.maxHeight = null;
          }
        });
        trigger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (!expanded) {
          subMenu.style.maxHeight = `${subMenu.scrollHeight}px`;
        } else {
          subMenu.style.maxHeight = null;
        }
      });
    }

    menuInner.append(section);
  });

  // Utility links in mobile
  const mobileUtility = document.createElement('div');
  mobileUtility.className = 'nav-mobile-utility';
  utilityLinks.forEach((a) => {
    const link = a.cloneNode(true);
    link.className = 'nav-mobile-utility-link';
    mobileUtility.append(link);
  });
  menuInner.append(mobileUtility);

  menu.append(menuInner);
  return menu;
}

/**
 * Decorates the header block
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  let navItems = [];
  let utilityLinks = [];

  try {
    const navDoc = await fetchNav();
    if (navDoc) {
      const sections = navDoc.body.querySelectorAll(':scope > div');
      const mainNavSection = sections[1];
      const utilitySection = sections[2];
      navItems = mainNavSection ? [...mainNavSection.querySelectorAll(':scope > ul > li')] : [];
      utilityLinks = utilitySection ? [...utilitySection.querySelectorAll(':scope > ul > li > a')] : [];
    }
  } catch (e) {
    // nav fetch failed — render logo + shell without nav items
  }

  // Build header structure
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');

  // 1. Utility bar (top row - 40px)
  const utilityBarWrapper = document.createElement('div');
  utilityBarWrapper.className = 'nav-utility-bar-wrapper';
  const utilityBar = buildUtilityBar(utilityLinks);
  utilityBarWrapper.append(utilityBar);
  nav.append(utilityBarWrapper);

  // 2. Main bar (bottom row - 72px)
  const mainBar = buildMainBar(navItems);
  nav.append(mainBar);

  // 3. Dropdown panels (desktop megamenu)
  const dropdowns = buildDropdownPanels(navItems);
  nav.append(dropdowns);

  // 4. Mobile menu
  const mobileMenu = buildMobileMenu(navItems, utilityLinks);
  nav.append(mobileMenu);

  // Event: nav link click toggles dropdown panels
  nav.querySelectorAll('.nav-main-link').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const index = trigger.getAttribute('data-index');
      const wasExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all panels
      closeAllPanels(nav);

      if (!wasExpanded) {
        trigger.setAttribute('aria-expanded', 'true');
        const panel = nav.querySelector(`.nav-dropdown-panel[data-index="${index}"]`);
        if (panel) panel.classList.add('open');
      }
    });
  });

  // Event: click outside closes panels
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      closeAllPanels(nav);
    }
  });

  // Event: Escape key closes panels and mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllPanels(nav);
      if (nav.classList.contains('nav-mobile-open')) {
        toggleMobileMenu(nav, false);
      }
    }
  });

  // Event: hamburger toggle
  const hamburger = nav.querySelector('.nav-hamburger');
  hamburger.addEventListener('click', () => {
    toggleMobileMenu(nav);
  });

  // Event: viewport resize handling
  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      // Switching to desktop: close mobile menu
      toggleMobileMenu(nav, false);
    } else {
      // Switching to mobile: close desktop panels
      closeAllPanels(nav);
    }
  });

  // Wrap and append
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  block.append(wrapper);
}
