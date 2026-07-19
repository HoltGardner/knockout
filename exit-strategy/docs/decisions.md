# Decision Log

Append-only. Every entry is a locked decision; reversing one requires a new
entry that supersedes it by ID. Agents: treat this file plus
`master-spec-v1.md` as the source of truth for what to build.

---

## D-001 — Escape Velocity v1 numbers confirmed (2026-07-19)

The v1 numbers in spec §2.2 and §2.3 are locked as the playtest starting
point: Jobs income 2–4, starting Cash 5, starting Burn 3, Asset tiers
4/1 · 8/2 · 15/4, Loans 10 Cash at 2/turn interest, the four Event types,
Burn track 0–12. Tuning targets stand: investor escapes turns 6–8, pure
grinder never escapes. Changes come only from logged playtests (human or
simulated) and get a superseding decision entry.

## D-002 — Price point and first print run (2026-07-19)

Physical deck retail price: **$24.99**. First print run: **1,000 units**,
DTC launch through whatsyourexitstrategy.com per spec §4.3. Implication for
Phase 0: revenue-share accounting and unit-economics instrumentation should
assume this price and run size for initial margins and payout modeling.

## D-003 — Buy, Borrow, Die ships second (2026-07-19)

Play 2 is **Buy, Borrow, Die** (max reach, framing discipline per spec §3.1
and §1.4.5). Rolodex ships third as the retention play. This matches the
spec's Part 5 default sequence: infrastructure → Escape Velocity → Buy,
Borrow, Die (+2 weeks) → Rolodex → Power Law → House Rules.

## D-004 — Fresh dedicated repository; AI-first development (2026-07-19)

All platform and game development moves to a dedicated repository (this
`exit-strategy/` tree is its future root; it currently lives inside the
knockout fork only because the session lacked GitHub permission to create
repositories). All development follows the AI-first practices defined in
`docs/architecture.md` and enforced through `CLAUDE.md` — spec-driven,
agent-legible code, game content as data, guardrails and balance targets as
CI tests.
