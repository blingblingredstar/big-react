import { ReactProps, ReactType } from 'shared/ReactTypes';

export type Container = Element;
export type Instance = Element | Text;

export const createInstance = (
  type: ReactType,
  _props: ReactProps,
): Container => {
  // TODO: handle props
  const element = document.createElement(type);
  return element;
};

export const createTextInstance = (content: string | number): Instance => {
  return document.createTextNode(`${content}`);
};

export const appendInitialChild = (parent: Container, child: Instance) => {
  parent.appendChild(child);
};

export const appendChildToContainer = appendInitialChild;
