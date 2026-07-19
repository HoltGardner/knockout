import { z } from 'zod';

/** Append-only ledger events (spec §1.5.3, ticket T0.5). Balances and
 * K-factor are projections derived by replay, never stored as authority.
 * Schemas are strict: unknown fields are rejected, which is load-bearing
 * for the ethics suite. */

const base = {
  eventId: z.string().min(1),
  occurredAt: z.iso.datetime(),
};

export const CodeIssued = z.strictObject({
  ...base,
  type: z.literal('code_issued'),
  codeId: z.string().min(1),
  kind: z.enum(['print_batch', 'personal']),
});

export const CodeActivated = z.strictObject({
  ...base,
  type: z.literal('code_activated'),
  codeId: z.string().min(1),
  sharerAccountId: z.string().min(1),
});

export const CodeRedeemed = z.strictObject({
  ...base,
  type: z.literal('code_redeemed'),
  codeId: z.string().min(1),
  redeemerAccountId: z.string().min(1),
  channel: z.enum(['in_person', 'online']),
  proximityConfirmed: z.boolean(),
});

export const PurchaseRecorded = z.strictObject({
  ...base,
  type: z.literal('purchase_recorded'),
  purchaseId: z.string().min(1),
  sku: z.string().min(1),
  channel: z.enum(['dtc', 'amazon']),
  amountCents: z.number().int().positive(),
  attributedCodeId: z.string().min(1).nullable(),
});

/** Spec §1.4.2 guardrail: a stake accrues from a purchase and nothing
 * else. This schema must never grow a field that references redemptions,
 * recruit counts, or token prices — tests/ethics enforces the closed set. */
export const StakeAccrued = z.strictObject({
  ...base,
  type: z.literal('stake_accrued'),
  purchaseId: z.string().min(1),
  beneficiaryAccountId: z.string().min(1),
  amountCents: z.number().int().positive(),
});

export const PayoutExecuted = z.strictObject({
  ...base,
  type: z.literal('payout_executed'),
  payoutId: z.string().min(1),
  beneficiaryAccountId: z.string().min(1),
  amountCents: z.number().int().positive(),
});

export const LedgerEvent = z.discriminatedUnion('type', [
  CodeIssued,
  CodeActivated,
  CodeRedeemed,
  PurchaseRecorded,
  StakeAccrued,
  PayoutExecuted,
]);
export type LedgerEvent = z.infer<typeof LedgerEvent>;
