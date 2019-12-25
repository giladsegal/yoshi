const path = require('path');
const { matchCSS } = require('../../utils');
const Scripts = require('../../scripts');
const { localEnv } = require('../../../scripts/utils/constants');

const scripts = new Scripts({
  testDirectory: path.join(__dirname),
  silent: true,
});

it.each(['serveWithCallback', 'startWithCallback'])(
  'css inclusion %s',
  async command => {
    await scripts[command](async () => {
      await page.goto('http://localhost:3000');
      const className = await page.$eval('#css-inclusion', elm =>
        elm.getAttribute('class'),
      );

      await matchCSS('app', page, [
        new RegExp(`.${className}{background:#ccc;color:#000;*}`),
      ]);
    });
  },
);

it('should run component test', async () => {
  //any reason to run this one in ciEnv as well?
  await scripts.test(localEnv);
});
