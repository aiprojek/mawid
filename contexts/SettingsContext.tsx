import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Settings } from '../types';
import { getDefaultSettings, IQAMAH_PRAYERS } from '../constants';
import { useLanguage } from './LanguageContext';

interface SettingsContextType {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    saveSettings: (newSettings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { language } = useLanguage();
    
    // Generate language-specific default settings
    const DEFAULT_SETTINGS = getDefaultSettings(language);

    const [settings, setSettings] = useState<Settings>(() => {
        try {
            let savedSettings = localStorage.getItem('waqtiPrayerTimesSettings');
            // Migration from old key
            if (!savedSettings) {
                const oldSettings = localStorage.getItem('prayerTimesSettings');
                if (oldSettings) {
                    savedSettings = oldSettings;
                    localStorage.setItem('waqtiPrayerTimesSettings', oldSettings);
                    localStorage.removeItem('prayerTimesSettings');
                }
            }

            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);

                // --- Migration Logic for prayerDuration ---
                if (parsed.prayerDuration && !parsed.prayerDurations) {
                    parsed.prayerDurations = {};
                    IQAMAH_PRAYERS.forEach(p => {
                        parsed.prayerDurations[p] = parsed.prayerDuration;
                    });
                    delete parsed.prayerDuration; // Remove the old key
                }

                // --- Migration Logic for slides ---
                if (parsed.slides && Array.isArray(parsed.slides)) {
                    let needsSlideMigration = false;
                    if (parsed.slides.length > 0 && (parsed.slides[0].enabled === undefined || parsed.slides[0].duration === undefined)) {
                        needsSlideMigration = true;
                    }

                    if (needsSlideMigration) {
                        const defaultDuration = parsed.slideInterval || 15;
                        parsed.slides = parsed.slides.map((slide: any) => ({
                            ...slide,
                            enabled: slide.enabled === undefined ? true : slide.enabled,
                            duration: slide.duration === undefined ? defaultDuration : slide.duration,
                            type: slide.type || 'text', // Ensure type exists
                        }));
                    }
                     // Clean up old properties from slides
                    parsed.slides = parsed.slides.map((slide: any) => {
                        if (slide.textAlign) delete slide.textAlign;
                        return slide;
                    });
                }
                
                // Remove old global interval setting
                if (parsed.slideInterval) {
                    delete parsed.slideInterval;
                }


                // --- Migration Logic for runningText ---
                if (parsed.runningText && typeof parsed.runningText === 'string' && !parsed.customTexts) {
                    parsed.customTexts = [{ id: 'migrated-1', content: parsed.runningText }];
                    delete parsed.runningText;
                }
                if (parsed.runningTextMode === 'static') {
                    parsed.runningTextMode = 'custom';
                }

                // --- NEW Migration for custom Dhikr ---
                // If the new dhikrList doesn't exist, it means we're on an old version.
                // We'll replace the old dhikr settings with the new default structure.
                if (!parsed.dhikrList || !Array.isArray(parsed.dhikrList)) {
                    parsed.dhikrList = DEFAULT_SETTINGS.dhikrList;
                    parsed.selectedDhikr = DEFAULT_SETTINGS.selectedDhikr;
                }
                
                // Merge loaded settings with defaults to ensure all keys are present
                const mergedSettings = { 
                    ...DEFAULT_SETTINGS, 
                    ...parsed,
                    iqamahOffsets: {
                        ...DEFAULT_SETTINGS.iqamahOffsets,
                        ...(parsed.iqamahOffsets || {}),
                    },
                    adjustments: {
                        ...DEFAULT_SETTINGS.adjustments,
                        ...(parsed.adjustments || {}),
                    },
                     prayerDurations: {
                        ...DEFAULT_SETTINGS.prayerDurations,
                        ...(parsed.prayerDurations || {}),
                    },
                    contextualWallpapers: {
                        ...DEFAULT_SETTINGS.contextualWallpapers,
                        ...(parsed.contextualWallpapers || {}),
                    },
                };
                return mergedSettings;
            }
        } catch (error) {
            console.error("Failed to load settings from localStorage", error);
        }
        return DEFAULT_SETTINGS;
    });

    const saveSettings = useCallback((newSettings: Settings) => {
        try {
            const settingsString = JSON.stringify(newSettings);
            localStorage.setItem('waqtiPrayerTimesSettings', settingsString);
            setSettings(newSettings);
        } catch (error) {
            console.error("Failed to save settings to localStorage", error);
        }
    }, []);

    // Effect to update settings if language changes and no settings are saved yet
    useEffect(() => {
        const savedSettings = localStorage.getItem('waqtiPrayerTimesSettings');
        if (!savedSettings) {
            setSettings(getDefaultSettings(language));
        }
    }, [language]);


    useEffect(() => {
        saveSettings(settings);
    }, [settings, saveSettings]);

    return (
        <SettingsContext.Provider value={{ settings, setSettings, saveSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};