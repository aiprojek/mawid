import React, { useState, useEffect, useRef } from 'react';
import type { Settings } from '../../types';
import { CollapsibleSection, Input, Select, Checkbox, QuillEditor } from './Shared';
// FIX: Added getDefaultSettings to the import.
import { IQAMAH_PRAYERS, getDefaultSettings } from '../../constants';
import { t, getLocale } from '../../i18n';

// BUG FIX #3: The default accent color from constants.ts is '#8B5CF6'. 
// It must be included here so the custom picker shows a '+' by default.
const VIBRANT_COLORS = [
    '#F87171', '#FB923C', '#FBBF24', '#A3E635',
    '#38BDF8', '#818CF8', '#8B5CF6',
];


// BUG FIX #3: Correctly type WallpaperPicker as a React.FC with a props interface to resolve issue with the 'key' prop.
interface WallpaperPickerProps {
    label: string;
    value: string;
    onChange: (newValue: string) => void;
    onReset: () => void;
}

// Reusable component for picking a wallpaper (URL or Upload)
const WallpaperPicker: React.FC<WallpaperPickerProps> = ({ label, value, onChange, onReset }) => {
    const [type, setType] = useState<'url' | 'upload'>(value?.startsWith('data:image') ? 'upload' : 'url');
    const [status, setStatus] = useState<{message: string, type: 'success' | 'error' | 'info'}>({message: '', type: 'info'});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const statusColor = {
        success: 'text-green-500 dark:text-green-400',
        error: 'text-red-500 dark:text-red-400',
        info: 'text-slate-500 dark:text-slate-400'
    }[status.type];

    useEffect(() => {
        // Sync type if value is changed externally (e.g. reset)
        setType(value?.startsWith('data:image') ? 'upload' : 'url');
    }, [value]);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
        if (file.size > MAX_FILE_SIZE) {
            setStatus({message: t('settings.display.wallpaper.maxSize'), type: 'error'});
            return;
        }
        if (!file.type.startsWith('image/')) {
            setStatus({message: 'Unsupported file format.', type: 'error'});
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            onChange(reader.result as string);
            setStatus({message: 'Image uploaded successfully.', type: 'success'});
        };
        reader.onerror = () => setStatus({message: 'Failed to read file.', type: 'error'});
        reader.readAsDataURL(file);
    };

    return (
        <div className="p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-200/30 dark:bg-slate-700/30">
            <h5 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</h5>
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name={`wallpaperType-${label}`} value="url" checked={type === 'url'} onChange={() => setType('url')} className="w-4 h-4 text-[var(--accent-color)] focus:ring-[var(--accent-color)]" />
                        <span>{t('settings.display.wallpaper.useUrl')}</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name={`wallpaperType-${label}`} value="upload" checked={type === 'upload'} onChange={() => setType('upload')} className="w-4 h-4 text-[var(--accent-color)] focus:ring-[var(--accent-color)]" />
                        <span>{t('settings.display.wallpaper.upload')}</span>
                    </label>
                </div>

                {type === 'url' ? (
                    <Input label={t('settings.display.wallpaper.url')} value={value?.startsWith('data:image') ? '' : value || ''} onChange={(e) => onChange(e.target.value)} placeholder="https://..." />
                ) : (
                    <div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                            {t('settings.display.wallpaper.selectFile')}
                        </button>
                        <p className={`text-xs mt-1 px-1 ${statusColor}`}>{status.message}</p>
                    </div>
                )}
                
                {value && (
                    <div className="flex items-center gap-4">
                         <div className="relative group w-24 h-16 rounded-md overflow-hidden border border-slate-300 dark:border-slate-600 flex-shrink-0">
                            <img src={value} alt={`${label} preview`} className="w-full h-full object-cover" />
                        </div>
                        <button type="button" onClick={onReset} className="text-sm text-red-500 hover:underline">{t('settings.display.wallpaper.reset')}</button>
                    </div>
                )}
            </div>
        </div>
    );
};


interface DisplaySettingsTabProps {
    localSettings: Settings;
    setLocalSettings: React.Dispatch<React.SetStateAction<Settings>>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleThemeCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCustomTextChange: (index: number, html: string) => void;
    addCustomText: () => void;
    removeCustomText: (index: number) => void;
    wallpaperType: 'url' | 'upload';
    setWallpaperType: React.Dispatch<React.SetStateAction<'url' | 'upload'>>;
    uploadStatus: { message: string; type: 'success' | 'error' | 'info' };
    fileInputRef: React.RefObject<HTMLInputElement>;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    uploadStatusColor: string;
}

export const DisplaySettingsTab: React.FC<DisplaySettingsTabProps> = ({
    localSettings,
    setLocalSettings,
    handleInputChange,
    handleThemeCheckboxChange,
    handleCustomTextChange,
    addCustomText,
    removeCustomText,
    wallpaperType,
    setWallpaperType,
    uploadStatus,
    fileInputRef,
    handleFileChange,
    uploadStatusColor
}) => {
    const localeData = getLocale();
    const THEME_OPTIONS = localeData.defaults.themeOptions;

    return (
        <>
            <CollapsibleSection title={t('settings.display.title')} defaultOpen={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <Select label={t('settings.display.theme')} name="theme" value={localSettings.theme} onChange={handleInputChange}>
                        <option value="dark">{t('settings.display.dark')}</option>
                        <option value="light">{t('settings.display.light')}</option>
                    </Select>
                    <Select label={t('settings.display.orientation')} name="displayMode" value={localSettings.displayMode} onChange={handleInputChange}>
                        <option value="landscape">{t('settings.display.landscape')}</option>
                        <option value="portrait">{t('settings.display.portrait')}</option>
                    </Select>
                     <div className="md:col-span-2">
                        <Select label={t('settings.display.layout')} name="layoutTemplate" value={localSettings.layoutTemplate} onChange={handleInputChange}>
                            <option value="focus-jam">{t('settings.display.layoutFocus')}</option>
                            <option value="dashboard-info">{t('settings.display.layoutDashboard')}</option>
                            <option value="minimalis">{t('settings.display.layoutMinimalist')}</option>
                        </Select>
                    </div>
                    <div className="md:col-span-2">
                        <Checkbox
                            label={t('settings.display.bgAnimation')}
                            name="enableBackgroundAnimation"
                            checked={localSettings.enableBackgroundAnimation}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-300 block">{t('settings.display.accentColor')}</label>
                        <div className="flex items-center gap-2 mt-2">
                            {VIBRANT_COLORS.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setLocalSettings(p => ({...p, accentColor: color}))}
                                    className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${localSettings.accentColor === color ? 'ring-2 ring-offset-2 ring-offset-slate-200 dark:ring-offset-slate-700 ring-[var(--accent-color)]' : ''}`}
                                    style={{ backgroundColor: color }}
                                    aria-label={`Select color ${color}`}
                                />
                            ))}
                            {/* Divider to separate presets from custom color picker */}
                            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                            <div className="relative w-8 h-8">
                                <input 
                                    name="accentColor" 
                                    type="color" 
                                    value={localSettings.accentColor} 
                                    onChange={handleInputChange} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    aria-label="Custom color picker"
                                />
                                <div 
                                    className="w-full h-full rounded-full border-2 border-dashed border-slate-400 dark:border-slate-500 flex items-center justify-center text-slate-500 dark:text-slate-400"
                                    style={{backgroundColor: VIBRANT_COLORS.includes(localSettings.accentColor) ? 'transparent' : localSettings.accentColor}}
                                    aria-hidden="true"
                                >
                                    {VIBRANT_COLORS.includes(localSettings.accentColor) && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title={t('settings.display.wallpaper.title')}>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" name="wallpaperType" value="url" checked={wallpaperType === 'url'} onChange={() => setWallpaperType('url')} className="w-4 h-4 text-[var(--accent-color)] focus:ring-[var(--accent-color)]" />
                            <span>{t('settings.display.wallpaper.useUrl')}</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" name="wallpaperType" value="upload" checked={wallpaperType === 'upload'} onChange={() => setWallpaperType('upload')} className="w-4 h-4 text-[var(--accent-color)] focus:ring-[var(--accent-color)]" />
                            <span>{t('settings.display.wallpaper.upload')}</span>
                        </label>
                    </div>
                    
                    {wallpaperType === 'url' ? (
                        <Input label={t('settings.display.wallpaper.url')} name="wallpaper" value={localSettings.wallpaper.startsWith('data:image') ? '' : localSettings.wallpaper} onChange={handleInputChange} placeholder="https://..." />
                    ) : (
                        <div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                                aria-label="File picker for wallpaper"
                            />
                            <button 
                                type="button" 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                            >
                                {t('settings.display.wallpaper.selectFile')}
                            </button>
                            <p className={`text-xs mt-1 px-1 ${uploadStatusColor}`}>{uploadStatus.message || t('settings.display.wallpaper.maxSize')}</p>
                        </div>
                    )}
                    {localSettings.wallpaper && (
                        <div className="mt-2">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t('settings.display.wallpaper.preview')}</p>
                            <div className="relative group w-40 h-24 rounded-md overflow-hidden border border-slate-300 dark:border-slate-600">
                                <img src={localSettings.wallpaper} alt="Wallpaper preview" className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => {
                                        setLocalSettings(prev => ({...prev, wallpaper: getDefaultSettings(getLocale().general.credit === 'Made by AI Projek' ? 'en' : 'id').wallpaper}));
                                    }} 
                                    className="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold"
                                >
                                    {t('settings.display.wallpaper.reset')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </CollapsibleSection>
            
            <CollapsibleSection title={t('settings.display.contextualWallpaper.title')}>
                 <Checkbox
                    label={t('settings.display.contextualWallpaper.enable')}
                    name="enableContextualWallpapers"
                    checked={localSettings.enableContextualWallpapers}
                    onChange={handleInputChange}
                />
                {localSettings.enableContextualWallpapers && (
                    <div className="pl-2 sm:pl-6 mt-4 space-y-6 border-l-0 sm:border-l-2 border-slate-300 dark:border-slate-600">
                        {IQAMAH_PRAYERS.map(prayerName => (
                            <WallpaperPicker
                                key={prayerName}
                                label={`${t('settings.display.wallpaper.title')} ${t(`prayerNames.${prayerName}`)}`}
                                value={localSettings.contextualWallpapers[prayerName]}
                                onChange={newValue => {
                                    const newWallpapers = {...localSettings.contextualWallpapers, [prayerName]: newValue};
                                    setLocalSettings(prev => ({...prev, contextualWallpapers: newWallpapers}));
                                }}
                                onReset={() => {
                                    const defaultWallpapers = getDefaultSettings(getLocale().general.credit === 'Made by AI Projek' ? 'en' : 'id').contextualWallpapers;
                                    const newWallpapers = {...localSettings.contextualWallpapers, [prayerName]: defaultWallpapers[prayerName]};
                                    setLocalSettings(prev => ({...prev, contextualWallpapers: newWallpapers}));
                                }}
                            />
                        ))}
                    </div>
                )}
            </CollapsibleSection>
            
            <CollapsibleSection title={t('settings.display.runningText.title')} defaultOpen={true}>
                <div className="space-y-4">
                     <Checkbox
                        label={t('settings.display.runningText.enable')}
                        name="enableRunningText"
                        checked={localSettings.enableRunningText}
                        onChange={handleInputChange}
                    />
                    <div className={`mt-4 space-y-4 border-t border-slate-300 dark:border-slate-600 pt-4 ${!localSettings.enableRunningText ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div>
                            <label className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300 block">{t('settings.display.runningText.mode')}</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" name="runningTextMode" value="custom" checked={localSettings.runningTextMode === 'custom'} onChange={handleInputChange} className="w-4 h-4 text-[var(--accent-color)] focus:ring-[var(--accent-color)]" />
                                    <span>{t('settings.display.runningText.custom')}</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" name="runningTextMode" value="themed" checked={localSettings.runningTextMode === 'themed'} onChange={handleInputChange} className="w-4 h-4 text-[var(--accent-color)] focus:ring-[var(--accent-color)]" />
                                    <span>{t('settings.display.runningText.themed')}</span>
                                </label>
                            </div>
                        </div>

                        {localSettings.runningTextMode === 'custom' ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pt-2">
                                    <h5 className="font-semibold text-slate-700 dark:text-slate-200">{t('settings.display.runningText.customList')}</h5>
                                    <button onClick={addCustomText} className="px-3 py-1 bg-[var(--accent-color)] text-white rounded-md hover:opacity-90 transition-colors text-sm font-semibold">
                                        {t('settings.display.runningText.addText')}
                                    </button>
                                </div>
                                {(localSettings.customTexts || []).map((text, index) => (
                                    <div key={text.id} className="bg-slate-200/50 dark:bg-slate-700/50 p-4 rounded-md border border-slate-300 dark:border-slate-600">
                                        <div className="flex justify-between items-center mb-2">
                                            <h6 className="font-semibold">{t('settings.display.runningText.text')} {index + 1}</h6>
                                            <button onClick={() => removeCustomText(index)} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 text-sm font-medium">{t('settings.slides.remove')}</button>
                                        </div>
                                        {localSettings.enableRunningText && (
                                            <QuillEditor
                                                value={text.content}
                                                onChange={html => handleCustomTextChange(index, html)}
                                            />
                                        )}
                                    </div>
                                ))}
                                {(!localSettings.customTexts || localSettings.customTexts.length === 0) && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">{t('settings.display.runningText.empty')}</p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4 pt-2">
                                <div>
                                    <h5 className="font-semibold text-slate-700 dark:text-slate-200">{t('settings.display.runningText.quranThemes')}</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                    {THEME_OPTIONS.filter(t => t.category === 'quran').map(theme => (
                                        <Checkbox key={theme.id} label={theme.name} value={theme.id} checked={(localSettings.runningTextThemes || []).includes(theme.id)} onChange={handleThemeCheckboxChange} />
                                    ))}
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-slate-700 dark:text-slate-200">{t('settings.display.runningText.hadithThemes')}</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                    {THEME_OPTIONS.filter(t => t.category === 'hadith').map(theme => (
                                        <Checkbox key={theme.id} label={theme.name} value={theme.id} checked={(localSettings.runningTextThemes || []).includes(theme.id)} onChange={handleThemeCheckboxChange} />
                                    ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-4">
                            <Input 
                                label={t('settings.display.runningText.speed')}
                                name="runningTextSpeed" 
                                type="number" 
                                min="1"
                                value={localSettings.runningTextSpeed} 
                                onChange={handleInputChange}
                                help={t('settings.display.runningText.speedHelp')}
                            />
                        </div>
                    </div>
                </div>
            </CollapsibleSection>
        </>
    );
};