/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-quicklinks
 * Base block: cards
 * Source: https://www.rockwellautomation.com/en-us.html
 * Selector: .quick-links.homepage-design
 * Generated: 2026-06-04
 *
 * Extracts quick-link items (icon + label + link) from the homepage
 * quick-links bar and builds a cards block with one row per link.
 */
export default function parse(element, { document }) {
  // Select all quick-link items from the wrapper
  const items = element.querySelectorAll('.quick-links__item');

  const cells = [];

  items.forEach((item) => {
    const link = item.querySelector('a');
    if (!link) return;

    // Get the icon image
    const icon = item.querySelector('.quick-links__icon img, img');
    // Get the label text
    const label = item.querySelector('.quick-links__label');

    // Build cell content: icon and linked label
    const cellContent = [];

    if (icon) {
      const iconClone = icon.cloneNode(true);
      cellContent.push(iconClone);
    }

    if (label && link) {
      // Create a link element with the label text
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = label.textContent.trim();
      cellContent.push(a);
    } else if (link) {
      // Fallback: use the link as-is
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      cellContent.push(a);
    }

    if (cellContent.length > 0) {
      cells.push(cellContent);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-quicklinks', cells });
  element.replaceWith(block);
}
