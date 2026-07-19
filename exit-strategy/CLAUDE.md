# CLAUDE.md — EXIT STRATEGY

Games that teach the real plays of economic success, spread in person.
Read `docs/master-spec-v1.md` (the founder's handoff brief) and
`docs/decisions.md` (locked decisions) before building anything. When code
and spec disagree, the spec + decision log win; cite the spec section
(e.g. "§2.3") in commit messages and doc comments when implementing it.

## Non-negotiable invariants (spec §1.4 — enforce in code, not prose)

1. **Stakes are revenue-linked, never recruitment-linked.** The stake ledger
   may reference purchases and nothing else. The schema must make a
   recruitment-linked reward inexpressible, and `tests/ethics/` must fail if
   any migration or code path breaks that. Never weaken, skip, or delete an
   ethics test to make a build pass.
2. **Structural caps stay structural.** Power Law's bet caps (max 3 bets,
   max 2 chips per bet) and any other safety cap live in the engine's types
   and validation — never only in UI copy.
3. **Printed lessons must be true.** Any odds, distributions, or claims on a
   card must match the implemented deck composition; tests verify counts
   against printed copy.
4. **Reveals include, never con.** Hidden-information mechanics (House
   Rules) must telegraph that more exists; no bait-and-switch flows anywhere,
   including share prompts.
5. **Expose plays, don't cheerlead harm.** Buy, Borrow, Die and similar
   spicy content keeps the civic framing from the spec's card copy verbatim.

## Engineering conventions

- **TypeScript strict everywhere.** pnpm workspaces monorepo; layout and
  package boundaries in `docs/architecture.md`.
- **Game logic is a pure, deterministic engine** (`packages/engine`): no
  I/O, no wall-clock, seeded RNG only. Every game is
  `(state, action, seed) -> state`. This is what makes simulation, replay,
  and async multiplayer cheap.
- **Card copy and numbers are data, not code** (`packages/content`): one
  structured source per game feeds the web UI, the print pipeline, and the
  simulator. Tuning a number never touches engine logic.
- **Balance targets are CI tests** (`packages/sim`): Monte Carlo runs assert
  the spec's tuning targets (§2.3: grinder never escapes; investor median
  escape turn 6–8; §3.2: full-spread reliably beats concentrator). A change
  that breaks a balance target fails CI and needs a decision-log entry.
- **The attribution ledger is append-only and event-sourced**
  (`packages/ledger`): balances are derived by replay, never stored as the
  authority.
- **Decisions get logged.** Anything that changes locked numbers, pricing,
  sequencing, or an invariant requires a new entry in `docs/decisions.md`.

## Working style for agents

- Small, single-concept modules with colocated tests; prefer extending an
  existing package over creating a new one.
- Work from tickets in `docs/tickets/` — each task there has acceptance
  criteria; implement to those, and update the ticket checklist in the same
  PR as the code.
- No secrets in the repo. Stripe credentials (`STRIPE_SECRET_KEY`,
  `STRIPE_WEBHOOK_SECRET`) and all other payment/webhook credentials come
  from environment configuration only.
