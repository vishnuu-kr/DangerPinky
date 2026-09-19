const { chromium } = require('playwright');

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

  const heights = [];
  for (let i = 0; i < 19; i++) {
    const data = await page.evaluate((idx) => {
      // Find the currently active spread element (parent is not hidden)
      const visibleDiv = Array.from(document.querySelectorAll('.book-spread, .book-cover'))
        .find(el => {
          const parent = el.closest('div');
          return !el.classList.contains('hidden') && !parent?.classList.contains('hidden');
        });

      if (!visibleDiv) return { idx, height: 'not found' };

      const leftCol = visibleDiv.querySelector('.lg\\:grid-cols-2 > div:first-child');
      const rightCol = visibleDiv.querySelector('.lg\\:grid-cols-2 > div:last-child');

      return {
        idx,
        spreadHeight: visibleDiv.offsetHeight,
        leftHeight: leftCol ? leftCol.offsetHeight : 'N/A',
        rightHeight: rightCol ? rightCol.offsetHeight : 'N/A'
      };
    }, i);

    heights.push(data);

    if (i < 18) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(400);
    }
  }

  console.log(JSON.stringify(heights, null, 2));
  await browser.close();
})();
