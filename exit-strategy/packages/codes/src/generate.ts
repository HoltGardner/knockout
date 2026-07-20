import { mulberry32, type Rng } from '@exit/engine';

/** Share-code generation (ticket T0.3). Codes are printed on physical
 * cards and typed by hand, so the alphabet drops lookalikes
 * (0/O, 1/I/L, U/V): 30 symbols. Format: PREFIX-XXXX-XXXC where C is a
 * weighted mod-30 check character catching single typos and adjacent
 * transpositions. */

export const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTVWXYZ';
const BASE = CODE_ALPHABET.length;
export const RANDOM_LENGTH = 7;

function checkChar(prefix: string, body: string): string {
  let sum = 0;
  const payload = `${prefix}-${body}`;
  for (let i = 0; i < payload.length; i++) {
    const value = payload.charCodeAt(i);
    sum = (sum + value * (i + 1)) % BASE;
  }
  return CODE_ALPHABET[sum] as string;
}

function format(prefix: string, body: string): string {
  const withCheck = body + checkChar(prefix, body);
  return `${prefix}-${withCheck.slice(0, 4)}-${withCheck.slice(4)}`;
}

/** Randomness comes in as an Rng so tests are deterministic; production
 * callers pass cryptoRng(). */
export function generateCode(prefix: string, rng: Rng): string {
  let body = '';
  for (let i = 0; i < RANDOM_LENGTH; i++) {
    body += CODE_ALPHABET[Math.floor(rng() * BASE)];
  }
  return format(prefix, body);
}

export function isValidCode(code: string): boolean {
  const match = /^([A-Z0-9]+)-([A-Z0-9]{4})-([A-Z0-9]{4})$/.exec(code);
  if (!match) return false;
  const [, prefix, a, b] = match;
  const chars = `${a}${b}`;
  for (const ch of chars) if (!CODE_ALPHABET.includes(ch)) return false;
  return format(prefix as string, chars.slice(0, RANDOM_LENGTH)) === code;
}

/** Unique batch, e.g. one code per deck + one per rules card for the
 * print run (D-002). Throws if the requested size exhausts retry budget —
 * at 30^7 (~22e9) combinations that indicates a broken rng, not bad luck. */
export function generateBatch(prefix: string, count: number, rng: Rng): string[] {
  const out = new Set<string>();
  let attempts = 0;
  while (out.size < count) {
    out.add(generateCode(prefix, rng));
    if (++attempts > count * 3) throw new Error('code space exhausted or rng broken');
  }
  return [...out];
}

/** Production rng backed by crypto.getRandomValues. */
export function cryptoRng(): Rng {
  return () => {
    const buf = new Uint32Array(1);
    globalThis.crypto.getRandomValues(buf);
    return (buf[0] as number) / 4294967296;
  };
}

/** Deterministic rng for reproducible test batches. */
export const seededRng = mulberry32;
