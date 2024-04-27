import {
  getBaseRollupPlugins,
  getPackageJson,
  resolvePkgPath,
} from './utils.js';
import generatePackageJson from 'rollup-plugin-generate-package-json';

const { name, module } = getPackageJson('react');
const packagePath = resolvePkgPath(name);
const distPath = resolvePkgPath(name, true);

/**
 * @type {import('rollup').RollupOptions[]}
 */
export default [
  {
    input: `${packagePath}/${module}`,
    output: {
      file: `${distPath}/index.js`,
      name: 'react',
      format: 'umd',
    },
    plugins: [
      ...getBaseRollupPlugins(),
      generatePackageJson({
        inputFolder: packagePath,
        outputFolder: distPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          main: 'index.js',
        }),
      }),
    ],
  },
  {
    input: `${packagePath}/src/jsx.ts`,
    output: [
      {
        file: `${distPath}/jsx-runtime.js`,
        name: 'jsx-runtime.js',
        format: 'umd',
      },
      {
        file: `${distPath}/jsx-dev-runtime.js`,
        name: 'jsx-dev-runtime.js',
        format: 'umd',
      },
    ],
    plugins: getBaseRollupPlugins(),
  },
];
