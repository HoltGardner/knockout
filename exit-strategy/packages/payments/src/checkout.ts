import type Stripe from 'stripe';
import {
  DECK_NAME_ESCAPE_VELOCITY,
  DECK_PRICE_CENTS,
  DECK_SKU_ESCAPE_VELOCITY,
} from '@exit/content';

export interface DeckCheckoutInput {
  /** The share/redeem code this purchase is attributed to, if any
   * (spec §1.2 / ticket T0.6). Carried in session metadata and read back
   * by the webhook. */
  attributedCodeId: string | null;
  successUrl: string;
  cancelUrl: string;
  quantity?: number;
}

/** Params for a hosted Stripe Checkout session selling the flagship deck.
 * Price always comes from @exit/content (D-002) — never hard-code it. */
export function buildDeckCheckoutParams(input: DeckCheckoutInput): Stripe.Checkout.SessionCreateParams {
  const quantity = input.quantity ?? 1;
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    throw new RangeError('quantity must be an integer between 1 and 10');
  }
  return {
    mode: 'payment',
    line_items: [
      {
        quantity,
        price_data: {
          currency: 'usd',
          unit_amount: DECK_PRICE_CENTS,
          product_data: {
            name: DECK_NAME_ESCAPE_VELOCITY,
            metadata: { sku: DECK_SKU_ESCAPE_VELOCITY },
          },
        },
      },
    ],
    metadata: {
      sku: DECK_SKU_ESCAPE_VELOCITY,
      attributedCodeId: input.attributedCodeId ?? '',
    },
    client_reference_id: input.attributedCodeId ?? undefined,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
  };
}
