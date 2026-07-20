import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/** Relational schema (ticket T0.2). Schema-as-code so the §1.4.2 guardrail
 * is reviewable and introspectable: tests/ethics walks these table
 * definitions, so any migration adding a forbidden reference fails CI
 * before it reaches a database. */

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  /** §1.4 rule 5: revenue share requires an age-verified account. */
  ageVerifiedAt: timestamp('age_verified_at', { withTimezone: true }),
});

export const codes = pgTable('codes', {
  id: text('id').primaryKey(),
  kind: text('kind', { enum: ['print_batch', 'personal'] }).notNull(),
  status: text('status', { enum: ['unassigned', 'active', 'revoked'] }).notNull().default('unassigned'),
  /** Null until a sharer activates a print-batch code (T0.3). */
  ownerAccountId: text('owner_account_id').references(() => accounts.id),
  batchId: text('batch_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const redemptions = pgTable('redemptions', {
  id: text('id').primaryKey(),
  codeId: text('code_id').notNull().references(() => codes.id),
  redeemerAccountId: text('redeemer_account_id').notNull().references(() => accounts.id),
  channel: text('channel', { enum: ['in_person', 'online'] }).notNull(),
  proximityConfirmed: boolean('proximity_confirmed').notNull().default(false),
  /** Applied share weight (spec §1.2.4), from @exit/content constants. */
  weight: integer('weight').notNull(),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
});

export const purchases = pgTable('purchases', {
  id: text('id').primaryKey(),
  sku: text('sku').notNull(),
  channel: text('channel', { enum: ['dtc', 'amazon'] }).notNull(),
  amountCents: integer('amount_cents').notNull(),
  attributedCodeId: text('attributed_code_id').references(() => codes.id),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
});

/** §1.4.2: a stake references the purchase it derives from and the account
 * it pays — nothing else. No code, redemption, recruit, or token columns,
 * ever. tests/ethics asserts this column set and FK set are closed. */
export const stakeEntries = pgTable('stake_entries', {
  id: text('id').primaryKey(),
  purchaseId: text('purchase_id').notNull().references(() => purchases.id),
  beneficiaryAccountId: text('beneficiary_account_id').notNull().references(() => accounts.id),
  amountCents: integer('amount_cents').notNull(),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
});

export const payouts = pgTable('payouts', {
  id: text('id').primaryKey(),
  beneficiaryAccountId: text('beneficiary_account_id').notNull().references(() => accounts.id),
  amountCents: integer('amount_cents').notNull(),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
});
