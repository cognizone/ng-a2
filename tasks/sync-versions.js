const { readdirSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const libDist = join(__dirname, '../dist/cognizone');
const distPackageJsonFiles = readdirSync(libDist).map(dir => join(libDist, dir, 'package.json'));

const srcDist = join(__dirname, '../projects/cognizone');
const srcPackageJsonFiles = readdirSync(srcDist).map(dir => join(srcDist, dir, 'package.json'));

for (let i = 0; i < distPackageJsonFiles.length; ++i) {
  const dist = JSON.parse(readFileSync(distPackageJsonFiles[i]));
  const src = JSON.parse(readFileSync(srcPackageJsonFiles[i]));
  src.version = dist.version;
  writeFileSync(srcPackageJsonFiles[i], JSON.stringify(src, null, 2), 'utf8');
}
