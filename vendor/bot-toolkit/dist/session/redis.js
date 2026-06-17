import { createRequire } from "node:module";
import { MemorySessionStorage } from "./memory.js";
/**
 * A grammY StorageAdapter backed by Redis. Values are JSON-serialized and
 * stored under a key prefix so a shared Redis (should one ever be used) is
 * namespaced. Async throughout — grammY's StorageAdapter accepts MaybePromise.
 */
export class RedisSessionStorage {
    client;
    prefix;
    constructor(client, prefix = "sess:") {
        this.client = client;
        this.prefix = prefix;
    }
    k(key) {
        return this.prefix + key;
    }
    async read(key) {
        const raw = await this.client.get(this.k(key));
        if (raw == null)
            return undefined;
        try {
            return JSON.parse(raw);
        }
        catch {
            // A corrupt/non-JSON value is treated as absent (recyclable state).
            return undefined;
        }
    }
    async write(key, value) {
        await this.client.set(this.k(key), JSON.stringify(value));
    }
    async delete(key) {
        await this.client.del(this.k(key));
    }
    async has(key) {
        return (await this.read(key)) !== undefined;
    }
    async *readAllKeys() {
        const keys = await this.client.keys(this.prefix + "*");
        for (const k of keys)
            yield k.slice(this.prefix.length);
    }
}
/**
 * Factory that builds a RedisSessionStorage from a connection URL using a real
 * ioredis client. ioredis is loaded LAZILY (via createRequire) so a bot that
 * never sets REDIS_URL doesn't pull it in. ioredis is a CJS module, so a
 * synchronous require keeps createBot synchronous; the client connects in the
 * background and reads/writes resolve once connected.
 */
export function defaultRedisStorage(url) {
    const require = createRequire(import.meta.url);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ioredis = require("ioredis");
    const Redis = ioredis.default ?? ioredis.Redis ?? ioredis;
    // maxRetriesPerRequest: null → commands queue while (re)connecting rather
    // than failing fast, matching session-store expectations.
    const client = new Redis(url, { maxRetriesPerRequest: null, lazyConnect: false });
    return new RedisSessionStorage(client);
}
/**
 * resolveSessionStorage picks the session storage for createBot:
 *   1. an explicitly-passed adapter wins;
 *   2. else, when env.REDIS_URL is set, build Redis storage (via `make`);
 *   3. else in-memory (development / no Redis configured).
 *
 * `env` and `make` are injectable for testing (default: process.env +
 * defaultRedisStorage). Always returns a concrete adapter — the single source
 * of truth for createBot's storage choice.
 */
export function resolveSessionStorage(explicit, env = process.env, make = defaultRedisStorage) {
    if (explicit)
        return explicit;
    if (env.REDIS_URL)
        return make(env.REDIS_URL);
    return new MemorySessionStorage();
}
