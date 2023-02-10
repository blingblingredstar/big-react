import { FiberNode } from './fiber';

/**
 * Traverse the fiber tree from bottom to top,
 * in react, use the DFS to traverse the fiber node tree,
 * this function works with beginWork to complete the DFS.
 * @returns root fiber node in the top of the tree
 */
export const completeWork = (fiber: FiberNode) => {
	// TODO
};
