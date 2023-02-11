import {
	appendInitialChild,
	createInstance,
	createTextInstance
} from 'hostConfig';
import { FiberNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTags';
import { NoFlags } from './fiberFlags';

/**
 * Traverse the fiber tree from bottom to top,
 * in react, use the DFS to traverse the fiber node tree,
 * this function works with beginWork to complete the DFS.
 * @returns root fiber node in the top of the tree
 */
export const completeWork = (wip: FiberNode) => {
	const newProps = wip.pendingProps;
	const current = wip.alternate;

	switch (wip.tag) {
		case HostComponent:
			if (current !== null && wip.stateNode) {
				// TODO update
			} else {
				// mount
				// 1. Build DOM
				const instance = createInstance(wip.type, newProps);
				// 2. Insert new DOM into DOM tree
				appendAllChildren(instance, wip);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		case HostText:
			// 1. Build DOM
			// 2. Insert new DOM into DOM tree
			if (current !== null && wip.stateNode) {
				// TODO update
			} else {
				// mount
				// 1. Build DOM
				const instance = createTextInstance(newProps.content);
				// 2. Insert new DOM into DOM tree
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		case HostRoot:
			bubbleProperties(wip);
			return null;
		default:
			if (__DEV__) {
				console.warn('Un handled wip.tag in completeWork for wip: ', wip);
			}
			return null;
	}
};

const appendAllChildren = (parent: FiberNode, wip: FiberNode) => {
	let node = wip.child;

	while (node !== null) {
		if (node.tag === HostComponent || node.tag === HostText) {
			appendInitialChild(parent, node.stateNode);
		} else if (node.child !== null) {
			node.child.return = node;
			node = node.child;
			continue;
		}

		if (node === wip) {
			return;
		}

		while (node.sibling === null) {
			if (node.return === null || node.return === wip) {
				return;
			}
			node = node.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
};

const bubbleProperties = (wip: FiberNode) => {
	let subtreeFlags = NoFlags;
	let child = wip.child;

	while (child !== null) {
		subtreeFlags |= child.subtreeFlags;
		subtreeFlags |= child.flags;

		child.return = wip;
		child = child.sibling;
	}

	wip.subtreeFlags |= subtreeFlags;
};
