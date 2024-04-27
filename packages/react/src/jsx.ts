import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import type {
  ElementType,
  ReactElement,
  ReactKey,
  ReactProps,
  ReactRef,
  ReactType,
} from 'shared/ReactTypes';

const ReactElement = (
  type: ReactType,
  key: ReactKey,
  ref: ReactRef,
  props: ReactProps,
): ReactElement => {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark__: 'BigReact',
  } as const;
  return element;
};

export const jsx = (
  type: ElementType,
  props: ReactProps,
  ...maybeChildren: Array<ReactElement | string | number>
): ReactElement => {
  const _props: Omit<ReactProps, 'key' | 'ref'> = {};
  let key = null;
  let ref = null;
  Object.entries(props).forEach(([k, v]) => {
    if (k === 'key') {
      key = v;
    } else if (k === 'ref') {
      ref = v;
    } else {
      _props[k] = v;
    }
  });
  if (maybeChildren.length === 1) {
    _props.children = maybeChildren[0];
  } else {
    _props.children = maybeChildren;
  }
  return ReactElement(type, key, ref, _props);
};

export const jsxDEV = (type: ElementType, props: ReactProps): ReactElement => {
  const _props: Omit<ReactProps, 'key' | 'ref'> = {};
  let key = null;
  let ref = null;
  Object.entries(props).forEach(([k, v]) => {
    if (k === 'key') {
      key = v;
    } else if (k === 'ref') {
      ref = v;
    } else {
      _props[k] = v;
    }
  });
  return ReactElement(type, key, ref, _props);
};
