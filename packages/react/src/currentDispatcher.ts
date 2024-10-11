import { Action } from 'shared/ReactTypes';

export interface UseState<S> {}

export interface Dispatcher {
  useState: <State>(
    initialState: State | (() => State),
  ) => [State, Dispatch<State>];
}

export type Dispatch<S> = (action: Action<S>) => void;

const currentDispatcher: { current: Dispatcher | null } = {
  current: null,
};

export const resolveDispatcher = () => {
  if (currentDispatcher.current === null) {
    throw new Error('Invalid hook call');
  }
  return currentDispatcher.current;
};

export default currentDispatcher;
