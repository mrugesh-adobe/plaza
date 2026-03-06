/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: sparkle cleanup.
 * Selectors from captured DOM of https://plaza-sparkle-launch.lovable.app
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove empty overlay divs that may interfere with block matching
    // Found: <div class="absolute inset-0 bg-hero-overlay"></div>
    const overlays = element.querySelectorAll('.bg-hero-overlay');
    overlays.forEach((el) => el.remove());

    // Remove gradient overlays on lounge cards
    // Found: <div class="absolute inset-0 bg-gradient-to-t from-charcoal/80...">
    const gradientOverlays = element.querySelectorAll('[class*="bg-gradient-to-t"]');
    gradientOverlays.forEach((el) => el.remove());

    // Remove base64 SVG images (inline icons from Lucide)
    // Found: <img src="data:image/svg+xml;base64,...">
    const svgImages = element.querySelectorAll('img[src^="data:image/svg+xml"]');
    svgImages.forEach((el) => el.remove());
  }

  if (hookName === H.after) {
    // Remove navigation bar
    // Found: <nav class="fixed top-0 left-0 right-0 z-50 bg-background/95...">
    WebImporter.DOMUtils.remove(element, ['nav']);

    // Remove footer
    // Found: <footer class="bg-charcoal py-16">
    WebImporter.DOMUtils.remove(element, ['footer']);

    // Remove Lovable platform badge
    // Found: <aside id="lovable-badge">
    WebImporter.DOMUtils.remove(element, ['aside#lovable-badge']);

    // Remove empty toast container
    // Found: <ol class="fixed top-0 z-[100]...">
    const toastContainers = element.querySelectorAll('ol.fixed');
    toastContainers.forEach((el) => el.remove());

    // Remove empty sections
    const emptySections = element.querySelectorAll('section:empty');
    emptySections.forEach((el) => el.remove());

    // Remove form inputs (interactive, not authorable)
    // Found: <input class="w-full bg-transparent...">
    const inputs = element.querySelectorAll('input');
    inputs.forEach((el) => el.remove());

    // Remove button elements (not link-based CTAs)
    // Found: <button class="md:hidden text-foreground"> (mobile menu toggle)
    // Found: <button class="w-full md:w-auto bg-primary..."> (Book Now form button)
    const buttons = element.querySelectorAll('button');
    buttons.forEach((el) => el.remove());

    // Remove leftover elements
    WebImporter.DOMUtils.remove(element, ['iframe', 'link', 'noscript']);
  }
}
