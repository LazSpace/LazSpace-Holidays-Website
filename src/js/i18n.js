import { setMeta } from './meta.js';
import { languages, defaultLang, getSupportedLangs, getLangConfig } from './langs.js';

let activeLang = defaultLang;
let dictionaryCache = {}; // In-memory cache for lazy loaded dictionaries
let fallbackDictionary = null; // Always load English

// Utility: get nested object properties by string path (e.g. "hero.title")
function getNestedValue(obj, path) {
    if (!obj) return undefined;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

/**
 * Initializes the i18n engine. Focuses on setting the language early.
 */
export async function initI18n() {
    // Ensure fallback English dictionary is always loaded
    await loadDictionary(defaultLang);
    fallbackDictionary = dictionaryCache[defaultLang];

    activeLang = getDefaultLang();
    await setLang(activeLang, true);
}

/**
 * Gets the default language using localStorage first, then browser language mapping, fallback 'en'.
 */
export function getDefaultLang() {
    const saved = localStorage.getItem('lazspace_lang');
    if (saved && languages[saved]) {
        return saved;
    }

    // Check browser language mapping for first visit
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang) {
        const shortCode = browserLang.split('-')[0].toLowerCase();
        // Specific dialect mappings could be added here
        if (languages[shortCode]) {
            return shortCode;
        }
    }

    return defaultLang;
}

/**
 * Switch the application language.
 */
export async function setLang(lang, forceReload = false) {
    if (!languages[lang]) {
        console.warn(`[i18n] Language ${lang} not supported, falling back to ${defaultLang}`);
        lang = defaultLang;
    }

    activeLang = lang;
    localStorage.setItem('lazspace_lang', lang);

    // Lazy load dictionary if not cached
    if (!dictionaryCache[lang] || forceReload) {
        await loadDictionary(lang);
    }

    const config = getLangConfig(lang);

    // Update HTML attribute
    document.documentElement.lang = lang;
    document.documentElement.dir = config.dir;

    // Toggle RTL class on body for specific styling
    if (config.dir === 'rtl') {
        document.body.classList.add('rtl');
    } else {
        document.body.classList.remove('rtl');
    }

    // Apply to DOM
    applyTranslations();
    handleIncompleteNotice(config);

    // Update Meta & SEO
    setMeta(lang);

    // Dispatch event for components that might need manual re-renders
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

/**
 * Loads the JSON dictionary dynamically and caches it.
 */
async function loadDictionary(lang) {
    // Optional: Check sessionStorage cache
    const sessionCache = sessionStorage.getItem(`i18n_${lang}`);
    if (sessionCache) {
        try {
            dictionaryCache[lang] = JSON.parse(sessionCache);
            return;
        } catch (e) { }
    }

    try {
        const response = await fetch(`/i18n/${lang}.json`);
        if (!response.ok) throw new Error(`Failed to fetch /i18n/${lang}.json`);
        const data = await response.json();
        dictionaryCache[lang] = data;
        sessionStorage.setItem(`i18n_${lang}`, JSON.stringify(data));
    } catch (err) {
        console.error('[i18n] Error loading dictionary:', err);
        // Ensure cache entry exists so we don't infinitely retry on failure
        if (!dictionaryCache[lang]) dictionaryCache[lang] = {};
    }
}

/**
 * Translate a key.
 * @param {string} keyPath - e.g. "hero.title"
 * @param {object} vars - Variables for interpolation: { name: "Bertin" }
 */
export function t(keyPath, vars = {}) {
    const currentDict = dictionaryCache[activeLang] || {};

    // Try current lang
    let str = getNestedValue(currentDict, keyPath);

    // Fallback to English
    if (typeof str !== 'string' && fallbackDictionary) {
        str = getNestedValue(fallbackDictionary, keyPath);
    }

    if (typeof str !== 'string') {
        console.warn(`[i18n] Missing translation key: ${keyPath}`);
        return keyPath; // Return the key as fallback so it's noticeable
    }

    // Interpolate vars
    for (const [key, value] of Object.entries(vars)) {
        str = str.replace(new RegExp(`{${key}}`, 'g'), value);
    }

    return str;
}

/**
 * Updates all DOM elements with data-i18n attributes.
 */
export function applyTranslations(context = document) {
    // textContent/innerHTML
    const els = context.querySelectorAll('[data-i18n]');
    els.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = t(key);
        // Use innerHTML because some translations contain <br> or basic formatting
        el.innerHTML = translated;
    });

    // Pick up placeholder translations
    const inputs = context.querySelectorAll('[data-i18n-placeholder]');
    inputs.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.setAttribute('placeholder', t(key));
    });

    // Pick up Aria labels
    const arias = context.querySelectorAll('[data-i18n-aria]');
    arias.forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        el.setAttribute('aria-label', t(key));
    });

    // Pick up titles (hover tooltips)
    const titles = context.querySelectorAll('[data-i18n-title]');
    titles.forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.setAttribute('title', t(key));
    });

    // Localized Form Validation
    const requiredInputs = context.querySelectorAll('input[required], select[required], textarea[required]');
    requiredInputs.forEach(input => {
        // Clear custom validity on input so it can be re-evaluated naturally
        input.addEventListener('input', () => {
            input.setCustomValidity('');
        });
        // Set localized message on invalid
        input.addEventListener('invalid', (e) => {
            if (input.validity.valueMissing) {
                input.setCustomValidity(t('contact.validation.required') || 'This field is required');
            } else if (input.validity.typeMismatch && input.type === 'email') {
                input.setCustomValidity(t('contact.validation.email') || 'Enter a valid email address');
            } else {
                input.setCustomValidity('');
            }
        });
    });
}

/**
 * Handles showing/hiding incomplete translation notice
 */
function handleIncompleteNotice(config) {
    let notice = document.getElementById('i18n-notice');
    if (!config.complete && activeLang !== defaultLang) {
        if (!notice) {
            notice = document.createElement('div');
            notice.id = 'i18n-notice';
            notice.style.position = 'fixed';
            notice.style.bottom = '0';
            notice.style.left = '0';
            notice.style.width = '100%';
            notice.style.background = 'var(--color-accent)';
            notice.style.color = '#000';
            notice.style.textAlign = 'center';
            notice.style.padding = '8px';
            notice.style.fontSize = '0.85rem';
            notice.style.zIndex = '9999';
            document.body.appendChild(notice);
        }
        notice.textContent = t('nav.incompleteNotice') || 'Some content may appear in English as translations are in progress.';
        notice.style.display = 'block';
    } else if (notice) {
        notice.style.display = 'none';
    }
}
