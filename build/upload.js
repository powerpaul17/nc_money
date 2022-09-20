const fs = require('fs');
const crypto = require('crypto');
const https = require('https');

const API_TOKEN = process.env.API_TOKEN;
const TAG_NAME = process.env.TAG_NAME;

const privateKey = process.env.PRIVATE_KEY && Buffer.from(process.env.PRIVATE_KEY, 'base64').toString() || process.env.PRIVATE_KEY_FILE && fs.readFileSync(process.env.PRIVATE_KEY_FILE);

const downloadLink = `https://github.com/powerpaul17/nc_money/releases/download/${TAG_NAME}/money.tar.gz`;

const fileContents = fs.readFileSync('money.tar.gz');
const signature = crypto.createSign('RSA-SHA512')
  .update(fileContents)
  .sign(privateKey, 'base64');

const req = https.request('https://apps.nextcloud.com/api/v1/apps/releases', {
  method: 'POST',
  headers: {
    Authorization: `Token ${API_TOKEN}`,
    ['Content-Type']: 'application/json'
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
});

const data = `{
  "download": "${downloadLink}",
  "signature": "${signature}"
}`;

req.write(data);

req.end();
