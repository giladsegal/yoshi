const path = require('path');
const { matchCSS } = require('../../utils');
const Scripts = require('../../scripts');

const scripts = new Scripts({
  testDirectory: path.join(__dirname),
  silent: false,
});

jest.setTimeout(20000);

it.each(['serve', 'start'])('css inclusion %s', async command => {
  const result = await scripts[command]();

  await page.goto('http://localhost:3000');

  const className = await page.$eval('#css-inclusion', elm =>
    elm.getAttribute('class'),
  );

  await matchCSS('app', page, [
    new RegExp(`.${className}{background:#ccc;color:#000;*}`),
  ]);

  await result.done();
});
