/** @type {import('jest').Config} */
const config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['./setupJest.ts'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
      },
    ],
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/cognizone/a2/*', '<rootDir>/dist/cognizone/server-file-browser/*'],
  moduleNameMapper: {
    '@cognizone/a2': '<rootDir>/projects/cognizone/a2/src/public-api.ts',
    '@cognizone/a2/(.*)': '<rootDir>/projects/cognizone/a2/src/public-api.ts',
    '@cognizone/server-file-browser': '<rootDir>/projects/cognizone/server-file-browser/src/public-api.ts',
    '@cognizone/server-file-browser/(.*)': '<rootDir>/projects/cognizone/server-file-browser/src/public-api.ts',
    '@cognizone/sse': '<rootDir>/projects/cognizone/sse/src/public-api.ts',
    '@cognizone/sse/(.*)': '<rootDir>/projects/cognizone/sse/src/public-api.ts',
  },
};

module.exports = config;
