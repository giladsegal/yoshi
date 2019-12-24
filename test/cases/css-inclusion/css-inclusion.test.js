const path = require('path');
const { matchCSS } = require('../../utils');
const Scripts = require('../../scripts');

const localEnv = {
  BUILD_NUMBER: '',
  TEAMCITY_VERSION: '',
  ARTIFACT_VERSION: '',
};

const scripts = new Scripts({
  testDirectory: path.join(__dirname),
  silent: true,
});

// afterEach(() => scripts.cleanupPublish());

it.each(['serve', 'start'])('css inclusion %s', async command => {
  await scripts[command](async () => {
    await page.goto('http://localhost:3000');
    const className = await page.$eval('#css-inclusion', elm =>
      elm.getAttribute('class'),
    );

    await matchCSS('app', page, [
      new RegExp(`.${className}{background:#ccc;color:#000;*}`),
    ]);
  });
});

it('should run component test', async () => {
  //on for ciEnv, do we need build?
  await scripts.test(localEnv);
});
