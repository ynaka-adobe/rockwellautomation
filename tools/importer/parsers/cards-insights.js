/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-insights
 * Base block: cards
 * Source: https://www.rockwellautomation.com/en-us.html
 * Selector: .campaign-tags
 * Generated: 2026-06-04
 *
 * Description: Filterable insight cards with topic toggles. Each card has an image,
 * category tag, title, description, and link. The section header includes a subtitle,
 * heading, and filter toggles for topic selection.
 *
 * Structure (per card row):
 *   Row: [image] | [category, title, description, link]
 */
export default function parse(element, { document }) {
  // Extract header content
  const subtitle = element.querySelector('.campaign-tags__subtitle');
  const title = element.querySelector('h2.campaign-tags__title, .campaign-tags__title');

  // Extract all card items
  const cardWrappers = element.querySelectorAll('.campaign-tags__card-wrapper');

  const cells = [];

  // Add header row with subtitle and title if present
  if (subtitle || title) {
    const headerContent = [];
    if (subtitle) headerContent.push(subtitle);
    if (title) headerContent.push(title);
    cells.push(headerContent);
  }

  // Build one row per card: [image] | [category + title + description + link]
  cardWrappers.forEach((wrapper) => {
    const cardLink = wrapper.querySelector('a.campaign-tags__card');
    const image = wrapper.querySelector('img.campaign-tags__card-image');
    const cardSubtitle = wrapper.querySelector('.campaign-tags__card-subtitle');
    const cardTitle = wrapper.querySelector('.campaign-tags__card-title');
    const cardDescription = wrapper.querySelector('.campaign-tags__card-description');
    const cardLinkText = wrapper.querySelector('.campaign-tags__card-link');

    // Build image cell
    const imageCell = [];
    if (image) {
      imageCell.push(image);
    }

    // Build text content cell
    const textCell = [];
    if (cardSubtitle) textCell.push(cardSubtitle);
    if (cardTitle) textCell.push(cardTitle);
    if (cardDescription) textCell.push(cardDescription);

    // Create a proper link element for the CTA
    if (cardLink && cardLinkText) {
      const link = document.createElement('a');
      link.href = cardLink.href;
      link.textContent = cardLinkText.textContent;
      textCell.push(link);
    } else if (cardLink) {
      const link = document.createElement('a');
      link.href = cardLink.href;
      link.textContent = 'Read More';
      textCell.push(link);
    }

    if (imageCell.length > 0 || textCell.length > 0) {
      cells.push([imageCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-insights', cells });
  element.replaceWith(block);
}
