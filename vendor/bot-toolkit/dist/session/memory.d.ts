import type { StorageAdapter } from "grammy";
/**
 * In-memory session storage — the toolkit's default persistence adapter.
 *
 * Implements grammY's StorageAdapter so it drops straight into `session({...})`.
 * Suitable for development and for the test harness (deterministic, reset per
 * run). Production bots use Redis (RedisSessionStorage) automatically — createBot
 * auto-selects it when REDIS_URL is set — falling back to this in-memory adapter
 * otherwise. Both expose the same grammY StorageAdapter interface.
 */
export declare class MemorySessionStorage<T> implements StorageAdapter<T> {
    private store;
    read(key: string): T | undefined;
    write(key: string, value: T): void;
    delete(key: string): void;
    has(key: string): boolean;
    readAllKeys(): string[];
}
