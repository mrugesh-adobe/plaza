/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-locations.
 * Base: cards (with images variant).
 * Source: https://plaza-sparkle-launch.lovable.app
 * Selector: section#destinations .grid
 *
 * Cards (with images) block structure (from block library):
 *   2 columns per row: image cell | text cell
 *   Each card: image | title (heading) + description + optional CTA
 *
 * Source HTML structure:
 *   .grid > div.group.relative (×3 cards)
 *     img (lounge photo)
 *     div.absolute.bottom-0 > p (date) + h3 (city) + p (terminal info)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all location card elements
  // Found: <div class="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer">
  const cards = element.querySelectorAll(':scope > div.group, :scope > div[class*="group"][class*="relative"]');

  cards.forEach((card) => {
    // Extract lounge image
    // Found: <img src="./images/b207e7d45c5d9ad674a734cbec6b0e17.jpg" alt="Plaza Premium Lounge Rome" class="w-full h-72 object-cover...">
    const image = card.querySelector('img');

    // Extract text content from overlay
    // Found: <div class="absolute bottom-0 left-0 right-0 p-6">
    const overlay = card.querySelector('[class*="absolute"][class*="bottom-0"], [class*="absolute"] [class*="bottom-0"]');

    const textContent = [];

    if (overlay) {
      // Extract date
      // Found: <p class="text-xs font-semibold text-gold uppercase...">December 2025</p>
      const date = overlay.querySelector('p:first-child, p[class*="text-xs"]');
      if (date) {
        const dateEl = document.createElement('p');
        const em = document.createElement('em');
        em.textContent = date.textContent.trim();
        dateEl.append(em);
        textContent.push(dateEl);
      }

      // Extract city name
      // Found: <h3 class="font-display text-xl font-bold...">Rome</h3>
      const city = overlay.querySelector('h3');
      if (city) textContent.push(city);

      // Extract terminal info
      // Found: <p class="text-sm text-gold-light font-body">Fiumicino Airport</p>
      const terminal = overlay.querySelector('p:last-child, p[class*="text-sm"]');
      if (terminal && terminal !== date) textContent.push(terminal);
    }

    // Build row: [image] | [text content]
    if (image || textContent.length > 0) {
      cells.push([image || '', textContent]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-locations', cells });
  element.replaceWith(block);
}
