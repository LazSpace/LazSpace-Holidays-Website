export const languages = {
    'en': { label: 'English', native: 'English', dir: 'ltr', complete: true },
    'ml': { label: 'Malayalam', native: 'മലയാളം', dir: 'ltr', complete: false },
    'hi': { label: 'Hindi', native: 'हिंदी', dir: 'ltr', complete: false },
    'ta': { label: 'Tamil', native: 'தமிழ்', dir: 'ltr', complete: false },
    'ar': { label: 'Arabic', native: 'العربية', dir: 'rtl', complete: false },
    'de': { label: 'German', native: 'Deutsch', dir: 'ltr', complete: false },
    'fr': { label: 'French', native: 'Français', dir: 'ltr', complete: false },
    'es': { label: 'Spanish', native: 'Español', dir: 'ltr', complete: false }
};

export const defaultLang = 'en';

export function getSupportedLangs() {
    return Object.keys(languages);
}

export function getLangConfig(lang) {
    return languages[lang] || languages[defaultLang];
}
