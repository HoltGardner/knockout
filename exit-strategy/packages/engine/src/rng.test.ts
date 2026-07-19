import { describe, expect, it } from 'vitest';
import { mulberry32, rollDie, shuffle } from './rng';

describe('deterministic rng', () => {
  it('same seed yields the same sequence', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('different seeds diverge', () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)());
  });

  it('rollDie stays in range', () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 1000; i++) {
      const roll = rollDie(rng, 6);
      expect(roll).toBeGreaterThanOrEqual(1);
      expect(roll).toBeLessThanOrEqual(6);
    }
  });

  it('shuffle is a permutation and leaves input untouched', () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(mulberry32(9), input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect([...out].sort()).toEqual(input);
  });
});
