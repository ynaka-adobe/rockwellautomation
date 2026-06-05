/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Rockwell Automation site-wide cleanup.
 * Removes non-authorable content (header, footer, nav, cookie banners, widgets, overlays).
 * All selectors validated against captured DOM in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove overlays, widgets, and elements that may interfere with block parsing
    // Found in captured HTML: <access-widget-ui class="notranslate"> (lines 2,5,7)
    WebImporter.DOMUtils.remove(element, ['access-widget-ui']);

    // Found in captured HTML: <a class="acsb-sr-only"> (line 4)
    WebImporter.DOMUtils.remove(element, ['.acsb-sr-only']);

    // Found in captured HTML: <div class="alert-banner-config"> (line 10)
    WebImporter.DOMUtils.remove(element, ['.alert-banner-config']);

    // Found in captured HTML: <div class="fly-in-config"> (line 12)
    WebImporter.DOMUtils.remove(element, ['.fly-in-config']);

    // Found in captured HTML: <div class="abm-intent-drawer-config"> (line 14)
    WebImporter.DOMUtils.remove(element, ['.abm-intent-drawer-config']);

    // Found in captured HTML: <div class="cookie-popup"> (line 4040)
    WebImporter.DOMUtils.remove(element, ['.cookie-popup']);

    // Found in captured HTML: <div id="onetrust-consent-sdk"> (line 4104)
    WebImporter.DOMUtils.remove(element, ['#onetrust-consent-sdk']);

    // Found in captured HTML: <div id="rafb-container"> (line 4379) - chat widget
    WebImporter.DOMUtils.remove(element, ['#rafb-container']);

    // Found in captured HTML: <div class="fly-in"> (line 4085) - promotional fly-in aside
    WebImporter.DOMUtils.remove(element, ['.fly-in']);

    // Found in captured HTML: <div class="pdf-viewer__container"> (line 4033)
    WebImporter.DOMUtils.remove(element, ['.pdf-viewer__container']);

    // Found in captured HTML: <div class="cloudservice testandtarget"> (line 4081)
    WebImporter.DOMUtils.remove(element, ['.cloudservice.testandtarget']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove site-wide non-authorable chrome (header/nav, footer)
    // Found in captured HTML: <div class="global-nav aem-GridColumn..."> (line 18) - contains ra-header, header, nav
    WebImporter.DOMUtils.remove(element, ['.global-nav']);

    // Found in captured HTML: <div class="footer aem-GridColumn..."> (line 3575) - contains ra-footer, footer
    WebImporter.DOMUtils.remove(element, ['.footer.aem-GridColumn']);

    // Found in captured HTML: <div class="ai-translations-disclaimer-text hidden"> (line 3572)
    WebImporter.DOMUtils.remove(element, ['.ai-translations-disclaimer-text']);

    // Remove iframes (SSO login, tracking, OneTrust resize)
    // Found in captured HTML: <iframe id="loginframe"> (line 2649), <iframe class="aamIframeLoaded"> (line 4102), <iframe class="ot-text-resize"> (line 4371), <iframe> (line 4377)
    WebImporter.DOMUtils.remove(element, ['iframe']);

    // Remove link elements (stylesheets) and noscript
    WebImporter.DOMUtils.remove(element, ['link', 'noscript']);
  }
}
