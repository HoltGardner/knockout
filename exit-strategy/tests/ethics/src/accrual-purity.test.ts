import { describe, expect, it } from 'vitest';
import { DECK_PRICE_CENTS } from '@exit/content';
import { accrueStake, type AccrueStakeInput } from '@exit/ledger';

/** Spec §1.4.2: the stake is a function of real revenue only. These tests
 * pin the accrual API so recruitment context cannot influence a stake —
 * never weaken or skip them (see CLAUDE.md). */

const baseInput: AccrueStakeInput = {
  purchase: {
    eventId: 'stripe:evt_1',
    occurredAt: '2026-07-19T12:00:00.000Z',
    type: 'purchase_recorded',
    purchaseId: 'cs_1',
    sku: 'ES-DECK-EV1',
    channel: 'dtc',
    amountCents: DECK_PRICE_CENTS,
    attributedCodeId: 'code_1',
  },
  beneficiaryAccountId: 'acct_sharer',
  rateBps: 1000,
  eventId: 'stk_1',
  occurredAt: '2026-07-19T12:00:01.000Z',
};

describe('ethics: stake accrual is a pure function of the purchase', () => {
  it('identical purchases accrue identical stakes', () => {
    expect(accrueStake(baseInput)).toEqual(accrueStake({ ...baseInput }));
  });

  it('smuggled recruitment context cannot change the accrual', () => {
    const smuggled = {
      ...baseInput,
      recruitCount: 250,
      downlineDepth: 4,
      tokenPriceCents: 999,
    } as AccrueStakeInput;
    expect(accrueStake(smuggled)).toEqual(accrueStake(baseInput));
  });

  it('a recruitment-shaped purchase is rejected at the boundary', () => {
    const poisoned = {
      ...baseInput,
      purchase: { ...baseInput.purchase, recruitCount: 250 },
    } as unknown as AccrueStakeInput;
    expect(() => accrueStake(poisoned)).toThrow();
  });

  it('the stake can never exceed the revenue it derives from', () => {
    const full = accrueStake({ ...baseInput, rateBps: 10_000 });
    expect(full?.amountCents).toBe(DECK_PRICE_CENTS);
    expect(() => accrueStake({ ...baseInput, rateBps: 10_001 })).toThrow(RangeError);
  });
});
