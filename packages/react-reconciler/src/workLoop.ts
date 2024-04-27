import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import {
  createWorkInProgress,
  type FiberNode,
  type FiberRootNode,
} from './fiber';
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
  renderRoot(fiberRootNode);
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

export const renderRoot = (root: FiberRootNode) => {
  prepareFreshStack(root);

  do {
    try {
      workLoop();
      break;
    } catch (error) {
      console.warn('Error during work loop:', error);
      workInProgress = null;
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);
};
