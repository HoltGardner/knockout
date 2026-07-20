# Execution Plan — Step by Step

Companion to `analysis-profitability.md`. Tags: **[ME]** = AI executes
autonomously; **[YOU]** = only the founder can; **[BOTH]** = split inside
the step. Optimized for [ME]. Founder cash outlay stays $0 until Step 6,
which sits behind gate G2. Gate definitions live in the analysis doc
(proposed D-006).

## Step 0 — Unblock the rails · [YOU] · ~5 min · blocking everything

Run `docs/migration.md` to seed `HoltGardner/exit-strategy` from the
staging tree, then start the next Claude session scoped to that repo. This
turns on real CI and makes deploys possible. Everything below assumes it.

## Step 1 — Escape Velocity engine + balance proof · [ME]

- Implement spec §2 as a pure reducer in `packages/engine/escape-velocity`
  (turn phases EARN→PAY→MOVE→DRAW, Jobs/Assets/Loans/Events, Lifestyle
  Creep tiers, bust/sell rules), all numbers from `packages/content`.
- Sim strategies in `packages/sim`: grinder, investor, leverage; CI
  asserts §2.3 — grinder never escapes, investor median escape turn 6–8,
  leverage shows high variance. Tuning becomes a data diff that must keep
  the suite green.

## Step 2 — The web app · [ME]

- `apps/web` becomes the real Next.js PWA: solo tutorial round,
  pass-and-play, mobile-first (spec §1.5).
- T0.4 redeem flow (`POST /redeem`, two-device in-person confirm,
  anti-abuse limits) and T0.5 event store on Postgres, using the existing
  schema, events, and projections.
- Mount the existing Stripe endpoints (`@exit/payments`); share-image
  auto-capture of the turn-six end state with the sharer's code (§2.4);
  event instrumentation that measures G1 and G3 directly.

## Step 3 — Accounts only you can own · [YOU] · ~1 hour total

No code, just credentials handed to me as env vars:
- Hosting (Vercel recommended) + Postgres (Neon recommended), connected
  to the new repo.
- Stripe: live + test keys, webhook endpoint secret
  (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`).
- DNS for whatsyourexitstrategy.com (app), exitstrategy.group,
  theschoolofpops.com pointed per T0.7.

## Step 4 — Launch free, measure G1 · [BOTH]

- [ME] Deploy, watch event data, tune game numbers via content config
  (balance suite keeps tuning honest), fix onboarding drop-offs, produce
  the weekly numbers readout.
- [YOU] 5–10 in-person playtests — the spec's real tuning loop and the
  raw footage for first clips. Recruit from your community.
- Gate review G1 → decision-log entry with real numbers.

## Step 5 — Preorder + content engine, measure G2 · [BOTH]

- [ME] Preorder page on the landing domain using the existing Checkout
  builder; clear ship-date and refund terms; preorder counter wired to
  real Stripe data. Clip scripts and share-image assets for the three
  content formats (§4.4); press/creator kit.
- [YOU] Be the face: post the clips, run the community, do the in-person
  circuit. This is the founder-bound lever; the analysis assumes your
  hours go here because nothing else in this plan needs them.
- Gate review G2 (≥150 paid preorders) → decision-log entry. **No vendor
  is paid before G2 passes.**

## Step 6 — Print run · [YOU decides, ME prepares]

- [ME] Print-ready files from the content source (rules card §2.1, full
  deck, box), code CSV batches via `@exit/codes` (2,000 codes), vendor
  spec sheet, RFQ email drafts to 3–4 vendors.
- [YOU] Pick vendor, pay (the only real check in the plan), approve
  physical proofs. Real quotes replace the [A] assumptions in the
  analysis; margins recomputed in a decision-log entry.

## Step 7 — Ship, close the loop, measure G3 · [ME, YOU packs boxes]

- [ME] Fulfillment wiring (labels, notification emails), stake-ledger
  screen (spec §1.5.2), K-factor + unit-economics projections live
  (T0.8), weekly readouts.
- [YOU] Self-fulfil run 1 from home (do things that don't scale); move to
  3PL when volume justifies it.
- Gate review G3 → run 2 + Buy, Borrow, Die (D-003) go/no-go.

## Step 8 — Game 2 and the series · [ME]

On a G3 pass: Buy, Borrow, Die engine + online (its balance targets in
CI), sharing the entire spine untouched. Rolodex third. The marginal cost
of each additional game is one engine + one content pack — this is where
the series economics compound.

## Standing rules

- Every gate result, pass or fail, becomes a decision-log entry with the
  measured numbers before the next step starts.
- Founder hours are spent only where tagged [YOU]; if I can do a thing,
  I do.
- Payouts remain accrual-only until the banking/compliance decision is
  taken (Phase 0 ticket, out-of-scope note).
