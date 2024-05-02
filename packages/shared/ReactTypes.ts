import { REACT_ELEMENT_TYPE } from './ReactSymbols';

export type ReactType = string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReactKey = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReactRef = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReactProps = Record<string, any> & {
  children?: ReactElement;
  key?: ReactKey;
  ref?: ReactRef;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ElementType = any;

export interface ReactElement {
  $$typeof: typeof REACT_ELEMENT_TYPE;
  type: ReactType;
  key: ReactKey;
  ref: ReactRef;
  props: ReactProps;
  __mark__: string;
}

export type Action<State> = State | ((prevState: State) => State);
