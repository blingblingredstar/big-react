import {
  appendInitialChild,
  Container,
  createInstance,
  createTextInstance,
  Instance,
} from 'hostConfig';
import { FiberNode } from './fiber';
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from './workTags';
import { NoFlags } from './fiberFlags';

/**
 * Completes the work on the current fiber.
 * This is where the side-effects are performed.
 * This is called after the work has been done on the children.
 * From the child to the parent.
 */
export const completeWork = (wip: FiberNode) => {
  const newProps = wip.pendingProps;
  const current = wip.alternate;

  switch (wip.tag) {
    case HostComponent:
      // Build the DOM element.
      // Insert the DOM into the DOM tree.
      if (current !== null && wip.stateNode !== null) {
        // Update the DOM element.
      } else {
        // Create the DOM element.
        const instance = createInstance(wip.type as string, newProps);
        appendAllChildren(instance, wip);
        wip.stateNode = instance;
      }
      bubbleProperties(wip);
      return null;
    case HostText:
      // Build the DOM element.
      // Insert the DOM into the DOM tree.
      if (current !== null && wip.stateNode !== null) {
        // Update the DOM element.
      } else {
        // Create the DOM element.
        const instance = createTextInstance(newProps.content!);
        wip.stateNode = instance;
      }
      bubbleProperties(wip);
      return null;
    case FunctionComponent:
      bubbleProperties(wip);
      return null;
    case HostRoot:
      bubbleProperties(wip);
      return null;
    default:
      if (__DEV__) {
        console.error('Unknown Fiber Tag in complete work:', wip);
      }
      return null;
  }
};

const appendAllChildren = (parent: Container, wip: FiberNode) => {
  let node = wip.child;

  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode as Instance);
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
  let subTreeFlags = NoFlags;
  let child = wip.child;

  while (child !== null) {
    subTreeFlags |= child.flags;
    subTreeFlags |= child.subTreeFlags;
    child.return = wip;
    child = child.sibling;
  }
  wip.subTreeFlags |= subTreeFlags;
};
