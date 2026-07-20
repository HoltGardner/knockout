import { getTableConfig } from 'drizzle-orm/pg-core';
import { describe, expect, it } from 'vitest';
import { projectStakeBalances, stakeEntries, type LedgerEvent } from '@exit/ledger';
import { mulberry32 } from '@exit/engine';

/** Ticket T0.2 ethics tests. (a) Schema introspection: stake_entries may
 * reference purchases (its source of value) and accounts (its
 * beneficiary) — nothing else, and its column set is closed. (b) Property:
 * recruiting alone never pays — stake balances are invariant under any
 * number of redemptions that lack purchases. */

describe('ethics: stake_entries schema is purchase-linked only', () => {
  const config = getTableConfig(stakeEntries);

  it('has a closed, known column set', () => {
    expect(config.columns.map((c) => c.name).sort()).toEqual([
      'amount_cents',
      'beneficiary_account_id',
      'id',
      'occurred_at',
      'purchase_id',
    ]);
  });

  it('foreign keys point only at purchases and accounts', () => {
    const targets = config.foreignKeys
      .map((fk) => {
        const ref = fk.reference();
        return `${ref.columns[0]?.name}->${getTableConfig(ref.foreignTable).name}`;
      })
      .sort();
    expect(targets).toEqual(['beneficiary_account_id->accounts', 'purchase_id->purchases']);
  });

  it('purchase linkage is mandatory, not optional', () => {
    const purchaseColumn = config.columns.find((c) => c.name === 'purchase_id');
    expect(purchaseColumn?.notNull).toBe(true);
  });
});

describe('ethics: recruiting alone never pays', () => {
  const stake = (id: string, account: string, cents: number): LedgerEvent => ({
    eventId: id,
    occurredAt: '2026-07-19T12:00:00.000Z',
    type: 'stake_accrued',
    purchaseId: 'pur_1',
    beneficiaryAccountId: account,
    amountCents: cents,
  });
  const redemption = (id: string): LedgerEvent => ({
    eventId: id,
    occurredAt: '2026-07-19T12:00:00.000Z',
    type: 'code_redeemed',
    codeId: 'code_1',
    redeemerAccountId: `acct_recruit_${id}`,
    channel: 'in_person',
    proximityConfirmed: true,
  });

  it('stake balances are invariant under purchase-less redemptions', () => {
    const base: LedgerEvent[] = [stake('stk_1', 'acct_sharer', 249)];
    const rng = mulberry32(7);
    const withRecruiting = [
      ...base,
      ...Array.from({ length: 500 }, (_, i) => redemption(`red_${i}_${Math.floor(rng() * 1e9)}`)),
    ];
    expect(projectStakeBalances(withRecruiting)).toEqual(projectStakeBalances(base));
  });

  it('a hundred redemptions with zero purchases pay exactly nothing', () => {
    const events = Array.from({ length: 100 }, (_, i) => redemption(`red_${i}`));
    expect(projectStakeBalances(events).size).toBe(0);
  });

  it('replaying duplicate deliveries does not double-pay', () => {
    const events = [stake('stk_1', 'acct_sharer', 249), stake('stk_1', 'acct_sharer', 249)];
    expect(projectStakeBalances(events).get('acct_sharer')).toBe(249);
  });
});
