import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PrayerTimesDisplay } from './components/PrayerTimesDisplay';
import { MainClock } from './components/MainClock';
import { AppHeader } from './components/AppHeader';
import { Footer } from './components/Footer';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { SettingsPage } from './components/SettingsModal';
import { InfoPage } from './components/InfoModal';
import { SlideDisplay } from './components/SlideDisplay';
import useClock from './hooks/useClock';
import usePrayerTimes from './hooks/usePrayerTimes';
import { DisplayState, PrayerName, PrayerTimes } from './types';
import { IQAMAH_PRAYERS } from './constants';
import { parseTimeToDate } from './utils';
import { t } from './i18n';

// This component isolates all the logic that needs to update every second.
// By doing this, the parent component (AppContent) and its other children (Header, Footer)
// do not re-render every second, which fixes the running text animation glitch.
const TimeSensitiveContent: React.FC<{ prayerTimes: PrayerTimes | null, stale: boolean }> = ({ prayerTimes, stale }) => {
    const { settings } = useSettings();
    const { currentTime } = useClock();

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [displayMode, setDisplayMode] = useState<'clock' | 'slide'>('clock');
    const [isTransitioning, setIsTransitioning] = useState(false);

    // --- Prayer State Machine Logic ---
    const [displayState, setDisplayState] = useState<DisplayState>(DisplayState.Clock);
    const [activePrayer, setActivePrayer] = useState<PrayerName | null>(null);
    const [countdown, setCountdown] = useState(0);
    const alarmAudioRef = useRef(new Audio());
    
    const isFriday = useMemo(() => currentTime.getDay() === 5, [currentTime]);

    const prayerTimesToUse = useMemo(() => {
        if (!prayerTimes) return null;
        if (isFriday && settings.enableFridayMode && settings.fridayTimeSource === 'manual') {
            return {
                ...prayerTimes,
                Dhuhr: settings.manualFridayTime,
            };
        }
        return prayerTimes;
    }, [prayerTimes, isFriday, settings.enableFridayMode, settings.fridayTimeSource, settings.manualFridayTime]);

    const sortedPrayerTimes = useMemo(() => {
        if (!prayerTimesToUse) return [];
        return IQAMAH_PRAYERS
            .map(name => ({ name, time: parseTimeToDate(prayerTimesToUse[name]) }))
            .sort((a, b) => a.time.getTime() - b.time.getTime());
    }, [prayerTimesToUse]);

    const nextPrayer = useMemo(() => {
        if (sortedPrayerTimes.length === 0) return null;
        const now = currentTime.getTime();
        const futurePrayers = sortedPrayerTimes.filter(p => p.time.getTime() > now);
        
        if (futurePrayers.length > 0) {
            return futurePrayers[0];
        }
        // If no prayers left today, the next prayer is the first one tomorrow
        const tomorrowPrayer = { ...sortedPrayerTimes[0] };
        tomorrowPrayer.time.setDate(tomorrowPrayer.time.getDate() + 1);
        return tomorrowPrayer;
    }, [currentTime, sortedPrayerTimes]);
    
    const timeToNextPrayer = useMemo(() => {
        if (!nextPrayer) return '';
        let diff = nextPrayer.time.getTime() - currentTime.getTime();
        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        
        if (hours > 0) {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        }
        return `${String(minutes).padStart(2, '0')}:${String(Math.floor(totalSeconds % 60)).padStart(2, '0')}`;
    },[currentTime, nextPrayer]);
    
    // NEW: Effect for Dynamic Page Title
    useEffect(() => {
        const originalTitle = "Maw'id";
        const isJumatPrayer = isFriday && settings.enableFridayMode && activePrayer === 'Dhuhr';

        switch(displayState) {
            case DisplayState.Clock:
                if (nextPrayer) {
                    const nextPrayerName = isFriday && settings.enableFridayMode && nextPrayer.name === 'Dhuhr'
                        ? t('general.jummah')
                        : t(`prayerNames.${nextPrayer.name}`);
                    document.title = `${timeToNextPrayer} ${t('main.until')} ${nextPrayerName}`;
                } else {
                    document.title = originalTitle;
                }
                break;
            case DisplayState.PrayerTime:
                 if (activePrayer) {
                    const prayerName = isJumatPrayer ? t('general.jummah') : t(`prayerNames.${activePrayer}`);
                    document.title = `${t('main.prayerTime')} ${prayerName.toUpperCase()}`;
                }
                break;
            case DisplayState.IqamahCountdown:
                const minutes = String(Math.floor(countdown / 60)).padStart(2, '0');
                const seconds = String(countdown % 60).padStart(2, '0');
                document.title = `${t('main.iqamahIn')} ${minutes}:${seconds}`;
                break;
            case DisplayState.KhutbahInProgress:
                document.title = settings.khutbahMessageTitle || t('defaults.khutbah.title');
                break;
            case DisplayState.PrayerInProgress:
                document.title = t('main.prayerInProgress');
                break;
            case DisplayState.Dhikr:
                document.title = t('main.dhikr');
                break;
            default:
                document.title = originalTitle;
        }

        return () => {
            document.title = originalTitle;
        }

    }, [displayState, timeToNextPrayer, nextPrayer, activePrayer, countdown, isFriday, settings]);


    const playAlarm = (soundSrc: string) => {
        const audio = alarmAudioRef.current;
        audio.src = soundSrc;
        audio.play().catch(error => console.error("Audio playback failed:", error));
    };

    // BUG FIX #1: More efficient prayer time trigger using setTimeout
    useEffect(() => {
        let prayerTimer: ReturnType<typeof setTimeout>;

        if (displayState === DisplayState.Clock && nextPrayer) {
            const now = new Date();
            const timeToNextAdhan = nextPrayer.time.getTime() - now.getTime();
            
            if (timeToNextAdhan > 0) {
                prayerTimer = setTimeout(() => {
                    setActivePrayer(nextPrayer.name);
                    if (settings.enableAdhanAlarm) {
                        playAlarm(settings.adhanAlarmSound);
                    }
                    setDisplayState(DisplayState.PrayerTime);
                }, timeToNextAdhan);
            }
        }

        return () => {
            if (prayerTimer) {
                clearTimeout(prayerTimer);
            }
        };
    }, [nextPrayer, displayState, settings.enableAdhanAlarm, settings.adhanAlarmSound]);


    useEffect(() => {
        const isJumatPrayer = isFriday && settings.enableFridayMode && activePrayer === 'Dhuhr';

        if (displayState === DisplayState.PrayerTime && activePrayer) {
            const timer = setTimeout(() => {
                if (isJumatPrayer) {
                    setDisplayState(DisplayState.KhutbahInProgress);
                } else {
                    const iqamahOffset = settings.iqamahOffsets[activePrayer] * 60;
                    setCountdown(iqamahOffset);
                    setDisplayState(DisplayState.IqamahCountdown);
                }
            }, 10000); // 10 seconds timer
            return () => clearTimeout(timer);
        } else if (displayState === DisplayState.IqamahCountdown && activePrayer) {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                if (settings.enableIqamahAlarm) {
                    playAlarm(settings.iqamahAlarmSound);
                }
                setDisplayState(DisplayState.PrayerInProgress);
            }
        } else if (displayState === DisplayState.KhutbahInProgress) {
             const khutbahDurationMs = settings.fridayPrayerDuration * 60 * 1000;
             const timer = setTimeout(() => {
                setDisplayState(DisplayState.Clock);
                setActivePrayer(null);
            }, khutbahDurationMs);
            return () => clearTimeout(timer);
        } else if (displayState === DisplayState.PrayerInProgress && activePrayer) {
            const durationForCurrentPrayer = settings.prayerDurations[activePrayer] || 10;
            const prayerDurationMs = durationForCurrentPrayer * 60 * 1000;
            const timer = setTimeout(() => {
                // On Friday, Dhikr is skipped
                if (isJumatPrayer || !settings.enableDhikr || (settings.selectedDhikr?.length ?? 0) === 0) {
                    setDisplayState(DisplayState.Clock);
                    setActivePrayer(null);
                } else {
                    setDisplayState(DisplayState.Dhikr);
                }
            }, prayerDurationMs);
            return () => clearTimeout(timer);
        } else if (displayState === DisplayState.Dhikr) {
            const dhikrDurationMs = settings.dhikrDuration * 60 * 1000;
            const timer = setTimeout(() => {
                setDisplayState(DisplayState.Clock);
                setActivePrayer(null);
            }, dhikrDurationMs);
            return () => clearTimeout(timer);
        }
    }, [displayState, countdown, activePrayer, settings, isFriday]);
    
    const enabledSlides = useMemo(() => {
        return settings.slides.filter(s => {
            if (!s.enabled) return false;
            if (s.fridayOnly) {
                return isFriday && settings.enableFridayMode && settings.enableFridaySlides;
            }
            return true;
        });
    }, [settings.slides, isFriday, settings.enableFridayMode, settings.enableFridaySlides]);
    
     useEffect(() => {
        if (enabledSlides.length === 0) {
            if (displayMode !== 'clock') setDisplayMode('clock');
            return;
        }

        const validIndex = currentSlideIndex >= enabledSlides.length ? 0 : currentSlideIndex;
        if (validIndex !== currentSlideIndex) {
            setCurrentSlideIndex(validIndex);
            return;
        }

        let durationSeconds: number;
        if (displayMode === 'clock') {
            // Duration for the clock is determined by the *next* slide to be shown.
            durationSeconds = enabledSlides[validIndex].duration;
        } else {
            // Duration for the slide is determined by the *current* slide being shown.
            durationSeconds = enabledSlides[validIndex].duration;
        }

        const timer = setTimeout(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                if (displayMode === 'clock') {
                    setDisplayMode('slide');
                } else {
                    const nextIndex = (validIndex + 1) % enabledSlides.length;
                    setCurrentSlideIndex(nextIndex);
                    setDisplayMode('clock');
                }
                setIsTransitioning(false);
            }, 500); // Fade transition time
        }, (durationSeconds || 15) * 1000); // Use 15s as a fallback

        return () => clearTimeout(timer);

    }, [enabledSlides, displayMode, currentSlideIndex]);


    return (
        <div className={`w-full h-full flex justify-center items-center transition-opacity duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {displayState === DisplayState.Clock && displayMode === 'slide' && enabledSlides.length > 0 ? (
                <SlideDisplay slide={enabledSlides[currentSlideIndex]} />
            ) : (
                <MainClock
                    stale={stale}
                    displayState={displayState}
                    activePrayer={activePrayer}
                    countdown={countdown}
                    prayerTimes={prayerTimesToUse}
                    nextPrayer={nextPrayer}
                    timeToNextPrayer={timeToNextPrayer}
                    isFriday={isFriday}
                />
            )}
        </div>
    );
};

// This component handles the per-second background update.
// It accepts children which it will not re-render unless they change.
const DynamicBackgroundView: React.FC<{ 
    children: React.ReactNode; 
    prayerTimes: PrayerTimes | null;
}> = ({ children, prayerTimes }) => {
    const { settings } = useSettings();
    const { currentTime } = useClock();

    // Utility to convert hex to rgba for the glow effect
    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const activeWallpaper = useMemo(() => {
        if (!settings.enableContextualWallpapers || !prayerTimes) {
            return settings.wallpaper;
        }

        // Get today's prayer times as Date objects
        const todayPrayerMoments = IQAMAH_PRAYERS.map(name => ({
            name,
            date: parseTimeToDate(prayerTimes[name])
        }));

        // Get yesterday's Isha time to correctly handle the period after midnight
        const ishaTimeStr = prayerTimes['Isha'];
        if (!ishaTimeStr) return settings.wallpaper; // Safety check

        const yesterdayIsha = parseTimeToDate(ishaTimeStr);
        yesterdayIsha.setDate(yesterdayIsha.getDate() - 1);

        // Combine yesterday's Isha with today's prayers
        const allMoments = [
            { name: 'Isha' as PrayerName, date: yesterdayIsha },
            ...todayPrayerMoments
        ].sort((a, b) => a.date.getTime() - b.date.getTime());

        // Find all prayer times that have passed relative to the current time
        const pastOrCurrentMoments = allMoments.filter(p => p.date.getTime() <= currentTime.getTime());

        let currentPrayerPeriod: PrayerName = 'Isha'; // Default to Isha
        if (pastOrCurrentMoments.length > 0) {
            // The last prayer in the sorted list of past prayers determines the current period
            currentPrayerPeriod = pastOrCurrentMoments[pastOrCurrentMoments.length - 1].name;
        }

        return settings.contextualWallpapers[currentPrayerPeriod as keyof typeof settings.contextualWallpapers] || settings.wallpaper;
    }, [currentTime, prayerTimes, settings]);


    useEffect(() => {
        const root = document.documentElement;
        if (settings.theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        if (settings.accentColor) {
            root.style.setProperty('--accent-color', settings.accentColor);
            root.style.setProperty('--accent-glow-color', hexToRgba(settings.accentColor, 0.5));
        } else {
             root.style.setProperty('--accent-color', '#8B5CF6'); // Default purple
             root.style.setProperty('--accent-glow-color', 'rgba(139, 92, 246, 0.5)');
        }
    }, [settings.theme, settings.accentColor]);

    const backgroundStyle = useMemo(() => ({
        backgroundImage: activeWallpaper ? `url(${activeWallpaper})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }), [activeWallpaper]);

    return (
        <div 
            style={backgroundStyle} 
            className={`
                min-h-screen font-sans text-slate-800 dark:text-white 
                bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 
                transition-colors duration-500 w-full relative
                ${settings.enableBackgroundAnimation ? 'animate-aurora' : ''}
            `}
        >
            <div className="absolute inset-0 bg-black/20 z-0"></div>
            
            <div className="relative z-10 min-h-screen flex flex-col w-full">
                 {children}
            </div>
        </div>
    );
};

// This component holds the static layout parts of the main view.
// It is wrapped in React.memo to prevent re-renders when its parent (DynamicBackgroundView) updates.
const MainViewLayout: React.FC<{ 
    prayerTimes: PrayerTimes | null;
    stale: boolean;
    onSettingsClick: () => void; 
    onInfoClick: () => void;
}> = React.memo(({ prayerTimes, stale, onSettingsClick, onInfoClick }) => {
    return (
        <>
            <AppHeader onSettingsClick={onSettingsClick} onInfoClick={onInfoClick} />
            <main className="flex-grow flex flex-col p-4 gap-4 md:gap-8 relative justify-center items-center">
                 <TimeSensitiveContent prayerTimes={prayerTimes} stale={stale} />
            </main>
            <Footer />
        </>
    );
});

const AppContent = () => {
    const [currentView, setCurrentView] = useState<'main' | 'settings' | 'info'>('main');
    const { prayerTimes, stale } = usePrayerTimes();
    const { language } = useLanguage(); // Re-render on language change

    // This key forces a re-render of child components when language changes,
    // ensuring all text is updated correctly.
    const key = useMemo(() => language, [language]);

    switch (currentView) {
        case 'settings':
            return <SettingsPage key={key} onBack={() => setCurrentView('main')} />;
        case 'info':
            return <InfoPage key={key} onBack={() => setCurrentView('main')} />;
        default:
             return (
                <DynamicBackgroundView prayerTimes={prayerTimes}>
                    <MainViewLayout 
                        prayerTimes={prayerTimes}
                        stale={stale}
                        onSettingsClick={() => setCurrentView('settings')} 
                        onInfoClick={() => setCurrentView('info')} 
                    />
                </DynamicBackgroundView>
            );
    }
};

const App = () => (
    <LanguageProvider>
        <SettingsProvider>
            <AppContent />
        </SettingsProvider>
    </LanguageProvider>
);

export default App;
