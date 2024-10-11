import { Action, ReactElement } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import ReactInternals from 'shared/internals';
import { Dispatch, Dispatcher } from 'react/src/currentDispatcher';

import {
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
  UpdateQueue,
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';

const { currentDispatcher } = ReactInternals;
let currentRenderFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;

interface Hook {
  memoizedState: any;
  updateQueue: UpdateQueue<unknown> | null;
  next: Hook | null;
}

export const renderWithHooks = (wip: FiberNode): ReactElement => {
  if (typeof wip.type !== 'function') {
    throw new Error('Unsupported element type in renderWithHooks.');
  }

  currentRenderFiber = wip;
  wip.memoizedState = null;

  const current = wip.alternate;

  if (current !== null) {
    // Update the state of the current hook.
    workInProgressHook = current.memoizedState;
  } else {
    // Create the state of the current hook.
    currentDispatcher.current = HooksDispatcherOnMount;
  }

  const Component = wip.type;
  const props = wip.pendingProps;
  const children = Component(props);

  currentRenderFiber = null;
  return children;
};

const mountWorkInProgressHook = (): Hook => {
  const hook: Hook = {
    memoizedState: null,
    updateQueue: null,
    next: null,
  };

  if (workInProgressHook === null) {
    // First hook for the current fiber.
    if (currentRenderFiber === null) {
      throw new Error('Invalid hook call');
    } else {
      workInProgressHook = hook;
      currentRenderFiber.memoizedState = workInProgressHook;
    }
  } else {
    // There are already hooks on this fiber.
    workInProgressHook.next = hook;
    workInProgressHook = hook;
  }

  return workInProgressHook;
};

const dispatchAction = <State>(
  fiber: FiberNode,
  updateQueue: UpdateQueue<State>,
  action: Action<State>,
) => {
  const update = createUpdate(action);
  enqueueUpdate(updateQueue, update);
  scheduleUpdateOnFiber(fiber);
};

const mountState = <State>(
  initialState: State | (() => State),
): [State, Dispatch<State>] => {
  // Find the current hook.
  const hook = mountWorkInProgressHook();
  const memoizedState =
    initialState instanceof Function ? initialState() : initialState;
  hook.memoizedState = memoizedState;
  hook.updateQueue = createUpdateQueue();

  if (currentRenderFiber === null) {
    throw new Error('Invalid hook call');
  }

  const dispatch = dispatchAction.bind(
    null,
    currentRenderFiber,
    hook.updateQueue,
  );

  return [memoizedState, dispatch];
};

const HooksDispatcherOnMount: Dispatcher = {
  useState: mountState,
};
