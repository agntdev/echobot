import type { Update } from "grammy/types";
/** Id the harness uses for the bot's own user (matches the fake botInfo). */
export declare const HARNESS_BOT_ID = 42;
/** A text message update. A leading "/command" automatically gets a bot_command entity. */
export declare function textUpdate(updateId: number, text: string, opts?: {
    chatId?: number;
    userId?: number;
}): Update;
/** A callback-query update (button tap). Includes the message the button was on,
 *  so handlers can edit it. */
export declare function callbackUpdate(updateId: number, data: string, opts?: {
    chatId?: number;
    userId?: number;
    messageId?: number;
}): Update;
