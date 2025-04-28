import { Topic } from "@/models/topics";

export interface CacheItem
{
    topics: Topic[];
}

export class CacheService {

    private CACHE_KEY: string;
    private CACHE_TIMESTAMP_KEY: string;

    constructor(key: string) {
        this.CACHE_KEY = key;
        this.CACHE_TIMESTAMP_KEY = `${key}_timestamp`;
    }

    Store(value: CacheItem): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(this.CACHE_KEY, serializedValue);
            localStorage.setItem(this.CACHE_TIMESTAMP_KEY, Date.now().toString());
        } catch (error) {
            console.error('Error setting item to localStorage', error);
        }
    }

    Retrieve<CacheItem>(): CacheItem | null {
        try {
            const serializedValue = localStorage.getItem(this.CACHE_KEY);
            if (serializedValue === null) {
                return null;
            }
            return JSON.parse(serializedValue) as CacheItem;
        } catch (error) {
            console.error('Error getting item from localStorage', error);
            return null;
        }
    }

    RetrieveTimestamp(): number | null {
        try {
            const timestamp = localStorage.getItem(this.CACHE_TIMESTAMP_KEY);
            if (timestamp === null) {
                return null;
            }
            return parseInt(timestamp);
        } catch (error) {
            console.error('Error getting timestamp from localStorage', error);
            return null;
        }
    }

    Remove(): void {
        try {
            localStorage.removeItem(this.CACHE_KEY);
            localStorage.removeItem(this.CACHE_TIMESTAMP_KEY);
        } catch (error) {
            console.error('Error removing item from localStorage', error);
        }
    }

    Clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage', error);
        }
    }
}

