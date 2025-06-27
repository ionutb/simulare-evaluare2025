const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const url = 'https://bacalaureat.edu.ro/Pages/JudetRezultMedie.aspx?jud=10';
  await page.goto(url, { waitUntil: 'load' });

  const allData = [];

  let currentPage = 1;
  while (currentPage < 296) {
    console.log(`Scraping page ${currentPage}`);

    // Wait for the table to appear
    await page.waitForSelector('table.mainTable');

    // Extract table data
    const rows = await page.$$eval('table.mainTable tr', trs => {
      const data = [];
      for (let i = 0; i < trs.length; i += 2) {
        const row1 = trs[i];
        const row2 = trs[i + 1];
        if (!row2) continue;
        const tds1 = Array.from(row1.querySelectorAll('td')).map(td => td.innerText.trim());
        const tds2 = Array.from(row2.querySelectorAll('td')).map(td => td.innerText.trim());
        data.push(tds1.concat(tds2));
      }
      return data;
    });

    allData.push(...rows);

    // Find and click the "Pagina următoare" button
    const nextBtn = await page.$('input[title="Pagina următoare"]');

    const isDisabled = await nextBtn?.getAttribute('disabled');
    if (!nextBtn || isDisabled !== null) break;

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      nextBtn.click(),
    ]);
    currentPage++;
  }

  await browser.close();

  fs.writeFileSync('mainTable_data.json', JSON.stringify(allData, null, 2), 'utf-8');
  console.log(`Done. Extracted ${allData.length} records to mainTable_data.json`);
})();
