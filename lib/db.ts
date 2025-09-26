import type { Settings } from '../types';

// Let TypeScript know that Dexie is available globally from the CDN script
declare var Dexie: any;

// FIX: Define a local interface for Dexie's Table and use it to type the table properties.
// This avoids the "Cannot find namespace 'Dexie'" error that occurs when using `Dexie.Table`
// with `declare var Dexie: any;`, while still providing type safety for database operations.
interface DexieTable<T, TKey> {
    get(key: TKey): Promise<T | undefined>;
    put(item: T, key?: TKey): Promise<TKey>;
    clear(): Promise<void>;
    toCollection(): { first(): Promise<T | undefined> };
}

interface StoredSettings extends Settings {
    id: number;
}

interface PrayerTimesCache {
    key: string;
    data: any[];
}

interface AppState {
    key: string;
    value: any;
}

class WaqtiDB extends Dexie {
    settings: DexieTable<StoredSettings, number>;
    prayerTimesCache: DexieTable<PrayerTimesCache, string>;
    appState: DexieTable<AppState, string>;

    constructor() {
        super('waqtiDB');
        this.version(1).stores({
            settings: 'id', // Primary key 'id', always will be 1
            prayerTimesCache: 'key', // Primary key, e.g., 'Jakarta-2023-10'
            appState: 'key' // Primary key, e.g., 'hasSeenWelcome'
        });
        this.settings = this.table('settings');
        this.prayerTimesCache = this.table('prayerTimesCache');
        this.appState = this.table('appState');
    }
}

export const db = new WaqtiDB();
