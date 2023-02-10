import { REACT_ELEMENT_TYPE, ReactElement } from 'shared';
import { FiberNode, createFiberFromElement } from './fiber';
import { HostText } from './workTags';
import { Placement } from './fiberFlags';

const ChildReconciler = (shouldTrackEffects: boolean) => {
	const reconcileSingleElement = (
		parent: FiberNode,
		current: FiberNode | null,
		element: ReactElement
	): FiberNode => {
		const fiber = createFiberFromElement(element);
		fiber.return = parent;
		return fiber;
	};

	const reconcileSingleTextNode = (
		parent: FiberNode,
		current: FiberNode | null,
		content: string | number
	): FiberNode => {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = parent;
		return fiber;
	};

	const placeSingleChild = (fiber: FiberNode) => {
		if (shouldTrackEffects && fiber.alternate === null) {
			fiber.flags |= Placement;
		}
		return fiber;
	};

	const reconcileChildFibers = (
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElement
	): FiberNode | null => {
		// Figure out the current fiber's type
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiber, newChild)
					);
				default:
					if (__DEV__) {
						console.warn(
							'Not implement this reconcile type yet in reconcileChildFibers, child type: ',
							newChild.$$typeof
						);
					}
					break;
			}
		}
		// TODO: multi child like ul > li * 3
		// HostText type
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiber, newChild)
			);
		}
		if (__DEV__) {
			console.warn(
				'Not implement this reconcile type yet in reconcileChildFibers, child type: ',
				newChild
			);
		}
		return null;
	};

	return reconcileChildFibers;
};

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
