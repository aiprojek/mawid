import React from 'react';
import type { Settings, PrayerName } from '../../types';
import { CollapsibleSection, Input, Select, Checkbox } from './Shared';
import { PRAYER_NAMES, IQAMAH_PRAYERS } from '../../constants';
import { t, getLocale } from '../../i18n';

interface CalculationSettingsTabProps {
    localSettings: Settings;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleNestedChange: (category: keyof Settings, key: string, value: string | number) => void;
}

export const CalculationSettingsTab: React.FC<CalculationSettingsTabProps> = ({
    localSettings,
    handleInputChange,
    handleNestedChange
}) => {
    const localeData = getLocale();
    const CALCULATION_METHODS = localeData.defaults.calculationMethods;
    const MADHAB_OPTIONS = localeData.defaults.madhabOptions;
    const HIGH_LATITUDE_RULES = localeData.defaults.highLatitudeRules;

    return (
        <>
            <CollapsibleSection title={t('settings.calculation.title')} defaultOpen={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select label={t('settings.calculation.method')} name="calculationMethod" value={localSettings.calculationMethod} onChange={handleInputChange}>
                        {CALCULATION_METHODS.map(method => (
                            <option key={method.id} value={method.id}>{method.name}</option>
                        ))}
                    </Select>
                    <Select label={t('settings.calculation.madhab')} name="madhab" value={localSettings.madhab} onChange={handleInputChange}>
                        {MADHAB_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                    </Select>
                    <Select label={t('settings.calculation.highLatitude')} name="highLatitudeRule" value={localSettings.highLatitudeRule} onChange={handleInputChange}>
                        {HIGH_LATITUDE_RULES.map(rule => <option key={rule.id} value={rule.id}>{rule.name}</option>)}
                    </Select>
                </div>
                <div className={`mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 ${localSettings.calculationMethod !== 99 ? 'opacity-50' : ''}`}>
                    <Input label={t('settings.calculation.fajrAngle')} name="fajrAngle" type="number" step="0.1" value={localSettings.fajrAngle} onChange={handleInputChange} disabled={localSettings.calculationMethod !== 99} />
                    <Input label={t('settings.calculation.ishaAngle')} name="ishaAngle" type="number" step="0.1" value={localSettings.ishaAngle} onChange={handleInputChange} disabled={localSettings.calculationMethod !== 99} />
                </div>
                {localSettings.calculationMethod !== 99 && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{t('settings.calculation.customNote')}</p>}
            </CollapsibleSection>
            
            <CollapsibleSection title={t('settings.calculation.corrections.title')} defaultOpen={true}>
                <Checkbox label={t('settings.calculation.corrections.useManual')} name="useManualTimes" checked={localSettings.useManualTimes} onChange={handleInputChange} />
                {localSettings.useManualTimes && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {PRAYER_NAMES.map(name => (
                            <Input 
                                key={name} 
                                label={t(`prayerNames.${name}`)}
                                type="time" 
                                value={localSettings.manualPrayerTimes[name]} 
                                onChange={(e) => handleNestedChange('manualPrayerTimes', name, e.target.value)} 
                            />
                        ))}
                    </div>
                )}
                <h4 className="font-semibold mt-6 mb-2">{t('settings.calculation.corrections.correction')}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {PRAYER_NAMES.map(name => (
                        <Input 
                            key={name}
                            label={t(`prayerNames.${name}`)}
                            type="number"
                            value={localSettings.adjustments[name]}
                            onChange={(e) => handleNestedChange('adjustments', name, Number(e.target.value))}
                        />
                    ))}
                </div>
                <h4 className="font-semibold mt-6 mb-2">{t('settings.calculation.corrections.iqamah')}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {IQAMAH_PRAYERS.map(name => (
                        <Input 
                            key={name}
                            label={t(`prayerNames.${name}`)}
                            type="number"
                            value={localSettings.iqamahOffsets[name]}
                            onChange={(e) => handleNestedChange('iqamahOffsets', name, Number(e.target.value))}
                        />
                    ))}
                </div>
            </CollapsibleSection>
        </>
    );
};
