import { Container } from 'react-dom/src/hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate
} from './updateQueue';
import { ReactElement } from 'shared';
import { scheduleUpdateOnFiber } from './workLoop';

export const createContainer = (container: Container) => {
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	hostRootFiber.updateQueue = createUpdateQueue();
	const root = new FiberRootNode(container, hostRootFiber);
	return root;
};

export const updateContainer = (
	element: ReactElement | null,
	root: FiberRootNode
) => {
	const hostRootFiber = root.current;
	const update = createUpdate(element);
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElement | null>,
		update
	);
	scheduleUpdateOnFiber(hostRootFiber);
	return element;
};
