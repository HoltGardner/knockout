# Architecture — AI-First Design and Implementation

This project is built primarily by AI agents under human direction. The
architecture is chosen so that agents can build, verify, and tune it safely:
everything an agent needs to know is in the repo, everything that must never
break is a test, and everything that gets tuned is data.

## Principles

1. **Spec-driven.** `docs/master-spec-v1.md` + `docs/decisions.md` are the
   source of truth. Code implements numbered spec sections and cites them.
   Tickets in `docs/tickets/` decompose the spec into agent-executable tasks
   with acceptance criteria.
2. **Agent-legible code.** Strict TypeScript, small single-purpose modules,
   Zod schemas at every package boundary, colocated tests. A fresh agent
   session should be able to load one package and act safely.
3. **Content as data.** Card copy, deck compositions, and all tunable
   numbers live in `packages/content` as structured, schema-validated data —
   the single source rendered to the web UI, the print PDF pipeline, and the
   simulator. Playtest tuning is a data diff, reviewable at a glance.
4. **Deterministic pure engine.** Each game is a pure reducer over typed
   state with seeded RNG (`packages/engine`). No I/O in game logic. This
   buys: perfect replays, async multiplayer as an event log, and cheap
   simulation.
5. **Simulation as CI (the AI-first playtest loop).** `packages/sim` runs
   Monte Carlo games with scripted strategies (grinder, investor, leverage,
   concentrator, spreader) and asserts the spec's balance targets on every
   commit. Later phase: LLM playtester evals that read only the printed card
   copy and flag rules confusion before humans ever sit down.
6. **Guardrails are structural.** The §1.4 invariants are schema constraints
   and a dedicated `tests/ethics/` suite (see CLAUDE.md). CI treats an
   ethics failure as unshippable.
7. **Event-sourced money.** Codes, redemptions, purchases, and stake
   accruals are append-only events; balances and K-factor are projections.
   Auditability is a feature of the brand, not an afterthought.

## Monorepo layout (pnpm workspaces, TypeScript strict)

```
packages/
  engine/     Pure game reducers: escape-velocity/, buy-borrow-die/, ...
  content/    Card copy + numbers as data; schemas; print/web renderers read this
  ledger/     Attribution + stake ledger: events, projections, schema (Drizzle)
  sim/        Monte Carlo harness, strategy bots, balance-target assertions
  print/      Content -> print-ready PDFs (rules card, deck, coded inserts)
apps/
  web/        PWA (Next.js): redeem, play, invite, stake ledger (spec §1.5)
docs/         Spec, decisions, architecture, tickets
tests/
  ethics/     §1.4 invariant suite (schema introspection + property tests)
```

## Stack

- **TypeScript** (strict) across engine, apps, infra; **pnpm** workspaces.
- **Next.js PWA** for `apps/web` — mobile-first, installable, no app store
  (spec §1.5.1); async + pass-and-play first, live multiplayer fast-follow.
- **Postgres + Drizzle ORM** — schema-as-code so the stake-ledger guardrail
  is a reviewable, testable migration, not a DBA convention.
- **Zod** for all runtime contracts (API, content files, events).
- **Vitest** (unit + property tests), **Playwright** (flows), GitHub Actions
  CI running: typecheck, lint, unit, ethics suite, simulation balance suite.
- **Shopify webhooks** for DTC purchases (spec §4.3); Amazon units carry the
  coded card so attribution re-links at redemption.

## Economic constants (from decisions D-002)

Deck price $24.99; first run 1,000 units. These live in
`packages/content/economics.ts` and feed the unit-economics instrumentation
(spec §4.2) and stake accrual math — never hard-coded elsewhere.
