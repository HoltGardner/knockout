/** Economic constants locked by decision D-002 (docs/decisions.md).
 * Changing either requires a superseding decision-log entry. */
export const DECK_PRICE_CENTS = 2499;
export const FIRST_PRINT_RUN_UNITS = 1000;

/** Catalog identity for the flagship deck (spec Part 2). */
export const DECK_SKU_ESCAPE_VELOCITY = 'ES-DECK-EV1';
export const DECK_NAME_ESCAPE_VELOCITY = 'ESCAPE VELOCITY — the deck';

/** Share weights (spec §1.2.4): in-person confirmation outweighs an online
 * link. v1 starting point — tune only via a decision-log entry. */
export const SHARE_WEIGHT_IN_PERSON = 3;
export const SHARE_WEIGHT_ONLINE = 1;
