import type { BotSpec } from "./types.js";
/** The set of commands a single spec MEANINGFULLY exercises: a command counts
 *  only if the step that sends it also asserts at least one expected call. */
export declare function commandsInSpec(spec: BotSpec): Set<string>;
/** The union of commands exercised across a whole suite. */
export declare function commandsInSpecs(specs: BotSpec[]): Set<string>;
export interface CoverageReport {
    /** Declared commands (from Details), normalized without slash. Case PRESERVED
     *  (grammY routes case-sensitively). */
    declared: string[];
    /** Declared commands with >= 1 MEANINGFUL spec exercising them. */
    covered: string[];
    /** Declared commands with NO meaningful spec — these fail the gate. */
    missing: string[];
    /** covered / declared as a 0..1 fraction (1 when nothing is declared). */
    fraction: number;
}
/** Normalize a declared command list: strip a leading slash + any @suffix, trim,
 *  drop blanks, dedup. Case is PRESERVED (review-1 L1). A token that doesn't fit
 *  the Telegram charset is kept VERBATIM (review-1 L2) rather than dropped, so a
 *  weird declared command can't silently escape the coverage requirement — it
 *  stays in `declared`, will never be matched by a spec, and shows up as missing. */
export declare function normalizeDeclaredCommands(declared: string[]): string[];
/**
 * computeCoverage compares the commands exercised by the spec suite against the
 * declared command list. A command is "covered" iff at least one spec sends it.
 * fraction is covered/declared (1.0 when nothing is declared, so a command-less
 * bot is not blocked by this half of the gate).
 */
export declare function computeCoverage(specs: BotSpec[], declared: string[]): CoverageReport;
