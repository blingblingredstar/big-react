import {
	REACT_ELEMENT_TYPE,
	ReactElement,
	ElementType,
	Key,
	Ref,
	Props
} from 'shared';

const MARK = 'big-react';

const createReactElement = (
	type: ElementType,
	key: Key,
	ref: Ref,
	props: Props
): ReactElement => {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: MARK
	};

	return element;
};

export const jsx = (
	type: ElementType,
	config: any,
	...maybeChildren: any[]
) => {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = null;

	Object.entries(config).forEach(([prop, propVal]) => {
		if (prop === 'key') {
			if (propVal !== undefined) {
				key = '' + propVal;
			}
		} else if (prop === 'ref') {
			if (propVal !== undefined) {
				ref = propVal;
			}
		} else {
			props[prop] = propVal;
		}
	});

	const maybeChildrenLength = maybeChildren.length;
	if (maybeChildrenLength) {
		if (maybeChildrenLength === 1) {
			props.children = maybeChildren[0];
		} else {
			props.children = maybeChildren;
		}
	}

	return createReactElement(type, key, ref, props);
};

export const jsxDev = (type: ElementType, config: any) => {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = null;

	Object.entries(config).forEach(([prop, propVal]) => {
		if (prop === 'key') {
			if (propVal !== undefined) {
				key = '' + propVal;
			}
		} else if (prop === 'ref') {
			if (propVal !== undefined) {
				ref = propVal;
			}
		} else {
			props[prop] = propVal;
		}
	});

	return createReactElement(type, key, ref, props);
};
