import { Container, appendChildIntoContainer } from 'react-dom/src/hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import {
	ChildDeletion,
	MutationMask,
	NoFlags,
	Placement,
	Update
} from './fiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';

let nextEffect: FiberNode | null = null;

export const commitMutationEffects = (finishedWork: FiberNode) => {
	nextEffect = finishedWork;

	while (nextEffect !== null) {
		// traverse to bottom
		const child: FiberNode | null = nextEffect.child;
		if (
			(nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
			nextEffect.child !== null
		) {
			// this means child exist and has mutation effects
			nextEffect = child;
		} else {
			// this means nextEffect has effects and need to traverse to up
			traverseUpward: while (nextEffect !== null) {
				commitMutationEffectsOnFiber(nextEffect);
				const { sibling } = nextEffect;
				if (sibling !== null) {
					nextEffect = sibling;
					break traverseUpward;
				}
				nextEffect = nextEffect?.return;
			}
		}
	}
};

const commitMutationEffectsOnFiber = (nextEffect: FiberNode) => {
	const { flags } = nextEffect;
	if ((flags & Placement) !== NoFlags) {
		// need to Placement
		commitPlacement(nextEffect);
		// remove Placement flag
		nextEffect.flags &= ~Placement;
	}
	if ((flags & Update) !== NoFlags) {
		// need to Update
		// remove Update flag
		nextEffect.flags &= ~Update;
	}
	if ((flags & ChildDeletion) !== NoFlags) {
		// need to ChildDeletion
		// remove ChildDeletion flag
		nextEffect.flags &= ~ChildDeletion;
	}
};

const commitPlacement = (nextEffect: FiberNode) => {
	// we need to find the parent DOM element
	// and find the current DOM and append the current DOM to parent DOM
	if (__DEV__) {
		console.warn('Execute Placement operation', nextEffect);
	}
	const hostParent = getHostParent(nextEffect);
	if (hostParent !== null) {
		appendPlacementNodeIntoContainer(nextEffect, hostParent);
	}
};

/**
 * Find the host container's parent node and return
 * like in browser, for <div><Current /></div>
 * will return the div if pass in the current
 */
const getHostParent = (fiber: FiberNode): Container | null => {
	let parent = fiber.return;
	while (parent !== null) {
		const parentTag = parent.tag;

		if (parentTag === HostComponent) {
			return parent.stateNode as Container;
		}

		if (parentTag === HostRoot) {
			return (parent.stateNode as FiberRootNode).container;
		}
		// traverse upward
		parent = parent.return;
	}
	if (__DEV__) {
		console.warn(
			'Could not find host parent in getHostParent for fiber: ',
			fiber
		);
	}
	return null;
};

const appendPlacementNodeIntoContainer = (
	finishedWork: FiberNode,
	hostParent: Container
) => {
	if ([HostComponent, HostText].includes(finishedWork.tag)) {
		appendChildIntoContainer(finishedWork.stateNode, hostParent);
		return;
	}
	const { child } = finishedWork;
	while (child !== null) {
		// traverse downward to child first
		appendPlacementNodeIntoContainer(child, hostParent);
		// traverse  siblings
		let sibling = child.sibling;
		while (sibling !== null) {
			appendPlacementNodeIntoContainer(sibling, hostParent);
			sibling = sibling.sibling;
		}
	}
};
