const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => {
    console.log('BROWSER CONSOLE:', msg.type(), msg.text());
  });

  page.on('pageerror', err => {
    console.log('BROWSER ERROR:', err.toString());
  });

  await page.goto('http://localhost:4500', { waitUntil: 'networkidle2' });

  // Try to click a nav link
  await page.click('a[href="#about"]');
  
  // Get the scroll position
  const scrollY = await page.evaluate(() => window.scrollY);
  console.log('ScrollY after clicking About link:', scrollY);
  
  // Wait a bit for smooth scroll
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await page.evaluate(() => window.scrollBy(0, 500));
  await new Promise(resolve => setTimeout(resolve, 100));
  const scrollYManual = await page.evaluate(() => window.scrollY);
  console.log('ScrollY after manual scrollBy:', scrollYManual);

  await browser.close();
})();
