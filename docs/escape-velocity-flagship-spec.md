# Escape Velocity & the Five-Game Line — Build Specification v1

**Status:** Draft for review — v1 numbers are playtest starting points, not final.
**Audience:** Claude Code (build agent) and the founder.
**Scope:** Shared systems, flagship at production depth, four follow-up games, growth architecture, build sequence.

> **Authorship note:** This document was written fresh from the handoff summary.
> Every number, card copy line, and mechanic below is a v1 proposal to be
> confirmed or adjusted in review — nothing here is locked until the decision
> blocks in §7 are answered.

---

## 0. Decisions to lock before build (§7 has details)

| # | Decision | Owner | Status |
|---|----------|-------|--------|
| 1 | Confirm Escape Velocity v1 numbers as playtest baseline | Founder | **OPEN** |
| 2 | Physical deck price point + first print-run size (DTC) | Founder | **OPEN** |
| 3 | Second game to ship: Buy Borrow Die (reach) vs Rolodex (brand fit) | Founder | **OPEN** |

---

## 1. Shared systems (every game inherits these)

### 1.1 The single-card rules constraint

Every game's complete rules must fit on **one card** (both sides, poker size,
minimum 8pt type). This is a hard constraint, not a goal:

- If a mechanic can't be explained inside the card budget, the mechanic is cut
  or simplified — the card is never enlarged and a second rules card is never
  added.
- Front of card: setup + the turn. Back of card: how you win + the three most
  common edge cases. Everything else must be self-evident from card copy.
- Teach time target: a new player is taking their first turn within 90 seconds
  of the box opening.

### 1.2 The share-to-unlock loop (with in-person weighting)

Each game ships with locked bonus content (expansion micro-packs, alternate
event cards, cosmetic card backs in the online version). Content unlocks by
**sharing**, with in-person sharing weighted above digital sharing:

| Share type | Signal | Weight |
|---|---|---|
| In-person scan | A *new* device/account scans this deck's unique QR code | **3×** |
| Hosted game | A new account finishes an online game you created | 2× |
| Link share | A new account signs up via your share link | 1× |

- Every physical deck carries a unique deck code (QR + human-readable) on the
  box and on the Signal Boost card (§2.6).
- Unlocks are also purchasable outright at a fair price. Sharing is a shortcut,
  never the only path (ethical constraint §1.4).

### 1.3 The three-domain funnel

Every game lives in three domains, each with exactly one job and one metric:

1. **Feed (content):** short-form clips of real game moments.
   Metric: click-through to Play.
2. **Play (free online baseline):** the full base game, free, in the browser.
   Metric: activation — first completed game.
3. **Table (physical deck):** the paid product.
   Metric: deck purchase, attributed to the share graph where possible.

Traffic flows Feed → Play → Table. The physical deck points back into the loop
via its QR code, closing the circle.

### 1.4 Ethical design rules (hard constraints, enforced in code)

These are invariants, not guidelines. The infrastructure must make violating
them impossible, and each ships with an automated test:

1. **No recruitment compensation.** Rewards (revenue share, unlocks) may derive
   only from *direct purchase attribution*, exactly **one level deep**, capped
   at 20% of a single purchase. The data model must have no way to express a
   reward chain (see §1.5 and §5.1). This is the HEX guardrail.
2. **Share prompts are bounded.** At most one share prompt per play session,
   always skippable in one tap, never loss-framed ("share or lose X" is
   forbidden copy).
3. **No pay-to-win.** All locked content is cosmetic or additive-variety only;
   the free base game is always the complete competitive game.
4. **True printed odds.** Any probability a game states on a card must be the
   actual probability in the deck composition. Tests verify card counts against
   printed odds.
5. **Age gate on money.** Revenue share requires an age-verified account.
6. **No dark patterns.** No countdown-pressure purchases, no obscured
   unsubscribe, no pre-checked boxes.

### 1.5 The ownership stake (HEX guardrail, baked into the schema)

The ownership/revenue-share program is wired to **real revenue share at the
data-model level**:

- `RevenueShare` rows foreign-key to a `Purchase` row and nothing else. There
  is no table, column, or join path that links a reward to a signup, a
  referral-of-a-referral, or any token.
- Attribution depth is structurally 1: `Purchase.attributed_to` is a single
  account ID, not a chain.
- A CI test asserts the schema has no path from `RevenueShare` to anything but
  `Purchase`, so future contributors cannot accidentally build the thing that
  gets founders served.

### 1.6 The online baseline

Every game ships a free web version first. It is the playtest instrument, the
funnel's middle, and the attribution point. Requirements: playable solo,
pass-and-play, and async multiplayer; full event instrumentation (§5.2); no
install; loads under 2 seconds on a mid-range phone.

---

## 2. Escape Velocity (flagship) — full production depth

### 2.1 Concept

You have a job, a lifestyle, and a way out. **Escape velocity** is the moment
your passive income covers your burn. The trap: grinding the job inflates your
lifestyle, so the bar you must clear rises as you earn. You cannot grind your
way out — the job funds the escape; it is not the escape.

- **Players:** 2–5 · **Time:** 20–30 min · **Age:** 12+
- **Win:** At the start of your turn, if your **Passive ≥ Burn**, you have
  reached Escape Velocity. You win.

### 2.2 Component list

| Component | Count | Notes |
|---|---|---|
| Rules card | 1 | Single-card constraint, §1.1 |
| Player dashboards | 5 | Card-stock, four tracks: Cash 0–20, Salary 2–8, Burn 2–8, Passive 0–8 |
| Tracking cubes | 20 | 4 per player (one per track) |
| Creep tokens | 10 | 2 per player |
| Asset cards | 24 | 8 Hustles, 10 Funds, 6 Engines (§2.4) |
| Side Gig cards | 18 | One-time cash / mini-passive (§2.4) |
| Event cards | 12 | One flipped per round (§2.4) |
| Signal Boost card | 1 | The share moment (§2.6) |
| First-player token | 1 | |
| **Total cards** | **60** | Tuck box, poker size |

### 2.3 Rules card — exact printed copy

**FRONT**

> **ESCAPE VELOCITY** · 2–5 players · 25 min
>
> **SETUP** — Each player: a dashboard, cubes on **Cash 2 · Salary 6 · Burn 3
> · Passive 0**. Shuffle Assets; deal 4 face-up as the Market. Shuffle Side
> Gigs and Events into their own decks. Youngest goes first.
>
> **EACH ROUND** — Flip 1 Event. It applies to everyone this round.
>
> **YOUR TURN**
> 1. **Escape check:** Passive ≥ Burn? You've escaped — you win.
> 2. **Collect:** gain Cash equal to your Passive.
> 3. **One action:**
> • **GRIND** — Gain Cash = Salary − Burn. Then add 1 Creep token; if you
> have 2, remove both and raise Burn by 1.
> • **INVEST** — Buy 1 Market card with Cash. Raise Passive by its number.
> Refill the Market.
> • **SIDE GIG** — Draw 2 Side Gig cards, keep 1, resolve it.
> • **DOWNSHIFT** — Lower Burn by 1 (minimum 2) and discard your Creep
> tokens. No income this turn.

**BACK**

> **HOW YOU WIN** — Escape velocity = the start of any of your turns where
> **Passive ≥ Burn**. Passive never goes away. Burn only rises through Creep
> and Events — and only falls when you Downshift.
>
> **THE TRAP** — Grinding pays Salary *minus* Burn, and every second Grind
> raises Burn. Grind forever and your paycheck's real value shrinks to
> nothing. The job funds the escape. It is not the escape.
>
> **EDGE CASES**
> • Can't afford any Market card? You may still Grind, Side Gig, or Downshift.
> • Two players escape the same round: highest Passive wins; tie = shared win.
> • Salary changes (Events) never change Burn unless the card says so.
>
> **FIRST TO ESCAPE?** — Read the Signal Boost card aloud. Yes, really.

### 2.4 Card copy — Assets, Side Gigs, Events (samples of exact copy)

**Assets** (front: name, cost, passive; back: one-line lesson)

| Tier | Count | Cost | Passive | Sample names |
|---|---|---|---|---|
| Hustle | 8 | 3 | +1 | Vending Route, Print-on-Demand Shop, Parking Spot Sublet, Niche Newsletter |
| Fund | 10 | 7 | +2 | Index Fund, Dividend Ladder, REIT, Duplex Rental |
| Engine | 6 | 12 | +4 | Laundromat, Self-Storage Lot, Small SaaS, Car Wash |

Sample, exact copy —

> **INDEX FUND** · Cost 7 · Passive +2
> *(back)* Boring wins. The market doesn't know you exist, and that's the point.

> **LAUNDROMAT** · Cost 12 · Passive +4
> *(back)* Quarters, every day, whether you show up or not. That's the whole idea.

**Side Gigs** (18): 8× one-time cash (+3 to +5), 6× "pay 2, gain Passive +1",
4× gamble ("Flip the top Asset card: even cost, gain +5 Cash; odd, lose 2").

> **FREELANCE SPRINT** — Gain 4 Cash. *(back)* Fast money spends fast.

> **COURSE LAUNCH** — Pay 2 Cash. Raise Passive by 1. *(back)* Build once, sell twice.

**Events** (12, one per round): Bull Market (Market cards cost 2 less this
round), Recession (Salaries −1 this round), Rent Hike (everyone's Burn +1
unless they Downshifted last round), Layoffs (Grind gains nothing this round),
Windfall (everyone +2 Cash), Raise (Grinders: Salary +1 *and* add a Creep
token — the golden handcuffs card), plus 6 more mild variants.

### 2.5 Tuned v1 numbers and the win math

**Starting state:** Cash 2, Salary 6, Burn 3, Passive 0. Creep: every 2nd
Grind → Burn +1.

**The trap curve (grind-only line):** Grind yields 3, 3, 2, 2, 1, 1, 0, 0, −1…
Net income hits zero by turn 7 and goes negative after — visible on the
dashboard, and Passive never moves, so pure grinding *cannot* win. This curve
is the lesson and the content clip (§5.4).

**The clean escape line (illustrative optimal):**

| Turn | Action | Cash | Passive | Burn |
|---|---|---|---|---|
| 1 | Grind (+3) | 5 | 0 | 3 |
| 2 | Grind (+3) | 8 | 0 | 4 (creep) |
| 3 | Invest Fund (−7) | 1 | 2 | 4 |
| 4 | Collect +2, Invest Hustle (−3) | 0 | 3 | 4 |
| 5 | Collect +3, Grind (+2) | 5 | 3 | 4 |
| 6 | Collect +3, Invest Fund (−7) | 1 | 5 | 4 |
| 7 | **Escape check: 5 ≥ 4 — win** | | | |

Solo-optimal escape is turn 7; with 3–4 players competing for Market cards and
Events interfering, expected first escape is **turns 7–9**. Tuning levers, in
order of sensitivity: creep rate (every 2nd Grind ↔ every Grind ↔ every 3rd),
starting Salary−Burn gap, Fund cost.

### 2.6 Lifestyle Creep — the design call (FLAGGED)

Creep is the spicy addition: **Grind is the only action that raises your own
Burn.** Earning actively raises the bar you must clear, so the trap is felt,
not narrated. Downshift is the release valve and teaches the frugality lever
(it clears Creep tokens *and* lowers Burn, at the cost of a turn's income).
If playtests show the trap is too cruel for casual tables, soften to
creep-every-3rd-Grind before touching any other number.

### 2.7 The turn-six share moment

The **Signal Boost card** sits face-down by the Market. The *first* player to
escape reads it aloud — by the win-math this lands around turns 6–9, at peak
table energy, and it's the winner talking (never a prompt aimed at losers):

> **SIGNAL BOOST** — You just escaped. Someone at this table is still
> grinding. Scan this deck's code together and you both unlock the first
> expansion pack — free, right now. *(QR + deck code)*
> *(back)* One share prompt per game. That's the rule we set for ourselves,
> and it's printed here so you can hold us to it.

In-person scans from the losers' phones are the 3×-weighted share event
(§1.2). Printing the self-imposed limit on the card is deliberate: the ethics
are part of the brand voice.

---

## 3. The four follow-up games

Each inherits every shared system in §1. Copy shown is exact v1 printed copy.

### 3.1 Buy Borrow Die (maximum reach)

*The tax strategy of the very rich, playable in 25 minutes.*

- **Players 2–4 · 25–35 min · 12+.** Win: largest dynastic net worth after
  three generations (12 rounds; generation ends every 4th round).
- **Mechanics:** Assets have printed **Basis** and a Value track. Values drift
  up each round via the Market die. **Sell** = take Value in cash but pay tax:
  30% of (Value − Basis), round up. **Borrow** = take cash equal to half
  Value, no tax, gain a Debt token (pay 1/round interest). **Die** (generation
  end) = pass everything to your heir: every asset's Basis steps up to its
  current Value; outstanding Debt settles from cash first, then forced sales.
- **Starting numbers v1:** Cash 10; asset deck of 20 (Basis 4–8, growth die
  d6: 1–2 = +0, 3–5 = +1, 6 = +2); interest 1/Debt/round; tax 30%.
- Rules card copy (front, abridged): *"On your turn: Buy an asset, Borrow
  against one, or Sell one. Selling is the only action that's taxed. Dying is
  free."* — that last line is the whole marketing hook.
- **Build notes:** The step-up-basis reveal at generation 1's end is this
  game's clip moment. Highest virality ceiling of the four ("buy, borrow, die"
  already trends); lowest brand risk because the game *critiques* the
  loophole by making you use it.

### 3.2 Power Law (venture portfolio)

*Ninety percent of your picks die. You only need one.*

- **Players 2–5 · 30 min · 12+.** Win: highest total return across three
  funds.
- **Mechanics:** Each fund round seeds a blind row of 10 Startup cards from a
  20-card deck with **printed, true composition: 12 go to zero, 5 return 2×,
  2 return 10×, 1 returns 50×** (§1.4 rule 4 — odds printed on the rules
  card and verified by test). Players allocate 10 check tokens across the row;
  a Diligence action peeks at one card's sector hint. Reveal, pay out, next
  fund.
- **Lesson mechanics teach:** the fund winner is almost always whoever was *in*
  the outlier, not whoever avoided the zeros — conviction sizing vs. spray-and-
  pray becomes a felt argument at the table.
- **Build notes:** Cheapest to build online (pure allocation + reveal); best
  candidate for async play. Ship third or fourth.

### 3.3 Rolodex (maximum brand fit)

*Your network is the asset. Warm it up before you need it.*

- **Players 2–5 · 25 min · 10+.** Win: first to complete two **Big Asks**.
- **Mechanics:** Contact cards have a domain icon (Money, Media, Tech, Deal)
  and Reach 1–3. A Big Ask needs a chain of three intros in its domain with
  ascending Reach. Actions: **Coffee** (draw a contact), **Favor** (give
  another player a favor token — later spend *their* token to borrow a contact
  from their tableau for one chain), **Intro** (lay a chain step).
- **Starting numbers v1:** 40 contacts (Reach 1 ×18, 2 ×14, 3 ×8), 8 Big
  Asks, 12 favor tokens.
- **Lesson:** favors given before asks made; you literally cannot finish most
  chains without having banked goodwill.
- **Build notes:** The Favor economy makes it the most in-person-social game in
  the line — the natural fit for the 3× in-person share weighting, and the
  game most likely to be taught person-to-person. Strongest brand echo of the
  share loop itself.

### 3.4 House Rules (expected value)

> **Concept flag:** the handoff summary named this title without a concept.
> The spec below is the proposed concept — confirm before build.

*The house always wins. This time, you're the house.*

- **Players 3–6 · 20 min · 12+.** Win: biggest bankroll after each player has
  hosted twice.
- **Mechanics:** Players rotate as **the House**. The House drafts one of
  three Game cards (simple draw-odds mini-games with printed true odds) and
  sets the payout *within the card's printed legal band*. Everyone else sees
  the odds and the payout and chooses: bet or sit out. Sitting out earns 1
  (opportunity cost is visible, not zero).
- **Lesson:** players learn to compute edge because the odds are always
  printed and always true (§1.4) — and learn why the house sets the band
  where it does. Anti-gambling by inoculation.
- **Starting numbers v1:** bankroll 15; 12 Game cards; payout bands set so
  house edge ranges 2–15%.
- **Build notes:** Ships last; most copy-sensitive (must never read as a
  gambling product — no real-money framing anywhere, marketing included).

---

## 4. Growth architecture

### 4.1 The K-factor loop

`K = (weighted shares per active player) × (share-to-activation conversion)`

- Share events carry channel weight (§1.2). Instrument K weekly, split by
  channel; the in-person channel is the one to grow — it converts to *tables*,
  and tables convert to decks.
- Target to validate before scaling paid spend: **K ≥ 0.4 blended** with
  in-person ≥ 40% of weighted shares.

### 4.2 Unit economics to instrument (from day one)

All placeholders — the dashboard ships first, the targets get filled by data:

| Metric | Definition |
|---|---|
| Landed cost / deck | Print + freight + duty + fulfillment, per unit |
| Contribution margin | Price − landed − payment fees − allocated CAC |
| CAC (blended / paid) | Spend ÷ new activated players; separately ÷ decks |
| Share-attributed % | Decks whose purchase traces to a share event |
| Activation rate | Signups → first completed online game |
| Play→Table rate | Activated players → deck purchase, 60-day window |

### 4.3 Amazon + DTC split

- **DTC first (Shopify): 90-day exclusive.** Full margin, full attribution
  (deck codes tie to orders), owns the customer email.
- **Amazon second:** reach + review velocity. Attribution granularity is lost
  at purchase, so the in-box QR insert *is* the attribution bridge — the deck
  code re-links an Amazon buyer to the graph at first scan.
- Pricing must hold identical across channels (MAP discipline from day one).

### 4.4 Content engine

- **Format 1 — the trap curve:** 30-second clip of the grind-only line dying
  on the dashboard (§2.5). The flagship's thesis in one shot.
- **Format 2 — the Signal Boost moment:** real tables, first escape, reading
  the card aloud. User-generated by design.
- **Format 3 — one-card teach:** the entire rules card explained in under 60
  seconds, one video per game.
- Creator seeding: 100 decks per launch with unique codes → creators' shares
  are measurably attributed, paid flat (never per-recruit — §1.4 rule 1).

---

## 5. Build sequence for Claude Code

Order is deliberate: attribution before anything that generates attributable
events, flagship before siblings.

### Phase 0 — Infrastructure spine (build first)

1. **Accounts + age gate.**
2. **Attribution service:** deck codes (generate, print-file export, scan
   endpoint), share links, share-event ingestion with channel weights.
3. **Schema with the HEX guardrail (§1.5):** `Purchase`,
   `Purchase.attributed_to` (single account, depth-1 by construction),
   `RevenueShare → Purchase` as the only reward edge. **CI test that fails if
   any migration adds a reward path to anything but `Purchase`.**
4. **Event taxonomy + K-factor dashboard** (§4.1, §4.2 metrics).
5. **Share-prompt service** enforcing §1.4 rule 2 (one per session,
   skippable) as a server-side constraint, not client copy.

### Phase 1 — Escape Velocity online baseline

Browser game per §1.6: solo, pass-and-play, async. All §2 numbers as config
(one tuning file — playtest iteration must not require redeploys).

### Phase 2 — Share-to-unlock

Unlock content plumbing, weighted thresholds, the purchasable-outright path.

### Phase 3 — Physical pipeline

Print-file generation from the same card-copy source of truth used by the web
version (single source: card copy lives in structured data, rendered to both
web and print PDFs), deck-code printing, DTC store, fulfillment webhooks.

### Phase 4 — Second game

Per decision #3. Same config-driven pattern as Phase 1.

### Phase 5 — Remaining games

Priority order after the second game, default: Buy Borrow Die / Rolodex
(whichever wasn't #2) → Power Law → House Rules.

---

## 6. Design calls made on the founder's behalf (flag to reverse)

1. **Lifestyle Creep in the flagship (§2.6):** Grind raises your own Burn.
   Kept, with a printed soft-tune fallback (creep every 3rd Grind).
2. **Ownership stake = purchase-linked revenue share only (§1.5):** enforced
   structurally in the schema plus CI, not by policy doc. No token, no
   recruitment linkage, ever.

---

## 7. Open decision blocks

**Decision 1 — Escape Velocity v1 numbers.**
Baseline proposed in §2.5 (start 2/6/3/0, creep every 2nd Grind, asset costs
3/7/12). Recommendation: accept as playtest baseline and commit to 10 logged
playtests before changing anything except via the tuning file.

**Decision 2 — Price point and first print run.**
Needs founder call. Frame: poker-size 60-card tuck boxes land cheap at volume;
the realistic bands are $19–$29 DTC price and 500 / 1,000 / 2,500 first run.
Recommendation to react to: **$24.99 and 1,000 units** — small enough to
misjudge safely, large enough for sane unit cost.

**Decision 3 — Second game.**
- **Buy Borrow Die:** maximum reach — the phrase already carries organic
  search and short-form momentum; broadest audience.
- **Rolodex:** maximum brand fit — its favor economy mirrors the in-person
  share loop and seeds the strongest table-to-table spread.
Recommendation to react to: **Buy Borrow Die** second (ride the reach while
the brand is unknown), Rolodex third (it compounds better once tables exist).

Answer these three and the next artifact is the Claude Code build ticket for
the Phase 0 infrastructure spine, written as exact tasks.
