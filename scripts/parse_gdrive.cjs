const fs = require('fs');

const content = fs.readFileSync('C:/Users/Windows 10/.gemini/antigravity/brain/5f94cb98-ea8a-437c-bd48-1cfde7c0f3ec/.system_generated/steps/1731/content.md', 'utf8');

// Regex for media files
const regex = /["']([^"']+\.(?:mp4|png|jpg|jpeg|mov|webp|pdf|zip))["']/gi;
const found = new Set();
let match;
while ((match = regex.exec(content)) !== null) {
  found.add(match[1]);
}

console.log('Total files found:', found.size);
console.log('Files:');
for (const f of found) {
  console.log(' - ' + f);
}
