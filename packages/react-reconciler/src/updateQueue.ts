import type { Action } from 'shared/ReactTypes';

export interface Update<State> {
  action: Action<State>;
}

export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null;
  };
}

export const createUpdate = <State>(action: Action<State>): Update<State> => {
  return {
    action,
  };
};

export const createUpdateQueue = <State>(): UpdateQueue<State> => {
  return {
    shared: {
      pending: null,
    },
  };
};

export const enqueueUpdate = <State>(
  queue: UpdateQueue<State>,
  update: Update<State>,
) => {
  if (queue.shared.pending === null) {
    queue.shared.pending = update;
  }
};

export const processUpdateQueue = <State>(
  baseState: State,
  pendingUpdate: Update<State> | null,
): {
  memoizedState: State;
} => {
  if (pendingUpdate !== null) {
    const { action } = pendingUpdate;
    const nextState = action instanceof Function ? action(baseState) : action;

    return {
      memoizedState: nextState,
    };
  }

  return {
    memoizedState: baseState,
  };
};
