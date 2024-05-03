import { beginWork } from './beginWork';
import { commitMutationEffects } from './commitWork';
import { completeWork } from './completeWork';
import {
  createWorkInProgress,
  type FiberNode,
  type FiberRootNode,
} from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;

/**
 * Initializes the work-in-progress tree.
 */
const prepareFreshStack = (root: FiberRootNode) => {
  workInProgress = createWorkInProgress(root.current, {});
};

export const scheduleUpdateOnFiber = (fiber: FiberNode) => {
  const fiberRootNode = markUpdateFromFiberToRoot(fiber);
  if (fiberRootNode === null) {
    if (__DEV__) {
      console.error('No root found for fiber:', fiber);
    }
    return;
  }
  renderRoot(fiberRootNode as FiberRootNode);
};

const markUpdateFromFiberToRoot = (fiber: FiberNode) => {
  let current = fiber;
  let parent = current.return;

  while (parent !== null) {
    current = parent;
    parent = current.return;
  }

  if (current.tag === HostRoot) {
    return current.stateNode;
  }

  return null;
};

const completeUnitOfWork = (fiber: FiberNode) => {
  let node: FiberNode | null = fiber;

  do {
    completeWork(node);
    const { sibling } = node;
    if (sibling !== null) {
      workInProgress = sibling;
      return;
    }
    node = node.return;
    workInProgress = node;
  } while (node !== null);
};

const performUnitOfWork = (fiber: FiberNode) => {
  const next = beginWork(fiber);
  fiber.memoizedProps = fiber.pendingProps;

  if (next !== null) {
    workInProgress = next;
  } else {
    completeUnitOfWork(fiber);
  }
};

const workLoop = () => {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
};

const commitRoot = (root: FiberRootNode) => {
  const finishedWork = root.finishedWork;
  if (finishedWork === null) {
    return;
  }

  if (__DEV__) {
    console.log('Committing root:', finishedWork);
  }

  root.finishedWork = null;

  const hasSubTreeEffects =
    (finishedWork.subTreeFlags & MutationMask) !== NoFlags;
  const hasRootEffects = (finishedWork.flags & MutationMask) !== NoFlags;

  if (hasRootEffects || hasSubTreeEffects) {
    // Before mutation
    // Mutation
    commitMutationEffects(finishedWork);
    root.current = finishedWork;
    // Layout(After mutation)
  } else {
    root.current = finishedWork;
  }
};

export const renderRoot = (root: FiberRootNode) => {
  prepareFreshStack(root);

  do {
    try {
      workLoop();
      break;
    } catch (error) {
      if (__DEV__) {
        console.warn('Error during work loop:', error);
      }
      workInProgress = null;
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);

  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  commitRoot(root);
};
