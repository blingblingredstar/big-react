import { ReactProps } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { processUpdateQueue } from './updateQueue';
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFibers';
import { renderWithHooks } from './fiberHooks';

/**
 * Reconciles the current Fiber with the work scheduled to be done on it.
 * From the root Fiber, it traverses the tree and performs the work on each Fiber.
 */
export const beginWork = (wip: FiberNode): FiberNode | null => {
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip);
    case HostComponent:
      return updateHostComponent(wip);
    case FunctionComponent:
      return updateFunctionComponent(wip);
    case HostText:
      return null;
    default:
      if (__DEV__) {
        console.error('Unknown Fiber Tag in begin work:', wip.tag);
      }
      return null;
  }
};

const reconcileChildren = (
  wip: FiberNode,
  nextChildren?: ReactProps['children'],
) => {
  const current = wip.alternate;

  if (current !== null) {
    // update
    wip.child = reconcileChildFibers(wip, current.child, nextChildren);
  } else {
    // mount
    wip.child = mountChildFibers(wip, null, nextChildren);
  }
};

const updateHostRoot = (wip: FiberNode): FiberNode | null => {
  const { updateQueue, memoizedState: baseState } = wip;
  const { pending } = updateQueue!.shared;
  updateQueue!.shared.pending = null;
  const { memoizedState } = processUpdateQueue(baseState, pending);
  wip.memoizedState = memoizedState;

  const nextChildren = wip.memoizedState;
  reconcileChildren(wip, nextChildren);
  return wip.child;
};

const updateHostComponent = (wip: FiberNode): FiberNode | null => {
  const nextProps = wip.pendingProps;
  const nextChildren = nextProps.children;
  reconcileChildren(wip, nextChildren);
  return wip.child;
};

const updateFunctionComponent = (wip: FiberNode): FiberNode | null => {
  const nextChildren = renderWithHooks(wip);
  reconcileChildren(wip, nextChildren);
  return wip.child;
};
