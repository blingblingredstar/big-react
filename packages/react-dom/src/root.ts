// Usage ReactDOM.createRoot(root).render(<App />);

import {
  createContainer,
  updateContainer,
} from 'react-reconciler/src/fiberReconciler';
import { Container } from './hostConfig';
import { ReactElement } from 'shared/ReactTypes';

export const createRoot = (container: Container) => {
  const root = createContainer(container);

  return {
    render(element: ReactElement) {
      updateContainer(element, root);
    },
  };
};
