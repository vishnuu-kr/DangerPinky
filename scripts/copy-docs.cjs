const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../dist');
const destDir = path.resolve(__dirname, '../docs');

if (!fs.existsSync(srcDir)) {
  console.error('[GitHub Pages] Error: dist/ directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

// Clean stale assets so old bundles don't pollute git history
const destAssetsDir = path.join(destDir, 'assets');
if (fs.existsSync(destAssetsDir)) {
  fs.rmSync(destAssetsDir, { recursive: true, force: true });
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy bundled dist output to docs directory
fs.cpSync(srcDir, destDir, { recursive: true });

// Ensure .nojekyll exists so GitHub Pages does not ignore files starting with an underscore
const noJekyllPath = path.join(destDir, '.nojekyll');
if (!fs.existsSync(noJekyllPath)) {
  fs.writeFileSync(noJekyllPath, '', 'utf8');
}

// Ensure 404.html duplicates the bundled index.html for SPA routing resilience
const indexPath = path.join(destDir, 'index.html');
const notFoundPath = path.join(destDir, '404.html');

if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, notFoundPath);
  console.log('[GitHub Pages] Duplicated bundled index.html to 404.html for SPA routing resilience.');
}

console.log('[GitHub Pages] Successfully synchronized dist to docs directory for GitHub Pages');
