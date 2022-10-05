const glob = require('glob');
const crypto = require('crypto')
const fs = require('fs');

const privateKey = process.env.PRIVATE_KEY && Buffer.from(process.env.PRIVATE_KEY, 'base64').toString() || process.env.PRIVATE_KEY_FILE && fs.readFileSync(process.env.PRIVATE_KEY_FILE);
const certificate = process.env.CERTIFICATE && Buffer.from(process.env.CERTIFICATE, 'base64').toString() || process.env.CERTIFICATE_FILE && fs.readFileSync(process.env.CERTIFICATE_FILE, 'ascii');

const paths = [
  '*.md',
  'appinfo/**/*',
  'img/**/*',
  'js/**/*',
  'lib/**/*',
  'templates/**/*'
];

const hashMap = new Map();

for (const path of paths) {
  const files = glob.sync(path, {nodir: true});
  for (const file of files) {
    const fileContents = fs.readFileSync(file);
    const hash = crypto
      .createHash('sha512')
      .update(fileContents)
      .digest('hex');
    hashMap.set(file, hash);
  }
}

const hashes = Object.fromEntries(hashMap);

const hashesString = JSON.stringify(hashes);

const signature = crypto.createSign('RSA-SHA512')
  .update(hashesString)
  .sign(privateKey, 'base64');

const result = {
  hashes,
  signature,
  certificate
};

fs.writeFileSync('appinfo/signature.json', JSON.stringify(result, undefined, 2));
