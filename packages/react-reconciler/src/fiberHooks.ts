import { ReactElement } from 'shared/ReactTypes';
import { FiberNode } from './fiber';

export const renderWithHooks = (wip: FiberNode): ReactElement => {
  if (typeof wip.type !== 'function') {
    throw new Error('Unsupported element type in renderWithHooks.');
  }
  const Component = wip.type;
  const props = wip.pendingProps;
  const children = Component(props);
  return children;
};
