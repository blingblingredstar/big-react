import { FiberNode } from './fiber';

/**
 * Traverse the fiber tree from top to bottom,
 * in react, use the DFS to traverse the fiber node tree,
 * this function works with completeWork to complete the DFS.
 * @returns childFiber node in the bottom of the tree
 */
export const beginWork = (fiber: FiberNode): FiberNode | null => {
	return null;
};
