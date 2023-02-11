import { beginWork } from './beginWork';
import { commitMutationEffects } from './commitWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
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

/**
 * Render phase, include beginWork and completeWork
 * start commit phase in the end.
 */
const renderRoot = (root: FiberRootNode) => {
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.warn('Error occurred during execution workLoop: ', e);
			}
			workingInProgress = null;
		}
	} while (true);

	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;
	commitRoot(root);
};

/**
 * Commit phase, include three sub phase
 * 1. beforeMutation
 * 2. mutation
 * 3. layout
 */
const commitRoot = (root: FiberRootNode) => {
	const finishedWork = root.finishedWork;
	// reset
	root.finishedWork = null;

	if (finishedWork === null) {
		return;
	}

	if (__DEV__) {
		console.warn('Commit phase start, finishedWork is: ', finishedWork);
	}

	// Check whether there are operations that need to be performed in the three sub-phases
	const hasSubtreeEffects =
		(finishedWork.subtreeFlags & MutationMask) !== NoFlags;
	const hasRootEffects = (finishedWork.flags & MutationMask) !== NoFlags;

	if (hasRootEffects || hasSubtreeEffects) {
		// beforeMutation
		// mutation
		commitMutationEffects(finishedWork);
		root.current = finishedWork;
		// layout
	} else {
		root.current = finishedWork;
	}
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
		completeUnitOfWork(fiber);
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
