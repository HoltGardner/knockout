# Phase 0 — Infrastructure Spine (build first)

Implements spec Part 5 items 1–2: the code and attribution system, and the
three-domain funnel wiring. Every game depends on this. Each task lists
acceptance criteria (AC); a task is done when its AC pass in CI. Check tasks
off in this file in the same PR as the code.

## T0.1 — Monorepo scaffold

- [x] pnpm workspace with `packages/engine`, `packages/content`,
      `packages/ledger`, `packages/sim`, `apps/web`, `tests/ethics` per
      `docs/architecture.md` (plus `packages/print`); strict tsconfig shared
      via base config.
- [x] CI (GitHub Actions): typecheck, lint, Vitest, with `tests/ethics` and
      `packages/sim` as separately named required jobs
      (`.github/workflows/ci.yml` — activates once this tree is a repo
      root; verified locally until then).
- **AC:** clean clone → `pnpm install && pnpm check` passes; an intentionally
  failing ethics test blocks the pipeline. *Verified locally 2026-07-19:
  full suite green (16 tests); adding a `recruitCount` field to the stake
  schema turned the ethics suite red, restored green after revert.*

## T0.2 — Ledger schema with the §1.4.2 guardrail

- [x] Drizzle schema (`packages/ledger/src/schema.ts`): `accounts` (with
      `age_verified_at` for §1.4.5), `codes` (kind `print_batch` |
      `personal`, owner nullable until activation, status), `redemptions`
      (code, redeemer, channel, proximity_confirmed, applied weight),
      `purchases` (sku, channel, amount_cents, attributed_code),
      `stake_entries` (purchase_id NOT NULL FK → purchases,
      beneficiary_account, amount_cents), `payouts`.
- [x] `stake_entries` columns and FKs form a closed set: purchases (value
      source) and accounts (beneficiary) only.
- [x] Ethics tests (`tests/ethics/src/schema-guardrail.test.ts`):
      (a) introspection via `getTableConfig` asserts the closed column set,
      the FK targets, and that purchase linkage is NOT NULL; (b) property
      tests: 500 purchase-less redemptions leave stake balances bit-for-bit
      identical, 100 redemptions with zero purchases pay exactly nothing,
      duplicate deliveries never double-pay (via
      `projectStakeBalances`, an early slice of T0.5).
- [ ] Generate SQL migrations with drizzle-kit once a live Postgres target
      exists (deploy-time task; introspection tests already gate the schema
      they generate from).
- **AC:** ethics suite green; a migration adding a forbidden reference makes
  it red. *Verified 2026-07-19: adding a `redemption_id` reference to
  `stake_entries` turned both introspection tests red; green on revert.*

## T0.3 — Code generation service

- [x] Collision-resistant short codes (`packages/codes`): 30-symbol
      alphabet with 0/O, 1/I/L, U dropped for hand entry; format
      `PREFIX-XXXX-XXXC` with a weighted mod-30 check character (catches
      all single typos tested and >95% of adjacent transpositions);
      deterministic seeded rng for tests, crypto rng for production;
      batch generation sized for D-002 (1,000 decks × 2 codes).
- [x] Print-batch CSV export/import (`packages/codes/src/batch-csv.ts`);
      parse validates every check character so a corrupted vendor file
      fails before printing. Codes are created `unassigned` and bind to a
      sharer at first activation (status enum in the T0.2 schema).
- [ ] Personal invite codes on demand — generation exists
      (`generateCode` with a personal prefix); the issuing endpoint lands
      with T0.4.
- **AC:** generate 10k codes with zero collisions in test; exported batch
  re-imports and validates round-trip. *Both verified in the suite
  2026-07-19.*

## T0.4 — Redemption flow (proximity-weighted, spec §1.2)

- [ ] `POST /redeem`: validates code, creates account if needed, records
      redemption, grants free online entry to that game.
- [ ] In-person confirmation: QR scan handshake or mutual-confirm step
      between two devices; sets `proximity_confirmed`, applies the higher
      weight. Online link redemption gets base weight.
- [ ] Anti-abuse: per-code redemption limits, device/account rate limits.
- **AC:** integration tests cover both channels; weights recorded per spec;
  a replayed/duplicated confirm does not double-count.

## T0.5 — Attribution ledger (event-sourced)

- [ ] Append-only event log: `code_issued`, `code_activated`,
      `code_redeemed`, `purchase_recorded`, `stake_accrued`,
      `payout_executed`.
- [ ] Projections: per-account stake balance, per-code funnel state,
      per-game K-factor inputs (spec §4.1). Balances derived by replay only.
- **AC:** replaying the event log from zero reproduces identical
  projections; projection tables can be dropped and rebuilt.

## T0.6 — Revenue-share accounting (Stripe per D-005)

- [x] Stake accrual rule: configurable rate (bps, structurally capped at
      100% of revenue) applied to an attributed purchase's `amountCents`
      — `packages/ledger/src/accrual.ts`; economics constants (deck $24.99
      per D-002) from `packages/content/economics.ts`. Purity locked by
      `tests/ethics/src/accrual-purity.test.ts`.
- [x] Stripe integration (`packages/payments`): hosted Checkout params for
      the deck with the attribution code in session metadata; webhook
      signature verification; `checkout.session.completed` →
      `purchase_recorded` with idempotent event ids; mountable
      (Request → Response) webhook handler. *Verified with signed offline
      fixtures — 14 tests.*
- [ ] Mount the webhook + checkout endpoints in `apps/web` and configure
      the Stripe dashboard endpoint (lands with T0.4/T0.7; needs
      `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` at deploy).
- [ ] Stake ledger screen (spec §1.5.2): what your network earned you —
      reads projections only.
- **AC:** webhook fixture → purchase → stake visible on the ledger screen;
  ethics suite still green. *Fixture → purchase → stake path verified at
  the package level 2026-07-19; recruitment-influenced accrual turns the
  ethics suite red (verified and reverted).*

## T0.7 — Three-domain funnel wiring (spec §1.3, Part 5 item 2)

- [ ] whatsyourexitstrategy.com: landing + redeem entry + DTC purchase flow
      (Stripe Checkout via `@exit/payments`, per D-005).
- [ ] Successful redemption lands on exitstrategy.group (community home).
- [ ] theschoolofpops.com linked as the depth layer. All three resolve
      every code to the single ledger.
- **AC:** e2e (Playwright): scan → redeem → land on group → purchase →
  attribution recorded, one ledger.

## T0.8 — K-factor + unit-economics instrumentation (spec §4.1–4.2)

- [ ] Event capture for the full loop; K computed per game as a projection.
- [ ] Unit-economics dashboard inputs: CAC components, deck margin at
      $24.99, LTV via repeat purchases; queryable, even if the UI is
      minimal.
- **AC:** simulated funnel fixtures produce the expected K value; metrics
  update on replay.

## Explicitly out of Phase 0

Game engines and UIs (Phase 1: Escape Velocity per spec Part 5 item 3),
live multiplayer, Amazon channel integration beyond the coded-card insert,
payout execution rails (accrual only for now — payouts need a
banking/compliance decision, flag for the decision log).
