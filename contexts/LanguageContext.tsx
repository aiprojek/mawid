import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setI18nLanguage, Language } from '../i18n';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        try {
            let savedLang = localStorage.getItem('waqti-lang') as Language;
             // Migration from old key
            if (!savedLang) {
                const oldLang = localStorage.getItem('mawid-lang') as Language;
                if (oldLang) {
                    savedLang = oldLang;
                    localStorage.setItem('waqti-lang', oldLang);
                    localStorage.removeItem('mawid-lang');
                }
            }

            if (savedLang && ['id', 'en'].includes(savedLang)) {
                return savedLang;
            }
            const browserLang = navigator.language.split('-')[0];
            return browserLang === 'en' ? 'en' : 'id';
        } catch (e) {
            return 'id';
        }
    });

    useEffect(() => {
        setI18nLanguage(language);
        try {
            localStorage.setItem('waqti-lang', language);
        } catch (e) {
            console.error("Could not save language to localStorage", e);
        }
    }, [language]);

    const setLanguage = (lang: Language) => {
        // FIX: Update the global language state *before* triggering the React state update.
        // This ensures that when components re-render, the t() function uses the new language.
        setI18nLanguage(lang);
        setLanguageState(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};