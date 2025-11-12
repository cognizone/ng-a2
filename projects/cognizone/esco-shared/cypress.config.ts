import { defineConfig } from 'cypress';
import * as path from 'path';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
      options: {
        projectConfig: {
          root: path.resolve(__dirname, 'src'),
          sourceRoot: path.resolve(__dirname, 'src'),
          buildOptions: {
            tsConfig: path.resolve(__dirname, 'tsconfig.json'),
          },
        },
      },
    },
  },
});
