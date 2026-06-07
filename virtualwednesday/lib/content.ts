/**
 * All site copy in one place — canonical strings from the brand style guide (§9)
 * plus product copy for the reflection → signature voice → agent concept.
 * Centralized so the brand voice can be revised (or a new guide folded in) in one edit.
 */

export const brand = {
  wordmark: "virtualwednesday",
  legalName: "VIRTUALWEDNESDAY, INC",
  year: 2025,
  outboundGlyph: "↗", // ↗
};

export const nav = {
  links: [
    { label: "About", href: "/about" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Careers", href: "/careers" },
  ],
  press: { label: "Press", href: "mailto:press@virtualwednesday.com?subject=Press%20Inquiry", outbound: true },
  contact: { label: "Contact", href: "mailto:contact@virtualwednesday.com", outbound: true },
};

export const footer = {
  links: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
};

export const hero = {
  heading: ["Less screen.", "More life."],
  subtitle:
    "Reflection builds a private, secure agent that’s truly yours — so you can get off your devices and into the magic of the real world.",
  learnMore: { label: "Learn More", href: "/about" },
};

export const waitlist = {
  heading: "Stay tuned",
  body: "Help shape the future of connection by being part of our early community of experience-ready members.",
  cta: { label: "Join the Waitlist", href: "/waitlist" },
  placeholder: "you@example.com",
  submit: "Join the Waitlist",
  success: "You're on the list. We'll be in touch.",
  invalid: "Enter a valid email address.",
};

/** The founding experience: reflection → signature voice → your own agent. */
export const appInAction = {
  eyebrow: "THE FOUNDING EXERCISE",
  heading: "Reflection becomes your voice.",
  subtitle:
    "A few honest minutes a week. We listen, and your signature voice takes shape — so your own agent can speak, and act, like you.",
  steps: [
    {
      key: "reflect",
      label: "Reflect",
      prompt: "What gave you energy this week?",
      answer: "Long walks, an unhurried dinner with friends, and finally finishing the book.",
    },
    {
      key: "voice",
      label: "Shape your voice",
      traits: ["warm", "direct", "curious", "unhurried"],
      profileLabel: "Your signature voice",
    },
    {
      key: "agent",
      label: "Your agent acts",
      agentLine: "I moved your 9am so you can keep the morning walk. Replied to Sam in your words.",
      reclaimed: "4 hrs back this week",
    },
  ],
};

export const howItWorks = {
  heading: "How it works",
  subtitle: "Three quiet steps. The rest is yours.",
  steps: [
    {
      n: "01",
      title: "Reflect",
      body: "Answer a few thoughtful prompts each week. No performance, no feed — just you, thinking out loud.",
    },
    {
      n: "02",
      title: "Shape your voice",
      body: "Your reflections compose a signature voice: your tone, your values, the way you actually sound.",
    },
    {
      n: "03",
      title: "Your agent acts",
      body: "Your own agent handles the busywork in your voice — and gives you back the hours that matter.",
    },
  ],
};

export const about = {
  heading: "A new kind of virtual experience, for everyone.",
  paragraphs: [
    "We're building VirtualWednesday to give people back their time — and to make everyone feel heard.",
    "It starts with reflection. A few honest minutes become a signature voice: the way you actually sound, the things you actually care about.",
    "That voice powers your own agent. It takes on the noise and the busywork, speaking and acting like you, so you can spend your attention where it counts.",
    "Less time managing your life. More time living it.",
  ],
  cta: { label: "Join the Waitlist", href: "/waitlist" },
};

export const careers = {
  heading: "Let's co-create a new way to connect.",
  body: "We're a small team building something personal, calm, and human. If that resonates, we'd love to hear your voice.",
  cta: { label: "Get in touch", href: "mailto:careers@virtualwednesday.com?subject=Joining%20VirtualWednesday", outbound: true },
};
