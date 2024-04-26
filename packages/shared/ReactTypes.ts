import { REACT_ELEMENT_TYPE } from './ReactSymbols';

export type ReactType = string;
export type ReactKey = any;
export type ReactRef = any;
export type ReactProps = Record<string, any>;
export type ElementType = any;

export interface ReactElement {
  $$typeof: typeof REACT_ELEMENT_TYPE;
  type: ReactType;
  key: ReactKey;
  ref: ReactRef;
  props: ReactProps;
  __mark__: string;
}
