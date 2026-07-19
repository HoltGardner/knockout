import { mulberry32, type Rng } from '@exit/engine';

/** A scripted playtest bot (grinder, investor, leverage, ...). Strategies
 * are the fixed lenses the balance suite runs against the engine. */
export interface Strategy<State, Action> {
  readonly name: string;
  pickAction(state: State, rng: Rng): Action;
}

/** Run n independent trials, each with its own deterministic seed derived
 * from baseSeed, so a failing trial is exactly reproducible. */
export function runTrials<T>(n: number, baseSeed: number, run: (rng: Rng, trial: number) => T): T[] {
  return Array.from({ length: n }, (_, trial) => run(mulberry32(baseSeed + trial), trial));
}
