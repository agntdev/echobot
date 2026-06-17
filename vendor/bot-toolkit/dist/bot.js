import { Bot, session, } from "grammy";
import { resolveSessionStorage } from "./session/redis.js";
/**
 * createBot — the toolkit's curated entry point. Wraps grammY's Bot with the
 * default session middleware and an error boundary, so every generated bot
 * shares one opinionated structure: the Dev-stage codegen targets this API, and
 * the test harness (M0-10) replays Updates against bots built here.
 *
 * The BotFather token is injected at runtime (never baked); polling vs webhook
 * is chosen at deploy time (docs/pivot M1-7).
 */
export function createBot(token, opts) {
    const bot = new Bot(token);
    bot.use(session({
        initial: opts.initial,
        // Auto-select: explicit adapter → Redis (REDIS_URL) → in-memory.
        storage: resolveSessionStorage(opts.storage),
    }));
    bot.catch((err) => {
        if (opts.onError)
            opts.onError(err);
        else
            console.error("[agntdev-bot] unhandled error:", err);
    });
    return bot;
}
