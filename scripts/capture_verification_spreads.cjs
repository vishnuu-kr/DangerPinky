const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 920 } });
  await page.goto('http://localhost:3000/#journal');
  await page.waitForTimeout(1500);

  // Selector for next spread button (ChevronRight / Next spread)
  const nextBtn = page.locator('button:has-text("Next"), button[title*="Next spread"]').first();

  // Spread 0: Hero
  await page.screenshot({ path: 'scratch/spread_00_hero.png' });

  // Spread 1: Prologue (Official Poster)
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'scratch/spread_01_prologue.png' });

  // Spread 2: Ch 01
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(600);

  // Spread 3: Ch 02 (Midnight Lab Video)
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'scratch/spread_03_ch02.png' });

  // Spread 4: Ch 03
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(400);
  // Spread 5: Ch 04
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(400);
  // Spread 6: Ch 05
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(400);
  // Spread 7: Ch 06 (Hallway Team Selfie)
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'scratch/spread_07_ch06.png' });

  // Advance to Ch 12 (Spread 13)
  for (let i = 8; i <= 13; i++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'scratch/spread_13_ch12.png' });

  await browser.close();
  console.log('Verification screenshots successfully captured.');
})();
