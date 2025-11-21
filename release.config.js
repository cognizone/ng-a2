const { readdirSync } = require('fs');
const { join } = require('path');

const libDist = join(__dirname, 'dist/cognizone');
const packagesRoots = readdirSync(libDist).map(dir => join(libDist, dir));

const npmPlugins = packagesRoots.map(pkgRoot => [
  '@semantic-release/npm',
  {
    pkgRoot,
  },
]);

module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    ...npmPlugins,
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'npm run release:sync-versions',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'projects/cognizone/**/package.json'],
      },
    ],
  ],
};
