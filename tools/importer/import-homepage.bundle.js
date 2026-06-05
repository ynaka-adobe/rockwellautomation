/* eslint-disable */
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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll("li.new-hero");
    const cells = [];
    slides.forEach((slide) => {
      const picture = slide.querySelector(".new-hero-image .hero picture");
      const imgFallback = slide.querySelector(".new-hero-image img.main-image");
      const image = picture || imgFallback;
      const heading = slide.querySelector(".new-hero-text-inner h1, .new-hero-text-inner h2");
      const description = slide.querySelector(".new-hero-text-inner .description");
      const ctaLinks = Array.from(
        slide.querySelectorAll(".new-hero-text-inner .hero-banner__buttons-container a")
      );
      const imageCell = [];
      if (image) {
        imageCell.push(image);
      }
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
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-quicklinks.js
  function parse2(element, { document }) {
    const items = element.querySelectorAll(".quick-links__item");
    const cells = [];
    items.forEach((item) => {
      const link = item.querySelector("a");
      if (!link) return;
      const icon = item.querySelector(".quick-links__icon img, img");
      const label = item.querySelector(".quick-links__label");
      const cellContent = [];
      if (icon) {
        const iconClone = icon.cloneNode(true);
        cellContent.push(iconClone);
      }
      if (label && link) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = label.textContent.trim();
        cellContent.push(a);
      } else if (link) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim();
        cellContent.push(a);
      }
      if (cellContent.length > 0) {
        cells.push(cellContent);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-quicklinks", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-insights.js
  function parse3(element, { document }) {
    const subtitle = element.querySelector(".campaign-tags__subtitle");
    const title = element.querySelector("h2.campaign-tags__title, .campaign-tags__title");
    const cardWrappers = element.querySelectorAll(".campaign-tags__card-wrapper");
    const cells = [];
    if (subtitle || title) {
      const headerContent = [];
      if (subtitle) headerContent.push(subtitle);
      if (title) headerContent.push(title);
      cells.push(headerContent);
    }
    cardWrappers.forEach((wrapper) => {
      const cardLink = wrapper.querySelector("a.campaign-tags__card");
      const image = wrapper.querySelector("img.campaign-tags__card-image");
      const cardSubtitle = wrapper.querySelector(".campaign-tags__card-subtitle");
      const cardTitle = wrapper.querySelector(".campaign-tags__card-title");
      const cardDescription = wrapper.querySelector(".campaign-tags__card-description");
      const cardLinkText = wrapper.querySelector(".campaign-tags__card-link");
      const imageCell = [];
      if (image) {
        imageCell.push(image);
      }
      const textCell = [];
      if (cardSubtitle) textCell.push(cardSubtitle);
      if (cardTitle) textCell.push(cardTitle);
      if (cardDescription) textCell.push(cardDescription);
      if (cardLink && cardLinkText) {
        const link = document.createElement("a");
        link.href = cardLink.href;
        link.textContent = cardLinkText.textContent;
        textCell.push(link);
      } else if (cardLink) {
        const link = document.createElement("a");
        link.href = cardLink.href;
        link.textContent = "Read More";
        textCell.push(link);
      }
      if (imageCell.length > 0 || textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-insights", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-news.js
  function parse4(element, { document }) {
    const col1Content = [];
    const header = element.querySelector(".company-news__header, .company-news__header-title");
    if (header) {
      const h2 = document.createElement("h2");
      h2.textContent = header.textContent.trim();
      col1Content.push(h2);
    }
    const results = element.querySelectorAll(".company-news__result");
    results.forEach((result) => {
      const titleEl = result.querySelector(".company-news__result-title");
      const linkEl = result.querySelector(".company-news__result-link-container");
      if (titleEl) {
        const p = document.createElement("p");
        if (linkEl && linkEl.href) {
          const a = document.createElement("a");
          a.href = linkEl.href;
          a.textContent = titleEl.textContent.trim();
          p.appendChild(a);
        } else {
          p.textContent = titleEl.textContent.trim();
        }
        col1Content.push(p);
      }
    });
    const ctaLink = element.querySelector(".company-news__cta-button-container a");
    if (ctaLink) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      const a = document.createElement("a");
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      strong.appendChild(a);
      p.appendChild(strong);
      col1Content.push(p);
    }
    const col2Content = [];
    const imageContainer = element.querySelector(".company-news__image-container");
    if (imageContainer) {
      const images = imageContainer.querySelectorAll('.company-news__image > img[src]:not([src^="data:"])');
      images.forEach((img) => {
        const clonedImg = document.createElement("img");
        clonedImg.src = img.src;
        if (img.alt) clonedImg.alt = img.alt;
        col2Content.push(clonedImg);
      });
    }
    const cells = [
      [col1Content, col2Content]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/rockwellautomation-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ["access-widget-ui"]);
      WebImporter.DOMUtils.remove(element, [".acsb-sr-only"]);
      WebImporter.DOMUtils.remove(element, [".alert-banner-config"]);
      WebImporter.DOMUtils.remove(element, [".fly-in-config"]);
      WebImporter.DOMUtils.remove(element, [".abm-intent-drawer-config"]);
      WebImporter.DOMUtils.remove(element, [".cookie-popup"]);
      WebImporter.DOMUtils.remove(element, ["#onetrust-consent-sdk"]);
      WebImporter.DOMUtils.remove(element, ["#rafb-container"]);
      WebImporter.DOMUtils.remove(element, [".fly-in"]);
      WebImporter.DOMUtils.remove(element, [".pdf-viewer__container"]);
      WebImporter.DOMUtils.remove(element, [".cloudservice.testandtarget"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [".global-nav"]);
      WebImporter.DOMUtils.remove(element, [".footer.aem-GridColumn"]);
      WebImporter.DOMUtils.remove(element, [".ai-translations-disclaimer-text"]);
      WebImporter.DOMUtils.remove(element, ["iframe"]);
      WebImporter.DOMUtils.remove(element, ["link", "noscript"]);
    }
  }

  // tools/importer/transformers/rockwellautomation-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: [["style", section.style]]
          });
          sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/transformers/rockwellautomation-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "cards-quicklinks": parse2,
    "cards-insights": parse3,
    "columns-news": parse4
  };
  var transformers = [
    transform,
    transform2,
    transform3
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Rockwell Automation homepage with hero, product categories, and promotional content",
    urls: ["https://www.rockwellautomation.com/en-us.html"],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".hero-carousel.carousel.panelcontainer"]
      },
      {
        name: "cards-quicklinks",
        instances: [".quick-links.homepage-design"]
      },
      {
        name: "cards-insights",
        instances: [".campaign-tags"]
      },
      {
        name: "columns-news",
        instances: [".company-news"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: ".hero-carousel.carousel.panelcontainer",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Quick Links Bar",
        selector: ".quick-links.homepage-design",
        style: null,
        blocks: ["cards-quicklinks"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Global Leaders Statement",
        selector: ".generic-container.pad-top-max",
        style: null,
        blocks: [],
        defaultContent: [".animated-header__header", ".animated-header__subtitle"]
      },
      {
        id: "section-4",
        name: "Latest Insights",
        selector: ".campaign-tags",
        style: "dark",
        blocks: ["cards-insights"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Rockwell Automation News",
        selector: ".company-news",
        style: null,
        blocks: ["columns-news"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Working Together / Brand Logos",
        selector: ".logo-links",
        style: "dark",
        blocks: [],
        defaultContent: [".logo-links__title", ".logo-links__logo-container"]
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
  var import_homepage_default = {
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
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
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
  return __toCommonJS(import_homepage_exports);
})();
