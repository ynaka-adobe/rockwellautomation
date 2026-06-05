/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import cardsQuicklinksParser from './parsers/cards-quicklinks.js';
import cardsInsightsParser from './parsers/cards-insights.js';
import columnsNewsParser from './parsers/columns-news.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/rockwellautomation-cleanup.js';
import sectionsTransformer from './transformers/rockwellautomation-sections.js';
import dmImagesTransformer from './transformers/rockwellautomation-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-quicklinks': cardsQuicklinksParser,
  'cards-insights': cardsInsightsParser,
  'columns-news': columnsNewsParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
  dmImagesTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Rockwell Automation homepage with hero, product categories, and promotional content',
  urls: ['https://www.rockwellautomation.com/en-us.html'],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.hero-carousel.carousel.panelcontainer'],
    },
    {
      name: 'cards-quicklinks',
      instances: ['.quick-links.homepage-design'],
    },
    {
      name: 'cards-insights',
      instances: ['.campaign-tags'],
    },
    {
      name: 'columns-news',
      instances: ['.company-news'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: '.hero-carousel.carousel.panelcontainer',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Quick Links Bar',
      selector: '.quick-links.homepage-design',
      style: null,
      blocks: ['cards-quicklinks'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Global Leaders Statement',
      selector: '.generic-container.pad-top-max',
      style: null,
      blocks: [],
      defaultContent: ['.animated-header__header', '.animated-header__subtitle'],
    },
    {
      id: 'section-4',
      name: 'Latest Insights',
      selector: '.campaign-tags',
      style: 'dark',
      blocks: ['cards-insights'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Rockwell Automation News',
      selector: '.company-news',
      style: null,
      blocks: ['columns-news'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Working Together / Brand Logos',
      selector: '.logo-links',
      style: 'dark',
      blocks: [],
      defaultContent: ['.logo-links__title', '.logo-links__logo-container'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (section breaks + DM images)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
