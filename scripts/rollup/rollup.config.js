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
	{
		input: `${pkgPath}/${module}`,
		output: {
			file: `${pkgDistPath}/index.js`,
			name: 'index.js',
			format: 'umd'
		},
		plugins: getBaseRollupPlugins()
	}
];
