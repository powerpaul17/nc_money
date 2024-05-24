const fs = require('fs');
const crypto = require('crypto');
const https = require('https');

const API_TOKEN = process.env.API_TOKEN;
const TAG_NAME = process.env.TAG_NAME;

if (!API_TOKEN || !TAG_NAME) throw new Error('no api token or tag name given');

const privateKey = process.env.APP_PRIVATE_KEY;

const filePath = process.env.FILE_PATH || 'money.tar.gz';

const downloadLink = `https://github.com/powerpaul17/nc_money/releases/download/${TAG_NAME}/money.tar.gz`;

const fileContents = fs.readFileSync(filePath);
const signature = crypto
  .createSign('RSA-SHA512')
  .update(fileContents)
  .sign(privateKey, 'base64');

const req = https.request(
  'https://apps.nextcloud.com/api/v1/apps/releases',
  {
    method: 'POST',
    headers: {
      Authorization: `Token ${API_TOKEN}`,
      ['Content-Type']: 'application/json'
    }
  },
  (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('close', () => {
      if (res.statusCode ?? 0 >= 400) {
        throw new Error(data);
      }

      console.log(data);
    });
  }
);

const data = `{
  "download": "${downloadLink}",
  "signature": "${signature}"
}`;

req.write(data);

req.end();
