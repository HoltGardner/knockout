import Stripe from 'stripe';
import { describe, expect, it } from 'vitest';
import { createStripeWebhookHandler } from './handler';
import { ledgerEventsFromStripeEvent, parseWebhookEvent } from './webhook';

const SECRET = 'whsec_test_secret';
const stripe = new Stripe('sk_test_offline');

function completedSessionEvent(overrides: Record<string, unknown> = {}) {
  return {
    id: 'evt_1',
    object: 'event',
    api_version: '2025-06-30',
    created: 1_752_912_000,
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_1',
        object: 'checkout.session',
        payment_status: 'paid',
        amount_total: 2499,
        metadata: { sku: 'ES-DECK-EV1', attributedCodeId: 'code_abc' },
        ...overrides,
      },
    },
  };
}

function sign(payload: string): string {
  return stripe.webhooks.generateTestHeaderString({ payload, secret: SECRET });
}

describe('webhook signature verification', () => {
  it('accepts a correctly signed payload', async () => {
    const payload = JSON.stringify(completedSessionEvent());
    const event = await parseWebhookEvent(payload, sign(payload), SECRET);
    expect(event.id).toBe('evt_1');
  });

  it('rejects a tampered payload', async () => {
    const payload = JSON.stringify(completedSessionEvent());
    const header = sign(payload);
    const tampered = payload.replace('2499', '1');
    await expect(parseWebhookEvent(tampered, header, SECRET)).rejects.toThrow();
  });

  it('rejects the wrong secret', async () => {
    const payload = JSON.stringify(completedSessionEvent());
    await expect(parseWebhookEvent(payload, sign(payload), 'whsec_other')).rejects.toThrow();
  });
});

describe('ledger translation', () => {
  const asEvent = (e: unknown) => e as Stripe.Event;

  it('maps a paid session to a purchase_recorded event', () => {
    const [purchase] = ledgerEventsFromStripeEvent(asEvent(completedSessionEvent()));
    expect(purchase).toMatchObject({
      type: 'purchase_recorded',
      eventId: 'stripe:evt_1',
      purchaseId: 'cs_test_1',
      sku: 'ES-DECK-EV1',
      channel: 'dtc',
      amountCents: 2499,
      attributedCodeId: 'code_abc',
    });
  });

  it('is idempotent on redelivery: same Stripe event, same ledger eventId', () => {
    const a = ledgerEventsFromStripeEvent(asEvent(completedSessionEvent()));
    const b = ledgerEventsFromStripeEvent(asEvent(completedSessionEvent()));
    expect(a[0]?.eventId).toBe(b[0]?.eventId);
  });

  it('missing attribution becomes null, not a fake code', () => {
    const event = completedSessionEvent({ metadata: { sku: 'ES-DECK-EV1' } });
    expect(ledgerEventsFromStripeEvent(asEvent(event))[0]?.attributedCodeId).toBeNull();
  });

  it('ignores unpaid sessions and unrelated event types', () => {
    expect(ledgerEventsFromStripeEvent(asEvent(completedSessionEvent({ payment_status: 'unpaid' })))).toEqual([]);
    const other = { ...completedSessionEvent(), type: 'payment_intent.succeeded' };
    expect(ledgerEventsFromStripeEvent(asEvent(other))).toEqual([]);
  });

  it('ignores sessions with no positive total', () => {
    expect(ledgerEventsFromStripeEvent(asEvent(completedSessionEvent({ amount_total: null })))).toEqual([]);
  });
});

describe('webhook handler', () => {
  const request = (payload: string, header?: string) =>
    new Request('https://whatsyourexitstrategy.com/api/stripe/webhook', {
      method: 'POST',
      body: payload,
      headers: header ? { 'stripe-signature': header } : {},
    });

  it('publishes ledger events for a valid delivery', async () => {
    const published: unknown[] = [];
    const handler = createStripeWebhookHandler({
      webhookSecret: SECRET,
      publish: (events) => void published.push(...events),
    });
    const payload = JSON.stringify(completedSessionEvent());
    const response = await handler(request(payload, sign(payload)));
    expect(response.status).toBe(200);
    expect(published).toHaveLength(1);
  });

  it('rejects bad signatures without publishing', async () => {
    const published: unknown[] = [];
    const handler = createStripeWebhookHandler({
      webhookSecret: SECRET,
      publish: (events) => void published.push(...events),
    });
    const payload = JSON.stringify(completedSessionEvent());
    expect((await handler(request(payload, 'bad_header'))).status).toBe(400);
    expect((await handler(request(payload))).status).toBe(400);
    expect(published).toHaveLength(0);
  });
});
