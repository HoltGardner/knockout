import { describe, expect, it } from 'vitest';
import { LedgerEvent } from './events';

describe('ledger events', () => {
  it('parses a valid redemption event', () => {
    const parsed = LedgerEvent.parse({
      eventId: 'evt_1',
      occurredAt: '2026-07-19T12:00:00Z',
      type: 'code_redeemed',
      codeId: 'code_1',
      redeemerAccountId: 'acct_2',
      channel: 'in_person',
      proximityConfirmed: true,
    });
    expect(parsed.type).toBe('code_redeemed');
  });

  it('rejects unknown event types', () => {
    const result = LedgerEvent.safeParse({
      eventId: 'evt_2',
      occurredAt: '2026-07-19T12:00:00Z',
      type: 'recruit_bonus',
    });
    expect(result.success).toBe(false);
  });
});
