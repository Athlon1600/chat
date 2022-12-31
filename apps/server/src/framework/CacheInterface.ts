export interface CacheInterface {

    getItem<T>(key: string): T;

    hasItem(key: string): boolean;

    putItem(key: string, data: any, seconds?: number): void;

    deleteItem(key: string): void;
}
