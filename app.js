const puppeteer = require('puppeteer');
const username = process.env.USERNAME || 'jonico22';


(async() => {

const browser = await puppeteer.launch({slowMo: 250});

const page = await browser.newPage();
await page.setViewport({width: 1200, height: 800, deviceScaleFactor: 2});
await page.goto(`https://twitter.com/${username}`);

await page.$eval(`.tweet[data-screen-name="${username}"]`, tweet => tweet.click());
await page.waitForSelector('.tweet.permalink-tweet', {visible: true});

const overlay = await page.$('.tweet.permalink-tweet');
const screenshot = await overlay.screenshot({path: 'tweet.png'});

await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          html, body {
            height: 100vh;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #fafafa;
          }
          img {
            max-width: 60%;
            box-shadow: 3px 3px 6px #eee;
            border-radius: 6px;
          }
        </style>
      </head>
      <body>
        <img src="data:img/png;base64,${screenshot.toString('base64')}">
      </body>
    </html>
`);

await page.pdf({path: 'tweet.pdf', printBackground: true});
await browser.close();

})();