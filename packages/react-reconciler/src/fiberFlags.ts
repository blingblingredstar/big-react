export const NoFlags = /*                      */ 0b00000000000000000000000000000000;
export const Placement = /*                    */ 0b00000000000000000000000000000001;
export const Update = /*                       */ 0b00000000000000000000000000000010;
export const ChildDeletion = /*                */ 0b00000000000000000000000000000100;

export type FiberFlags =
  | typeof NoFlags
  | typeof Placement
  | typeof Update
  | typeof ChildDeletion;

export const MutationMask = Placement | Update | ChildDeletion;
