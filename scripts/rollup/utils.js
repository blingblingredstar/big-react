import { readFileSync } from 'fs';
import path from 'path';
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const packagePath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

export function resolvePackagePath(pkgName, isDist) {
	if (isDist) return `${distPath}/${pkgName}`;
	return `${packagePath}/${pkgName}`;
}

export function getPackageJson(pkgName) {
	const path = `${resolvePackagePath(pkgName)}/package.json`;
	const str = readFileSync(path, { encoding: 'utf-8' });
	return JSON.parse(str);
}

export function getBaseRollupPlugins({
	alias = {
		__DEV__: true,
		preventAssignment: true
	},
	tsconfig = {}
} = {}) {
	return [replace(alias), cjs(), ts(tsconfig)];
}
