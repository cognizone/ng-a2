const runAll = require('npm-run-all');

const options = require('./start-lib.config.json');

const scripts = options.libs.map(lib => `build:${lib} -- --watch --prod=false`);

runAll(scripts, { parallel: true, printLabel: false, stdout: process.stdout, stderr: process.stderr })
  .then(() => {
    console.log('done!');
  })
  .catch(err => {
    console.error('failed!', err);
  });
