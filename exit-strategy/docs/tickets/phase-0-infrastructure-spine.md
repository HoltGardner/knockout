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

- [ ] Drizzle schema: `accounts`, `codes` (id, kind: `print_batch` |
      `personal`, owner_account, status), `redemptions` (code, redeemer,
      channel: `in_person` | `online`, proximity_confirmed, weight),
      `purchases` (sku, channel: `dtc` | `amazon`, amount_cents,
      attributed_code), `stake_entries` (purchase_id NOT NULL FK →
      purchases, beneficiary_account, amount_cents), `payouts`.
- [ ] `stake_entries` has **no** column or join path referencing codes,
      redemptions, accounts-recruited, or any token price — purchases only
      (beneficiary aside).
- [ ] Ethics tests: (a) schema introspection asserts `stake_entries`' only
      outbound FK besides beneficiary is `purchase_id`; (b) property test:
      total stakes for an account are invariant under adding redemptions
      with no purchases (recruiting alone never pays).
- **AC:** ethics suite green; a migration adding a forbidden reference makes
  it red.

## T0.3 — Code generation service

- [ ] Collision-resistant short codes (unambiguous alphabet, checksum),
      batch generation for print runs (sized for D-002's 1,000-unit run,
      one code per deck + per rules card), personal invite codes on demand.
- [ ] Print-batch export (CSV) for the print vendor; codes created
      `unassigned`, bound to a sharer at first activation.
- **AC:** generate 10k codes with zero collisions in test; exported batch
  re-imports and validates round-trip.

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

## T0.6 — Revenue-share accounting

- [ ] Stake accrual rule: configurable percentage of an attributed
      purchase's `amount_cents`, accrued to the code's owning sharer;
      economics constants (deck $24.99 per D-002) from
      `packages/content/economics.ts`.
- [ ] Shopify webhook consumer records `purchase_recorded` with attributed
      code (order custom field / discount-code carrier).
- [ ] Stake ledger screen (spec §1.5.2): what your network earned you —
      reads projections only.
- **AC:** webhook fixture → purchase → stake visible on the ledger screen;
  ethics suite still green.

## T0.7 — Three-domain funnel wiring (spec §1.3, Part 5 item 2)

- [ ] whatsyourexitstrategy.com: landing + redeem entry + DTC purchase flow.
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
