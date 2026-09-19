const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(1000);

  const journalBtn = page.locator('button:has-text("DEVELOPER DOSSIER"), button:has-text("VISHNU\'S LOGBOOK"), button:has-text("READ JOURNAL"), button:has-text("OPEN LOGBOOK")');
  if (await journalBtn.count() > 0) {
    await journalBtn.first().click();
    await page.waitForTimeout(800);
  }

  const artifactDir = 'C:/Users/Windows 10/.gemini/antigravity/brain/616eb15a-3980-4b32-9fa9-3ffe673824be';

  // Navigate through spreads and take screenshots of Spread 11 (Ch 10), Spread 13 (Ch 12), and Spread 18 (Epilogue)
  for (let i = 0; i < 19; i++) {
    const currentSpreadText = await page.locator('text=/SPREAD \\d+ OF \\d+/').textContent().catch(() => 'N/A');
    
    // Spread indices in 0-based:
    // Ch 10 is index 11 (Spread 12 of 19)
    // Ch 12 is index 13 (Spread 14 of 19)
    // Epilogue is index 18 (Spread 19 of 19)
    if (i === 11 || i === 13 || i === 18) {
      console.log(`Capturing verified screenshot for: ${currentSpreadText} (index ${i})`);
      await page.screenshot({ path: path.join(artifactDir, `verified_spread_${i}.png`) });
    }

    if (i < 18) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(500);
    }
  }

  await browser.close();
  console.log('✓ Verification captures complete!');
})();
