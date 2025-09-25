import React from 'react';
import { t } from '../../i18n';
import { CollapsibleSection } from '../settings/Shared';

export const GuideTab: React.FC = () => {
    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">{t('info.guide.title')}</h1>
            <p className="text-slate-600 dark:text-slate-300">{t('info.guide.intro')}</p>

            <CollapsibleSection title={t('info.guide.general.title')}>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                    {t('info.guide.general.content')}
                </p>
            </CollapsibleSection>

            <CollapsibleSection title={t('info.guide.calculation.title')}>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                    {t('info.guide.calculation.content')}
                </p>
            </CollapsibleSection>

            <CollapsibleSection title={t('info.guide.display.title')}>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                    {t('info.guide.display.content')}
                </p>
            </CollapsibleSection>

            <CollapsibleSection title={t('info.guide.alarm.title')}>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                    {t('info.guide.alarm.content')}
                </p>
            </CollapsibleSection>

            <CollapsibleSection title={t('info.guide.slides.title')}>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                    {t('info.guide.slides.content')}
                </p>
            </CollapsibleSection>
        </div>
    );
};
