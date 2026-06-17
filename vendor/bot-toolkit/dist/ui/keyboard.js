// AGNTDEV bot toolkit — inline-keyboard UI-kit.
//
// Pure builders that return plain Telegram InlineKeyboardMarkup-shaped objects.
// Kept dependency-free (no grammY import) so the UI-kit is fully unit-testable
// without a running bot — and so the test harness (M0-10) can assert against the
// exact outgoing-call payloads a bot produces.
/** A callback button: tapping it sends `callbackData` back to the bot. */
export function inlineButton(text, callbackData) {
    return { text, callback_data: callbackData };
}
/** A url button: tapping it opens `url`. */
export function urlButton(text, url) {
    return { text, url };
}
/** Wrap rows of buttons into an InlineKeyboardMarkup. */
export function inlineKeyboard(rows) {
    return { inline_keyboard: rows };
}
/** A menu: one callback button per item, laid out in `columns` per row. */
export function menuKeyboard(items, columns = 1) {
    const cols = Math.max(1, Math.floor(columns));
    const rows = [];
    for (let i = 0; i < items.length; i += cols) {
        rows.push(items.slice(i, i + cols).map((it) => inlineButton(it.text, it.data)));
    }
    return inlineKeyboard(rows);
}
/** A yes/no confirmation. Callbacks are `<actionPrefix>:yes` / `<actionPrefix>:no`. */
export function confirmKeyboard(actionPrefix, opts) {
    return inlineKeyboard([
        [
            inlineButton(opts?.yes ?? "✅ Yes", `${actionPrefix}:yes`),
            inlineButton(opts?.no ?? "❌ No", `${actionPrefix}:no`),
        ],
    ]);
}
/**
 * Slice `items` into a page and build prev/next controls. Controls carry the
 * target page index in their callback data: `<prefix>:prev:<n>` / `<prefix>:next:<n>`.
 */
export function paginate(items, opts) {
    const perPage = Math.max(1, Math.floor(opts.perPage));
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    const page = Math.min(Math.max(0, Math.floor(opts.page)), totalPages - 1);
    const start = page * perPage;
    const pageItems = items.slice(start, start + perPage);
    const prefix = opts.callbackPrefix ?? "page";
    const row = [];
    if (page > 0) {
        row.push(inlineButton(opts.prevLabel ?? "« Prev", `${prefix}:prev:${page - 1}`));
    }
    if (page < totalPages - 1) {
        row.push(inlineButton(opts.nextLabel ?? "Next »", `${prefix}:next:${page + 1}`));
    }
    const controls = {
        inline_keyboard: row.length > 0 ? [row] : [],
    };
    return { page, totalPages, pageItems, controls };
}
