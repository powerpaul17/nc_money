const {spawnSync} = require('child_process');
const fs = require('fs');

function writeEnvToFile(envName, fileName) {
  const value = process.env[envName];
  if (!value) throw new Error('env variable has no value:' + envName);

  fs.writeFileSync(fileName, value);
}

console.log('writing key/cert file');

writeEnvToFile('APP_PRIVATE_KEY', '/tmp/money.key');
writeEnvToFile('APP_CERTIFICATE', '/tmp/money.crt');

console.log('signing app');

try {
  const occSign = spawnSync('php', [
    '../../occ',
    'integrity:sign-app',
    '--path', 'custom_apps/money/build/dist',
    '--privateKey', '/tmp/money.key',
    '--certificate', '/tmp/money.crt'
  ])

  const output = occSign.stdout.toString();
  console.log(output);

  if (occSign.status) {
    throw new Error(output)
  }
} finally {
  console.log('removing key/cert file');

  fs.unlinkSync('/tmp/money.key');
  fs.unlinkSync('/tmp/money.crt');
}
