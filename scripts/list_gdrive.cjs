const https = require('https');
const fs = require('fs');

async function check() {
  const url = 'https://drive.google.com/drive/folders/13C08YCfB5DdErK0anLz1Ia17Gs_u2pdP';
  https.get(url, (r) => {
    let data = '';
    r.on('data', c => data += c);
    r.on('end', () => {
      const re = /"([^"]+\.(?:jpg|png|mp4|jpeg))"/gi;
      let m;
      const set = new Set();
      while ((m = re.exec(data)) !== null) {
        set.add(m[1]);
      }
      console.log(Array.from(set));
    });
  });
}
check();
