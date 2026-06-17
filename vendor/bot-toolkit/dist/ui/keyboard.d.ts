/** A callback button: tapping it sends `callback_data` back to the bot. */
export interface CallbackButton {
    text: string;
    callback_data: string;
}
/** A url button: tapping it opens `url`. */
export interface UrlButton {
    text: string;
    url: string;
}
/** A single inline keyboard button. Discriminated so the markup is structurally
 *  assignable to grammY's `reply_markup` while staying dependency-free. */
export type InlineButton = CallbackButton | UrlButton;
/** Telegram InlineKeyboardMarkup shape. */
export interface InlineKeyboardMarkup {
    inline_keyboard: InlineButton[][];
}
/** A callback button: tapping it sends `callbackData` back to the bot. */
export declare function inlineButton(text: string, callbackData: string): CallbackButton;
/** A url button: tapping it opens `url`. */
export declare function urlButton(text: string, url: string): UrlButton;
/** Wrap rows of buttons into an InlineKeyboardMarkup. */
export declare function inlineKeyboard(rows: InlineButton[][]): InlineKeyboardMarkup;
/** A menu: one callback button per item, laid out in `columns` per row. */
export declare function menuKeyboard(items: ReadonlyArray<{
    text: string;
    data: string;
}>, columns?: number): InlineKeyboardMarkup;
/** A yes/no confirmation. Callbacks are `<actionPrefix>:yes` / `<actionPrefix>:no`. */
export declare function confirmKeyboard(actionPrefix: string, opts?: {
    yes?: string;
    no?: string;
}): InlineKeyboardMarkup;
export interface PaginateOptions {
    /** 0-based requested page (clamped into range). */
    page: number;
    perPage: number;
    /** Callback prefix for the prev/next controls; default "page". */
    callbackPrefix?: string;
    prevLabel?: string;
    nextLabel?: string;
}
export interface Paginated<T> {
    /** Clamped 0-based page actually shown. */
    page: number;
    totalPages: number;
    pageItems: T[];
    /** Prev/Next control row (empty inline_keyboard when a single page). */
    controls: InlineKeyboardMarkup;
}
/**
 * Slice `items` into a page and build prev/next controls. Controls carry the
 * target page index in their callback data: `<prefix>:prev:<n>` / `<prefix>:next:<n>`.
 */
export declare function paginate<T>(items: ReadonlyArray<T>, opts: PaginateOptions): Paginated<T>;
