import { describe, expect, it } from 'vitest';
import { runTrials } from './index';

/** Placeholder harness test. Real balance targets land with the Escape
 * Velocity engine (spec §2.3): grinder never escapes; investor median
 * escape turn 6-8. Those assertions plug into runTrials here. */
describe('simulation harness', () => {
  it('trials are independent and reproducible', () => {
    const a = runTrials(5, 100, (rng) => rng());
    const b = runTrials(5, 100, (rng) => rng());
    expect(a).toEqual(b);
    expect(new Set(a).size).toBe(5);
  });
});
