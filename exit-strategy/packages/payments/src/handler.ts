import type { PurchaseRecordedEvent } from '@exit/ledger';
import { ledgerEventsFromStripeEvent, parseWebhookEvent } from './webhook';

export interface StripeWebhookHandlerOptions {
  webhookSecret: string;
  /** Append the translated events to the attribution ledger (T0.5). */
  publish: (events: PurchaseRecordedEvent[]) => void | Promise<void>;
}

/** Web-standard (Request -> Response) webhook endpoint, mountable in any
 * framework (Next.js route handler, plain Node server, edge runtime). */
export function createStripeWebhookHandler(options: StripeWebhookHandlerOptions) {
  return async (request: Request): Promise<Response> => {
    const signature = request.headers.get('stripe-signature');
    if (!signature) return new Response('missing stripe-signature header', { status: 400 });
    const rawBody = await request.text();
    let event;
    try {
      event = await parseWebhookEvent(rawBody, signature, options.webhookSecret);
    } catch {
      return new Response('invalid signature', { status: 400 });
    }
    const ledgerEvents = ledgerEventsFromStripeEvent(event);
    if (ledgerEvents.length > 0) await options.publish(ledgerEvents);
    return Response.json({ received: true, ledgerEvents: ledgerEvents.length });
  };
}
