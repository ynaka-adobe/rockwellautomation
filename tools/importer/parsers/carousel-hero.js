/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-hero
 * Base block: carousel
 * Source: https://www.rockwellautomation.com/en-us.html
 * Generated: 2026-06-04
 *
 * Extracts hero carousel slides from Rockwell Automation homepage.
 * Each slide contains: image, heading, description, and CTA button.
 * Maps to Carousel block table format: [image | heading + description + CTA] per row.
 *
 * Source structure:
 *   div.hero-carousel.carousel.panelcontainer
 *     > div.new-hero-wrapper-outer
 *       > div.new-hero-wrapper
 *         > li.new-hero (multiple slides)
 *           > div.hero-carousel-slide.parbase > div.new-hero
 *             > div.new-hero-text-wrapper > div.new-hero-text > div.new-hero-text-inner
 *               > h1/h2 (heading)
 *               > div.description (description text)
 *               > div.hero-banner__buttons-container > span.button > a (CTA)
 *             > div.new-hero-image > div.hero > picture > img.main-image (slide image)
 *
 * Validated selectors against source.html:
 *   - li.new-hero: carousel slide containers (4 found in source)
 *   - .new-hero-text-inner h1, .new-hero-text-inner h2: slide headings
 *   - .new-hero-text-inner .description: slide description divs
 *   - .new-hero-text-inner .hero-banner__buttons-container a: CTA links
 *   - .new-hero-image .hero picture: hero image picture elements
 *   - .new-hero-image img.main-image: fallback image selector
 */
export default function parse(element, { document }) {
  // Select all carousel slide items - each li.new-hero is one slide
  const slides = element.querySelectorAll('li.new-hero');

  const cells = [];

  slides.forEach((slide) => {
    // Extract the hero image - prefer picture element, fallback to img
    const picture = slide.querySelector('.new-hero-image .hero picture');
    const imgFallback = slide.querySelector('.new-hero-image img.main-image');
    const image = picture || imgFallback;

    // Extract heading (h1 for first slide, h2 for subsequent slides)
    const heading = slide.querySelector('.new-hero-text-inner h1, .new-hero-text-inner h2');

    // Extract description text
    const description = slide.querySelector('.new-hero-text-inner .description');

    // Extract CTA links from the buttons container
    const ctaLinks = Array.from(
      slide.querySelectorAll('.new-hero-text-inner .hero-banner__buttons-container a')
    );

    // Build the image cell (column 1)
    const imageCell = [];
    if (image) {
      imageCell.push(image);
    }

    // Build the content cell (column 2): heading + description + CTA links
    const contentCell = [];
    if (heading) {
      contentCell.push(heading);
    }
    if (description) {
      contentCell.push(description);
    }
    if (ctaLinks.length > 0) {
      ctaLinks.forEach((link) => contentCell.push(link));
    }

    // Only add the row if we have meaningful content
    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
