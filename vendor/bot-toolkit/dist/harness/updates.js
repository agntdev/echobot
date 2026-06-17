// Synthetic Update builders for the replay harness. Ids/dates are caller-supplied
// (the runner assigns them deterministically per step) so replays are reproducible.
const DEFAULT_CHAT_ID = 1;
const DEFAULT_USER_ID = 1;
/** Id the harness uses for the bot's own user (matches the fake botInfo). */
export const HARNESS_BOT_ID = 42;
function privateChat(id) {
    return { id, type: "private", first_name: "Test" };
}
function humanUser(id) {
    return { id, is_bot: false, first_name: "Test" };
}
/** bot_command entity for a leading "/cmd" so grammY's command router matches. */
function botCommandEntities(text) {
    const m = /^\/[A-Za-z0-9_]+/.exec(text);
    return m ? [{ type: "bot_command", offset: 0, length: m[0].length }] : undefined;
}
/** A text message update. A leading "/command" automatically gets a bot_command entity. */
export function textUpdate(updateId, text, opts) {
    const chatId = opts?.chatId ?? DEFAULT_CHAT_ID;
    const userId = opts?.userId ?? DEFAULT_USER_ID;
    const entities = botCommandEntities(text);
    return {
        update_id: updateId,
        message: {
            message_id: updateId,
            date: 0,
            chat: privateChat(chatId),
            from: humanUser(userId),
            text,
            ...(entities ? { entities } : {}),
        },
    };
}
/** A callback-query update (button tap). Includes the message the button was on,
 *  so handlers can edit it. */
export function callbackUpdate(updateId, data, opts) {
    const chatId = opts?.chatId ?? DEFAULT_CHAT_ID;
    const userId = opts?.userId ?? DEFAULT_USER_ID;
    const messageId = opts?.messageId ?? updateId;
    return {
        update_id: updateId,
        callback_query: {
            id: String(updateId),
            from: humanUser(userId),
            message: {
                message_id: messageId,
                date: 0,
                chat: privateChat(chatId),
                from: { id: HARNESS_BOT_ID, is_bot: true, first_name: "TestBot" },
                text: "(previous)",
            },
            chat_instance: `ci-${chatId}`,
            data,
        },
    };
}
