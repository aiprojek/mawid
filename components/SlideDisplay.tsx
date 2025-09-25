import React, { useState, useEffect } from 'react';
import type { Slide, QRCodePosition, TextSlide, ScheduleItem } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { t } from '../i18n';
import { useLanguage } from '../contexts/LanguageContext';

// Deklarasikan Recharts yang dimuat dari CDN agar TypeScript mengetahuinya
declare const Recharts: any;

// --- NEW Schedule Card Icons ---
const SpeakerIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const BookOpenIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>);
const ClockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);


interface SlideDisplayProps {
    slide: Slide;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

// NEW: Helper function to format the update date
const useFormatUpdateDate = () => {
    const { language } = useLanguage();
    const locale = language === 'id' ? 'id-ID' : 'en-US';

    return (isoString?: string): string | null => {
        if (!isoString) return null;
        try {
            const date = new Date(isoString);
            const gregorianDate = new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(date);

            const hijriDate = new Intl.DateTimeFormat(`${locale}-u-ca-islamic`, {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(date);
            
            return `${gregorianDate} / ${hijriDate}`;
        } catch (e) {
            console.error("Error formatting date:", e);
            return null;
        }
    };
};

const getQrCodePositionClass = (position?: QRCodePosition) => {
    switch (position) {
        case 'top-left':
            return 'top-4 left-4';
        case 'top-right':
            return 'top-4 right-4';
        case 'bottom-left':
            return 'bottom-4 left-4';
        case 'bottom-right':
            return 'bottom-4 right-4';
        default:
            return 'bottom-4 right-4'; // Default position
    }
};

const QRCodeDisplay: React.FC<{ slide: Slide }> = ({ slide }) => {
    if (!slide.qrCodeUrl) return null;

    const positionClass = getQrCodePositionClass(slide.qrCodePosition);

    return (
        <div className={`absolute ${positionClass} z-20 p-2 bg-white rounded-lg shadow-2xl w-28 h-28 md:w-40 md:h-40`}>
            <img src={slide.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
        </div>
    );
};

// Component for a single schedule card
const ScheduleCard: React.FC<{ item: ScheduleItem }> = ({ item }) => (
    <div className="bg-gradient-to-br from-black/30 to-black/40 p-6 rounded-2xl border border-white/20 shadow-lg flex flex-col gap-4 w-full max-w-md">
        <div className="flex items-start gap-4">
            <div className="text-[var(--accent-color)] mt-1"><BookOpenIcon/></div>
            <div>
                <p className="text-sm uppercase text-white/70 tracking-wider">{t('settings.slides.schedule.topic')}</p>
                <h2 className="text-2xl font-bold text-white">{item.topic}</h2>
            </div>
        </div>
        <div className="flex items-start gap-4">
            <div className="text-[var(--accent-color)] mt-1"><SpeakerIcon/></div>
            <div>
                <p className="text-sm uppercase text-white/70 tracking-wider">{t('settings.slides.schedule.speaker')}</p>
                <h3 className="text-xl font-medium text-white/90">{item.speaker}</h3>
            </div>
        </div>
        <div className="flex items-start gap-4 mt-2 pt-4 border-t border-white/20">
            <div className="text-[var(--accent-color)] mt-1"><ClockIcon/></div>
            <div>
                <p className="text-sm uppercase text-white/70 tracking-wider">{t('settings.slides.schedule.time')}</p>
                <p className="text-xl font-semibold text-white/90">{item.day}, {item.time}</p>
            </div>
        </div>
    </div>
);


// NEW: Carousel component for schedule items
const ScheduleCarousel: React.FC<{ items: ScheduleItem[] }> = ({ items }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (items.length <= 1) return;

        const timer = setInterval(() => {
            setActiveIndex(prevIndex => (prevIndex + 1) % items.length);
        }, 5000); // Rotate every 5 seconds

        return () => clearInterval(timer);
    }, [items.length]);

    return (
        <div className="relative w-full h-[400px] mt-8 flex items-center justify-center">
            {items.map((item, index) => {
                const totalItems = items.length;
                let offset = index - activeIndex;

                // Handle circular wrapping
                if (offset > totalItems / 2) {
                    offset -= totalItems;
                }
                if (offset < -totalItems / 2) {
                    offset += totalItems;
                }

                const isActive = offset === 0;
                const isAdjacent = Math.abs(offset) === 1;

                const style: React.CSSProperties = {
                    transform: `translateX(${offset * 60}%) scale(${isActive ? 1 : 0.75})`,
                    opacity: isActive ? 1 : (isAdjacent ? 0.5 : 0),
                    zIndex: isActive ? 10 : 0,
                    pointerEvents: isActive ? 'auto' : 'none',
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                };
                
                return (
                    <div
                        key={item.id}
                        className="absolute w-full flex justify-center"
                        style={style}
                    >
                        <ScheduleCard item={item} />
                    </div>
                );
            })}
        </div>
    );
};


export const SlideDisplay: React.FC<SlideDisplayProps> = ({ slide }) => {
    const { settings } = useSettings();
    const formatUpdateDate = useFormatUpdateDate();

    if (!slide) return null;

    const renderSlideContent = () => {
        // Tampilan baru dengan grafik jika Recharts berhasil dimuat
        if (slide.type === 'finance' && typeof Recharts !== 'undefined') {
            const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Label } = Recharts;
            const { title, lastBalance, income, expense, currentBalance, donationTarget, lastUpdated } = slide.financeInfo;
            const formattedLastUpdated = formatUpdateDate(lastUpdated);

            const barChartData = [{ name: 'Ringkasan', Pemasukan: income, Pengeluaran: expense }];
            const hasDonationTarget = donationTarget && donationTarget > 0;
            
            const collectedAmount = Math.max(0, income || 0);
            const progress = hasDonationTarget ? (collectedAmount / donationTarget) * 100 : 0;
            const pieData = hasDonationTarget ? [
                { name: 'Terkumpul', value: collectedAmount },
                { name: 'Sisa', value: Math.max(0, donationTarget - collectedAmount) },
            ] : [];

            const PIE_COLORS = ['var(--accent-color, #8B5CF6)', '#475569'];

            return (
                <div className="w-full flex flex-col justify-center items-center p-4 md:p-8">
                    <div className="w-full max-w-6xl bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-6xl font-bold text-shadow-lg" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>
                                {title}
                            </h1>
                            {formattedLastUpdated && (
                                <p className="text-lg md:text-xl text-white/80 font-normal mt-4 mb-8">
                                    {formattedLastUpdated}
                                </p>
                            )}
                        </div>
                        <div className={`grid grid-cols-1 ${hasDonationTarget ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
                            <div className="lg:col-span-1 bg-black/20 p-4 rounded-lg flex flex-col justify-center">
                                <h2 className="text-xl font-bold text-center mb-4 text-white/90">Pemasukan vs Pengeluaran</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                                        <XAxis dataKey="name" tick={{ fill: 'white' }} />
                                        <YAxis tickFormatter={(value) => new Intl.NumberFormat('id-ID', {notation: 'compact'}).format(value)} tick={{ fill: 'white' }} />
                                        <Tooltip
                                            formatter={(value: any) => formatCurrency(value as number)}
                                            contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '0.5rem' }}
                                            labelStyle={{ color: 'white' }}
                                            cursor={{fill: 'rgba(255,255,255,0.1)'}}
                                        />
                                        <Legend wrapperStyle={{ color: 'white' }} />
                                        <Bar dataKey="Pemasukan" fill="#22c55e" radius={[4, 4, 0, 0]}/>
                                        <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]}/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="lg:col-span-1 flex flex-col justify-center gap-4">
                                <div className="bg-black/20 p-4 rounded-lg text-center">
                                    <p className="text-lg md:text-xl uppercase text-white/70">{t('settings.slides.finance.initialBalance')}</p>
                                    <p className="text-2xl md:text-4xl font-bold font-mono">{formatCurrency(lastBalance)}</p>
                                </div>
                                <div className="bg-[var(--accent-color)]/30 p-6 rounded-lg text-center">
                                    <p className="text-xl md:text-2xl uppercase text-white/80">{t('settings.slides.finance.finalBalance')}</p>
                                    <p className="text-4xl md:text-6xl font-bold font-mono">{formatCurrency(currentBalance)}</p>
                                </div>
                            </div>
                            {hasDonationTarget && (
                                <div className="lg:col-span-1 bg-black/20 p-4 rounded-lg flex flex-col justify-center">
                                    <h2 className="text-xl font-bold text-center mb-1 text-white/90">{t('settings.slides.finance.donationTarget')}</h2>
                                    <p className="text-center text-lg font-mono text-white/80 mb-2">{formatCurrency(donationTarget!)}</p>
                                    <ResponsiveContainer width="100%" height={260}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                                animationBegin={200}
                                                animationDuration={800}
                                            >
                                                {pieData.map((_entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke={PIE_COLORS[index % PIE_COLORS.length]}/>
                                                ))}
                                                <Label value={`${progress.toFixed(0)}%`} position="center" fill="white" className="text-3xl font-bold"/>
                                            </Pie>
                                            <Tooltip formatter={(value: any) => formatCurrency(value as number)} />
                                            <Legend wrapperStyle={{ color: 'white', paddingTop: '10px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {hasDonationTarget && collectedAmount < donationTarget && (
                                        <div className="mt-4 text-center">
                                            <p className="text-lg text-white/90">Dana yang masih dibutuhkan:</p>
                                            <p className="text-2xl font-bold font-mono text-[var(--accent-color)]">{formatCurrency(donationTarget - collectedAmount)}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        switch (slide.type) {
            case 'image':
                return (
                    <div className="w-full flex items-center justify-center p-4">
                        <img
                            src={slide.imageUrl}
                            alt={'Slide Image'}
                            className={`max-w-full max-h-full object-contain rounded-lg shadow-lg ${
                                settings.displayMode === 'portrait' ? 'w-full h-auto' : 'h-full w-auto'
                            }`}
                        />
                    </div>
                );

            case 'schedule':
                 const useCarousel = slide.scheduleItems.length > 3;
                return (
                    <div className="w-full flex flex-col justify-center items-center p-8">
                        <div className="w-full max-w-7xl mx-auto">
                            <h1 className="text-4xl md:text-6xl font-bold text-white text-shadow-lg mb-8 text-center" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>
                                {slide.title}
                            </h1>
                            {useCarousel ? (
                                <ScheduleCarousel items={slide.scheduleItems} />
                            ) : (
                                <div className="flex flex-wrap justify-center gap-6">
                                    {slide.scheduleItems.map(item => (
                                        <div key={item.id} className="transform hover:scale-105 transition-transform duration-300 md:basis-[45%] xl:basis-[31%] flex-grow">
                                            <ScheduleCard item={item} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'finance': // Fallback jika Recharts tidak ada
                const { title, lastBalance, income, expense, currentBalance, donationTarget, lastUpdated } = slide.financeInfo;
                const collectedAmount = Math.max(0, income || 0);
                const progress = donationTarget && donationTarget > 0 ? (collectedAmount / donationTarget) * 100 : 0;
                const formattedLastUpdated = formatUpdateDate(lastUpdated);
                const hasDonationTarget = donationTarget && donationTarget > 0;

                return (
                    <div className="w-full flex flex-col justify-center items-center p-8">
                        <div className="w-full max-w-5xl bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <div className="text-center">
                                <h1 className="text-4xl md:text-6xl font-bold text-shadow-lg" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>
                                    {title}
                                </h1>
                                {formattedLastUpdated && (
                                    <p className="text-lg md:text-xl text-white/80 font-normal mt-4 mb-8">
                                        {formattedLastUpdated}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="bg-black/20 p-4 rounded-lg">
                                    <p className="text-lg md:text-xl uppercase text-white/70">{t('settings.slides.finance.initialBalance')}</p>
                                    <p className="text-2xl md:text-4xl font-bold">{formatCurrency(lastBalance)}</p>
                                </div>
                                <div className="bg-green-500/30 p-4 rounded-lg">
                                    <p className="text-lg md:text-xl uppercase text-white/80">{t('settings.slides.finance.income')}</p>
                                    <p className="text-2xl md:text-4xl font-bold">{formatCurrency(income)}</p>
                                </div>
                                <div className="bg-red-500/30 p-4 rounded-lg">
                                    <p className="text-lg md:text-xl uppercase text-white/80">{t('settings.slides.finance.expense')}</p>
                                    <p className="text-2xl md:text-4xl font-bold">{formatCurrency(expense)}</p>
                                </div>
                            </div>
                            <div className="mt-6 bg-[var(--accent-color)]/30 p-6 rounded-lg text-center">
                                 <p className="text-xl md:text-2xl uppercase text-white/80">{t('settings.slides.finance.finalBalance')}</p>
                                 <p className="text-4xl md:text-6xl font-bold">{formatCurrency(currentBalance)}</p>
                            </div>
                            {hasDonationTarget && (
                                <div className="mt-6">
                                    <div className="flex justify-between items-center mb-2 text-lg">
                                        <span>{t('settings.slides.finance.donationTarget')}</span>
                                        <span>{formatCurrency(donationTarget)}</span>
                                    </div>
                                    <div className="w-full bg-black/30 rounded-full h-6">
                                        <div 
                                            className="bg-[var(--accent-color)] h-6 rounded-full text-center text-white font-bold flex items-center justify-center"
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        >
                                           {progress.toFixed(0)}%
                                        </div>
                                    </div>
                                     {collectedAmount < donationTarget && (
                                        <div className="mt-4 text-center">
                                            <p className="text-lg text-white/90">Dana yang masih dibutuhkan:</p>
                                            <p className="text-2xl font-bold font-mono text-[var(--accent-color)]">{formatCurrency(donationTarget - collectedAmount)}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'text':
            default:
                const isSideQr = slide.qrCodeUrl && (slide.qrCodePosition === 'side-left' || slide.qrCodePosition === 'side-right');

                const QrComponent = () => (
                    <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-2xl w-48 h-48 md:w-56 md:h-56">
                        <img src={slide.qrCodeUrl!} alt="QR Code" className="w-full h-full object-contain" />
                    </div>
                );

                const TextComponent = () => (
                     <div className={`w-full ${isSideQr ? 'max-w-3xl text-left' : 'max-w-5xl text-center'}`}>
                        {slide.title && (
                            <h1 className="text-4xl md:text-6xl font-bold text-shadow-lg mb-4" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>
                                {slide.title}
                            </h1>
                        )}
                        <div 
                            className="ql-editor text-xl md:text-3xl text-slate-800 dark:text-white/90 text-shadow" 
                            style={{textShadow: '1px 1px 5px rgba(0,0,0,0.7)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: 'none', border: 'none' }}
                            dangerouslySetInnerHTML={{ __html: slide.content || '' }} 
                        />
                    </div>
                );
                
                if (isSideQr) {
                     return (
                        <div className="w-full flex justify-center items-center p-8 gap-8">
                             {slide.qrCodePosition === 'side-left' && <QrComponent />}
                             <TextComponent />
                             {slide.qrCodePosition === 'side-right' && <QrComponent />}
                        </div>
                    )
                }

                return (
                    <div className="w-full flex flex-col justify-center items-center p-8">
                        <TextComponent />
                    </div>
                );
        }
    };

    const isSideQr = slide.type === 'text' && slide.qrCodeUrl && (slide.qrCodePosition === 'side-left' || slide.qrCodePosition === 'side-right');

    return (
        <div className="w-full max-h-full relative overflow-y-auto">
            {renderSlideContent()}
            {!isSideQr && <QRCodeDisplay slide={slide} />}
        </div>
    );
};
