import Stripe from 'stripe';
import { DECK_SKU_ESCAPE_VELOCITY } from '@exit/content';
import { PurchaseRecorded, type PurchaseRecordedEvent } from '@exit/ledger';

/** Webhook signature verification is pure HMAC — it never calls the Stripe
 * API, so this client needs no real key. The live API client (checkout
 * session creation) is constructed where it is used, with
 * STRIPE_SECRET_KEY from the environment. */
const offlineStripe = new Stripe('sk_offline_signature_verification_only');

/** Verify and parse a Stripe webhook delivery. Throws on a bad signature —
 * callers translate that into HTTP 400. */
export function parseWebhookEvent(
  rawBody: string,
  signatureHeader: string,
  webhookSecret: string,
): Promise<Stripe.Event> {
  return offlineStripe.webhooks.constructEventAsync(rawBody, signatureHeader, webhookSecret);
}

/** Translate a verified Stripe event into attribution-ledger events
 * (ticket T0.6). Idempotent by construction: the ledger eventId derives
 * from the Stripe event id, so a redelivered webhook maps to the same
 * ledger event and downstream dedupe is trivial. Unhandled or incomplete
 * events yield [] — this function never throws on shape. */
export function ledgerEventsFromStripeEvent(
  event: Stripe.Event,
): PurchaseRecordedEvent[] {
  if (event.type !== 'checkout.session.completed') return [];
  const session = event.data.object;
  if (session.payment_status !== 'paid') return [];
  if (typeof session.amount_total !== 'number' || session.amount_total <= 0) return [];
  const attributedCodeId = session.metadata?.['attributedCodeId'];
  return [
    PurchaseRecorded.parse({
      eventId: `stripe:${event.id}`,
      occurredAt: new Date(event.created * 1000).toISOString(),
      type: 'purchase_recorded',
      purchaseId: session.id,
      sku: session.metadata?.['sku'] || DECK_SKU_ESCAPE_VELOCITY,
      channel: 'dtc',
      amountCents: session.amount_total,
      attributedCodeId: attributedCodeId ? attributedCodeId : null,
    }),
  ];
}
