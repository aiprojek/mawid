import React from 'react';
import { t } from '../../i18n';

const CoffeeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>);
const TelegramIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 15 22l-4-9-9-4 20-7z" /></svg>);
const GithubIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>);

export const AboutTab: React.FC = () => {
    const features = t('info.about.features', {}).split('|').map(f => {
        const [title, description] = f.split(':', 2);
        return { title, description };
    });

    return (
        <div className="space-y-8">
            <section className="text-center">
                <img src="/mawid.png" alt="App Icon" className="w-24 h-24 mx-auto mb-4 rounded-3xl shadow-lg" />
                <h1 className="text-4xl font-bold text-[var(--accent-color)]">{t('info.about.appName')}</h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
                    {t('info.about.description_part1')}
                    <a href="https://mawaqit.net" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] hover:underline font-semibold">
                        {t('info.about.mawaqit_link_text')}
                    </a>
                    {t('info.about.description_part2')}
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold border-b-2 border-[var(--accent-color)] pb-2 mb-4">{t('info.about.featuresTitle')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100">{feature.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold border-b-2 border-[var(--accent-color)] pb-2 mb-4">{t('info.about.supportTitle')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <a href="https://lynk.id/aiprojek/s/bvBJvdA" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 p-4 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors">
                        <CoffeeIcon />
                        <span>{t('info.about.coffee')}</span>
                    </a>
                    <a href="https://t.me/aiprojek_community" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 p-4 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors">
                        <TelegramIcon />
                        <span>{t('info.about.discussion')}</span>
                    </a>
                    <a href="https://github.com/aiprojek/mawid" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 p-4 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors">
                        <GithubIcon />
                        <span>{t('info.about.github')}</span>
                    </a>
                </div>
            </section>
            
            <footer className="text-center text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p>{t('info.developedBy')} <a href="https://aiprojek01.my.id/" target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--accent-color)] hover:underline">AI Projek</a>.</p>
                <p>{t('info.license')} <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank" rel="noopener noreferrer" className="font-mono hover:underline">GNU GPLv3</a>.</p>
                 <p className="mt-2">{t('info.dataSource')} <a href="https://aladhan.com/prayer-times-api" target="_blank" rel="noopener noreferrer" className="underline">Aladhan API</a>.</p>
            </footer>
        </div>
    );
};