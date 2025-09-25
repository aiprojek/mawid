import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const useClock = () => {
    const [time, setTime] = useState(new Date());
    const { language } = useLanguage();
    const locale = language === 'id' ? 'id-ID' : 'en-US';

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const formatDateParts = (date: Date) => {
        const day = new Intl.DateTimeFormat(locale, {
            weekday: 'long',
        }).format(date);
        
        const fullDate = new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);

        // Remove the day part from the full date string if it exists
        const justTheDate = fullDate.replace(day + ', ', '');

        return { day, date: justTheDate };
    };
    
    const formatHijriDate = (date: Date) => {
         try {
            // Use Intl API for accurate Hijri date conversion with Indonesian/English locale
            return new Intl.DateTimeFormat(`${locale}-u-ca-islamic`, {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(date);
        } catch (e) {
            // Fallback for older browsers or environments without full Intl support
            const day = date.getDate();
            const year = date.getFullYear();
            if (year < 622) return "Before Hijri";
            return "Hijri date unavailable";
        }
    };

    const { day, date } = formatDateParts(time);

    return {
        currentTime: time,
        formattedTime: formatTime(time),
        hours: String(time.getHours()).padStart(2, '0'),
        minutes: String(time.getMinutes()).padStart(2, '0'),
        seconds: String(time.getSeconds()).padStart(2, '0'),
        formattedDay: day,
        formattedFullDate: date,
        formattedHijriDate: formatHijriDate(time),
    };
};

export default useClock;
