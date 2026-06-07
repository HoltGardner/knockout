# Overtone Design Language

A portable, implementation-ready specification of the **Overtone** design language,
documented so it can be applied to other projects. The reference implementation is
the **VirtualWednesday** landing page, which is built in this exact system.

> **How to use this file:** Hand it to Claude (or any designer/developer) alongside a
> target project. Sections 3–7 are the *source of truth* (tokens + components).
> Section 10 is the step-by-step integration guide. Everything is expressed as
> copy-pasteable values so it can be applied without re-deriving anything.

---

## 1. Design Philosophy

Overtone's design is **quiet, warm, and editorial**. It rejects the dense, gamified,
notification-heavy aesthetic of typical apps in favor of a calm, premium canvas with a
single confident statement and one clear action.

The visual ethos mirrors the product ethos — human connection over noise:

- **One idea per screen.** A large typographic headline carries the emotional weight;
  everything else recedes.
- **Warm minimalism.** A paper-like off-white background instead of stark white or
  dark mode. Near-monochrome, with a single restrained accent.
- **Generous stillness.** Lots of vertical space, content centered in the viewport,
  nothing competing for attention.
- **Restraint as luxury.** No gradients, shadows, bounce, or decoration. Motion is
  limited to subtle opacity shifts.

**Adjectives to design toward:** calm, human, unhurried, confident, premium, inclusive.

---

## 2. Brand Foundations

| Principle | What it means in practice |
|---|---|
| Typographic hierarchy | The headline is the hero. Scale + tight tracking do the work, not color or imagery. |
| Warmth | Off-white `#f4f3f0` canvas, soft near-black text — never pure `#fff` backgrounds. |
| One action | A single primary CTA (a pill button). Secondary links are quiet and inline. |
| Whitespace | Large gaps (48–100px) and a centered, breathing layout. |
| Microcopy in caps | Navigation, footer, and legal text are `UPPERCASE` for a refined editorial feel. |
| Lowercase wordmark | The brand name renders lowercase, signaling approachability. |

---

## 3. Color

Near-monochrome, warm-neutral palette built on a paper background, with a single deep
navy reserved for inline text links.

```css
:root {
  --bg:              #f4f3f0; /* Warm off-white "paper" — page background */
  --black:           #000000; /* Primary text, headings, button fill */
  --subtitle-color:  #2b2b2b; /* Secondary / supporting body text */
  --nav-link-color:  #292928; /* Navigation links */
  --footer-link:     #1f1f1f; /* Footer links */
  --accent-link:     #1a365d; /* Deep navy — inline hyperlinks only */
  --on-dark:         #ffffff; /* Text/icon on black button */
}
```

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#f4f3f0` | Page background ("paper") |
| `--black` | `#000000` | Headlines, primary text, primary button fill |
| `--subtitle-color` | `#2b2b2b` | Supporting subtitle / body text |
| `--nav-link-color` | `#292928` | Nav links |
| `--footer-link` | `#1f1f1f` | Footer links |
| `--accent-link` | `#1a365d` | Inline hyperlinks (e.g. "Learn More") |
| `--on-dark` | `#ffffff` | Text on the black pill button |

**Rules**
- The palette is effectively monochrome: four near-black grays on one warm off-white.
- The **only** chromatic color is `--accent-link` (deep navy), and it is reserved for
  inline text links — never buttons, never large fills.
- Never use pure white (`#fff`) as a background; the warmth of `#f4f3f0` is core to the brand.
- Buttons are solid black with white text — the single highest-contrast element on the page.

---

## 4. Typography

**Typeface:** [Geist](https://fonts.google.com/specimen/Geist) (variable, weights 100–900),
loaded from Google Fonts. Rendered with `-webkit-font-smoothing: antialiased`.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet" />
```

```css
font-family: 'Geist', sans-serif;
```

### Type scale

| Role | Size | Weight | Line-height | Letter-spacing | Transform |
|---|---|---|---|---|---|
| Display / Hero | `clamp(64px, 10vw, 128px)` | 500 | 1.0 | `-0.06em` | — |
| Section heading (H2) | 24px | 700 | 1.1 | `-0.04em` | — |
| Logo / wordmark | 20px | 600 | — | `-0.03em` | lowercase |
| Subtitle / lead | 16px | 400 | 1.4 | `-0.02em` | — |
| Button label | 16px | 400 | — | — | — |
| Nav link | 14px | 400 | — | — | `UPPERCASE` |
| Inline link | 14px | 400 | — | — | — |
| Footer text / links | 12px | 400 | — | — | `UPPERCASE` |

**Signature traits**
- **Tight negative tracking** scales with size: the bigger the type, the tighter the
  letter-spacing (`-0.06em` at display → `-0.02em` at body). This is the most
  recognizable typographic move in the system.
- **Display weight is medium (500), not bold.** The headline is large but not heavy.
- **Microcopy is uppercase** (nav, footer); **the wordmark is lowercase**.

---

## 5. Layout & Spacing

```css
/* Shared container */
max-width: 1044px;
margin: 0 auto;
padding-inline: 32px;   /* 20px on mobile */
```

**Structure (top → bottom):** fixed navbar → centered hero → waitlist/CTA block → footer.

| Element | Spec |
|---|---|
| Container width | `max-width: 1044px`, centered |
| Navbar height | 72px (60px mobile), `position: fixed`, centered via `left:50%; transform:translateX(-50%)` |
| Main region | full-viewport flex column, centered both axes, `gap: 60px`, `padding: 100px 32px 80px` |
| Hero stack gap | 12px |
| Waitlist block | `max-width: 420px`, centered, `gap: 16px` |
| Footer | centered flex, `gap: 24px`, `padding: 24px 32px 32px` |

**Spacing scale (px):** `4 · 6 · 8 · 12 · 16 · 24 · 32 · 48 · 60 · 80 · 100`
(Use these increments for all gaps/padding to stay on-system.)

**Responsive (`max-width: 768px`)**
- Navbar: `height: 60px`, `padding: 0 20px`
- Nav links: `gap: 20px`, `font-size: 12px`
- Main: `gap: 48px`, `padding: 80px 20px 60px`
- Footer: stacks vertically, `gap: 12px`, `padding: 20px 20px 24px`

---

## 6. Components

### Navbar
- Fixed to top, full width, capped at the 1044px container, background matches `--bg`
  (no border, no shadow).
- **Left:** lowercase text wordmark (20px / 600 / `-0.03em`).
- **Right:** horizontal uppercase links, `gap: 32px`, color `--nav-link-color`.
- External/outbound links append a north-east arrow glyph **↗** (`&#8599;`, U+2197).
- Hover: `opacity: 0.7`.

### Hero
- Centered, stacked: display heading + inline subtitle row.
- Subtitle row is `flex` with an inline accent link beside the supporting sentence
  (e.g. supporting text + `Learn More`), `gap: 8px`, wraps on small screens.

### CTA / Waitlist block
- Centered, `max-width: 420px`: H2 heading + one supporting paragraph + pill button.

### Pill button (primary CTA)
```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--black);
  color: var(--on-dark);
  font-size: 16px;
  font-weight: 400;
  text-decoration: none;
  padding: 16px 28px;
  border-radius: 999px;     /* full pill */
  transition: opacity 0.15s ease;
}
.btn:hover { opacity: 0.85; }
```
- Trailing **↗** glyph for forward/outbound actions.

### Footer
- Centered: copyright (uppercase, 12px) + uppercase links (Terms, Privacy).
- Hover: `opacity: 0.7`.

### Iconography
- Deliberately minimal. The only recurring glyph is the **↗ north-east arrow**
  (`&#8599;` / U+2197), used to mark outbound or forward actions on links and buttons.
  No icon set, no decorative imagery.

---

## 7. Motion

Motion is intentionally minimal and calm.

- **Only opacity transitions** — `transition: opacity 0.15s ease`.
- **Hover state = reduced opacity:** `0.7` for text links, `0.85` for the button.
- No scaling, sliding, bouncing, parallax, or color transitions.

---

## 8. Voice & Tone

Short, warm, declarative, and inclusive. Lowercase brand, uppercase utility text.

**Patterns**
- **Two-word emotional headline** as the hero (e.g. *"Feel heard."*).
- **Inclusive framing:** "…for everyone."
- **Anticipation + community:** "Stay tuned," "early community of … members."
- Sentences are calm and human, never hype-driven or feature-listing.

**Reference copy (from the VirtualWednesday implementation)**
- Hero: **"Feel heard."**
- Subtitle: *"A new kind of virtual experience, for everyone."* + inline `Learn More`
- CTA heading: **"Stay tuned"**
- CTA body: *"Help shape the future of connection by being part of our early community
  of experience-ready members."*
- CTA button: **"Join the Waitlist ↗"**

---

## 9. Reference Implementation

The canonical source of truth is the VirtualWednesday landing page. Its tokens, in one block:

```css
:root {
  --bg: #f4f3f0;
  --black: #000;
  --footer-link: #1f1f1f;
  --subtitle-color: #2b2b2b;
  --nav-link-color: #292928;
  --accent-link: #1a365d;
  --on-dark: #ffffff;
}

html, body {
  font-family: 'Geist', sans-serif;
  background-color: var(--bg);
  color: var(--black);
  -webkit-font-smoothing: antialiased;
}
```

Layout skeleton: `fixed nav (72px)` → `main { flex center; gap:60px; padding:100px 32px 80px }`
→ `footer`, all inside a `max-width: 1044px` centered container.

### Design tokens (JSON, for design tools / codegen)
```json
{
  "color": {
    "bg": "#f4f3f0",
    "black": "#000000",
    "subtitle": "#2b2b2b",
    "navLink": "#292928",
    "footerLink": "#1f1f1f",
    "accentLink": "#1a365d",
    "onDark": "#ffffff"
  },
  "font": { "family": "Geist", "weights": [400, 500, 600, 700] },
  "type": {
    "display": { "size": "clamp(64px,10vw,128px)", "weight": 500, "lineHeight": 1.0, "tracking": "-0.06em" },
    "h2":      { "size": "24px", "weight": 700, "lineHeight": 1.1, "tracking": "-0.04em" },
    "wordmark":{ "size": "20px", "weight": 600, "tracking": "-0.03em" },
    "subtitle":{ "size": "16px", "weight": 400, "lineHeight": 1.4, "tracking": "-0.02em" },
    "button":  { "size": "16px", "weight": 400 },
    "navLink": { "size": "14px", "weight": 400, "transform": "uppercase" },
    "footer":  { "size": "12px", "weight": 400, "transform": "uppercase" }
  },
  "radius": { "pill": "999px" },
  "spacing": [4, 6, 8, 12, 16, 24, 32, 48, 60, 80, 100],
  "container": { "maxWidth": "1044px", "padInline": "32px", "padInlineMobile": "20px" },
  "motion": { "transition": "opacity 0.15s ease", "hoverLink": 0.7, "hoverButton": 0.85 },
  "breakpoint": "768px",
  "glyph": { "outbound": "↗" }
}
```

---

## 10. Integration Guide — Applying Overtone to a New Project

Follow these steps to bring an existing or new product into the Overtone design language.

1. **Load Geist** (Google Fonts, weights `100..900`) and set
   `font-family: 'Geist', sans-serif` + `-webkit-font-smoothing: antialiased` on `body`.
2. **Drop in the color tokens** from §3. Set the page background to `--bg` (`#f4f3f0`)
   and default text to `--black`. Do not introduce new colors — the only accent is
   `--accent-link` for inline links.
3. **Center everything** in a `max-width: 1044px` container. Make the primary content
   region a full-viewport, centered flex column with a `60px` gap.
4. **Make one headline the hero** at `clamp(64px, 10vw, 128px)`, weight `500`,
   line-height `1.0`, letter-spacing `-0.06em`. Keep it short — ideally two words.
5. **Apply tight tracking everywhere**, scaling with size (display `-0.06em` →
   body `-0.02em`).
6. **Use one pill CTA** (`border-radius: 999px`, black fill, white text, `16px 28px`
   padding) with a trailing `↗`. Secondary actions are quiet inline links.
7. **Set microcopy in `UPPERCASE`** (nav + footer) and render the **wordmark lowercase**.
8. **Limit motion** to `opacity 0.15s ease`; hover reduces opacity (`0.7` links / `0.85` button).
9. **Stay on the spacing scale** (`4 · 6 · 8 · 12 · 16 · 24 · 32 · 48 · 60 · 80 · 100`).
10. **Apply the responsive rules** at the `768px` breakpoint (§5).

### Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Warm `#f4f3f0` paper background | Pure white or dark-mode backgrounds |
| One big, tightly-tracked headline | Multiple competing headings |
| Solid black pill CTA + `↗` | Gradients, glows, drop shadows |
| Uppercase nav/footer microcopy | Decorative icon sets or stock imagery |
| Opacity-only transitions | Bounce, slide, scale, parallax |
| A single deep-navy accent for links | Multiple accent colors |
| Lowercase wordmark | All-caps or stylized logo |

### Starter snippet
```html
<!-- Geist -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet" />

<style>
  :root{
    --bg:#f4f3f0; --black:#000; --subtitle-color:#2b2b2b;
    --nav-link-color:#292928; --footer-link:#1f1f1f; --accent-link:#1a365d;
  }
  body{ font-family:'Geist',sans-serif; background:var(--bg); color:var(--black);
        -webkit-font-smoothing:antialiased; }
  .hero-heading{ font-size:clamp(64px,10vw,128px); font-weight:500;
                 line-height:1; letter-spacing:-0.06em; }
  .btn{ display:inline-flex; align-items:center; gap:6px; background:var(--black);
        color:#fff; padding:16px 28px; border-radius:999px; text-decoration:none;
        transition:opacity .15s ease; }
  .btn:hover{ opacity:.85; }
</style>
```

---

*Reference implementation: VirtualWednesday landing page. Design language: Overtone.*
