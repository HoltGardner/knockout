import { isValidCode } from './generate';

/** Print-vendor CSV export/import (T0.3). Columns: code,batch_id,seq.
 * Codes leave here `unassigned`; a sharer binds one at first activation. */

export interface BatchRow {
  code: string;
  batchId: string;
  seq: number;
}

export function exportBatchCsv(codes: readonly string[], batchId: string): string {
  const header = 'code,batch_id,seq';
  const rows = codes.map((code, i) => `${code},${batchId},${i + 1}`);
  return [header, ...rows].join('\n') + '\n';
}

/** Parses and validates; throws on malformed rows or bad check characters
 * so a corrupted vendor file is caught before printing. */
export function parseBatchCsv(csv: string): BatchRow[] {
  const lines = csv.trim().split('\n');
  if (lines[0] !== 'code,batch_id,seq') throw new Error('unexpected CSV header');
  return lines.slice(1).map((line, i) => {
    const [code, batchId, seqRaw] = line.split(',');
    const seq = Number(seqRaw);
    if (!code || !batchId || !Number.isInteger(seq)) throw new Error(`malformed row ${i + 2}`);
    if (!isValidCode(code)) throw new Error(`invalid code at row ${i + 2}: ${code}`);
    return { code, batchId, seq };
  });
}
