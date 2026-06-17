import type { StorageAdapter } from "grammy";
/**
 * Redis session storage for production bots (Change 3 / docs/pivot open
 * question 2.8). Auto-selected by createBot when REDIS_URL is set, so generated
 * bots persist session state in Redis with ZERO code changes (and fall back to
 * in-memory otherwise). State is recyclable — losing Redis loses sessions, not
 * the bot.
 */
/**
 * The minimal ioredis surface RedisSessionStorage needs. Keeping it an
 * interface lets us unit-test the adapter with a fake in-memory client (no
 * server, no ioredis dependency in the test).
 */
export interface RedisLike {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<unknown>;
    del(key: string): Promise<unknown>;
    keys(pattern: string): Promise<string[]>;
}
/**
 * A grammY StorageAdapter backed by Redis. Values are JSON-serialized and
 * stored under a key prefix so a shared Redis (should one ever be used) is
 * namespaced. Async throughout — grammY's StorageAdapter accepts MaybePromise.
 */
export declare class RedisSessionStorage<T> implements StorageAdapter<T> {
    private readonly client;
    private readonly prefix;
    constructor(client: RedisLike, prefix?: string);
    private k;
    read(key: string): Promise<T | undefined>;
    write(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
    has(key: string): Promise<boolean>;
    readAllKeys(): AsyncIterableIterator<string>;
}
/**
 * Factory that builds a RedisSessionStorage from a connection URL using a real
 * ioredis client. ioredis is loaded LAZILY (via createRequire) so a bot that
 * never sets REDIS_URL doesn't pull it in. ioredis is a CJS module, so a
 * synchronous require keeps createBot synchronous; the client connects in the
 * background and reads/writes resolve once connected.
 */
export declare function defaultRedisStorage<T>(url: string): StorageAdapter<T>;
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
export declare function resolveSessionStorage<S extends object>(explicit: StorageAdapter<S> | undefined, env?: {
    REDIS_URL?: string;
}, make?: (url: string) => StorageAdapter<S>): StorageAdapter<S>;
