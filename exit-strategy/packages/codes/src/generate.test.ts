import { describe, expect, it } from 'vitest';
import { FIRST_PRINT_RUN_UNITS } from '@exit/content';
import { CODE_ALPHABET, generateBatch, generateCode, isValidCode, seededRng } from './generate';

describe('code generation', () => {
  it('produces well-formed, self-validating codes', () => {
    const rng = seededRng(42);
    for (let i = 0; i < 200; i++) {
      const code = generateCode('EV1', rng);
      expect(code).toMatch(/^EV1-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
      expect(isValidCode(code)).toBe(true);
    }
  });

  it('excludes ambiguous characters', () => {
    for (const ch of '01OILU') expect(CODE_ALPHABET).not.toContain(ch);
  });

  it('checksum catches single-character typos', () => {
    const code = generateCode('EV1', seededRng(1));
    const i = 5; // inside the random body
    const original = code[i] as string;
    const swapped = CODE_ALPHABET[(CODE_ALPHABET.indexOf(original) + 1) % CODE_ALPHABET.length];
    expect(isValidCode(code.slice(0, i) + swapped + code.slice(i + 1))).toBe(false);
  });

  it('checksum catches adjacent transpositions', () => {
    let caught = 0;
    let applicable = 0;
    const rng = seededRng(3);
    for (let n = 0; n < 200; n++) {
      const code = generateCode('EV1', rng);
      const chars = code.replace(/-/g, '').slice(3); // 8 payload chars
      for (let i = 0; i < chars.length - 1; i++) {
        if (chars[i] === chars[i + 1]) continue;
        applicable++;
        const t = chars.slice(0, i) + (chars[i + 1] as string) + (chars[i] as string) + chars.slice(i + 2);
        const rebuilt = `EV1-${t.slice(0, 4)}-${t.slice(4)}`;
        if (!isValidCode(rebuilt)) caught++;
      }
    }
    expect(caught / applicable).toBeGreaterThan(0.95);
  });

  it('AC: a 10k batch has zero collisions', () => {
    const batch = generateBatch('EV1', 10_000, seededRng(7));
    expect(new Set(batch).size).toBe(10_000);
    expect(batch.every(isValidCode)).toBe(true);
  });

  it('covers the print run: one code per deck + one per rules card', () => {
    const batch = generateBatch('EV1', FIRST_PRINT_RUN_UNITS * 2, seededRng(11));
    expect(batch).toHaveLength(2000);
  });
});
