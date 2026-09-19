const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (e) {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  }

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(1200);

  // Click View Journal / Logbook if on landing page
  const journalBtn = page.locator('button:has-text("DEVELOPER DOSSIER"), button:has-text("VISHNU\'S LOGBOOK"), button:has-text("READ JOURNAL"), button:has-text("OPEN LOGBOOK")');
  if (await journalBtn.count() > 0) {
    await journalBtn.first().click();
    await page.waitForTimeout(800);
  }

  // Ensure spread mode
  const spreadModeBtn = page.locator('button:has-text("Book Spread")');
  if (await spreadModeBtn.count() > 0) {
    await spreadModeBtn.click();
    await page.waitForTimeout(500);
  }

  const artifactDir = 'C:/Users/Windows 10/.gemini/antigravity/brain/616eb15a-3980-4b32-9fa9-3ffe673824be';
  const results = [];
  
  for (let i = 0; i < 19; i++) {
    const spreads = page.locator('.book-spread-fixed, .book-cover-fixed');
    let visibleBox = null;
    const count = await spreads.count();
    for (let s = 0; s < count; s++) {
      const item = spreads.nth(s);
      if (await item.isVisible()) {
        visibleBox = await item.boundingBox();
        break;
      }
    }
    
    const currentSpreadText = await page.locator('text=/SPREAD \\d+ OF \\d+/').textContent().catch(() => 'N/A');
    console.log(`Auditing spread ${i + 1}/19: ${currentSpreadText} -> Height: ${visibleBox ? Math.round(visibleBox.height) : 'N/A'}px`);
    
    results.push({
      spreadIndex: i,
      label: currentSpreadText,
      height: visibleBox ? Math.round(visibleBox.height) : 'N/A',
      width: visibleBox ? Math.round(visibleBox.width) : 'N/A',
      y: visibleBox ? Math.round(visibleBox.y) : 'N/A'
    });

    if ([0, 1, 4, 12, 13, 14, 16, 18].includes(i)) {
      await page.screenshot({ path: path.join(artifactDir, `audit_spread_${i}.png`) });
    }

    if (i < 18) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(600);
    }
  }

  console.log('\n--- FINAL AUDIT SUMMARY ---');
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
