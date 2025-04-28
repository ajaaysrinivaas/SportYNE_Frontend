// inMemoryCacheService.ts
export class InMemoryCacheService<T> {
    private cache: Map<string, { data: T; timestamp: number }>;
    private duration: number;
  
    constructor(duration: number) {
      this.cache = new Map();
      this.duration = duration;
    }
  
    get(key: string): T | null {
      const item = this.cache.get(key);
      if (item && Date.now() - item.timestamp < this.duration) {
        return item.data;
      }
      // Remove expired item
      this.cache.delete(key);
      return null;
    }
  
    set(key: string, data: T): void {
      this.cache.set(key, { data, timestamp: Date.now() });
    }
  
    remove(key: string): void {
      this.cache.delete(key);
    }
  
    clear(): void {
      this.cache.clear();
    }
  }
  