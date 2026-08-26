const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'dist')));

const server = app.listen(3000, async () => {
  console.log('Server started on port 3000');
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Capture browser console logs
    page.on('console', msg => {
      console.log(`BROWSER CONSOLE [${msg.type()}]:`, msg.text(), msg.location());
    });
    
    page.on('pageerror', error => {
      console.log('BROWSER ERROR:', error.stack || error.message);
    });

    console.log('Navigating to http://localhost:3000/#silatnas');
    await page.goto('http://localhost:3000/#silatnas', { waitUntil: 'networkidle0' });
    
    await new Promise(r => setTimeout(r, 2000));
    console.log('Done waiting.');
    
    await browser.close();
  } catch (err) {
    console.error('Puppeteer Error:', err);
  } finally {
    server.close();
  }
});
