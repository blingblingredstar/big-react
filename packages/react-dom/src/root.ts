// ReactDOM.createRoot(root).render(<App />)

import { ReactElement } from 'shared';
import { Container } from './hostConfig';
import {
	createContainer,
	updateContainer
} from 'react-reconciler/src/fiberReconciler';

export const createRoot = (container: Container) => {
	const root = createContainer(container);
	return {
		render(element: ReactElement) {
			updateContainer(element, root);
		}
	};
};
