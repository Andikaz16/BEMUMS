import puppeteer from 'puppeteer';
async function run() {
  const b = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage();
  const errors = [];
  p.on('pageerror', err => errors.push(err.message));
  await p.setViewport({ width: 375, height: 812, isMobile: true });
  await p.goto('http://localhost:5173/', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 4500));
  await p.goto('http://localhost:5173/#silatnas', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));
  await p.screenshot({ path: 'silatnas_mobile_shot2.png' });
  console.log('ERRORS:', errors.length);
  await b.close();
}
run();
