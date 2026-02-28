import { t } from './i18n.js';
import { getSupportedLangs } from './langs.js';

/**
 * Updates Localized Meta Tags, Page Title, and Hreflang Tags
 */
export function setMeta(lang) {
    // Update Title
    // Fallback to English title pattern if missing from dictionary to avoid empty titles
    const docTitle = t('nav.home') !== 'nav.home' ? `${t('nav.home')} | LazSpace Holidays` : 'LazSpace Holidays | Curated Journeys';
    document.title = docTitle;

    // Update Meta Description
    const metaDescElement = document.querySelector('meta[name="description"]');
    if (metaDescElement) {
        const descVal = t('hero.subtitle') !== 'hero.subtitle' ? t('hero.subtitle') : 'Premium travel planning from Kerala to the world.';
        metaDescElement.setAttribute('content', descVal);
    }

    // Update OpenGraph Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', docTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
        const descVal = t('hero.subtitle') !== 'hero.subtitle' ? t('hero.subtitle') : 'Premium travel planning from Kerala to the world.';
        ogDesc.setAttribute('content', descVal);
    }

    // Handle SEO Hreflang Tags (Canonical and Alternates)
    updateHreflangTags(lang);
}

function updateHreflangTags(activeLang) {
    const baseUrl = window.location.origin + window.location.pathname;
    const langs = getSupportedLangs();

    // Update canonical link to the base url without query params (or specific to language if preferred)
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    // For single page architecture, canonical should probably stay static to base,
    // or track the ?lang param. We will track ?lang param.
    canonical.setAttribute('href', `${baseUrl}?lang=${activeLang}`);

    // Ensure alternate hreflang tags exist
    langs.forEach(l => {
        let link = document.querySelector(`link[hreflang="${l}"]`);
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'alternate');
            link.setAttribute('hreflang', l);
            document.head.appendChild(link);
        }
        link.setAttribute('href', `${baseUrl}?lang=${l}`);
    });

    // Add x-default
    let xDefault = document.querySelector('link[hreflang="x-default"]');
    if (!xDefault) {
        xDefault = document.createElement('link');
        xDefault.setAttribute('rel', 'alternate');
        xDefault.setAttribute('hreflang', 'x-default');
        document.head.appendChild(xDefault);
    }
    xDefault.setAttribute('href', `${baseUrl}?lang=en`);

    // Update the URL in the browser without reloading to reflect the lang
    const newUrl = `${baseUrl}?lang=${activeLang}` + window.location.hash;
    window.history.replaceState({ path: newUrl }, '', newUrl);
}
