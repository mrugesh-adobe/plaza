/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: sparkle sections.
 * Adds section breaks (<hr>) and section-metadata blocks based on template sections.
 * Runs in afterTransform only.
 * Selectors from captured DOM of https://plaza-sparkle-launch.lovable.app
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;

    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid position shifts
    const reversedSections = [...sections].reverse();

    reversedSections.forEach((section) => {
      // Find section element using selector(s)
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;

      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) {
        console.warn(`Section "${section.name}" not found with selectors: ${selectors.join(', ')}`);
        return;
      }

      // Add section-metadata block if section has a style
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: {
            style: section.style,
          },
        });
        // Insert section-metadata after the section element's content
        sectionEl.append(metadataBlock);
      }

      // Add <hr> before the section (except first section)
      if (section.id !== sections[0].id) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
