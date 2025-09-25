export const en = {
    general: {
        online: 'Online',
        offline: 'Offline',
        credit: 'Made by AI Projek',
        back: 'Back',
        save: 'Save',
        close: 'Close',
        saved: 'Settings saved successfully!',
        saveError: 'Failed to save settings.',
        exported: 'Data exported successfully.',
        exportError: 'Failed to export data.',
        imported: 'Data imported successfully! Reloading...',
        importError: 'Failed to import data. The file might be corrupt or invalid.',
        noContent: 'No content available for the selected themes.',
        customTextPlaceholder: 'Set running text in the Settings menu.',
        jummah: "Jum'ah",
        jumat: "Jum'at",
    },
    welcome: {
        title: 'Welcome to Waqti',
        message: 'Your personal reminder for appointments with The Creator. Before you begin, please select your preferred language.',
        language: 'Select Language',
        guide: 'View Guide',
        start: 'Get Started'
    },
    prayerNames: {
        Fajr: 'Fajr',
        Sunrise: 'Sunrise',
        Dhuhr: 'Dhuhr',
        Asr: 'Asr',
        Maghrib: 'Maghrib',
        Isha: 'Isha',
    },
    main: {
        loading: 'Loading prayer times...',
        error: 'An error occurred',
        prayerTime: 'PRAYER TIME',
        upNext: 'Next Prayer',
        countdownTo: 'Countdown to',
        iqamahIn: 'Iqamah in',
        prayerInProgress: 'ESTABLISH THE PRAYER',
        prayerInProgressTagline: 'Straighten and close the rows!',
        dhikr: 'DHIKR AFTER PRAYER',
        until: 'Until',
        in: 'in',
        otherPrayerTimes: 'Other Prayer Times',
        iqamahOffset: 'Iqamah in {{minutes}} min',
    },
    footer: {
        runningText: {
            text: `Surely, prayer is a timed prescription for the believers.`,
            source: 'Q.S. An-Nisa: 103'
        },
    },
    settings: {
        title: 'Settings',
        tabs: {
            general: 'General',
            calculation: 'Calculation',
            display: 'Display',
            alarm: 'Alarm & Dhikr',
            slides: 'Slides'
        },
        general: {
            title: 'General Settings',
            mosqueName: 'Mosque Name',
            language: 'Language',
            city: 'City',
            search: 'Search',
            searching: 'Searching...',
            currentCity: 'Current city: {{city}}',
            citySetTo: 'City set to {{city}}. Prayer times will be updated.',
            cityTooShort: 'City name is too short.',
            dataManagement: {
                title: 'Data Management',
                description: 'Save your settings to a file for backup or to move them to another device.',
                export: 'Export Settings',
                import: 'Import Settings'
            }
        },
        calculation: {
            title: 'Prayer Time Calculation Settings',
            method: 'Calculation Method',
            madhab: 'Madhab (for Asr Time)',
            highLatitude: 'High Latitude Rule',
            fajrAngle: 'Fajr Angle',
            ishaAngle: 'Isha Angle',
            customNote: 'Angles can only be changed if the Calculation Method is set to Custom.',
            corrections: {
                title: 'Manual Adjustments',
                useManual: 'Use Manual Prayer Times',
                correction: 'Time Adjustments (minutes)',
                iqamah: 'Delay to Iqamah (minutes)'
            }
        },
        display: {
            title: 'Display & Visual Settings',
            theme: 'Theme',
            dark: 'Dark',
            light: 'Light',
            orientation: 'Orientation Mode',
            landscape: 'Landscape (Wide Screen)',
            portrait: 'Portrait (Tall Screen)',
            layout: 'Main Display Layout Template',
            layoutFocus: 'Focus Clock',
            layoutDashboard: 'Information Dashboard',
            layoutMinimalist: 'Minimalist',
            bgAnimation: 'Enable Background Animation',
            accentColor: 'Accent Color',
            wallpaper: {
                title: 'Main Wallpaper',
                useUrl: 'Use URL',
                upload: 'Upload',
                url: 'Wallpaper Image URL',
                selectFile: 'Select Image File...',
                maxSize: 'Max file size is 2MB.',
                preview: 'Preview',
                reset: 'Reset'
            },
            contextualWallpaper: {
                title: 'Contextual Wallpapers',
                enable: 'Enable different wallpapers for each prayer time'
            },
            runningText: {
                title: 'Running Text',
                enable: 'Enable Running Text in Footer',
                mode: 'Content Mode',
                custom: 'Custom',
                themed: 'Themed',
                customList: 'Custom Text List',
                addText: 'Add Text',
                text: 'Text',
                empty: 'No custom texts yet. Please add one.',
                quranThemes: 'Qur\'an Themes',
                hadithThemes: 'Hadith Themes',
                speed: 'Animation Speed (seconds)',
                speedHelp: 'Duration for the text to scroll from one side to the other. Longer text takes longer.'
            }
        },
        alarm: {
            title: 'Alarm Settings',
            enableAdhan: 'Enable Adhan Alarm',
            enableIqamah: 'Enable Iqamah Alarm',
            sound: {
                default: 'Default',
                url: 'URL',
                upload: 'Upload'
            },
            friday: {
                title: 'Jum\'ah Mode Settings',
                enable: 'Enable Jum\'ah Mode',
                timeSource: 'Jum\'ah Time Source',
                followDhuhr: 'Follow Dhuhr Time',
                manual: 'Set Manually',
                manualTime: 'Manual Jum\'ah Time',
                khutbahDuration: 'Khutbah Display Duration (minutes)',
                khutbahDurationHelp: 'Replaces the iqamah countdown. After this, the prayer is considered finished.',
                khutbahTitle: 'Khutbah Message Title',
                khutbahTagline: 'Khutbah Message Tagline',
                enableSlides: 'Enable slides specific to Friday'
            },
            duration: {
                title: 'Display Duration Settings',
                prayer: '"Prayer Established" Duration (minutes)',
                dhikr: 'Total Dhikr Duration (minutes)',
                enableDhikr: 'Enable Dhikr Display After Prayer',
                dhikrList: 'Dhikr List to Display',
                dhikrEmpty: 'Select at least one dhikr to display.',
                addDhikr: 'Add New Dhikr',
                arabic: 'Arabic Text',
                latin: 'Latin Text (Transliteration)',
                add: 'Add',
                emptyFields: 'Arabic and Latin text cannot be empty.'
            }
        },
        slides: {
            title: 'Slide Settings',
            list: 'Slide List',
            add: {
                text: 'Add Text',
                image: 'Add Image',
                schedule: 'Add Schedule',
                finance: 'Add Finance'
            },
            slide: 'Slide',
            enable: 'Enable Slide',
            remove: 'Remove',
            duration: 'Display Duration',
            seconds: 'seconds',
            fridayOnly: 'Show on Fridays only',
            fridayOnlyHelp: 'Enable "slides specific to Friday" in the Alarm & Dhikr tab to use this.',
            titleInput: 'Title',
            content: 'Content',
            imageUrl: 'Image URL',
            image: 'Image',
            selectFile: 'Select File...',
            schedule: {
                topic: 'Topic',
                speaker: 'Speaker',
                day: 'Day',
                time: 'Time',
                add: 'Add Schedule Item'
            },
            finance: {
                reportTitle: 'Report Title',
                initialBalance: 'Initial Balance',
                income: 'Income',
                expense: 'Expense',
                finalBalance: 'Final Balance',
                donationTarget: 'Donation Target (Optional)'
            },
            empty: 'No slides yet. Please add one.',
            type: {
                text: 'Text Slide',
                image: 'Image Slide',
                schedule: 'Schedule Slide',
                finance: 'Finance Slide'
            }
        }
    },
    info: {
        title: 'About & Guide',
        tabs: {
            about: 'About App',
            guide: 'User Guide'
        },
        about: {
            appName: "Waqti",
            description_part1: "A modern and personal prayer times application to accompany your time with The Creator. Features customizations, themes, and dynamic content for personal use and digital mosque clock displays. Inspired by ",
            mawaqit_link_text: "Mawaqit",
            description_part2: " with simplified usage—no account or backoffice needed. The name Waqti (وقتي) means 'My Time', emphasizing a personal connection to prayer times.",
            featuresTitle: 'Key Features',
            features: "Automatic Prayer Times:Calculates prayer times based on city and selected method.|Customizable Calculations:Adjust methods, madhab, and time corrections.|Iqamah Countdown:Displays a countdown from adhan to iqamah.|Jum'ah Mode:Special display mode for Friday prayers.|Display Layouts:Choose from Focus, Dashboard, or Minimalist views.|Dynamic Slideshow:Display text, images, schedules, and financial reports.|Theming:Customize accent colors and wallpapers.|Running Text:Show custom messages or themed content.|Dhikr Display:Shows a sequence of dhikr after prayers.|Offline Support:Continues to function even without an internet connection.|PWA Support:Can be installed on your device for quick access and a native app-like experience.|Orientation Modes:Responsive support for both landscape (wide) and portrait (tall) displays.|Backup & Restore Data:Easily export and import all your settings.",
            supportTitle: 'Developer',
            coffee: 'Buy Me a Coffee',
            discussion: 'Join Discussion',
            github: 'GitHub'
        },
        guide: {
            title: 'Settings Guide',
            intro: 'Here is an explanation of each available setting to help you customize the application according to your needs.',
            general: {
                title: 'General Settings',
                content: `
- Mosque Name: The name displayed on the main screen.
- Language: Changes the application's interface language.
- City: Determines the prayer time calculations. The app will fetch data from the internet based on this city.
- Data Management: You can export all current settings into a .json file as a backup or to move them to another device. Use import to restore from that file.`
            },
            calculation: {
                title: 'Calculation Settings',
                content: `
- Calculation Method: Choose the institution for prayer time calculation (e.g., Ministry of Religious Affairs of Indonesia). Select 'Custom' to set your own Fajr and Isha angles.
- Madhab: Affects the Asr prayer time calculation. 'Standard' is for Shafii, Maliki, Hanbali, while 'Hanafi' has a later time.
- Time Corrections: Manually add or subtract minutes for each prayer time if you find a discrepancy with your local mosque.
- Iqamah Delay: Sets the countdown duration from the adhan to the iqamah for each prayer.`
            },
            display: {
                title: 'Display Settings',
                content: `
- Theme: Choose between a dark or light appearance.
- Orientation Mode: 'Landscape' is suitable for wide screens (monitors), 'Portrait' is for tall screens. This affects the layout.
- Display Layout Template: Select the main screen appearance. 'Focus Clock' is large and clear, 'Information Dashboard' shows various info, and 'Minimalist' is simple.
- Accent Color: The primary color used for highlights, buttons, and the next prayer time marker.
- Wallpaper: Set the background image for the main screen, either via URL or by uploading an image.
- Contextual Wallpaper: If enabled, the wallpaper will change automatically based on the current prayer time period (e.g., a different image for Fajr, Dhuhr, etc.).
- Running Text: Display a moving text at the bottom of the screen. 'Custom' mode uses text you write, while 'Themed' mode randomly selects from Quranic verses or hadiths.`
            },
            alarm: {
                title: 'Alarm & Dhikr Settings',
                content: `
- Alarms: Enable alarms that will sound when it is time for Adhan and Iqamah. You can use the default sound, a URL, or upload your own audio file.
- Jum'ah Mode: Special settings for Fridays. You can set the Jum'ah time to follow Dhuhr or a manual time. The 'Khutbah Display Duration' replaces the iqamah countdown on Fridays.
- Display Durations: Set how long the 'Prayer in Progress' screen is shown for each prayer and the total duration for the entire dhikr sequence.
- Dhikr List: Enable, disable, add, remove, and reorder the list of dhikr that appear after the prayer is completed.`
            },
            slides: {
                title: 'Slide Settings',
                content: `
This feature allows you to display various informational slides that will alternate with the main clock display.
- Add Slides: Click the buttons to add different types of slides: Text, Image, Schedule, or Finance.
- Slide Settings: For each slide, you can enable/disable it, set its display duration, and choose if it should only appear on Fridays.
- Content Types:
  - Text: Display a title and content with simple formatting.
  - Image: Display an image from a URL or an uploaded file.
  - Schedule: Display a list of mosque activities/studies.
  - Finance: Display a financial report summary, including income, expenses, and final balance, complete with a chart.`
            }
        },
        developedBy: 'This application was developed by:',
        license: 'License:',
        dataSource: 'Prayer time data provided by',
    },
    defaults: {
        khutbah: {
            title: 'Maintain Calm',
            tagline: "The Jum'ah Khutbah is in progress"
        },
        fridaySlides: [
            { title: "Sunnah: Read Surah Al-Kahf", content: `<p class="ql-align-center"><em style="color: rgb(255, 255, 255);">"Whoever reads Surah Al-Kahf on the day of Jum’ah, will have a light that will shine from him from one Friday to the next."</em></p><p class="ql-align-center"><strong style="color: rgb(255, 255, 255);">(Narrated by al-Haakim and al-Bayhaqi)</strong></p>` },
            { title: "Sunnah: Prepare Yourself", content: `<p class="ql-align-center"><strong style="color: rgb(255, 255, 255);">Bathe, Wear Your Best Clothes, & Use Perfume</strong></p><p class="ql-align-center"><em style="color: rgb(255, 255, 255);">"Whoever takes a bath on Friday, purifies himself as much as he can... his sins between that Friday and the next will be forgiven."</em></p><p class="ql-align-center"><strong style="color: rgb(255, 255, 255);">(Narrated by Bukhari)</strong></p>` },
            { title: "Virtue: Hasten to the Mosque", content: `<p class="ql-align-center"><em style="color: rgb(255, 255, 255);">Coming in the first hour is like sacrificing a camel, the second hour like a cow, the third like a ram, the fourth like a chicken, and the fifth like an egg.</em></p><p class="ql-align-center"><strong style="color: rgb(255, 255, 255);">(Agreed upon)</strong></p>` },
            { title: "Virtue: Increase Salawat", content: `<p class="ql-align-center"><em style="color: rgb(255, 255, 255);">"Increase your prayers upon me on Friday. Whoever sends one prayer upon me, Allah will send ten prayers upon him."</em></p><p class="ql-align-center"><strong style="color: rgb(255, 255, 255);">(Narrated by Al-Bayhaqi)</strong></p>` },
            { title: "An Auspicious Time for Dua", content: `<p class="ql-align-center"><em style="color: rgb(255, 255, 255);">"On Friday there is a time, when if a Muslim slave stands to pray and asks Allah for something, He will give it to him."</em></p><p class="ql-align-center"><strong style="color: rgb(255, 255, 255);">That time is after Asr until Maghrib. (Narrated by Bukhari & Muslim)</strong></p>` }
        ],
        calculationMethods: [
            { id: 0, name: 'Shia Ithna-Ansari' },
            { id: 1, name: 'University of Islamic Sciences, Karachi' },
            { id: 2, name: 'Islamic Society of North America (ISNA)' },
            { id: 3, name: 'Muslim World League (MWL)' },
            { id: 4, name: 'Umm Al-Qura University, Makkah' },
            { id: 5, name: 'Egyptian General Authority of Survey' },
            { id: 7, name: 'Institute of Geophysics, University of Tehran' },
            { id: 8, name: 'Gulf Region' },
            { id: 9, name: 'Kuwait' },
            { id: 10, name: 'Qatar' },
            { id: 11, name: 'Majlis Ugama Islam Singapura, Singapore' },
            { id: 12, name: 'Union of Islamic Organisations of France' },
            { id: 13, name: 'Diyanet İşleri Başkanlığı, Turkey' },
            { id: 14, name: 'Spiritual Administration of Muslims of Russia' },
            { id: 15, name: 'Moonsighting Committee Worldwide' },
            { id: 16, name: 'Dubai (unofficial)' },
            { id: 17, name: 'Ministry of Religious Affairs of Indonesia' },
            { id: 99, name: 'Custom' }
        ],
        madhabOptions: [
            { id: 0, name: 'Standard (Shafii, Maliki, Hanbali)' },
            { id: 1, name: 'Hanafi' }
        ],
        highLatitudeRules: [
            { id: 'auto', name: 'Automatic (Default)' },
            { id: 'MiddleOfTheNight', name: 'Middle of the Night' },
            { id: 'OneSeventh', name: 'One Seventh of the Night' },
            { id: 'AngleBased', name: 'Angle Based (Twilight)' }
        ],
        themeOptions: [
            { id: 'quran-tauhid', name: 'Tawhid & Aqidah', category: 'quran' },
            { id: 'quran-akhlaq', name: 'Akhlaq (Manners)', category: 'quran' },
            { id: 'quran-fikih', name: 'Fiqh', category: 'quran' },
            { id: 'quran-random', name: 'Random', category: 'quran' },
            { id: 'hadith-tauhid', name: 'Tawhid & Aqidah', category: 'hadith' },
            { id: 'hadith-akhlaq', name: 'Akhlaq (Manners)', category: 'hadith' },
            { id: 'hadith-fikih', name: 'Fiqh', category: 'hadith' },
            { id: 'hadith-random', name: 'Random', category: 'hadith' },
        ],
    }
};