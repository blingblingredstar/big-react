import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import type { FiberNode } from './fiber';

let workInProgress: FiberNode | null = null;

/**
 * Initializes the work-in-progress tree.
 */
const prepareFreshStack = (root: FiberNode) => {
  workInProgress = root;
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

export const renderRoot = (root: FiberNode) => {
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
