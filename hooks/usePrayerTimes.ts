import { useState, useEffect } from 'react';
import type { PrayerTimes } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { PRAYER_NAMES } from '../constants';
import { t } from '../i18n';

const usePrayerTimes = () => {
    const { settings } = useSettings();
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stale, setStale] = useState(false); // UX Improvement: for graceful loading

    useEffect(() => {
        const fetchPrayerTimes = async () => {
            if (settings.useManualTimes) {
                setPrayerTimes(settings.manualPrayerTimes);
                setLoading(false);
                setError(null);
                setStale(false);
                return;
            }

            // UX Improvement: Indicate that data is being refreshed, but don't clear old data
            if (prayerTimes) {
                setStale(true);
            } else {
                setLoading(true);
            }
            setError(null);

            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1; // getMonth() is 0-indexed
            const day = now.getDate();

            const cacheKey = `prayerTimesCache-${settings.city}-${year}-${month}`;

            try {
                // 1. Coba dapatkan dari cache terlebih dahulu
                const cachedData = localStorage.getItem(cacheKey);
                let monthlyData: any[] | null = null;

                if (cachedData) {
                    monthlyData = JSON.parse(cachedData);
                } else {
                    // 2. Jika tidak ada di cache, ambil dari API
                    // Bersihkan cache lama sebelum mengambil yang baru
                    Object.keys(localStorage).forEach(key => {
                        if (key.startsWith('prayerTimesCache-')) {
                            localStorage.removeItem(key);
                        }
                    });

                    const tuneString = PRAYER_NAMES.map(name => settings.adjustments[name] || 0).join(',');
                    let apiUrl = `https://api.aladhan.com/v1/calendarByCity?city=${settings.city}&country=Indonesia&method=${settings.calculationMethod}&month=${month}&year=${year}&school=${settings.madhab}&latitudeAdjustmentMethod=${settings.highLatitudeRule}&tune=${tuneString}`;

                    if (settings.calculationMethod === 99) {
                        apiUrl += `&methodSettings=${settings.fajrAngle},,${settings.ishaAngle}`;
                    }
                    
                    const response = await fetch(apiUrl);

                    if (!response.ok) {
                        throw new Error(`API error: ${response.statusText}`);
                    }
                    const data = await response.json();

                    if (data.code === 200 && data.data) {
                        monthlyData = data.data;
                        localStorage.setItem(cacheKey, JSON.stringify(monthlyData));
                    } else {
                        throw new Error(data.data || data.status || 'Could not fetch prayer times.');
                    }
                }

                // 3. Ekstrak waktu shalat hari ini dari data bulanan
                const todayData = monthlyData?.find(d => parseInt(d.date.gregorian.day, 10) === day);

                if (todayData) {
                    const timings = todayData.timings;
                    const formattedTimes: PrayerTimes = {
                        Fajr: timings.Fajr.split(' ')[0],
                        Sunrise: timings.Sunrise.split(' ')[0],
                        Dhuhr: timings.Dhuhr.split(' ')[0],
                        Asr: timings.Asr.split(' ')[0],
                        Maghrib: timings.Maghrib.split(' ')[0],
                        Isha: timings.Isha.split(' ')[0],
                    };
                    setPrayerTimes(formattedTimes);
                } else {
                     throw new Error(t('main.error') + ` (${day}/${month}/${year})`);
                }
            } catch (err) {
                 // Jika terjadi error (misal, offline), coba gunakan cache lama jika ada
                const anyCache = Object.keys(localStorage).find(key => key.startsWith('prayerTimesCache-'));
                if (anyCache && localStorage.getItem(anyCache)) {
                    try {
                        const oldMonthlyData = JSON.parse(localStorage.getItem(anyCache)!);
                        // Coba temukan hari ini di cache lama (mungkin tidak ada)
                        const todayInOldData = oldMonthlyData?.find((d: any) => parseInt(d.date.gregorian.day, 10) === day && parseInt(d.date.gregorian.month.number, 10) === month);
                         if (todayInOldData) {
                            const timings = todayInOldData.timings;
                            const formattedTimes: PrayerTimes = {
                                Fajr: timings.Fajr.split(' ')[0],
                                Sunrise: timings.Sunrise.split(' ')[0],
                                Dhuhr: timings.Dhuhr.split(' ')[0],
                                Asr: timings.Asr.split(' ')[0],
                                Maghrib: timings.Maghrib.split(' ')[0],
                                Isha: timings.Isha.split(' ')[0],
                            };
                            setPrayerTimes(formattedTimes);
                            setError(t('main.error'));
                        } else {
                             throw err; // Lemparkan error asli jika hari ini tidak ada di cache lama
                        }
                    } catch (finalError) {
                         if (err instanceof Error) {
                            setError(err.message);
                        } else {
                            setError(t('main.error'));
                        }
                        setPrayerTimes(null);
                    }
                } else {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError(t('main.error'));
                    }
                    setPrayerTimes(null);
                }
            } finally {
                setLoading(false);
                setStale(false);
            }
        };

        fetchPrayerTimes();
    }, [
        settings.city, 
        settings.calculationMethod, 
        settings.useManualTimes, 
        settings.manualPrayerTimes,
        settings.madhab,
        settings.highLatitudeRule,
        settings.fajrAngle,
        settings.ishaAngle,
        settings.adjustments
    ]);

    return { prayerTimes, loading, error, stale };
};

export default usePrayerTimes;
