# LazSpace Holidays SEO Master Guide

This document defines the SEO philosophy and technical architecture established for the LazSpace Holidays web platform. 

## 1. Technical SEO Hygiene
- **Performance**: The entire project uses Vite with aggressive Terser minification and chunk-based code-splitting. Vendor libraries and AI tools are extracted so the critical DOM unblocks instantly.
- **LCP Optimization**: Below-the-fold images and embedded iframes strictly enforce `loading="lazy"`. Hero sections natively prioritize background loads.
- **Canonical Trapping**: The `<head>` automatically computes distinct canonical URLs via our `SEOManager` to prevent duplicate indexing across URL parameters.

## 2. Advanced Schema Injection (`JSON-LD`)
By leveraging `SEOManager.js`, every page dynamically requests its own rich-result schema:
- **Organization**: Fired globally to validate the LLP Identity and brand logos.
- **FAQPage**: Generated automatically whenever the AI Blog engine synthesizes questions or across structural localized pages.
- **LocalBusiness**: Hard-wired into `local-seo.html` to lock the Neyyattinkara/Trivandrum coordinates into Google Maps rankings.

## 3. SEO Localization (`hreflang`)
The custom `i18n.js` and `meta.js` engines cross-reference `data-i18n` translations into Google-friendly tags, exposing native Malayalam and Hindi variants to regional search algorithms.

## 4. Admin Protection
The proprietary Admin Dashboard (`/admin`) enforces strict security tags (` robots: "noindex, nofollow"`) preventing sensitive pipeline/analytics paths from polluting global search.

## 6. Sitemap Generation
While the Node server provides a dynamic endpoint at `/api/sitemap`, you can also generate a static XML file for pure-static hosting:
```bash
node scripts/generate-sitemap.cjs
```
This script is pre-programmed to map your core routes and destination slugs into `public/sitemap.xml`.

## 7. Analytics & GTM Setup
To activate tracking, open `src/main.js` and update the placeholder IDs:
- **GTM**: Replace `'GTM-XXXXXXX'` in `TagManager.init()` and uncomment the line.
- **Analytics**: The `AnalyticsTracker.init()` call fires automatically, but you can configure specific tracking endpoints in `src/utils/AnalyticsTracker.js`.

---
*Documented by Antigravity for LazSpace Holidays LLP*
