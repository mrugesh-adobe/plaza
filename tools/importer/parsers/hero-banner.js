/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner.
 * Base: hero.
 * Source: https://plaza-sparkle-launch.lovable.app
 * Selector: section#booking
 *
 * Hero block structure (from block library):
 *   Row 1: Background image
 *   Row 2: Heading + subheading + optional CTA
 *
 * Source HTML structure:
 *   section#booking > img.absolute (background image)
 *   section#booking h1 (heading: "Your journey starts here")
 *   section#booking p.font-body (subtitle: "Explore our one-of-a-kind premium airport lounges")
 *   section#booking .max-w-4xl (booking form - interactive, simplified to CTA)
 */
export default function parse(element, { document }) {
  // Extract background image
  // Found: <img src="./images/acdb05f809b3fc943ecf39c8fe781977.jpg" alt="Premium airport lounge" class="absolute inset-0...">
  const bgImage = element.querySelector('img.absolute, img[class*="absolute"]');

  // Extract heading
  // Found: <h1 class="font-display text-3xl...">Your journey starts here</h1>
  const heading = element.querySelector('h1');

  // Extract subtitle paragraph
  // Found: <p class="font-body text-lg...">Explore our one-of-a-kind premium airport lounges</p>
  const subtitle = element.querySelector('p.font-body, p.text-lg');

  // Build cells matching hero block library structure
  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content (heading + subtitle + CTA)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subtitle) contentCell.push(subtitle);

  // Create a "Book Now" CTA link from the booking form context
  // The form is interactive and not authorable - represent as a simple CTA link
  const ctaLink = document.createElement('a');
  ctaLink.href = '#booking';
  ctaLink.textContent = 'Book Now';
  const ctaParagraph = document.createElement('p');
  ctaParagraph.append(ctaLink);
  contentCell.push(ctaParagraph);

  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
