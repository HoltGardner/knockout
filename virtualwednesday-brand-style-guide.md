# VirtualWednesday — Brand Style Guide

*A living style guide for virtualwednesday.com and the VirtualWednesday brand.*
*Deeply inspired by the design language of [Overtone](https://overto.ne), made our own.*

> **Companion file:** [`overtone-design-language.md`](./overtone-design-language.md) documents the
> Overtone design language this guide is inspired by. **This** file is the source of truth for
> VirtualWednesday — it informs every design element across every facet of the brand: web, product,
> social, email, decks, and physical.

---

## 0. How to use this guide

- Sections **3–9** are canonical tokens and components — build from them directly.
- Section **2 (Opening Sequence)** is the signature brand moment; treat it as a first-class deliverable.
- Section **12** gives copy-paste tokens (CSS + JSON) for codegen and design tools.
- When in doubt, choose **restraint, warmth, and stillness** over decoration.

---

## 1. Brand Foundation

**What we are.** VirtualWednesday is *a new kind of virtual experience, for everyone* — a calm,
human space for connection. Our design exists to make people **feel heard**.

**Positioning.** Premium yet inclusive. Quiet confidence over hype. We are the antidote to noisy,
gamified, attention-extracting software.

**Brand personality**

| Trait | Expression |
|---|---|
| Calm | Stillness, whitespace, slow and deliberate motion |
| Human | Warm paper canvas, lowercase wordmark, plain-spoken copy |
| Confident | One large statement per screen; no clutter |
| Inclusive | "…for everyone"; accessible by default |
| Premium | Restraint as luxury — no gradients, glows, or gimmicks |

**Design principles**

1. **One idea per screen.** A single typographic statement carries the weight.
2. **Warm minimalism.** Off-white paper, near-monochrome, one restrained accent.
3. **Generous stillness.** Big vertical space; content centered and breathing.
4. **Motion is a whisper.** Opacity and gentle reveals only — never bounce or flash.
5. **Restraint is the brand.** If an element isn't earning attention, remove it.

---

## 2. The Opening Sequence — "The Overture"

The entrance into virtualwednesday.com is a **cinematic, ~2.4s reveal** on the warm canvas.
It is the brand's signature moment: calm, typographic, and unhurried. It must feel like a
held breath that resolves into the hero.

> **Inspiration, verified:** Overtone is a **Framer** site that animates its entrance with
> **Framer Motion** "appear" animations, set to honor reduced-motion
> (`data-framer-appear-animation="no-preference"`). Our Overture mirrors that approach: a tasteful
> appear/reveal that **must respect `prefers-reduced-motion`**. Build it in Framer Motion (or GSAP)
> if you prefer — keep the *feel* and the timing below.

### Storyboard

| Phase | Time | What happens | Motion |
|---|---|---|---|
| **0 · Black canvas** | 0–150ms | Full-screen `--bg` paper fills the viewport. Nothing else. | — |
| **1 · Wordmark rises** | 150–950ms | Centered lowercase `virtualwednesday` fades up and settles. | opacity 0→1, `translateY(12px→0)`, tight tracking eases `-0.01em → -0.03em` |
| **2 · Held breath** | 950–1500ms | The wordmark holds, perfectly still. | — |
| **3 · Lift & reveal** | 1500–2200ms | Wordmark glides up into the nav position and shrinks to nav size; simultaneously the hero **"Feel heard."** reveals via an upward clip-mask. | wordmark `scale 1→0.27` + move to navbar; hero `clip-path` wipe bottom→top |
| **4 · Settle** | 2200–2400ms | Subtitle, CTA, and footer fade in in sequence. Page is interactive. | staggered opacity 0→1 (60ms stagger) |

### Timing & easing

- **Master easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (gentle "ease-out-expo" feel).
- **Total duration:** 2.4s. Never exceed 3s — it must never feel like a loading screen.
- **Stagger:** child elements reveal 60ms apart in Phase 4.
- **One-time per session:** play on first load; on subsequent navigations within a session,
  skip to the settled state (store a `sessionStorage` flag).

### Accessibility (required)

- Honor `prefers-reduced-motion: reduce` — **skip directly to the settled state**, no animation.
- Never trap focus during the sequence; the page must be keyboard-usable the moment Phase 4 begins.
- Maintain text contrast throughout (see §6 Accessibility).

### Reference implementation

```html
<div id="overture" class="overture" aria-hidden="true">
  <span class="overture__mark">virtualwednesday</span>
</div>

<style>
  /* The Overture: brand opening sequence */
  .overture{
    position: fixed; inset: 0; z-index: 9999;
    display: grid; place-items: center;
    background: var(--bg);
    pointer-events: none;
  }
  .overture__mark{
    font-family: 'Geist', sans-serif;
    font-weight: 600; font-size: 20px; color: var(--black);
    letter-spacing: -0.03em;
    opacity: 0; transform: translateY(12px);
    animation:
      mark-in 800ms cubic-bezier(.22,1,.36,1) 150ms forwards,
      mark-lift 700ms cubic-bezier(.22,1,.36,1) 1500ms forwards;
  }
  @keyframes mark-in   { to { opacity:1; transform: translateY(0);   } }
  @keyframes mark-lift { to { opacity:0; transform: translateY(-40vh) scale(1); } }

  /* Hero reveal (apply to your .hero-heading) */
  .hero-heading{
    clip-path: inset(0 0 100% 0);
    animation: hero-wipe 800ms cubic-bezier(.22,1,.36,1) 1600ms forwards;
  }
  @keyframes hero-wipe { to { clip-path: inset(0 0 0% 0); } }

  /* Staggered settle for subtitle / CTA / footer */
  .reveal{ opacity:0; animation: fade-up 600ms ease 1900ms forwards; }
  .reveal:nth-of-type(2){ animation-delay: 1960ms; }
  .reveal:nth-of-type(3){ animation-delay: 2020ms; }
  @keyframes fade-up { from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:none;} }

  /* Reduced motion: no sequence */
  @media (prefers-reduced-motion: reduce){
    .overture{ display:none; }
    .hero-heading{ clip-path:none; animation:none; }
    .reveal{ opacity:1; animation:none; }
  }
</style>

<script>
  // Play once per session; remove the overlay after it finishes.
  (function () {
    const el = document.getElementById('overture');
    if (!el) return;
    if (sessionStorage.getItem('vw-overture-seen')) { el.remove(); return; }
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    sessionStorage.setItem('vw-overture-seen', '1');
    setTimeout(() => el.remove(), reduce ? 0 : 2400);
  })();
</script>
```

> The numbers above are the spec; the snippet is a faithful starting point. Keep the *feel*
> (calm, ~2.4s, opacity + clip reveals, master easing) even if you re-implement in a framework
> or motion library (Framer Motion / GSAP).

---

## 3. Logo & Wordmark

- **Primary mark:** the lowercase wordmark **`virtualwednesday`**, set in Geist 600 with
  `-0.03em` tracking. One word, no space, all lowercase — friendly and modern.
- **Clear space:** keep at least the cap-height of the wordmark clear on all sides.
- **Minimum size:** 16px on screen.
- **Color:** `--black` on `--bg`; `--bg` on a black field. No other colorways.
- **Don't:** add a space or capital W, stretch, outline, add gradients/shadows, or place on busy imagery.

---

## 4. Color

A warm, near-monochrome palette on a paper canvas, with a single deep-navy accent for links.

```css
:root {
  /* Core */
  --bg:              #f4f3f0; /* Warm "paper" — primary background */
  --black:           #000000; /* Headlines, primary text, button fill */
  --on-dark:         #ffffff; /* Text/icons on black */

  /* Text grays (warm) */
  --subtitle-color:  #2b2b2b; /* Secondary / supporting text */
  --nav-link-color:  #292928; /* Navigation links */
  --footer-link:     #1f1f1f; /* Footer links / fine print */

  /* Accent */
  --accent-link:     #1a365d; /* Deep navy — inline hyperlinks only */

  /* Optional surfaces (use sparingly, stay on-brand) */
  --bg-raised:       #faf9f6; /* Slightly lighter card/surface */
  --hairline:        #e3e1db; /* 1px dividers on paper */
}
```

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#f4f3f0` | Page background ("paper") |
| `--black` | `#000000` | Headlines, primary text, primary button |
| `--on-dark` | `#ffffff` | Text on black |
| `--subtitle-color` | `#2b2b2b` | Supporting text |
| `--nav-link-color` | `#292928` | Nav links |
| `--footer-link` | `#1f1f1f` | Footer links |
| `--accent-link` | `#1a365d` | Inline hyperlinks only |
| `--bg-raised` | `#faf9f6` | Optional raised surface |
| `--hairline` | `#e3e1db` | Optional 1px divider |

**Rules**
- Background is **always warm paper** (`#f4f3f0`) — never pure white, never dark mode.
- The palette is monochrome; **deep navy is the only chromatic color**, and only on inline links.
- Highest contrast is reserved for the **single black CTA** — protect its prominence.

---

## 5. Typography

**Typeface:** [Geist](https://fonts.google.com/specimen/Geist), variable, weights 100–900.
Antialiased. (Geist Mono is permitted for code/numeric labels only.)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet" />
```

### Type scale

| Role | Size | Weight | Line-height | Tracking | Transform |
|---|---|---|---|---|---|
| Display / Hero | `clamp(64px, 10vw, 128px)` | 500 | 1.0 | `-0.06em` | — |
| Section heading (H2) | 24px | 700 | 1.1 | `-0.04em` | — |
| Wordmark | 20px | 600 | — | `-0.03em` | lowercase |
| Subtitle / lead | 16px | 400 | 1.4 | `-0.02em` | — |
| Body | 16px | 400 | 1.5 | `-0.01em` | — |
| Button label | 16px | 400 | — | — | — |
| Nav link | 14px | 400 | — | — | UPPERCASE |
| Caption / footer | 12px | 400 | — | — | UPPERCASE |

**Signature traits**
- **Tight, size-scaled negative tracking** (`-0.06em` display → `-0.01em` body). This is the
  single most recognizable typographic move — apply it everywhere.
- **Display weight is medium (500), not bold.**
- **Microcopy is UPPERCASE; the wordmark is lowercase.**

---

## 6. Layout, Grid & Spacing

```css
max-width: 1044px;       /* shared container */
margin: 0 auto;
padding-inline: 32px;    /* 20px on mobile */
```

- **Container:** 1044px max, centered.
- **Primary region:** full-viewport flex column, centered both axes, `gap: 60px`,
  `padding: 100px 32px 80px`.
- **Spacing scale (px):** `4 · 6 · 8 · 12 · 16 · 24 · 32 · 48 · 60 · 80 · 100`. Use only these.
- **Breakpoint:** `865px` (matching Overtone's live `min-width: 865px` / `max-width: 864.98px`) —
  nav 72→60px, main gap 60→48px, padding tightens (see snippet/tokens).

**Accessibility**
- Body text ≥ 16px; meet WCAG AA contrast (the near-black-on-paper palette passes comfortably).
- Visible focus states on all interactive elements (don't rely on opacity alone for focus).
- Respect `prefers-reduced-motion` everywhere, especially the Overture.

---

## 7. Components

### Navbar
Fixed top, capped to container, background `--bg`, no border/shadow. Lowercase wordmark left;
UPPERCASE links right (`gap: 32px`, `--nav-link-color`). Outbound links append **↗** (`&#8599;`).
Hover: `opacity: 0.7`.

### Hero
Centered stack: display heading + inline subtitle row (supporting sentence + inline accent link).

### CTA block
Centered, `max-width: 420px`: H2 + one supporting paragraph + pill button.

### Pill button (primary)
```css
.btn{
  display:inline-flex; align-items:center; gap:6px;
  background:var(--black); color:var(--on-dark);
  font-size:16px; font-weight:400; text-decoration:none;
  padding:16px 28px; border-radius:999px;
  transition:opacity .15s ease;
}
.btn:hover{ opacity:.85; }
.btn:focus-visible{ outline:2px solid var(--accent-link); outline-offset:3px; }
```
Trailing **↗** for forward/outbound actions.

### Secondary / inline link
`--accent-link`, underlined, hover `opacity: 0.8`.

### Footer
Centered: UPPERCASE copyright + UPPERCASE links (Terms, Privacy), 12px.

### Iconography
Minimal by rule. The only recurring glyph is the **↗ north-east arrow** (U+2197) for outbound/forward
actions. No icon sets, no decorative illustration.

---

## 8. Motion

- **Opacity and gentle reveals only.** Standard transition: `opacity 0.15s ease`.
- **Reveals** (Overture, scroll-in): `cubic-bezier(0.22, 1, 0.36, 1)`, 600–800ms, `translateY ≤ 12px`.
- **Hover:** reduce opacity (`0.7` links / `0.85` button).
- **Never:** bounce, scale-pop, parallax, spin, flashing, or color transitions.
- Always provide a `prefers-reduced-motion` path.

---

## 9. Voice & Tone

Short, warm, declarative, inclusive. Lowercase brand; uppercase utility text.

**Patterns**
- **Two-word emotional headline** as the hero (e.g. *"Feel heard."*).
- **Inclusive framing:** "…for everyone."
- **Anticipation + community:** "Stay tuned," "early community of … members."
- Calm and human — never hype, never feature-dumping.

**Canonical copy**
- Hero: **"Feel heard."**
- Subtitle: *"A new kind of virtual experience, for everyone."* + inline `Learn More`
- CTA heading: **"Stay tuned"**
- CTA body: *"Help shape the future of connection by being part of our early community of experience-ready members."*
- CTA button: **"Join the Waitlist ↗"**

---

## 10. Art Direction & Imagery

- Default to **type and space** rather than imagery. The hero should rarely need a photo.
- If imagery is used: soft, warm, candid, human moments — never glossy stock or high-saturation.
  Tone images toward the paper palette (warm, low-contrast). No heavy filters or gradients.
- Avoid UI screenshots in the hero; keep the entrance pure and typographic.

---

## 11. Brand Applications (all facets)

| Surface | Guidance |
|---|---|
| **Website** | The Overture on entry; centered hero; one CTA; paper canvas. |
| **Product UI** | Same tokens; paper surfaces (`--bg`, `--bg-raised`); pill primary buttons; hairline dividers. |
| **Email** | Paper background, lowercase wordmark, one CTA, generous spacing, UPPERCASE footer. |
| **Social** | Paper canvas, large tight-tracked statement, ↗ for links. Minimal, type-forward posts. |
| **Decks / docs** | Geist throughout, paper slides, one idea per slide, 1044-style centered margins. |
| **Physical / merch** | Lowercase wordmark, black-on-paper, no decoration. |

**Cross-facet rules:** warm paper background, Geist with tight tracking, lowercase wordmark,
UPPERCASE microcopy, one black pill CTA, ↗ for outbound, opacity-only motion, single navy accent.

---

## 12. Design Tokens (copy-paste)

### CSS
```css
:root{
  --bg:#f4f3f0; --black:#000; --on-dark:#fff;
  --subtitle-color:#2b2b2b; --nav-link-color:#292928; --footer-link:#1f1f1f;
  --accent-link:#1a365d; --bg-raised:#faf9f6; --hairline:#e3e1db;
  --radius-pill:999px;
  --container:1044px; --pad-inline:32px; --pad-inline-mobile:20px;
  --ease-reveal:cubic-bezier(.22,1,.36,1);
  --transition:opacity .15s ease;
  --bp:768px;
}
```

### JSON
```json
{
  "color": {
    "bg": "#f4f3f0", "black": "#000000", "onDark": "#ffffff",
    "subtitle": "#2b2b2b", "navLink": "#292928", "footerLink": "#1f1f1f",
    "accentLink": "#1a365d", "bgRaised": "#faf9f6", "hairline": "#e3e1db"
  },
  "font": { "family": "Geist", "weights": [400, 500, 600, 700] },
  "type": {
    "display":  { "size": "clamp(64px,10vw,128px)", "weight": 500, "lineHeight": 1.0, "tracking": "-0.06em" },
    "h2":       { "size": "24px", "weight": 700, "lineHeight": 1.1, "tracking": "-0.04em" },
    "wordmark": { "size": "20px", "weight": 600, "tracking": "-0.03em", "transform": "lowercase" },
    "subtitle": { "size": "16px", "weight": 400, "lineHeight": 1.4, "tracking": "-0.02em" },
    "body":     { "size": "16px", "weight": 400, "lineHeight": 1.5, "tracking": "-0.01em" },
    "navLink":  { "size": "14px", "weight": 400, "transform": "uppercase" },
    "caption":  { "size": "12px", "weight": 400, "transform": "uppercase" }
  },
  "radius": { "pill": "999px" },
  "spacing": [4, 6, 8, 12, 16, 24, 32, 48, 60, 80, 100],
  "container": { "maxWidth": "1044px", "padInline": "32px", "padInlineMobile": "20px" },
  "motion": {
    "transition": "opacity 0.15s ease",
    "easeReveal": "cubic-bezier(0.22,1,0.36,1)",
    "hoverLink": 0.7, "hoverButton": 0.85
  },
  "overture": { "totalMs": 2400, "staggerMs": 60, "playOncePerSession": true, "respectsReducedMotion": true },
  "breakpoint": "865px",
  "glyph": { "outbound": "↗" }
}
```

---

## 13. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Warm `#f4f3f0` paper background | Pure white or dark-mode backgrounds |
| One big, tightly-tracked headline | Multiple competing headlines |
| The calm ~2.4s Overture on entry | A spinner/loading-style intro |
| Solid black pill CTA + `↗` | Gradients, glows, drop shadows |
| UPPERCASE nav/footer microcopy | Decorative icon sets or stock imagery |
| Opacity-only / gentle reveals | Bounce, slide, scale-pop, parallax |
| Single deep-navy accent for links | Multiple accent colors |
| Lowercase wordmark | All-caps or stylized logo |
| Respect `prefers-reduced-motion` | Force animation on everyone |

---

*VirtualWednesday, Inc. — design language inspired by Overtone, made our own.*
