import { Props } from 'shared';

export type Container = Element;
export type Instance = Element;

export const createInstance = (type: string, props: Props): Instance => {
	const element = document.createElement(type);
	// TODO process the props
	return element;
};

export const appendInitialChild = (
	parent: Instance | Container,
	child: Instance
) => {
	parent.appendChild(child);
};

export const createTextInstance = (content: string) => {
	return document.createTextNode(content);
};

export const appendChildIntoContainer = (child: Instance, parent: Instance) => {
	parent.appendChild(child);
};
