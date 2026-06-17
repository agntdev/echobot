/**
 * In-memory session storage — the toolkit's default persistence adapter.
 *
 * Implements grammY's StorageAdapter so it drops straight into `session({...})`.
 * Suitable for development and for the test harness (deterministic, reset per
 * run). Production bots use Redis (RedisSessionStorage) automatically — createBot
 * auto-selects it when REDIS_URL is set — falling back to this in-memory adapter
 * otherwise. Both expose the same grammY StorageAdapter interface.
 */
export class MemorySessionStorage {
    store = new Map();
    read(key) {
        return this.store.get(key);
    }
    write(key, value) {
        this.store.set(key, value);
    }
    delete(key) {
        this.store.delete(key);
    }
    has(key) {
        return this.store.has(key);
    }
    readAllKeys() {
        return [...this.store.keys()];
    }
}
