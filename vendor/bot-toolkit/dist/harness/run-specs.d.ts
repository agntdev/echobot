import type { Bot } from "grammy";
import type { BotSpec, SpecResult } from "./types.js";
export interface SuiteResult {
    total: number;
    passed: number;
    failed: number;
    results: SpecResult[];
}
/**
 * Run many specs, each against a FRESH bot from `makeBot` (isolation — capture
 * state and the fake botInfo are per-bot). Returns the aggregate.
 */
export declare function runSpecs(makeBot: () => Bot<any>, specs: BotSpec[]): Promise<SuiteResult>;
/** A concise human/CI-readable report. */
export declare function formatSuiteResult(suite: SuiteResult): string;
/** Validate + narrow an untrusted JSON value into a BotSpec. Throws on malformed
 *  input (generated specs are not blindly trusted). */
export declare function parseBotSpec(obj: unknown): BotSpec;
/** Validate an array of specs (e.g. a parsed specs.json). */
export declare function parseBotSpecs(arr: unknown): BotSpec[];
