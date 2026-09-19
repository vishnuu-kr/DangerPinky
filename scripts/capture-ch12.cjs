const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(1000);
  const journalBtn = page.locator('button:has-text("DEVELOPER DOSSIER"), button:has-text("VISHNU\'S LOGBOOK"), button:has-text("READ JOURNAL"), button:has-text("OPEN LOGBOOK")');
  if (await journalBtn.count() > 0) await journalBtn.first().click();
  await page.waitForTimeout(500);

  // Jump directly to chapter-12
  const ch12Btn = page.locator('button:has-text("05 Finish")');
  if (await ch12Btn.count() > 0) await ch12Btn.click();
  await page.waitForTimeout(600);

  await page.screenshot({ path: 'C:/Users/Windows 10/.gemini/antigravity/brain/616eb15a-3980-4b32-9fa9-3ffe673824be/ch12_screenshot.png' });
  await browser.close();
  console.log('✓ Captured ch12_screenshot.png');
})();
