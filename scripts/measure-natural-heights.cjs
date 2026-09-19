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

  const results = [];
  for (let i = 0; i < 19; i++) {
    const data = await page.evaluate((idx) => {
      // Find visible spread
      const spread = document.querySelector('.book-spread-fixed, .book-cover-fixed');
      if (!spread) return null;
      
      const scrollContainers = spread.querySelectorAll('.book-page-scroll');
      const leftPageScroll = scrollContainers[0];
      const rightPageScroll = scrollContainers[1];

      return {
        spreadIndex: idx,
        spreadHeight: spread.offsetHeight,
        leftScrollHeight: leftPageScroll ? leftPageScroll.scrollHeight : (spread.scrollHeight),
        leftClientHeight: leftPageScroll ? leftPageScroll.clientHeight : (spread.clientHeight),
        rightScrollHeight: rightPageScroll ? rightPageScroll.scrollHeight : 'N/A',
        rightClientHeight: rightPageScroll ? rightPageScroll.clientHeight : 'N/A',
        hasLeftOverflow: leftPageScroll ? leftPageScroll.scrollHeight > leftPageScroll.clientHeight : false,
        hasRightOverflow: rightPageScroll ? rightPageScroll.scrollHeight > rightPageScroll.clientHeight : false
      };
    }, i);

    if (data) results.push(data);

    if (i < 18) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(500);
    }
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
