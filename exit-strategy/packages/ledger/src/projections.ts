import type { LedgerEvent } from './events';

/** Stake balances derived purely by replaying the event log (T0.5).
 * Duplicate eventIds (webhook redeliveries) are ignored, so replay is
 * idempotent. Only stake_accrued and payout_executed can move a balance —
 * redemptions and code events cannot, by construction (§1.4.2). */
export function projectStakeBalances(events: readonly LedgerEvent[]): Map<string, number> {
  const balances = new Map<string, number>();
  const seen = new Set<string>();
  for (const event of events) {
    if (seen.has(event.eventId)) continue;
    seen.add(event.eventId);
    if (event.type === 'stake_accrued') {
      balances.set(
        event.beneficiaryAccountId,
        (balances.get(event.beneficiaryAccountId) ?? 0) + event.amountCents,
      );
    } else if (event.type === 'payout_executed') {
      balances.set(
        event.beneficiaryAccountId,
        (balances.get(event.beneficiaryAccountId) ?? 0) - event.amountCents,
      );
    }
  }
  return balances;
}
