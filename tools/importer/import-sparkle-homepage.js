/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsDealsParser from './parsers/cards-deals.js';
import cardsLocationsParser from './parsers/cards-locations.js';

// TRANSFORMER IMPORTS
import sparkleCleanupTransformer from './transformers/sparkle-cleanup.js';
import sparkleSectionsTransformer from './transformers/sparkle-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-deals': cardsDealsParser,
  'cards-locations': cardsLocationsParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  sparkleCleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'sparkle-homepage',
  description: 'Plaza Sparkle Launch homepage with hero, deals cards, lounge location cards, and promotional CTA sections.',
  urls: [
    'https://plaza-sparkle-launch.lovable.app',
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: ['section#booking'],
    },
    {
      name: 'cards-deals',
      instances: ['section.bg-cream .grid'],
    },
    {
      name: 'cards-locations',
      instances: ['section#destinations .grid'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero with Booking Form',
      selector: 'section#booking',
      style: 'dark',
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Latest Deals & Partner Offers',
      selector: 'section.bg-cream',
      style: 'cream',
      blocks: ['cards-deals'],
      defaultContent: ['section.bg-cream h2'],
    },
    {
      id: 'section-3',
      name: 'New & Reopened Lounges',
      selector: 'section#destinations',
      style: null,
      blocks: ['cards-locations'],
      defaultContent: ['section#destinations h2', 'section#destinations p.text-center'],
    },
    {
      id: 'section-4',
      name: 'Online Exclusive Offer CTA',
      selector: 'section.bg-cta-gradient',
      style: 'dark',
      blocks: [],
      defaultContent: ['section.bg-cta-gradient h2', 'section.bg-cta-gradient p', 'section.bg-cta-gradient a'],
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

  // Run cleanup transformers first
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });

  // Run section transformer in afterTransform only
  if (hookName === 'afterTransform' && PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1) {
    try {
      sparkleSectionsTransformer.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error('Section transformer failed:', e);
    }
  }
}

/**
 * Find all blocks on the page based on the embedded template configuration
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

// EXPORT DEFAULT CONFIGURATION
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (handle root URL → /index)
    let rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    if (!rawPath || rawPath === '') rawPath = '/index';
    const path = rawPath;

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
