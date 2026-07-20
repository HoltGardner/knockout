import { describe, expect, it } from 'vitest';
import { DECK_PRICE_CENTS, FIRST_PRINT_RUN_UNITS } from './economics';

describe('economics constants match decision D-002', () => {
  it('deck retails at $24.99', () => {
    expect(DECK_PRICE_CENTS).toBe(2499);
  });
  it('first print run is 1,000 units', () => {
    expect(FIRST_PRINT_RUN_UNITS).toBe(1000);
  });
});
