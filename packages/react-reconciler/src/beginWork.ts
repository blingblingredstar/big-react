import { ReactElement } from 'shared';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFibers';

/**
 * Traverse the fiber tree from top to bottom,
 * in react, use the DFS to traverse the fiber node tree,
 * this function works with completeWork to complete the DFS.
 * @returns childFiber node in the bottom of the tree
 */
export const beginWork = (wip: FiberNode): FiberNode | null => {
	// Compare and return child fiber node
	switch (wip.type) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.warn(
					'Not implement fiber type in beginWork for type: ',
					wip.type
				);
			}
			return null;
	}
};

const updateHostRoot = (wip: FiberNode): FiberNode | null => {
	const baseState = wip.memoizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;
	const { memoizedState } = processUpdateQueue(baseState, pending);
	wip.memoizedState = memoizedState;

	const nextChild = wip.memoizedState;

	return wip.child;
};

const updateHostComponent = (wip: FiberNode): FiberNode | null => {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;

	return wip.child;
};

const reconcileChildren = (wip: FiberNode, children?: ReactElement) => {
	const current = wip.alternate;

	if (current !== null) {
		// update
		wip.child = reconcileChildFibers(wip, current, children);
	} else {
		// mount
		wip.child = mountChildFibers(wip, null, children);
	}
};
