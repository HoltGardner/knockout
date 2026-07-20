import type { z } from 'zod';
import { PurchaseRecorded, StakeAccrued } from './events';

/** Revenue-share accrual (ticket T0.6, spec §1.2.3 and §1.4.2).
 * A stake is a function of a recorded purchase and a rate — nothing else.
 * There is deliberately no parameter through which redemption counts,
 * recruit counts, or token prices could influence the result; tests/ethics
 * locks this shape. */

/** Rate is in basis points. Structural cap: a stake can never exceed the
 * revenue it derives from (10_000 bps = 100%). */
export function computeStakeCents(amountCents: number, rateBps: number): number {
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new RangeError('amountCents must be a positive integer');
  }
  if (!Number.isInteger(rateBps) || rateBps < 0 || rateBps > 10_000) {
    throw new RangeError('rateBps must be an integer in 0..10000');
  }
  return Math.floor((amountCents * rateBps) / 10_000);
}

export interface AccrueStakeInput {
  purchase: z.infer<typeof PurchaseRecorded>;
  beneficiaryAccountId: string;
  rateBps: number;
  eventId: string;
  occurredAt: string;
}

/** Returns a validated stake event referencing the purchase, or null when
 * the rate rounds the accrual to zero. */
export function accrueStake(input: AccrueStakeInput): z.infer<typeof StakeAccrued> | null {
  const purchase = PurchaseRecorded.parse(input.purchase);
  const amountCents = computeStakeCents(purchase.amountCents, input.rateBps);
  if (amountCents === 0) return null;
  return StakeAccrued.parse({
    eventId: input.eventId,
    occurredAt: input.occurredAt,
    type: 'stake_accrued',
    purchaseId: purchase.purchaseId,
    beneficiaryAccountId: input.beneficiaryAccountId,
    amountCents,
  });
}
