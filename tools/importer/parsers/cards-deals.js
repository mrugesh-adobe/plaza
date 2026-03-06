/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-deals.
 * Base: cards (no images variant).
 * Source: https://plaza-sparkle-launch.lovable.app
 * Selector: section.bg-cream .grid
 *
 * Cards (no images) block structure (from block library):
 *   1 column per row, each row = one card with text content
 *   Each card: title (heading) + description + optional CTA
 *
 * Source HTML structure:
 *   .grid > div.bg-card (×4 cards)
 *     div.bg-primary > span (category tag: "Limited Time", "Exclusive", etc.)
 *     div.p-5 > h3 (title) + p (description) + span > "Learn More"
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all card elements
  // Found: <div class="bg-card rounded-lg overflow-hidden shadow-md...">
  const cards = element.querySelectorAll(':scope > div.bg-card, :scope > div[class*="bg-card"]');

  cards.forEach((card) => {
    const cardContent = [];

    // Extract category tag
    // Found: <span class="text-xs font-semibold text-gold uppercase...">Limited Time</span>
    const tag = card.querySelector('.bg-primary span, [class*="bg-primary"] span');
    if (tag) {
      const tagEl = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = tag.textContent.trim();
      tagEl.append(em);
      cardContent.push(tagEl);
    }

    // Extract title
    // Found: <h3 class="font-display text-lg font-semibold...">15% Off Duty Free</h3>
    const title = card.querySelector('h3');
    if (title) cardContent.push(title);

    // Extract description
    // Found: <p class="text-sm text-muted-foreground font-body mb-4">...</p>
    const desc = card.querySelector('.p-5 p, div[class*="p-5"] p');
    if (desc) cardContent.push(desc);

    // Extract CTA link
    // Found: <span class="inline-flex items-center...">Learn More <img ...></span>
    // Convert span to a proper link
    const ctaSpan = card.querySelector('span.inline-flex, span[class*="inline-flex"]');
    if (ctaSpan) {
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = 'Learn More';
      const p = document.createElement('p');
      p.append(link);
      cardContent.push(p);
    }

    if (cardContent.length > 0) {
      cells.push(cardContent);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-deals', cells });
  element.replaceWith(block);
}
