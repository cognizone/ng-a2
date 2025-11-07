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
  collectCoverage: false,
  collectCoverageFrom: [
    'projects/**/*.{ts,tsx}',
    '!projects/**/*.spec.{ts,tsx}',
    '!projects/**/*.d.ts',
    '!projects/**/index.ts',
    '!projects/**/public-api.ts',
    '!projects/**/*.module.ts',
    '!projects/**/cypress/**',
    '!projects/**/*.cy.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'text-summary', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};

module.exports = config;
