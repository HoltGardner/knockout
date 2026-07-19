import { describe, expect, it } from 'vitest';
import { accrueStake, computeStakeCents } from './accrual';

const purchase = {
  eventId: 'stripe:evt_1',
  occurredAt: '2026-07-19T12:00:00.000Z',
  type: 'purchase_recorded',
  purchaseId: 'cs_1',
  sku: 'ES-DECK-EV1',
  channel: 'dtc',
  amountCents: 2499,
  attributedCodeId: 'code_1',
} as const;

describe('computeStakeCents', () => {
  it('floors to whole cents', () => {
    expect(computeStakeCents(2499, 1000)).toBe(249);
  });
  it('caps the rate at 100% of revenue', () => {
    expect(computeStakeCents(2499, 10_000)).toBe(2499);
    expect(() => computeStakeCents(2499, 10_001)).toThrow(RangeError);
  });
  it('rejects non-positive amounts', () => {
    expect(() => computeStakeCents(0, 1000)).toThrow(RangeError);
  });
});

describe('accrueStake', () => {
  it('emits a stake referencing the purchase', () => {
    const stake = accrueStake({
      purchase,
      beneficiaryAccountId: 'acct_sharer',
      rateBps: 1000,
      eventId: 'stk_1',
      occurredAt: '2026-07-19T12:00:01.000Z',
    });
    expect(stake).toMatchObject({
      type: 'stake_accrued',
      purchaseId: 'cs_1',
      beneficiaryAccountId: 'acct_sharer',
      amountCents: 249,
    });
  });
  it('returns null when the accrual rounds to zero', () => {
    const stake = accrueStake({
      purchase: { ...purchase, amountCents: 5 },
      beneficiaryAccountId: 'acct_sharer',
      rateBps: 100,
      eventId: 'stk_2',
      occurredAt: '2026-07-19T12:00:01.000Z',
    });
    expect(stake).toBeNull();
  });
});
