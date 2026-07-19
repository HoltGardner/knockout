# EXIT STRATEGY

Games that teach the real plays of economic success — designed to spread in
person. The way the game spreads teaches the same lesson the game teaches:
growth is curriculum.

The line: **Escape Velocity** (flagship, locked) → **Buy, Borrow, Die** →
**Rolodex** → **Power Law** → **House Rules**, on a shared spine of unique
codes, in-person redemption, an attribution ledger, and revenue-linked
stakes.

## Domains

- [whatsyourexitstrategy.com](https://whatsyourexitstrategy.com) — the
  question, the games, code redemption, DTC store.
- [exitstrategy.group](https://exitstrategy.group) — the community: chapters,
  meetups, in-person play.
- [theschoolofpops.com](https://theschoolofpops.com) — the curriculum and
  the book.

## Start here

| Doc | What it is |
|---|---|
| [`docs/master-spec-v1.md`](docs/master-spec-v1.md) | The founder's handoff brief — all five games at full spec |
| [`docs/decisions.md`](docs/decisions.md) | Locked decisions (numbers, $24.99 / 1,000-unit run, ship order) |
| [`docs/architecture.md`](docs/architecture.md) | AI-first architecture: spec-driven, content as data, simulation as CI |
| [`CLAUDE.md`](CLAUDE.md) | Rules of engagement for AI agents building this — including the non-negotiable §1.4 invariants |
| [`docs/tickets/phase-0-infrastructure-spine.md`](docs/tickets/phase-0-infrastructure-spine.md) | The current build ticket: the code + attribution spine |

## Status

Decisions D-001–D-004 locked. Phase 0 T0.1 (monorepo scaffold, CI, ethics
guardrail suite) is complete and verified locally — `pnpm install && pnpm
check`. Next: migrate this tree to the dedicated repository
([`docs/migration.md`](docs/migration.md)), then T0.2 (ledger schema).
