import React, { useState, useEffect } from 'react';
import useClock from '../../hooks/useClock';
import { useSettings } from '../../contexts/SettingsContext';
import type { PrayerName, PrayerTimes } from '../../types';
// FIX: PRAYER_NAMES_ID is deprecated, using i18n's t() function instead.
import { t } from '../../i18n';

interface LayoutProps {
    prayerTimes: PrayerTimes | null;
    nextPrayer: { name: PrayerName; time: Date; } | null;
    timeToNextPrayer: string;
    isFriday: boolean;
}

const AnimatedDigit: React.FC<{ value: string }> = ({ value }) => {
    const tens = value[0];
    const units = value[1];
    return (
        <>
            <span key={`t-${tens}`} className="inline-block animate-fade-in w-[0.55em] text-center">{tens}</span>
            <span key={`u-${units}`} className="inline-block animate-fade-in w-[0.55em] text-center">{units}</span>
        </>
    );
};

export const MinimalistLayout: React.FC<LayoutProps> = ({
    prayerTimes,
    nextPrayer,
    timeToNextPrayer,
    isFriday
}) => {
    const { hours, minutes, formattedDay, formattedFullDate, formattedHijriDate } = useClock();
    const { settings } = useSettings();
    const [isShowingHijri, setIsShowingHijri] = useState(false);
    const [dateOpacity, setDateOpacity] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setDateOpacity(0);
            setTimeout(() => {
                setIsShowingHijri(prev => !prev);
                setDateOpacity(1);
            }, 300);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const dateToShow = isShowingHijri ? formattedHijriDate : formattedFullDate;
    // FIX: Replaced PRAYER_NAMES_ID with t() function for localization.
    const nextPrayerName = nextPrayer ? (isFriday && settings.enableFridayMode && nextPrayer.name === 'Dhuhr' ? t('general.jummah') : t(`prayerNames.${nextPrayer.name}`)) : '';

    // --- Portrait Layout ---
    if (settings.displayMode === 'portrait') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 gap-8">
                {/* Main Time & Date */}
                <div className="flex-shrink-0">
                    <h1 
                        className="font-mono font-bold tracking-tight text-shadow-lg text-[clamp(4rem,22vw,10rem)] leading-none flex items-baseline justify-center"
                        style={{textShadow: '3px 3px 25px rgba(0,0,0,0.6)'}}
                    >
                        <AnimatedDigit value={hours} />
                        <span className="animate-pulse">:</span>
                        <AnimatedDigit value={minutes} />
                    </h1>
                    <p className="text-[clamp(1rem,4vw,1.5rem)] tracking-wide text-slate-700 dark:text-white/90 mt-2">
                        <span className="transition-opacity duration-300" style={{ opacity: dateOpacity }}>
                            {formattedDay}, {dateToShow}
                        </span>
                    </p>
                </div>

                {/* Next Prayer Highlight */}
                {nextPrayer && (
                    <div className="text-center bg-black/20 backdrop-blur-md border-2 border-[var(--accent-color)] rounded-3xl p-6 animate-pulse-glow w-full max-w-sm">
                        <p className="text-base uppercase tracking-widest text-white font-bold" style={{ textShadow: '0 0 8px var(--accent-color), 0 0 4px rgba(0,0,0,0.6)' }}>
                            {t('main.upNext')}
                        </p>
                        <h2 className="text-[clamp(2rem,8vw,3.5rem)] font-bold my-1">{nextPrayerName}</h2>
                        <p className="font-mono font-bold text-[clamp(2.5rem,10vw,5rem)] leading-none my-2">{prayerTimes ? prayerTimes[nextPrayer.name] : '--:--'}</p>
                        <p className="font-mono text-lg opacity-80">{t('main.in')} {timeToNextPrayer}</p>
                    </div>
                )}
            </div>
        );
    }

    // --- Landscape Layout ---
    return (
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-center text-center p-4 md:p-8 gap-8 md:gap-12">
            {/* Main Time & Date */}
            <div className="flex-shrink-0">
                 <h1 
                    className="font-mono font-bold tracking-tight text-shadow-lg text-[clamp(4rem,22vw,10rem)] leading-none flex items-baseline justify-center"
                    style={{textShadow: '3px 3px 25px rgba(0,0,0,0.6)'}}
                >
                    <AnimatedDigit value={hours} />
                    <span className="animate-pulse">:</span>
                    <AnimatedDigit value={minutes} />
                </h1>
                <p className="text-[clamp(1rem,4vw,1.5rem)] tracking-wide text-slate-700 dark:text-white/90 mt-2">
                     <span className="transition-opacity duration-300" style={{ opacity: dateOpacity }}>
                        {formattedDay}, {dateToShow}
                    </span>
                </p>
            </div>

            {/* Next Prayer Highlight */}
            {nextPrayer && (
                <div className="text-center bg-black/20 backdrop-blur-md border-2 border-[var(--accent-color)] rounded-3xl p-6 md:p-8 animate-pulse-glow w-full max-w-sm md:w-auto">
                    <p className="text-base md:text-lg uppercase tracking-widest text-white font-bold" style={{ textShadow: '0 0 8px var(--accent-color), 0 0 4px rgba(0,0,0,0.6)' }}>
                        {t('main.upNext')}
                    </p>
                    <h2 className="text-[clamp(2rem,8vw,3.5rem)] font-bold my-1">{nextPrayerName}</h2>
                    <p className="font-mono font-bold text-[clamp(2.5rem,10vw,5rem)] leading-none my-2">{prayerTimes ? prayerTimes[nextPrayer.name] : '--:--'}</p>
                    <p className="font-mono text-lg md:text-xl opacity-80">{t('main.in')} {timeToNextPrayer}</p>
                </div>
            )}
        </div>
    );
};