import generatePackageJson from 'rollup-plugin-generate-package-json';
import {
	getBaseRollupPlugins,
	getPackageJson,
	resolvePackagePath
} from './utils';

const { name, module } = getPackageJson('react');
const pkgPath = resolvePackagePath(name);
const pkgDistPath = resolvePackagePath(name, true);

/** @type {import("rollup").RollupOptions[]} */
export default [
	// react
	{
		input: `${pkgPath}/${module}`,
		output: {
			file: `${pkgDistPath}/index.js`,
			name: 'index.js',
			format: 'umd'
		},
		plugins: [
			...getBaseRollupPlugins(),
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				baseContents({ name, description, version }) {
					return {
						name,
						description,
						version,
						main: 'index.js'
					};
				}
			})
		]
	},
	// jsx-runtime
	{
		input: `${pkgPath}/src/jsx.ts`,
		output: [
			// jsx-runtime
			{
				file: `${pkgDistPath}/jsx-runtime.js`,
				name: 'jsx-runtime.js',
				format: 'umd'
			},
			// jsx-dev-runtime
			{
				file: `${pkgDistPath}/jsx-dev-runtime.js`,
				name: 'jsx-dev-runtime.js',
				format: 'umd'
			}
		],
		plugins: getBaseRollupPlugins()
	}
];
