var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-sparkle-homepage.js
  var import_sparkle_homepage_exports = {};
  __export(import_sparkle_homepage_exports, {
    default: () => import_sparkle_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const bgImage = element.querySelector('img.absolute, img[class*="absolute"]');
    const heading = element.querySelector("h1");
    const subtitle = element.querySelector("p.font-body, p.text-lg");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subtitle) contentCell.push(subtitle);
    const ctaLink = document.createElement("a");
    ctaLink.href = "#booking";
    ctaLink.textContent = "Book Now";
    const ctaParagraph = document.createElement("p");
    ctaParagraph.append(ctaLink);
    contentCell.push(ctaParagraph);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-deals.js
  function parse2(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll(':scope > div.bg-card, :scope > div[class*="bg-card"]');
    cards.forEach((card) => {
      const cardContent = [];
      const tag = card.querySelector('.bg-primary span, [class*="bg-primary"] span');
      if (tag) {
        const tagEl = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = tag.textContent.trim();
        tagEl.append(em);
        cardContent.push(tagEl);
      }
      const title = card.querySelector("h3");
      if (title) cardContent.push(title);
      const desc = card.querySelector('.p-5 p, div[class*="p-5"] p');
      if (desc) cardContent.push(desc);
      const ctaSpan = card.querySelector('span.inline-flex, span[class*="inline-flex"]');
      if (ctaSpan) {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = "Learn More";
        const p = document.createElement("p");
        p.append(link);
        cardContent.push(p);
      }
      if (cardContent.length > 0) {
        cells.push(cardContent);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-deals", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-locations.js
  function parse3(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll(':scope > div.group, :scope > div[class*="group"][class*="relative"]');
    cards.forEach((card) => {
      const image = card.querySelector("img");
      const overlay = card.querySelector('[class*="absolute"][class*="bottom-0"], [class*="absolute"] [class*="bottom-0"]');
      const textContent = [];
      if (overlay) {
        const date = overlay.querySelector('p:first-child, p[class*="text-xs"]');
        if (date) {
          const dateEl = document.createElement("p");
          const em = document.createElement("em");
          em.textContent = date.textContent.trim();
          dateEl.append(em);
          textContent.push(dateEl);
        }
        const city = overlay.querySelector("h3");
        if (city) textContent.push(city);
        const terminal = overlay.querySelector('p:last-child, p[class*="text-sm"]');
        if (terminal && terminal !== date) textContent.push(terminal);
      }
      if (image || textContent.length > 0) {
        cells.push([image || "", textContent]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-locations", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/sparkle-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      const overlays = element.querySelectorAll(".bg-hero-overlay");
      overlays.forEach((el) => el.remove());
      const gradientOverlays = element.querySelectorAll('[class*="bg-gradient-to-t"]');
      gradientOverlays.forEach((el) => el.remove());
      const svgImages = element.querySelectorAll('img[src^="data:image/svg+xml"]');
      svgImages.forEach((el) => el.remove());
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, ["nav"]);
      WebImporter.DOMUtils.remove(element, ["footer"]);
      WebImporter.DOMUtils.remove(element, ["aside#lovable-badge"]);
      const toastContainers = element.querySelectorAll("ol.fixed");
      toastContainers.forEach((el) => el.remove());
      const emptySections = element.querySelectorAll("section:empty");
      emptySections.forEach((el) => el.remove());
      const inputs = element.querySelectorAll("input");
      inputs.forEach((el) => el.remove());
      const buttons = element.querySelectorAll("button");
      buttons.forEach((el) => el.remove());
      WebImporter.DOMUtils.remove(element, ["iframe", "link", "noscript"]);
    }
  }

  // tools/importer/transformers/sparkle-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section) => {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) {
          console.warn(`Section "${section.name}" not found with selectors: ${selectors.join(", ")}`);
          return;
        }
        if (section.style) {
          const metadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: {
              style: section.style
            }
          });
          sectionEl.append(metadataBlock);
        }
        if (section.id !== sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-sparkle-homepage.js
  var parsers = {
    "hero-banner": parse,
    "cards-deals": parse2,
    "cards-locations": parse3
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "sparkle-homepage",
    description: "Plaza Sparkle Launch homepage with hero, deals cards, lounge location cards, and promotional CTA sections.",
    urls: [
      "https://plaza-sparkle-launch.lovable.app"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: ["section#booking"]
      },
      {
        name: "cards-deals",
        instances: ["section.bg-cream .grid"]
      },
      {
        name: "cards-locations",
        instances: ["section#destinations .grid"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero with Booking Form",
        selector: "section#booking",
        style: "dark",
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Latest Deals & Partner Offers",
        selector: "section.bg-cream",
        style: "cream",
        blocks: ["cards-deals"],
        defaultContent: ["section.bg-cream h2"]
      },
      {
        id: "section-3",
        name: "New & Reopened Lounges",
        selector: "section#destinations",
        style: null,
        blocks: ["cards-locations"],
        defaultContent: ["section#destinations h2", "section#destinations p.text-center"]
      },
      {
        id: "section-4",
        name: "Online Exclusive Offer CTA",
        selector: "section.bg-cta-gradient",
        style: "dark",
        blocks: [],
        defaultContent: ["section.bg-cta-gradient h2", "section.bg-cta-gradient p", "section.bg-cta-gradient a"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
    if (hookName === "afterTransform" && PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1) {
      try {
        transform2.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error("Section transformer failed:", e);
      }
    }
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_sparkle_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      let rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      if (!rawPath || rawPath === "") rawPath = "/index";
      const path = rawPath;
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_sparkle_homepage_exports);
})();
