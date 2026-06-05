/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-news
 * Base block: columns
 * Source: https://www.rockwellautomation.com/en-us.html
 * Selector: .company-news
 * Generated: 2026-06-04
 *
 * Structure: Two-column layout
 *   - Column 1: Section heading, news article links (title + read more), CTA button
 *   - Column 2: Images collage
 */
export default function parse(element, { document }) {
  // === Column 1: News content ===
  const col1Content = [];

  // Section heading
  const header = element.querySelector('.company-news__header, .company-news__header-title');
  if (header) {
    const h2 = document.createElement('h2');
    h2.textContent = header.textContent.trim();
    col1Content.push(h2);
  }

  // News articles - each has a title and a "Read More" link
  const results = element.querySelectorAll('.company-news__result');
  results.forEach((result) => {
    const titleEl = result.querySelector('.company-news__result-title');
    const linkEl = result.querySelector('.company-news__result-link-container');

    if (titleEl) {
      const p = document.createElement('p');
      if (linkEl && linkEl.href) {
        const a = document.createElement('a');
        a.href = linkEl.href;
        a.textContent = titleEl.textContent.trim();
        p.appendChild(a);
      } else {
        p.textContent = titleEl.textContent.trim();
      }
      col1Content.push(p);
    }
  });

  // CTA button (e.g., "Visit the Newsroom") - wrapped in strong for button styling
  const ctaLink = element.querySelector('.company-news__cta-button-container a');
  if (ctaLink) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    const a = document.createElement('a');
    a.href = ctaLink.href;
    a.textContent = ctaLink.textContent.trim();
    strong.appendChild(a);
    p.appendChild(strong);
    col1Content.push(p);
  }

  // === Column 2: Images ===
  const col2Content = [];

  // Get the main content images (not SVG decorations/masks)
  const imageContainer = element.querySelector('.company-news__image-container');
  if (imageContainer) {
    const images = imageContainer.querySelectorAll('.company-news__image > img[src]:not([src^="data:"])');
    images.forEach((img) => {
      const clonedImg = document.createElement('img');
      clonedImg.src = img.src;
      if (img.alt) clonedImg.alt = img.alt;
      col2Content.push(clonedImg);
    });
  }

  // Build cells - single row with two columns
  const cells = [
    [col1Content, col2Content],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-news', cells });
  element.replaceWith(block);
}
