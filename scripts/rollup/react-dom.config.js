import {
  getBaseRollupPlugins,
  getPackageJson,
  resolvePkgPath,
} from './utils.js';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import alias from '@rollup/plugin-alias';

const { name, module } = getPackageJson('react-dom');
const packagePath = resolvePkgPath(name);
const distPath = resolvePkgPath(name, true);

/**
 * @type {import('rollup').RollupOptions[]}
 */
export default [
  {
    input: `${packagePath}/${module}`,
    output: [
      {
        file: `${distPath}/index.js`,
        name: 'index.js',
        format: 'umd',
      },
      {
        file: `${distPath}/client.js`,
        name: 'client.js',
        format: 'umd',
      },
    ],
    plugins: [
      ...getBaseRollupPlugins(),
      alias({
        entries: {
          hostConfig: `${packagePath}/src/hostConfig.ts`,
        },
      }),
      generatePackageJson({
        inputFolder: packagePath,
        outputFolder: distPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          main: 'index.js',
          peerDependencies: {
            react: version,
          },
        }),
      }),
    ],
  },
];
