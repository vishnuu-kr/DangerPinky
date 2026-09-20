const fs = require('fs');

const content = fs.readFileSync('C:/Users/Windows 10/.gemini/antigravity/brain/5f94cb98-ea8a-437c-bd48-1cfde7c0f3ec/.system_generated/steps/1731/content.md', 'utf8');

// aria-label="FILENAME TYPE Shared" ... ssk='5:...:FILEID-...'
const regex = /aria-label="([^"]+?\.(?:mp4|png|jpg|jpeg|mov|webp|pdf))[^"]*"[^>]*ssk='5:[^:]*:([a-zA-Z0-9_-]{20,45})-[^']*'/gi;
const results = [];
let match;
while ((match = regex.exec(content)) !== null) {
  results.push({
    name: match[1],
    id: match[2]
  });
}

// In case the order is flipped: ssk before aria-label
const regex2 = /ssk='5:[^:]*:([a-zA-Z0-9_-]{20,45})-[^']*'[^>]*aria-label="([^"]+?\.(?:mp4|png|jpg|jpeg|mov|webp|pdf))[^"]*"/gi;
while ((match = regex2.exec(content)) !== null) {
  results.push({
    name: match[2],
    id: match[1]
  });
}

const unique = new Map();
for (const item of results) {
  if (!unique.has(item.name)) {
    unique.set(item.name, item.id);
  }
}

console.log('Found', unique.size, 'mapped files with Google Drive IDs:');
for (const [name, id] of unique.entries()) {
  console.log(`${name} -> https://drive.google.com/uc?export=download&id=${id} (or id: ${id})`);
}
