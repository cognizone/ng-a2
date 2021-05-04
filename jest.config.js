module.exports = {
	preset: 'jest-preset-angular',
	setupFilesAfterEnv: ['./setupJest.ts'],
	globals: {
		'ts-jest': {
			tsConfig: '<rootDir>/tsconfig.spec.json',
			stringifyContentPathRegex: '\\.html$',
			astTransformers: ['jest-preset-angular/build/InlineFilesTransformer', 'jest-preset-angular/build/StripStylesTransformer']
		}
	},
	modulePathIgnorePatterns: [
		"<rootDir>/dist/cognizone/a2/*",
		"<rootDir>/dist/cognizone/server-file-browser/*"
	],
	moduleNameMapper: {
		'@cognizone/a2': '<rootDir>/projects/cognizone/a2/src/public-api.ts',
		'@cognizone/a2/(.*)': '<rootDir>/projects/cognizone/a2/src/public-api.ts',
		'@cognizone/server-file-browser': '<rootDir>/projects/cognizone/server-file-browser/src/public-api.ts',
		'@cognizone/server-file-browser/(.*)': '<rootDir>/projects/cognizone/server-file-browser/src/public-api.ts',
		'@cognizone/sse': '<rootDir>/projects/cognizone/sse/src/public-api.ts',
		'@cognizone/sse/(.*)': '<rootDir>/projects/cognizone/sse/src/public-api.ts'
	}
};
