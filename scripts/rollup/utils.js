import path from 'path';
import fs from 'fs';
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const packagePath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

const resolvePkgPath = (pkgName, isDist = false) => {
  if (isDist) {
    return `${distPath}/${pkgName}`;
  }
  return `${packagePath}/${pkgName}`;
};

const getPackageJson = (pkgName) => {
  const path = `${resolvePkgPath(pkgName)}/package.json`;
  const str = fs.readFileSync(path, { encoding: 'utf-8' });
  return JSON.parse(str);
};

const getBaseRollupPlugins = ({
  alias = {
    __DEV__: true,
    preventAssignment: true,
  },
  tsConfig = {},
} = {}) => {
  return [replace(alias), cjs(), ts(tsConfig)];
};

export { resolvePkgPath, getPackageJson, getBaseRollupPlugins };
