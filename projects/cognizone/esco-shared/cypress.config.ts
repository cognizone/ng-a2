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
          root: path.resolve(__dirname, '../../..'),
        },
      },
    },
    specPattern: '**/*.cy.ts',
    supportFile: path.resolve(__dirname, '../../../cypress/support/component.ts'),
  },
});
