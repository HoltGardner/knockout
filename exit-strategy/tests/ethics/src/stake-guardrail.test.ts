import { describe, expect, it } from 'vitest';
import { StakeAccrued } from '@exit/ledger';

/** Spec §1.4.2 (the HEX guardrail): the ownership stake is revenue-linked,
 * never recruitment-linked. A stake event references a purchase and nothing
 * else. CI treats a failure here as unshippable — never weaken or skip
 * these tests to make a build pass (see CLAUDE.md). */

const validStake = {
  eventId: 'evt_1',
  occurredAt: '2026-07-19T12:00:00Z',
  type: 'stake_accrued',
  purchaseId: 'pur_1',
  beneficiaryAccountId: 'acct_1',
  amountCents: 250,
};

describe('ethics: stakes are purchase-linked only', () => {
  it('accepts a purchase-linked stake', () => {
    expect(StakeAccrued.safeParse(validStake).success).toBe(true);
  });

  it('rejects a stake with no purchase reference', () => {
    const { purchaseId: _omitted, ...noPurchase } = validStake;
    expect(StakeAccrued.safeParse(noPurchase).success).toBe(false);
  });

  it.each([
    ['redemptionId', 'red_1'],
    ['recruitedAccountId', 'acct_9'],
    ['recruitCount', 3],
    ['tokenPriceCents', 100],
  ])('rejects recruitment-shaped field %s', (field, value) => {
    expect(StakeAccrued.safeParse({ ...validStake, [field]: value }).success).toBe(false);
  });

  it('the schema field set is closed and known', () => {
    expect(Object.keys(StakeAccrued.shape).sort()).toEqual([
      'amountCents',
      'beneficiaryAccountId',
      'eventId',
      'occurredAt',
      'purchaseId',
      'type',
    ]);
  });
});
