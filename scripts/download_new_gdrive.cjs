const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../scratch/gdrive_downloads');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const filesToDownload = [
  { name: '20260911_150150_0000.png', id: '1WJfYvIB4oM0JUj7FWmX-2QvnN4F6Qy5T' },
  { name: '20260911_180017.mp4', id: '1J43ivwirgMmX2Hvgov6yBTKJsCMw8taT' },
  { name: '20260911_235734.mp4', id: '1T4GFlVq-D_5tFHZoPKYsQLBHif32zUFS' },
  { name: '20260911_235809.mp4', id: '1r5i-EsTUS6_9EKT2Lh7XJt3oe8knKrnV' },
  { name: '20260912_013332.jpg', id: '1yB8CGsAdFk9FtyBlukxlB1SjbX3eCXiT' },
  { name: '20260912_013418.jpg', id: '1zppCg41PGWGujgcIKbA5hPSkH9mNamwm' },
  { name: '20260912_051630.mp4', id: '1DVfdx_tYlYE6gzB6C8cjvI8C1BVcbPz3' },
  { name: '20260912_051801.mp4', id: '1uDnhsULmcK6SFemEo1pSQQsiHtb6V46T' }
];

function downloadFile(fileObj) {
  return new Promise((resolve, reject) => {
    const dest = path.join(targetDir, fileObj.name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`Already downloaded: ${fileObj.name} (${fs.statSync(dest).size} bytes)`);
      return resolve();
    }

    const url = `https://drive.google.com/uc?export=download&id=${fileObj.id}`;

    function fetchUrl(targetUrl) {
      https.get(targetUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchUrl(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          console.error(`Failed ${fileObj.name}: status ${res.statusCode}`);
          return resolve();
        }

        const fileStream = fs.createWriteStream(dest);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Saved: ${fileObj.name} (${fs.statSync(dest).size} bytes)`);
          resolve();
        });
        fileStream.on('error', (err) => {
          fs.unlink(dest, () => {});
          console.error(`Stream error for ${fileObj.name}:`, err.message);
          resolve();
        });
      }).on('error', (err) => {
        console.error(`Network error for ${fileObj.name}:`, err.message);
        resolve();
      });
    }

    fetchUrl(url);
  });
}

async function run() {
  console.log(`Starting download of ${filesToDownload.length} files...`);
  for (const f of filesToDownload) {
    await downloadFile(f);
  }
  console.log('All downloads completed!');
}

run();
