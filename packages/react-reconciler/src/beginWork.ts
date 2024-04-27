import { FiberNode } from './fiber';

/**
 * Reconciles the current Fiber with the work scheduled to be done on it.
 * From the root Fiber, it traverses the tree and performs the work on each Fiber.
 */
export const beginWork = (fiber: FiberNode): FiberNode | null => {
  return fiber;
};
