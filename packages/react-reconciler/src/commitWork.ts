import { appendChildToContainer, Container, Instance } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags, Placement } from './fiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';

let nextEffect: FiberNode | null = null;

export const commitMutationEffects = (wip: FiberNode) => {
  nextEffect = wip;
  while (nextEffect !== null) {
    const child = nextEffect.child;

    if (child !== null && (nextEffect.flags & MutationMask) !== NoFlags) {
      nextEffect = child;
    } else {
      up: while (nextEffect !== null) {
        commitMutationEffectsOnFiber(nextEffect);
        if (nextEffect.sibling !== null) {
          nextEffect = nextEffect.sibling;
          break up;
        }
        nextEffect = nextEffect.return;
      }
    }
  }
};

const commitMutationEffectsOnFiber = (fiber: FiberNode) => {
  const { flags } = fiber;
  if ((flags & Placement) !== NoFlags) {
    commitPlacement(fiber);
    // Reset the Placement flag.
    fiber.flags &= ~Placement;
  }
};

const commitPlacement = (fiber: FiberNode) => {
  if (__DEV__) {
    console.log('Commit Placement:', fiber);
  }
  // Get parent dom element.
  const hostParent = getHostParent(fiber);
  appendPlacementIntoContainer(fiber, hostParent);
};

const getHostParent = (fiber: FiberNode): Container => {
  let parent = fiber.return;
  while (parent !== null) {
    if (parent.tag === HostComponent) {
      return parent.stateNode as Element;
    }
    if (parent.tag === HostRoot) {
      return (parent.stateNode as FiberRootNode).container;
    }
    parent = parent.return;
  }
  if (__DEV__) {
    console.error('No host parent for fiber:', fiber);
  }
  return parent as unknown as Container;
};

const appendPlacementIntoContainer = (
  fiber: FiberNode,
  container: Container,
) => {
  if (fiber.tag === HostComponent || fiber.tag === HostText) {
    appendChildToContainer(fiber.stateNode as Instance, container);
    return;
  }
  const child = fiber.child;
  if (child !== null) {
    appendPlacementIntoContainer(child, container);
    let sibling = child.sibling;
    while (sibling !== null) {
      appendPlacementIntoContainer(sibling, container);
      sibling = sibling.sibling;
    }
  }
};
