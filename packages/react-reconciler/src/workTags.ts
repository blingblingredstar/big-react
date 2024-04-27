export const FunctionComponent = 0b0000;
export const HostRoot = 0b0011;
export const HostComponent = 0b0101;
export const HostText = 0b0110;

export type WorkTag =
  | typeof FunctionComponent
  | typeof HostRoot
  | typeof HostComponent
  | typeof HostText;
