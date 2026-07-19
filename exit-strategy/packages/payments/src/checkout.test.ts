import { describe, expect, it } from 'vitest';
import { DECK_PRICE_CENTS, DECK_SKU_ESCAPE_VELOCITY } from '@exit/content';
import { buildDeckCheckoutParams } from './checkout';

const urls = { successUrl: 'https://whatsyourexitstrategy.com/thanks', cancelUrl: 'https://whatsyourexitstrategy.com/deck' };

describe('deck checkout params', () => {
  it('prices from @exit/content, never hard-coded', () => {
    const params = buildDeckCheckoutParams({ attributedCodeId: null, ...urls });
    expect(params.mode).toBe('payment');
    expect(params.line_items?.[0]?.price_data?.unit_amount).toBe(DECK_PRICE_CENTS);
    expect(params.line_items?.[0]?.price_data?.currency).toBe('usd');
  });

  it('carries the attribution code in metadata and client_reference_id', () => {
    const params = buildDeckCheckoutParams({ attributedCodeId: 'code_abc', ...urls });
    expect(params.metadata?.['attributedCodeId']).toBe('code_abc');
    expect(params.metadata?.['sku']).toBe(DECK_SKU_ESCAPE_VELOCITY);
    expect(params.client_reference_id).toBe('code_abc');
  });

  it('handles unattributed purchases', () => {
    const params = buildDeckCheckoutParams({ attributedCodeId: null, ...urls });
    expect(params.metadata?.['attributedCodeId']).toBe('');
    expect(params.client_reference_id).toBeUndefined();
  });

  it('bounds quantity', () => {
    expect(() => buildDeckCheckoutParams({ attributedCodeId: null, quantity: 0, ...urls })).toThrow(RangeError);
    expect(() => buildDeckCheckoutParams({ attributedCodeId: null, quantity: 11, ...urls })).toThrow(RangeError);
  });
});
