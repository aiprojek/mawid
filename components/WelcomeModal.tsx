import React from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { t } from '../i18n';

interface WelcomeModalProps {
    onClose: () => void;
    onGoToGuide: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose, onGoToGuide }) => {
    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-full text-center transform transition-all animate-fade-in scale-95 motion-safe:animate-scale-up">
                
                <h2 id="welcome-title" className="text-3xl font-bold text-slate-800 dark:text-white mb-4">{t('welcome.title')}</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                    {t('welcome.message')}
                </p>

                <div className="mt-6 text-left">
                    <label className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300 block">{t('welcome.language')}</label>
                    <LanguageSwitcher />
                </div>

                <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
                    <button 
                        onClick={onClose} 
                        className="w-full px-6 py-3 bg-[var(--accent-color)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] dark:focus:ring-offset-slate-800"
                    >
                        {t('welcome.start')}
                    </button>
                    <button 
                        onClick={onGoToGuide} 
                        className="w-full px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-offset-slate-800"
                    >
                        {t('welcome.guide')}
                    </button>
                </div>
            </div>
        </div>
    );
};