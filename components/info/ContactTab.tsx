import React, { useState } from 'react';
import { t } from '../../i18n';

const SendIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>);

export const ContactTab: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, subject, message } = formData;
        const body = `Pesan dari: ${name}\n\n${message}`;
        const mailtoLink = `mailto:aiprojek01@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">{t('info.contact.title')}</h1>
            <p className="text-slate-600 dark:text-slate-300">{t('info.contact.description')}</p>
            
            <form onSubmit={handleSubmit} className="space-y-4 bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-300 block">{t('info.contact.name')}</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]" />
                    </div>
                    <div>
                        <label htmlFor="email" className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-300 block">{t('info.contact.email')}</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]" />
                    </div>
                </div>
                <div>
                    <label htmlFor="subject" className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-300 block">{t('info.contact.subject')}</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]" />
                </div>
                <div>
                    <label htmlFor="message" className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-300 block">{t('info.contact.message')}</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} className="w-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"></textarea>
                </div>
                <div>
                    <button type="submit" className="w-full sm:w-auto px-6 py-3 bg-[var(--accent-color)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] dark:focus:ring-offset-slate-800 flex items-center justify-center gap-2">
                        <SendIcon />
                        <span>{t('info.contact.send')}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};