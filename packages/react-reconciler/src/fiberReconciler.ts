import { Container } from 'hostConfig';
import { ReactElement } from 'shared/ReactTypes';
import { HostRoot } from './workTags';
import { FiberNode, FiberRootNode } from './fiber';
import { createUpdate, createUpdateQueue, enqueueUpdate } from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';

export const createContainer = (container: Container): FiberRootNode => {
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  const root = new FiberRootNode(container, hostRootFiber);
  hostRootFiber.updateQueue = createUpdateQueue();
  return root;
};

export const updateContainer = (
  reactElement: ReactElement | null,
  root: FiberRootNode,
) => {
  const hostRootFiber = root.current;
  const update = createUpdate(reactElement);
  enqueueUpdate(hostRootFiber.updateQueue!, update);
  scheduleUpdateOnFiber(hostRootFiber);
  return reactElement;
};
