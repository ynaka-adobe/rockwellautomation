/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Rockwell Automation section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks for sections with a style.
 * Runs in afterTransform only. Uses payload.template.sections from page-templates.json.
 *
 * Sections (from page-templates.json homepage template):
 *   1. Hero Carousel - selector: .hero-carousel.carousel.panelcontainer - style: null
 *   2. Quick Links Bar - selector: .quick-links.homepage-design - style: null
 *   3. Global Leaders Statement - selector: .generic-container.pad-top-max - style: null
 *   4. Latest Insights - selector: .campaign-tags - style: dark
 *   5. Rockwell Automation News - selector: .company-news - style: null
 *   6. Working Together / Brand Logos - selector: .logo-links - style: dark
 *
 * All selectors validated against captured DOM in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };

    // Process sections in reverse order to preserve DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: [['style', section.style]],
        });
        sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
      }

      // Insert <hr> before every section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
