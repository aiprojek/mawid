import React, { useState, useEffect } from 'react';
import useClock from '../../hooks/useClock';
import { useSettings } from '../../contexts/SettingsContext';
import type { PrayerName, PrayerTimes } from '../../types';
import { PRAYER_NAMES, IQAMAH_PRAYERS } from '../../constants';
import { t } from '../../i18n';

interface LayoutProps {
    prayerTimes: PrayerTimes | null;
    nextPrayer: { name: PrayerName; time: Date; } | null;
    timeToNextPrayer: string;
    stale: boolean;
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

export const FocusClockLayout: React.FC<LayoutProps> = ({
    prayerTimes,
    nextPrayer,
    timeToNextPrayer,
    stale,
    isFriday
}) => {
    const { hours, minutes, seconds, formattedDay, formattedFullDate, formattedHijriDate } = useClock();
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
    const staleClass = stale ? 'opacity-50' : 'opacity-100';

    if (settings.displayMode === 'portrait') {
        const upcomingPrayers = PRAYER_NAMES.filter(p => p !== nextPrayer?.name && p !== 'Sunrise');
        const nextPrayerName = nextPrayer ? (isFriday && settings.enableFridayMode && nextPrayer.name === 'Dhuhr' ? t('general.jummah') : t(`prayerNames.${nextPrayer.name}`)) : '';

        return (
            <div className={`w-full h-full flex flex-col items-center justify-evenly p-4 gap-6 transition-opacity duration-300 ${staleClass}`}>
                <div className="text-center">
                    <h1 
                        className="font-mono font-bold tracking-tighter text-shadow-lg text-[clamp(3rem,18vh,6rem)] leading-none flex items-baseline justify-center py-2"
                        style={{textShadow: '3px 3px 15px rgba(0,0,0,0.5)'}}
                    >
                        <AnimatedDigit value={hours} />
                        <span>:</span>
                        <AnimatedDigit value={minutes} />
                        <span className="text-[clamp(1.2rem,4vh,1.75rem)] w-auto px-2">:
                            <AnimatedDigit value={seconds} />
                        </span>
                    </h1>
                    <div className="flex justify-center items-center gap-2 text-[clamp(0.9rem,3vh,1.5rem)] tracking-wide text-slate-700 dark:text-white/90 mt-2">
                        <span className="transition-opacity duration-300" style={{ opacity: dateOpacity }}>
                            {formattedDay}, {dateToShow}
                        </span>
                    </div>
                </div>

                <div className="w-full max-w-md mx-auto">
                    {nextPrayer && (
                        <div className="text-center bg-white/10 dark:bg-black/20 backdrop-blur-md border border-[var(--accent-color)] rounded-3xl p-6 animate-pulse-glow">
                            <p className="text-sm uppercase tracking-widest text-white font-bold" style={{ textShadow: '0 0 8px var(--accent-color), 0 0 4px rgba(0,0,0,0.6)' }}>
                                {t('main.upNext')}
                            </p>
                            <h2 className="text-[clamp(2rem,8vw,3.5rem)] font-bold my-1">{nextPrayerName}</h2>
                            <p className="font-mono font-bold text-[clamp(2.5rem,10vw,5rem)] leading-none my-2">{prayerTimes ? prayerTimes[nextPrayer.name] : '--:--'}</p>
                            <p className="font-mono text-lg opacity-80">{t('main.in')} {timeToNextPrayer}</p>
                        </div>
                    )}
                </div>
        
                <div className="w-full max-w-md mx-auto">
                    <h3 className="text-center mb-3 text-lg font-semibold opacity-80">{t('main.otherPrayerTimes')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {upcomingPrayers.map(name => {
                            const displayName = isFriday && settings.enableFridayMode && name === 'Dhuhr' ? t('general.jummah') : t(`prayerNames.${name}`);
                            const showIqamah = !(isFriday && settings.enableFridayMode && name === 'Dhuhr');
                            return (
                                <div key={name} className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/10 dark:border-white/10 text-center">
                                    <p className="font-semibold text-base text-slate-800 dark:text-white/90">{displayName}</p>
                                    <p className="font-mono font-bold text-2xl my-1 text-slate-800 dark:text-white">{prayerTimes ? prayerTimes[name] : '--:--'}</p>
                                    {showIqamah && (
                                        <p className="text-xs text-slate-600 dark:text-slate-300/80">{t('main.iqamahOffset', { minutes: settings.iqamahOffsets[name].toString() })}</p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={`w-full h-full flex flex-col items-center justify-evenly p-2 md:p-4 gap-8 transition-opacity duration-300 ${staleClass}`}>
                <div className="text-center">
                    <h1 
                        className="font-mono font-bold tracking-tight text-shadow-lg text-[clamp(5rem,25vh,15rem)] leading-none flex items-baseline justify-center"
                        style={{textShadow: '3px 3px 25px rgba(0,0,0,0.6)'}}
                    >
                        <AnimatedDigit value={hours} />
                        <span>:</span>
                        <AnimatedDigit value={minutes} />
                        <span className="text-[clamp(1.5rem,6vh,4rem)] w-auto px-2 md:px-4">:
                            <AnimatedDigit value={seconds} />
                        </span>
                    </h1>
                    <div className="flex justify-center items-center gap-2 text-[clamp(1rem,4vh,2rem)] tracking-wide text-slate-700 dark:text-white/90 mt-1">
                        <span className="transition-opacity duration-300" style={{ opacity: dateOpacity }}>
                            {formattedDay}, {dateToShow}
                        </span>
                    </div>
                </div>
        
                <div className="w-full max-w-7xl mx-auto">
                    <div className="grid grid-cols-6 gap-2 md:gap-4 bg-black/10 backdrop-blur-lg p-2 md:p-3 rounded-2xl md:rounded-3xl border border-white/10 dark:border-white/20">
                        {PRAYER_NAMES.map(name => {
                            const isNext = name === nextPrayer?.name;
                            const time = prayerTimes ? prayerTimes[name] : '--:--';
                            const displayName = isFriday && settings.enableFridayMode && name === 'Dhuhr' ? t('general.jummah') : t(`prayerNames.${name}`);
        
                            return (
                                <div key={name} className={`p-3 rounded-2xl text-center transition-all duration-300 ${isNext ? 'bg-[var(--accent-color)]/50 border border-[var(--accent-color)] animate-pulse-glow' : 'bg-white/5 dark:bg-black/10'}`}>
                                    <p className={`font-semibold text-[clamp(0.7rem,2.5vw,1.2rem)] ${isNext ? 'text-white' : 'text-slate-700 dark:text-white/80'}`}>{displayName}</p>
                                    <p className={`font-mono font-bold text-[clamp(1.2rem,4vw,2.2rem)] mt-1 ${isNext ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{time}</p>
                                    {isNext && name !== 'Sunrise' && (
                                        <p className="text-white/90 text-xs mt-1 opacity-90">
                                            {t('main.in')} <span className="font-mono">{timeToNextPrayer}</span>
                                        </p>
                                    )}
                                    {!isNext && IQAMAH_PRAYERS.includes(name) && !(isFriday && settings.enableFridayMode && name === 'Dhuhr') && (
                                        <p className="text-xs mt-1 text-slate-700 dark:text-white/80 opacity-90">
                                            {t('main.iqamahOffset', { minutes: settings.iqamahOffsets[name].toString() })}
                                        </p>
                                    )}
                                </div>
                            );
                         })}
                    </div>
                </div>
            </div>
        );
    }
};
