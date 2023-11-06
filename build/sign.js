const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function writeEnvToFile(envName, fileName) {
  const value = process.env[envName];
  if (!value) throw new Error('env variable has no value:' + envName);

  fs.writeFileSync(fileName, value);
}

console.log('writing key/cert file');

const keyFilePath = '/tmp/money.key';
const certFilePath = '/tmp/money.crt';

writeEnvToFile('APP_PRIVATE_KEY', keyFilePath);
writeEnvToFile('APP_CERTIFICATE', certFilePath);

console.log('signing app');

try {
  const occSign = spawnSync('php', [
    '../../occ',
    'integrity:sign-app',
    '--path', path.join(process.env.NC_APP_DIRECTORY ?? 'custom_apps', '/money/build/dist'),
    '--privateKey', keyFilePath,
    '--certificate', certFilePath
  ]);

  const output = occSign.stdout.toString();
  console.log(output);

  if (occSign.status) {
    throw new Error(output);
  }
} finally {
  console.log('removing key/cert file');

  fs.unlinkSync(keyFilePath);
  fs.unlinkSync(certFilePath);
}
