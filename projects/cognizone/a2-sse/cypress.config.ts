import { defineConfig } from 'cypress';
import * as path from 'path';

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: 'http://localhost:4200',
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
    supportFile: path.resolve(__dirname, '../../cypress-test-app/cypress/support/component.ts'),
  },
});
