import React from 'react';
import type { Settings } from '../../types';
import { CollapsibleSection, Input } from './Shared';
import { t } from '../../i18n';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface GeneralSettingsTabProps {
    localSettings: Settings;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    citySearch: string;
    setCitySearch: React.Dispatch<React.SetStateAction<string>>;
    handleLocationSearch: () => void;
    isSearching: boolean;
    locationStatus: { message: string; type: 'success' | 'error' | 'info' };
    locationStatusColor: string;
    handleExportData: () => void;
    handleImportData: (event: React.ChangeEvent<HTMLInputElement>) => void;
    importFileRef: React.RefObject<HTMLInputElement>;
}

export const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({
    localSettings,
    handleInputChange,
    citySearch,
    setCitySearch,
    handleLocationSearch,
    isSearching,
    locationStatus,
    locationStatusColor,
    handleExportData,
    handleImportData,
    importFileRef
}) => {
    return (
        <>
            <CollapsibleSection title={t('settings.general.title')} defaultOpen={true}>
                <div className="grid grid-cols-1 gap-4">
                    <Input label={t('settings.general.mosqueName')} name="mosqueName" value={localSettings.mosqueName} onChange={handleInputChange} />
                    <div>
                        <label className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-300 block">{t('settings.general.language')}</label>
                        <LanguageSwitcher />
                    </div>
                    <div>
                        <label className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-300 block">{t('settings.general.city')}</label>
                        <div className="flex items-center gap-2">
                            <input value={citySearch} onChange={(e) => setCitySearch(e.target.value)} placeholder="e.g. Jakarta" className="flex-grow bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]" />
                            <button onClick={handleLocationSearch} disabled={isSearching} className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:opacity-90 transition-colors font-semibold disabled:bg-slate-500 disabled:cursor-not-allowed">
                                {isSearching ? t('settings.general.searching') : t('settings.general.search')}
                            </button>
                        </div>
                        <p className={`text-xs mt-1 px-1 ${locationStatusColor}`}>{locationStatus.message}</p>
                    </div>
                </div>
            </CollapsibleSection>
            <CollapsibleSection title={t('settings.general.dataManagement.title')}>
                 <div className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {t('settings.general.dataManagement.description')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            type="button"
                            onClick={handleExportData}
                            className="w-full px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors font-semibold"
                        >
                            {t('settings.general.dataManagement.export')}
                        </button>
                        <button 
                            type="button"
                            onClick={() => importFileRef.current?.click()}
                            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-semibold"
                        >
                            {t('settings.general.dataManagement.import')}
                        </button>
                        <input 
                            type="file"
                            ref={importFileRef}
                            onChange={handleImportData}
                            accept=".json"
                            className="hidden"
                        />
                    </div>
                </div>
            </CollapsibleSection>
        </>
    );
};