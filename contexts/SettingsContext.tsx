import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Settings } from '../types';
import { getDefaultSettings, IQAMAH_PRAYERS } from '../constants';
import { useLanguage } from './LanguageContext';
import { db } from '../lib/db';

interface SettingsContextType {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    saveSettings: (newSettings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { language } = useLanguage();
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const loadAndMigrateSettings = async () => {
            let finalSettings: Settings | null = null;
            const DEFAULT_SETTINGS = getDefaultSettings(language);
            
            // 1. Coba dapatkan dari IndexedDB
            const settingsFromDB = await db.settings.get(1);
            if (settingsFromDB) {
                // Hapus properti 'id' sebelum menggabungkan
                const { id, ...restOfSettings } = settingsFromDB;
                // Gabungkan dengan default untuk memastikan semua kunci ada
                finalSettings = { ...DEFAULT_SETTINGS, ...restOfSettings };
            } else {
                // 2. Jika tidak ada, coba migrasi dari localStorage
                let settingsFromLS = localStorage.getItem('waqtiPrayerTimesSettings');
                if (!settingsFromLS) {
                     settingsFromLS = localStorage.getItem('prayerTimesSettings'); // Kunci lama
                }
                
                if (settingsFromLS) {
                    try {
                        console.log("Migrating settings from localStorage to IndexedDB...");
                        const parsed = JSON.parse(settingsFromLS);

                        // --- Jalankan logika migrasi yang ada ---
                        if (parsed.prayerDuration && !parsed.prayerDurations) {
                            parsed.prayerDurations = {};
                            IQAMAH_PRAYERS.forEach(p => {
                                parsed.prayerDurations[p] = parsed.prayerDuration;
                            });
                            delete parsed.prayerDuration;
                        }
                        if (parsed.slides && Array.isArray(parsed.slides)) {
                             parsed.slides = parsed.slides.map((slide: any) => {
                                if (slide.textAlign) delete slide.textAlign;
                                return {
                                    ...slide,
                                    enabled: slide.enabled === undefined ? true : slide.enabled,
                                    duration: slide.duration === undefined ? (parsed.slideInterval || 15) : slide.duration,
                                    type: slide.type || 'text',
                                };
                            });
                        }
                        if (parsed.slideInterval) delete parsed.slideInterval;
                        if (parsed.runningText && typeof parsed.runningText === 'string' && !parsed.customTexts) {
                            parsed.customTexts = [{ id: 'migrated-1', content: parsed.runningText }];
                            delete parsed.runningText;
                        }
                        if (parsed.runningTextMode === 'static') parsed.runningTextMode = 'custom';
                        if (!parsed.dhikrList || !Array.isArray(parsed.dhikrList)) {
                            parsed.dhikrList = DEFAULT_SETTINGS.dhikrList;
                            parsed.selectedDhikr = DEFAULT_SETTINGS.selectedDhikr;
                        }
                        
                        const migratedSettings = { ...DEFAULT_SETTINGS, ...parsed };
                        
                        // Simpan ke IndexedDB
                        await db.settings.put({ ...migratedSettings, id: 1 });
                        
                        // Hapus dari localStorage
                        localStorage.removeItem('waqtiPrayerTimesSettings');
                        localStorage.removeItem('prayerTimesSettings');
                        
                        finalSettings = migratedSettings;
                        console.log("Migration successful.");
                    } catch (e) {
                        console.error("Failed to migrate settings from localStorage", e);
                    }
                }
            }
            
            // 3. Jika masih belum ada pengaturan, gunakan default
            if (!finalSettings) {
                console.log("No existing settings found, using defaults.");
                finalSettings = DEFAULT_SETTINGS;
                await db.settings.put({ ...finalSettings, id: 1 });
            }
            
            setSettings(finalSettings);
            setLoading(false);
        };
    
        loadAndMigrateSettings();
    }, [language]);

    const saveSettings = useCallback(async (newSettings: Settings) => {
        try {
            await db.settings.put({ ...newSettings, id: 1 });
            setSettings(newSettings); // Update state lokal
        } catch (error) {
            console.error("Failed to save settings to IndexedDB", error);
        }
    }, []);

    if (loading || !settings) {
        return <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 text-white">Loading Settings...</div>;
    }

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
