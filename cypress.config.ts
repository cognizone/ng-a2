import { defineConfig } from 'cypress';
import * as path from 'path';

export default defineConfig({
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
    indexHtmlFile: path.resolve(__dirname, 'projects/cypress-test-app/src/index.html'),
    supportFile: path.resolve(__dirname, 'projects/cypress-test-app/cypress/support/component.ts'),
  },
});
