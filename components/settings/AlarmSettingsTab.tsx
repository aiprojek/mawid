import React from 'react';
import type { Settings, Dhikr } from '../../types';
import { CollapsibleSection, Input, Checkbox, SoundPicker, Select } from './Shared';
import { IQAMAH_PRAYERS } from '../../constants';
import { t } from '../../i18n';

const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
    </svg>
);

const ArrowDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
    </svg>
);

interface AlarmSettingsTabProps {
    localSettings: Settings;
    setLocalSettings: React.Dispatch<React.SetStateAction<Settings>>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleNestedChange: (category: keyof Settings, key: string, value: string | number) => void;
    handleDhikrSelectionChange: (dhikrId: string, isChecked: boolean) => void;
    handleMoveDhikr: (index: number, direction: 'up' | 'down') => void;
    handleRemoveDhikr: (idToRemove: string) => void;
    newDhikrArabic: string;
    setNewDhikrArabic: React.Dispatch<React.SetStateAction<string>>;
    newDhikrLatin: string;
    setNewDhikrLatin: React.Dispatch<React.SetStateAction<string>>;
    handleAddDhikr: () => void;
}

export const AlarmSettingsTab: React.FC<AlarmSettingsTabProps> = ({
    localSettings,
    setLocalSettings,
    handleInputChange,
    handleNestedChange,
    handleDhikrSelectionChange,
    handleMoveDhikr,
    handleRemoveDhikr,
    newDhikrArabic,
    setNewDhikrArabic,
    newDhikrLatin,
    setNewDhikrLatin,
    handleAddDhikr,
}) => {
    return (
        <>
            <CollapsibleSection title={t('settings.alarm.title')} defaultOpen={true}>
                <div className="space-y-6">
                    {/* Adhan Alarm */}
                    <div className="space-y-3 p-4 border border-slate-300 dark:border-slate-600 rounded-lg">
                        <Checkbox 
                            label={t('settings.alarm.enableAdhan')}
                            name="enableAdhanAlarm"
                            checked={localSettings.enableAdhanAlarm}
                            onChange={handleInputChange}
                        />
                        <SoundPicker 
                            name="adhanSoundType"
                            value={localSettings.adhanAlarmSound}
                            onChange={value => setLocalSettings(p => ({...p, adhanAlarmSound: value}))}
                            disabled={!localSettings.enableAdhanAlarm}
                        />
                    </div>
                    {/* Iqamah Alarm */}
                    <div className="space-y-3 p-4 border border-slate-300 dark:border-slate-600 rounded-lg">
                        <Checkbox 
                            label={t('settings.alarm.enableIqamah')}
                            name="enableIqamahAlarm"
                            checked={localSettings.enableIqamahAlarm}
                            onChange={handleInputChange}
                        />
                        <SoundPicker 
                            name="iqamahSoundType"
                            value={localSettings.iqamahAlarmSound}
                            onChange={value => setLocalSettings(p => ({...p, iqamahAlarmSound: value}))}
                            disabled={!localSettings.enableIqamahAlarm}
                        />
                    </div>
                </div>
            </CollapsibleSection>

             <CollapsibleSection title={t('settings.alarm.friday.title')} defaultOpen={true}>
                <div className="space-y-4">
                    <Checkbox
                        label={t('settings.alarm.friday.enable')}
                        name="enableFridayMode"
                        checked={localSettings.enableFridayMode}
                        onChange={handleInputChange}
                    />
                     <div className={`mt-4 space-y-4 border-t border-slate-300 dark:border-slate-600 pt-4 ${!localSettings.enableFridayMode ? 'opacity-50 pointer-events-none' : ''}`}>
                         <Select label={t('settings.alarm.friday.timeSource')} name="fridayTimeSource" value={localSettings.fridayTimeSource} onChange={handleInputChange}>
                            <option value="dhuhr">{t('settings.alarm.friday.followDhuhr')}</option>
                            <option value="manual">{t('settings.alarm.friday.manual')}</option>
                        </Select>
                        {localSettings.fridayTimeSource === 'manual' && (
                             <Input 
                                label={t('settings.alarm.friday.manualTime')}
                                name="manualFridayTime" 
                                type="time" 
                                value={localSettings.manualFridayTime} 
                                onChange={handleInputChange} 
                            />
                        )}
                        <Input 
                            label={t('settings.alarm.friday.khutbahDuration')}
                            name="fridayPrayerDuration"
                            type="number"
                            value={localSettings.fridayPrayerDuration}
                            onChange={handleInputChange}
                            help={t('settings.alarm.friday.khutbahDurationHelp')}
                        />
                         <Input 
                            label={t('settings.alarm.friday.khutbahTitle')} 
                            name="khutbahMessageTitle" 
                            type="text" 
                            value={localSettings.khutbahMessageTitle} 
                            onChange={handleInputChange} 
                        />
                         <Input 
                            label={t('settings.alarm.friday.khutbahTagline')}
                            name="khutbahMessageTagline" 
                            type="text" 
                            value={localSettings.khutbahMessageTagline} 
                            onChange={handleInputChange} 
                        />
                        <Checkbox
                            label={t('settings.alarm.friday.enableSlides')}
                            name="enableFridaySlides"
                            checked={localSettings.enableFridaySlides}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title={t('settings.alarm.duration.title')} defaultOpen={true}>
                <h4 className="font-semibold mb-4">{t('settings.alarm.duration.prayer')}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {IQAMAH_PRAYERS.map(name => (
                        <Input
                            key={name}
                            label={t(`prayerNames.${name}`)}
                            type="number"
                            value={localSettings.prayerDurations[name] || ''}
                            onChange={(e) => handleNestedChange('prayerDurations', name, Number(e.target.value))}
                        />
                    ))}
                    <Input 
                        label={t('settings.alarm.duration.dhikr')}
                        name="dhikrDuration" 
                        type="number" 
                        value={localSettings.dhikrDuration} 
                        onChange={handleInputChange} 
                    />
                </div>
                <div className="mt-6 pt-4 border-t border-slate-300 dark:border-slate-600">
                    <Checkbox
                        label={t('settings.alarm.duration.enableDhikr')}
                        name="enableDhikr"
                        checked={localSettings.enableDhikr}
                        onChange={handleInputChange}
                    />
                    {localSettings.enableDhikr && (
                        <div className="pl-6 mt-4 space-y-4 border-l-2 border-slate-300 dark:border-slate-600">
                            <div>
                                <h5 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">{t('settings.alarm.duration.dhikrList')}</h5>
                                <div className="space-y-3">
                                    {(localSettings.dhikrList || []).map((dhikr, index) => (
                                        <div key={dhikr.id} className="flex items-center gap-4 p-3 bg-slate-200/50 dark:bg-slate-700/50 rounded-md">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-[var(--accent-color)] focus:ring-[var(--accent-color)] flex-shrink-0"
                                                checked={(localSettings.selectedDhikr || []).includes(dhikr.id)}
                                                onChange={(e) => handleDhikrSelectionChange(dhikr.id, e.target.checked)}
                                            />
                                            <div className="flex-grow">
                                                <p className="font-semibold text-lg" lang="ar">{dhikr.arabic}</p>
                                                <p className="text-sm italic text-slate-600 dark:text-slate-400">{dhikr.latin}</p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <div className="flex flex-col">
                                                    <button 
                                                        onClick={() => handleMoveDhikr(index, 'up')} 
                                                        disabled={index === 0}
                                                        className="p-1 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                        aria-label="Pindah ke atas"
                                                    >
                                                        <ArrowUpIcon />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleMoveDhikr(index, 'down')} 
                                                        disabled={index === (localSettings.dhikrList || []).length - 1}
                                                        className="p-1 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                        aria-label="Pindah ke bawah"
                                                    >
                                                        <ArrowDownIcon />
                                                    </button>
                                                </div>
                                                <button onClick={() => handleRemoveDhikr(dhikr.id)} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 text-sm font-medium">{t('settings.slides.remove')}</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {(localSettings.selectedDhikr?.length ?? 0) === 0 && (
                                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">{t('settings.alarm.duration.dhikrEmpty')}</p>
                                )}
                            </div>

                            <div className="pt-4 border-t border-slate-300 dark:border-slate-700">
                                <h5 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">{t('settings.alarm.duration.addDhikr')}</h5>
                                <div className="space-y-3">
                                    <Input label={t('settings.alarm.duration.arabic')} value={newDhikrArabic} onChange={e => setNewDhikrArabic(e.target.value)} placeholder="سُبْحَانَ اللَّهِ" />
                                    <Input label={t('settings.alarm.duration.latin')} value={newDhikrLatin} onChange={e => setNewDhikrLatin(e.target.value)} placeholder="Subhanallah" />
                                    <button onClick={handleAddDhikr} className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:opacity-90 transition-colors font-semibold">{t('settings.alarm.duration.add')}</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CollapsibleSection>
        </>
    );
};
