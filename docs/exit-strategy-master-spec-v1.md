# EXIT STRATEGY: Master Game Spec v1

Handoff brief for Claude Code. This document contains the flagship game
(Escape Velocity, locked) at full production depth, four follow-up games at
full spec, the shared systems every game inherits, the viral growth
architecture, and the build sequence.

**Mission:** gamify the exit strategy of wealth that AI promises, by teaching
the foundational plays of economic success as games people share in person.

**Design north star:** the way the game spreads should teach the same lesson
the game teaches. Growth is curriculum.

---

## PART 1: SHARED SYSTEMS (every game inherits these)

### 1.1 The single-card rules constraint

Every game's complete rules fit on ONE card, front and back. That card is
three things at once:

1. The rules (the syllabus).
2. A referral ticket (a unique code).
3. A collectible (part of an expanding series).

The deck is separate from the rules card. Cash is tracked with chips or on a
printed track, never with extra rules.

### 1.2 The share-to-unlock loop (the growth engine)

Why it works: it rewards real-world social capital, not link spam, which
mirrors the brand thesis (community and time, not screens) and is far harder
to bot.

How it works:

1. Every physical card and deck carries a unique code tied to whoever shares
   it.
2. A recipient redeems the code for FREE online entry to that game.
3. The sharer earns an ownership stake. See the guardrail in 1.4. The stake
   is a revenue share on real product sold through their network, NOT a token
   that appreciates when they recruit.
4. In-person shares are weighted higher than online shares. A code confirmed
   by two devices in physical proximity (QR scanned in person, or a mutual
   confirm step) grants a larger reward than a link pasted online.

### 1.3 The three-domain funnel

1. **whatsyourexitstrategy.com** is the question and the top of funnel. The
   game landing page and the code redemption entry point. The card sends
   people here.
2. **exitstrategy.group** is the movement and community home. Redeemers land
   here. Chapters, meetups, membership, and the in-person events live here.
3. **theschoolofpops.com** is the curriculum and author platform. The deeper
   "plays" library and the book live here.

Flow: question drives to game, game drives to group, group hosts community
and in-person play, school goes deeper.

### 1.4 Ethical design rules (hard constraints, protect the brand)

These are non-negotiable and Claude Code must enforce them in every build:

1. Every lesson taught must be TRUE and verifiable. We expose real plays, we
   do not invent get-rich fantasy.
2. The ownership stake is tied to real revenue we actually generate. It is
   never a token whose price rises because someone recruited more players.
   That is a security and it looks like a pyramid. It is the exact trap that
   made HEX a target.
3. Any game that borrows a dopamine mechanic (variable reward) must use it to
   teach the antidote, and the safety cap must be structural in the rules,
   not advisory.
4. Any reveal or hidden-information mechanic must feel like being let in,
   never like being conned. If a playtester feels tricked rather than
   included, the design failed.
5. Spicy framing is allowed and encouraged. Cheerleading harm is not. When we
   expose a controversial move, the card lets the player in on the truth and
   points to the civic conversation, it does not tell them to go do it.

### 1.5 Online version baseline (applies to all games)

1. Lightweight web app, mobile-first, no app store at launch. Progressive web
   app.
2. Core screens: redeem a code, play (async and live), invite (generate a
   personal code), stake ledger (see what your network earned you).
3. Attribution ledger: every code, every redemption, every downstream
   purchase, tied to the originating sharer. This is the spine of both
   virality and revenue share.
4. Live multiplayer is a fast-follow. Launch with async or single-device
   pass-and-play plus a solo tutorial round.

---

## PART 2: FLAGSHIP (LOCKED) - ESCAPE VELOCITY

The play: passive income beating your cost of living is freedom. Wages are a
treadmill. Psychological driver: loss aversion plus real-time status gap. You
watch the grinder stay stuck while the owner walks free. Ethics: clean. The
lesson is true and prosocial. It just makes an invisible trap visible.

### 2.1 THE CARD (what is literally printed)

**FRONT**

```
ESCAPE VELOCITY
A job pays you for your time.
An asset pays you while you sleep.
Escape when your assets cover your life.

Players 2-5   |   15 min   |   The play: passive income

SETUP
Deal each player 1 JOB card and 5 Cash.
Set your BURN to 3.
Shuffle the Asset / Loan / Event deck. Deal 3 to each player.
```

**BACK**

```
YOUR TURN (in order)
1. EARN  Take your Job income + all your Asset income.
2. PAY   Pay your Burn, plus 2 for each Loan you hold.
         Cannot pay? Sell one Asset at half value, or bust.
3. MOVE  Do ONE:
         - BUY an Asset (pay its cost, place it face up)
         - TAKE a Loan (gain 10 Cash, costs 2 each turn)
         - PAY OFF a Loan (spend 10 Cash, remove it)
4. DRAW  Flip the top Event and resolve it.

WIN
The instant your ASSET income alone is equal to or above
your Burn, you hit Escape Velocity. First to escape wins.

WATCH OUT
Every time your total income crosses a new tier,
LIFESTYLE CREEP raises your Burn by 1.
Grinding your job raises the bar. Only assets clear it.
```

### 2.2 Component list (for Claude Code and for print)

1. 1 Rules Card (above).
2. Job cards (deal 1 each). Starting income values 2 to 4. Example set:
   Barista (income 2), Nurse (income 4), Founder (income 3, but starts at
   Burn 4). Variety teaches that surplus, not salary, funds freedom.
3. Asset cards, three tiers:
   * Small: cost 4, pays 1 per turn.
   * Medium: cost 8, pays 2 per turn.
   * Large: cost 15, pays 4 per turn. Slightly better payback rewards
     scaling.
4. Loan cards: each gives 10 Cash, costs 2 per turn interest.
5. Event cards, four types:
   * CRASH: every player whose Loan count exceeds their Cash on hand must
     sell one Asset at half value, or bust.
   * WINDFALL: gain 3 Cash.
   * LIFESTYLE CREEP: your Burn rises by 1 immediately.
   * OPPORTUNITY: buy one Asset this turn at half cost.
6. Cash chips or a printed cash track.
7. A Burn dial or track per player (0 to 12).

### 2.3 Win math and tuning target

Design target: a smart investor escapes around turn 6 to 8. A pure
job-grinder never escapes, by design, and feels it.

1. Job-grinder illustration: income 3, Burn 3, surplus 0. Never invests,
   never escapes. This is the gut punch.
2. Investor path: starts with 5 Cash, buys Small on turn 1, compounds surplus
   into Medium then Large, clears Burn by roughly turn 7.
3. Leverage path: a Loan funds a Large asset early (net +2 per turn after
   interest), which either rockets the player ahead or gets them wiped on a
   Crash. That variance is the risk lesson. These numbers are the v1 starting
   point. They are quick-fix values, not final. Flag for playtesting to lock
   the turn count near 6 to 8 and confirm the grinder truly cannot escape.

### 2.4 The share moment

The screenshot is the turn-six trap closing: one player free, one stuck, one
blown up by leverage. Build the online version to auto-capture and offer to
share that exact end state, with the sharer's code baked into the share
image.

---

## PART 3: FOLLOW-UP GAMES (full spec)

### 3.1 BUY, BORROW, DIE (ship as Play 2, the viral rocket)

The play: the wealthy borrow against assets instead of selling, so they never
trigger tax, then pass assets on clean. Driver: curiosity gap and
outrage-fascination. "Wait, that is legal?" Ethics: highest framing risk. The
card must let the player in on a real, legal move AND point to the civic
debate, never read as a how-to for dodging.

**THE CARD FRONT**

```
BUY, BORROW, DIE
Sell an asset, you pay tax.
Borrow against it, you do not.
Hold it until you die, your heirs pay nothing.
This is legal. Now you know why the debate exists.

Players 2-5   |   20 min   |   The play: tax-free liquidity

SETUP
Deal each player 2 Assets and 5 Cash.
Assets grow in value each turn (see track).
Game lasts 8 turns. Turn 8 is "Die."
```

**BACK**

```
YOUR TURN
1. GROW  Raise each Asset you hold by its growth number.
2. SPEND To fund Lifestyle you need Cash. Get it two ways:
         - SELL an Asset: gain its value, then draw a TAX card
           and pay the tax on the gain.
         - BORROW against an Asset: gain up to 50% of its value
           as Cash, no tax, but pay 1 interest per loan each turn.
3. LIVE  Convert Cash to Lifestyle points (1 to 1). Banked forever.
4. EVENT Flip and resolve.

THE END (turn 8, "Die")
Assets still held pass to heirs at stepped-up basis: no tax,
scored as bonus Lifestyle.

WIN
Most Lifestyle points, minus all tax ever paid.
The player who never sold usually wins. That is the lesson.
```

Build notes:

1. Asset value track: start values 10 to 20, growth 1 to 3 per turn.
2. Tax card: pay 30% of the gain since purchase.
3. Interest and forced-sale risk create the tension. Over-borrow, then an
   Event caps your borrowing, and you are forced to sell into tax.
4. Social engine: this is the screenshot machine. "A card game taught me how
   billionaires skip taxes." Expect critics. That is reach. Keep the civic
   framing tight.

### 3.2 POWER LAW (ship as Play 3 or 4, highest replay)

The play: make many small bets with capped downside. Most die, one pays for
everything. Driver: variable reward, the dopamine engine. Ethics: tightest
tightrope. The cap MUST be structural. The lesson is literally the antidote
to gambling.

**THE CARD FRONT**

```
POWER LAW
Most bets go to zero.
A few pay small.
One pays for everything.
You cannot win with one bet. Only with enough of them.

Players 2-5   |   15 min   |   The play: asymmetric bets

SETUP
Each player gets 20 Chips and the same 10 turns.
Each turn you may place UP TO 3 bets. Never more. Never all-in.
Each bet costs 2 Chips.
```

**BACK**

```
YOUR TURN
1. BET   Place 1 to 3 bets, 2 Chips each.
2. REVEAL Draw one Outcome per bet:
         Dud (0x, lose it), Base (3x), Hit (10x), Moonshot (50x).
3. BANK  Collect winnings.

THE RULE THAT MATTERS
You may never stake more than 2 Chips on a single bet.
Spread or die. That is the whole game.

WIN
Most Chips after 10 turns.
The player chasing one big bet almost always busts.
The diversifier almost always catches the outlier.
```

Build notes:

1. Outcome deck starting distribution per 20 cards: 15 Dud, 3 Base (3x),
   1 Hit (10x), 1 Moonshot (50x). Positive expected value overall, brutal
   variance at low bet counts, which is the entire teaching point.
2. Tune so a full-spread player reliably beats a concentrator across 10
   turns, but variance still stings. Flag for playtesting.
3. The structural cap (max 3 bets, max 2 per bet) is what makes this ethical.
   It cannot be a suggestion. Enforce it in code.

### 3.3 ROLODEX (ship as Play 2 alternative or Play 3, the brand's soul)

The play: your network and reputation are compounding assets. Trust pays
dividends, betrayal is permanent. Driver: reciprocity and social capital. The
most prosocial driver in the set. Ethics: essentially none needed. The lesson
is the thing we believe.

**THE CARD FRONT**

```
ROLODEX
A contact is worth little.
A trusted relationship compounds.
Betray one and it is gone forever, in front of everyone.

Players 3-6   |   20 min   |   The play: social capital

SETUP
Deal each player 3 Relationship cards, each at Trust level 1.
Shuffle the Deal deck.
```

**BACK**

```
YOUR TURN, do TWO actions
- TEND    Raise one Relationship's Trust by 1 (max 5).
- INTRO   Draw a new Relationship at Trust 1.
- CLOSE   Play a Deal if your Relationships meet its Trust cost.
- CASH OUT Burn a Relationship for instant Cash. It is destroyed
           permanently and every player sees it.

TRUST OPENS DOORS
Deals list a required combined Trust. High-Trust relationships
unlock Legacy Deals nobody else can touch.

WIN
First to close a Legacy Deal, or the highest network value
when the Deal deck runs out.
```

Build notes:

1. This is the native home for the in-person share mechanic. The physical
   hand-off is not decoration, it is the fiction. Lean into that in the
   online build: shares confirmed in person raise your in-game Trust faster.
2. Weakness to solve in playtest: make tending feel active, not like
   homework. Give TEND immediate small payoffs so it is satisfying, not
   chore-like.

### 3.4 HOUSE RULES (ship last, highest concept, highest execution risk)

The play: the wealthy play by rules most people do not know exist. The edge
is knowing which game you are in. Driver: curiosity gap plus insider-outsider
status. This is the brand thesis as a mechanic. Ethics: the reveal must feel
like a gift. See rule 1.4.4.

**THE CARD FRONT**

```
HOUSE RULES
You are playing a game.
Some of the rules are hidden.
The players who find them have been winning the whole time.

Players 3-6   |   25 min   |   The play: information asymmetry

SETUP
Shuffle the HOUSE deck face down. Do not read it.
Reveal House rules only when the rules tell you to.
```

**BACK**

```
YOUR TURN
1. ACT   Earn, spend, or trade as the open rules allow.
2. LEVEL When you cross a Level threshold (by earning or by
         SHARING a card in person), reveal the next House rule
         and read it aloud. It now applies to everyone.
3. LEARN Early House rules always hint that more exist.
         Nobody is ever blindsided. You are being let in.

THE TWIST
The true win condition is a House rule. The players who leveled
fastest, often by sharing, saw it first and played toward it.

WIN
Revealed on the final House rule. It rewards whoever understood
the real game earliest.
```

Build notes:

1. Diegetic growth: "share to unlock the hidden rules" is native to the
   story, not bolted on. This makes the viral loop feel like gameplay.
2. Guardrail in code: every early reveal must telegraph that more rules
   exist. The delight is discovery, never a bait-and-switch.
3. Hardest to teach on one card. If playtesting shows confusion, this ships
   last with the most polish budget.

---

## PART 4: GROWTH ARCHITECTURE (make it a best-seller and a social phenomenon)

### 4.1 The viral coefficient goal

Target a viral coefficient (K) above 1, meaning each buyer brings in more
than one new player on average. The loop:

1. Buyer plays in person, hits a share moment (the trap closing, the tax
   reveal, the 50x pop).
2. Buyer hands or scans a coded card to a friend.
3. Friend redeems free online play, feels the same moment.
4. Friend buys a physical deck. The original buyer earns a revenue-share
   stake.
5. Repeat. Track K per game. Buy, Borrow, Die and Power Law should show the
   highest K because their share moments are the most screenshottable.

### 4.2 Unit economics to instrument

1. The physical deck is the profit unit. Clear price point, real margin,
   day-one revenue. Start with a print run small enough to validate, then
   scale.
2. Free online play is the acquisition unit, cheap to serve, drives the next
   deck sale.
3. Instrument CAC (mostly content and card cost) against LTV (repeat deck
   buys across the expanding series plus any membership). The expanding
   series of Plays is the recurring revenue that turns one sale into a
   subscriber-like relationship.

### 4.3 Amazon plus DTC

1. DTC first through whatsyourexitstrategy.com to own the customer, the
   email, and the code attribution.
2. Amazon as the discovery and best-seller-rank engine. Optimize the listing
   for the "games that teach money" and "financial literacy game" search
   space. Reviews and rank are the flywheel.
3. Keep the coded card in every unit on both channels so attribution survives
   even an Amazon sale.

### 4.4 Content engine

1. Lead social content with Buy, Borrow, Die (outrage-fascination) and Power
   Law (the reveal pop). These pull attention.
2. Convert attention to Escape Velocity as the safe, satisfying first
   purchase.
3. Every piece of content ends on the question: what is your exit strategy.
   The brand name is the call to action.

---

## PART 5: BUILD SEQUENCE FOR CLAUDE CODE

Infrastructure before features. Build the spine first, then the games.

1. **INFRASTRUCTURE:** the code and attribution system. Unique code
   generation, in-person redemption (proximity-weighted), the attribution
   ledger, and the revenue-share accounting. Every game depends on this.
   Build it once, correctly, with the ethical guardrail from 1.4.2 enforced
   at the data model level (stake is revenue-linked, never
   recruitment-price-linked).
2. **INFRASTRUCTURE:** the three-domain funnel wiring. Redemption lands on
   the group, purchase flows through DTC, all codes resolve to a single
   ledger.
3. **FLAGSHIP FEATURE:** Escape Velocity online. Solo tutorial,
   pass-and-play, then async multiplayer. Auto-capture the turn-six share
   image with the sharer's code embedded.
4. **VIRAL FEATURE:** ship Buy, Borrow, Die online two weeks after flagship
   as the social rocket. It exists to drive traffic back to buy the deck.
5. **RETENTION FEATURE:** Rolodex, which converts buyers into a community and
   makes the in-person share the gameplay.
6. **DEPTH FEATURES:** Power Law and House Rules, in that order. Power Law
   needs the structural bet cap enforced in code. House Rules needs the most
   polish on the reveal.

---

## OPEN DECISIONS TO LOCK BEFORE BUILD

1. Confirm the v1 numbers in Escape Velocity (2.2 and 2.3) as the playtest
   starting point, or adjust.
2. Confirm the physical deck price point and first print-run size for the DTC
   launch.
3. Confirm which follow-up ships second: Buy, Borrow, Die (max reach, needs
   framing discipline) or Rolodex (max brand fit, slower to go viral).
