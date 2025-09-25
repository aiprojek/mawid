import { en } from './locales/en';
import { id } from './locales/id';

export type Locale = typeof id;
export type Language = 'id' | 'en';

const translations = { id, en };

let currentLanguage: Language = 'id';

export const setI18nLanguage = (lang: Language) => {
    currentLanguage = lang;
    document.documentElement.lang = lang;
};

// Helper to navigate nested object keys, e.g., 'settings.title'
const getNestedTranslation = (locale: Locale, key: string): string | undefined => {
    try {
        return key.split('.').reduce((obj, k) => (obj as any)[k], locale);
    } catch (e) {
        return undefined;
    }
};

export const t = (key: string, replacements?: Record<string, string>): string => {
    let translation = getNestedTranslation(translations[currentLanguage], key);
    if (translation === undefined) {
        // Fallback to Indonesian or return key if not found in any locale
        const fallback = getNestedTranslation(translations.id, key);
        translation = fallback || key;
    }

    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            translation = translation!.replace(`{{${rKey}}}`, replacements[rKey]);
        });
    }

    return translation!;
};

// Function to get the entire locale object, useful for constants or lists
export const getLocale = (): Locale => {
    return translations[currentLanguage];
};

export const getRawLocale = (lang: Language): Locale => {
    return translations[lang];
}
