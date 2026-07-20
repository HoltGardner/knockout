import type { Rng } from './rng';

export type PlayerId = string;

/** Every game is a pure reducer over typed state (docs/architecture.md).
 * No I/O, no wall clock; randomness only via the provided Rng. */
export type Reducer<State, Action> = (state: State, action: Action, rng: Rng) => State;
