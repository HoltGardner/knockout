import { describe, expect, it } from 'vitest';
import { exportBatchCsv, parseBatchCsv } from './batch-csv';
import { generateBatch, seededRng } from './generate';

describe('print-batch CSV', () => {
  it('AC: export round-trips through parse with validation', () => {
    const codes = generateBatch('EV1', 500, seededRng(5));
    const rows = parseBatchCsv(exportBatchCsv(codes, 'RUN1'));
    expect(rows.map((r) => r.code)).toEqual(codes);
    expect(rows.every((r) => r.batchId === 'RUN1')).toBe(true);
    expect(rows.map((r) => r.seq)).toEqual(codes.map((_, i) => i + 1));
  });

  it('rejects corrupted codes before they reach the printer', () => {
    const csv = exportBatchCsv(generateBatch('EV1', 3, seededRng(6)), 'RUN1');
    const corrupted = csv.replace(/EV1-([A-Z0-9])/g, (m, c: string) => `EV1-${c === 'X' ? 'Y' : 'X'}`);
    expect(() => parseBatchCsv(corrupted)).toThrow(/invalid code/);
  });

  it('rejects unexpected headers', () => {
    expect(() => parseBatchCsv('a,b,c\nfoo,bar,1')).toThrow(/header/);
  });
});
