import React, { useMemo } from 'react';
import useClock from '../../hooks/useClock';
import { useSettings } from '../../contexts/SettingsContext';
import type { PrayerName, PrayerTimes, ScheduleSlide, FinanceSlide } from '../../types';
import { PRAYER_NAMES } from '../../constants';
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

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const DashboardInfoLayout: React.FC<LayoutProps> = ({
    prayerTimes,
    nextPrayer,
    timeToNextPrayer,
    isFriday
}) => {
    const { hours, minutes, seconds, formattedDay, formattedFullDate, formattedHijriDate } = useClock();
    const { settings } = useSettings();

    const scheduleSlide = useMemo(() => settings.slides.find(s => s.type === 'schedule' && s.enabled) as ScheduleSlide | undefined, [settings.slides]);
    const financeSlide = useMemo(() => settings.slides.find(s => s.type === 'finance' && s.enabled) as FinanceSlide | undefined, [settings.slides]);

    const nextPrayerName = nextPrayer ? (isFriday && settings.enableFridayMode && nextPrayer.name === 'Dhuhr' ? t('general.jummah') : t(`prayerNames.${nextPrayer.name}`)) : '';

    const isPortrait = settings.displayMode === 'portrait';

    return (
        <div className={`w-full h-full p-4 grid ${isPortrait ? 'grid-cols-1 grid-rows-3' : 'grid-cols-3 grid-rows-2'} gap-4`}>
            {/* Main Clock & Next Prayer */}
            <div className={`bg-black/20 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-center items-center text-center ${isPortrait ? 'row-span-1' : 'col-span-2 row-span-1'}`}>
                <h1 className="font-mono font-bold tracking-tight text-shadow-lg text-[clamp(3rem,15vw,8rem)] leading-none flex items-baseline justify-center">
                    <AnimatedDigit value={hours} />
                    <span>:</span>
                    <AnimatedDigit value={minutes} />
                    <span className="text-[clamp(1rem,4vw,2rem)] w-auto px-2">:
                        <AnimatedDigit value={seconds} />
                    </span>
                </h1>
                <p className="text-lg md:text-xl">{formattedDay}, {formattedFullDate}</p>
                <p className="text-md md:text-lg text-white/80">{formattedHijriDate}</p>
                
                {nextPrayer && (
                     <div className="mt-4 border-t border-white/20 pt-4 w-full max-w-sm">
                        <p className="text-sm uppercase tracking-widest text-[var(--accent-color)] font-bold">{t('main.upNext')}</p>
                        <h2 className="text-3xl font-bold">{nextPrayerName}</h2>
                        <p className="font-mono text-xl">{t('main.in')} {timeToNextPrayer}</p>
                    </div>
                )}
            </div>

            {/* All Prayer Times */}
            <div className={`bg-black/20 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-center ${isPortrait ? 'row-span-1' : 'col-span-1 row-span-2'}`}>
                <h2 className="text-2xl font-bold text-center mb-4">{t('main.otherPrayerTimes')}</h2>
                <div className="space-y-2 flex-grow flex flex-col justify-evenly">
                    {PRAYER_NAMES.map(name => {
                        const isNext = name === nextPrayer?.name;
                        const time = prayerTimes ? prayerTimes[name] : '--:--';
                        const displayName = isFriday && settings.enableFridayMode && name === 'Dhuhr' ? t('general.jummah') : t(`prayerNames.${name}`);
                        return (
                            <div key={name} className={`flex justify-between items-center p-2 rounded-lg ${isNext ? 'bg-[var(--accent-color)]/50' : ''}`}>
                                <span className="font-semibold text-lg">{displayName}</span>
                                <span className="font-mono font-bold text-xl">{time}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Schedule Info */}
            <div className={`bg-black/20 backdrop-blur-md rounded-2xl p-4 flex flex-col ${isPortrait ? 'row-span-1' : 'col-span-1 row-span-1'}`}>
                <h2 className="text-2xl font-bold text-center mb-2">{scheduleSlide?.title || t('settings.slides.type.schedule')}</h2>
                {scheduleSlide && scheduleSlide.scheduleItems.length > 0 ? (
                    <div className="space-y-3 overflow-y-auto">
                        {scheduleSlide.scheduleItems.map(item => (
                            <div key={item.id} className="p-3 bg-black/20 rounded-lg">
                                <p className="font-bold text-lg text-[var(--accent-color)]">{item.topic}</p>
                                <p className="text-white/90">{item.speaker}</p>
                                <p className="text-sm text-white/70">{item.day}, {item.time}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-white/70 flex-grow flex items-center justify-center">{t('general.noContent')}</p>
                )}
            </div>
            
            {/* Finance Info */}
            <div className={`bg-black/20 backdrop-blur-md rounded-2xl p-4 flex-col ${isPortrait ? 'hidden' : 'col-span-1 row-span-1 flex'}`}>
                 <h2 className="text-2xl font-bold text-center mb-2">{financeSlide?.financeInfo.title || t('settings.slides.type.finance')}</h2>
                 {financeSlide ? (
                     <div className="space-y-2 text-center flex-grow flex flex-col justify-center">
                        <div>
                             <p className="text-sm uppercase text-white/70">{t('settings.slides.finance.income')}</p>
                             <p className="font-mono text-2xl font-bold text-green-400">{formatCurrency(financeSlide.financeInfo.income)}</p>
                        </div>
                         <div>
                             <p className="text-sm uppercase text-white/70">{t('settings.slides.finance.expense')}</p>
                             <p className="font-mono text-2xl font-bold text-red-400">{formatCurrency(financeSlide.financeInfo.expense)}</p>
                        </div>
                         <div className="pt-2 border-t border-white/20 mt-2">
                             <p className="text-md uppercase text-white/80">{t('settings.slides.finance.finalBalance')}</p>
                             <p className="font-mono text-3xl font-bold text-[var(--accent-color)]">{formatCurrency(financeSlide.financeInfo.currentBalance)}</p>
                            </div>
                         </div>
                     ) : (
                         <p className="text-center text-white/70 flex-grow flex items-center justify-center">{t('general.noContent')}</p>
                     )}
                </div>
            </div>
        );
    };