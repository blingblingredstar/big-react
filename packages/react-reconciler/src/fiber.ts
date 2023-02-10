import { Props, Key, Ref, ReactElement } from 'shared';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';
import { UpdateQueue } from './updateQueue';

export class FiberNode {
	tag: WorkTag;
	key: Key;
	/** Props at beginning */
	pendingProps: Props;
	/** For function component, type is function itself */
	type: any;
	/** For host component like <div /> stateNode is the div dom element */
	stateNode: any;
	ref: Ref;

	/** Parent node */
	return: FiberNode | null;
	/** Sibling node */
	sibling: FiberNode | null;
	/** Child node */
	child: FiberNode | null;
	/** Index for component like ul > li * 3 */
	index: number;

	/** Props after working */
	memoizedProps: Props | null;
	/** State after update */
	memoizedState: any;
	/** The alternate fiber node, connect the current/workingInProgress fiber */
	alternate: FiberNode | null;
	/** Side effect */
	flags: Flags;
	updateQueue: UpdateQueue<unknown> | null;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// Instance
		this.tag = tag;
		this.key = key;
		this.type = null;
		this.stateNode = null;

		// Relations, build as a tree
		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		this.ref = null;

		// As work unit
		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.updateQueue = null;
		this.memoizedState = null;

		this.alternate = null;
		this.flags = NoFlags;
	}
}

export class FiberRootNode {
	/** Root element like in browser is app dom element */
	container: Container;
	/** Host root fiber node */
	current: FiberNode;
	/** Alternate fiber after finished reconcile */
	finishedWork: FiberNode | null;

	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;
	if (wip === null) {
		// In mount phase, we don't have the alternate
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;
		wip.alternate = current;
		current.alternate = wip;
	} else {
		// Otherwise it's update phase
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags;
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;

	return wip;
};

export const createFiberFromElement = (element: ReactElement): FiberNode => {
	const { type, key, props } = element;
	let fiberTag: WorkTag = FunctionComponent;

	if (typeof type === 'string') {
		// if ReactElement is like <div />, type is 'div'
		fiberTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('Undefined type in element: ', element);
	}
	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
};
