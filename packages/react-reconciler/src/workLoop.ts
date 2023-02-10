import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { HostRoot } from './workTags';

let workingInProgress: FiberNode | null;

/**
 * Initialize
 */
const prepareFreshStack = (root: FiberRootNode) => {
	workingInProgress = createWorkInProgress(root.current, {});
};

export const scheduleUpdateOnFiber = (fiber: FiberNode) => {
	// TODO: scheduler
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
};

const markUpdateFromFiberToRoot = (fiber: FiberNode) => {
	let node = fiber;
	let parent = node.return;

	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
};

const renderRoot = (root: FiberRootNode) => {
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			console.warn('Error occurred during execution workLoop: ', e);
			workingInProgress = null;
		}
	} while (true);
};

const workLoop = () => {
	while (workingInProgress !== null) {
		performUnitOfWork(workingInProgress);
	}
};

const performUnitOfWork = (fiber: FiberNode) => {
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;

	if (next === null) {
		completeUnitOfWork(next);
	} else {
		workingInProgress = next;
	}
};

const completeUnitOfWork = (fiber: FiberNode) => {
	let node: FiberNode | null = fiber;

	do {
		completeWork(node);
		const { sibling } = node;
		if (sibling !== null) {
			workingInProgress = sibling;
			return;
		}
		node = node.return;
		workingInProgress = node;
	} while (node !== null);
};
