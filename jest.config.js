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
  modulePathIgnorePatterns: ['<rootDir>/dist/cognizone/a2-core/*'],
  testPathIgnorePatterns: ['/cypress/', '/node_modules/'],
  moduleNameMapper: {
    '@cognizone/a2-core': '<rootDir>/projects/cognizone/a2-core/src/public-api.ts',
    '@cognizone/a2-core/(.*)': '<rootDir>/projects/cognizone/a2-core/src/public-api.ts',
    '@cognizone/a2-sse': '<rootDir>/projects/cognizone/a2-sse/src/public-api.ts',
    '@cognizone/a2-sse/(.*)': '<rootDir>/projects/cognizone/a2-sse/src/public-api.ts',
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
