# LazSpace Holidays LLP - Multilingual Website

This repository contains the source code for the LazSpace Holidays premium business website. It is built using Vanilla JavaScript, HTML5, Vanilla CSS, and bundled using Vite.

## Development Setup

1. Make sure you have Node JS installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Advanced Dynamic Multilingual Architecture (v2)

This project uses a scalable, custom vanilla JavaScript i18n engine designed for maximum performance, featuring lazy loading, caching, and RTL support.

### Supported Languages (Driven by Registry)
The active languages are maintained in `src/js/langs.js`. Currently supported:
- English (`en`) - Default LTR
- Malayalam (`ml`) - LTR
- Hindi (`hi`) - LTR
- Tamil (`ta`) - LTR
- Arabic (`ar`) - RTL
- German (`de`) - LTR
- French (`fr`) - LTR
- Spanish (`es`) - LTR

### How it Works

1. **Language Registry**: `src/js/langs.js` acts as the single source of truth. It dictates the `<select>` options in the Navbar, sets the `<html dir="rtl|ltr">` attribute, and builds the canonical SEO `hreflang` tags.
2. **Dictionaries**: Look inside `public/i18n/`. You will find JSON files for each language code. These contain nested key-value pairs representing translatable strings.
3. **Lazy Loading & Caching**: The engine fetches the requested language pack dynamically *only* when the user (or browser mapping) selects it. It retains it in a session-level cache to ensure instant swaps thereafter.
4. **Data Attributes**: HTML elements are tagged with special data attributes. The engine automatically scans for these attributes and updates the DOM.
    - `data-i18n="key.path"`: Translates text content / innerHTML.
    - `data-i18n-placeholder="key.path"`: Translates input placeholders.
    - `data-i18n-aria="key.path"`: Translates ARIA accessibility labels.
    - `data-i18n-title="key.path"`: Translates tooltip titles.
5. **RTL Support**: Arabic triggers `<html dir="rtl">` and toggles a `.rtl` class on the body. This hooks into `src/styles/rtl.css` to dynamically reverse layouts, align forms, and mirror physical direction icons while preserving phone number `unicode-bidi`.

### Adding a New Language

1. Open `src/js/langs.js` and add your new language entry to the `languages` registry object, specifying its `dir` (ltr/rtl) and `complete` status.
2. Create `public/i18n/[lang-code].json` (e.g., `it.json`). Check the `en.json` file for the schema.
3. Done. The Navbar automatically updates, SEO tags automatically generate, and routing processes immediately. If your dictionary is incomplete, the engine automatically falls back to English seamlessly on a key-by-key basis, and displays a localized incomplete notice in the footer.
