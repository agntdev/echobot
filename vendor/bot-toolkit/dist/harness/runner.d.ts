import type { Bot } from "grammy";
import type { BotSpec, SpecResult } from "./types.js";
/**
 * Replay a spec against a bot, tokenlessly. Installs a capture transformer and
 * overrides the bot's error handler so handler exceptions surface in the result
 * (instead of being swallowed by the toolkit's bot.catch). Returns per-step
 * pass/fail with captured calls and any thrown error.
 *
 * Call on a FRESH bot per spec (capture state + fake botInfo are per-bot).
 */
export declare function runSpec(bot: Bot<any>, spec: BotSpec): Promise<SpecResult>;
