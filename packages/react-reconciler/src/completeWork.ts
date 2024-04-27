import { FiberNode } from './fiber';

/**
 * Completes the work on the current fiber.
 * This is where the side-effects are performed.
 * This is called after the work has been done on the children.
 * From the child to the parent.
 */
export const completeWork = (fiber: FiberNode) => {
  return fiber;
};
